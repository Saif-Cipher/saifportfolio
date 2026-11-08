"use client";

import React, { useEffect, useRef } from "react";

export type DataRainProps = {
  fullscreen?: boolean;
  className?: string;
  count?: number;
  flowSpeed?: number;
  obstacleRadius?: number;
  autopilot?: boolean;
  palette?: {
    calm?: string;
    mid?: string;
    hot?: string;
  };
};

const MAX_PARTICLES = 7000;
const TAIL_LENGTH = 19;
const DT = 1 / 60;
const PUFF_COUNT = 32;
const TWO_PI = Math.PI * 2;
const SEGMENTS = 6;
const STRIDE = 3;

// Default fallback colors (Warm White, Red & Dark Slate Blue)
const DEFAULT_CALM = [144, 224, 239]; // Soft light blue #90E0EF
const DEFAULT_MID = [34, 87, 122];    // Dark Slate Blue #22577A
const DEFAULT_HOT = [251, 54, 64];    // Red Accent #FB3640
const DEFAULT_CORE = [248, 247, 242]; // Warm White #F8F7F2

const ALPHA_WEIGHTS = [0.2, 0.32, 0.48];
const WIDTH_WEIGHTS = [0.7, 0.9, 1.2];
const OVERALL_V = 1.3;
const CORE_WIDTH = 1.4;

const DECAY_FAST = 1 - Math.exp(-DT / 0.12);
const DECAY_SMOOTH = 1 - Math.exp(-DT * 8);
const TRACK_SPEED = 1 - Math.exp(-DT * 18);
const VEL_SMOOTH = 1 - Math.exp(-DT * 10);
const ENTER_SPEED = 1 - Math.exp(-DT / 0.06);
const EXIT_SPEED = 1 - Math.exp(-DT / 0.2);
const FLASH_RATE = 0.03 * DT;
const FLASH_DECAY = Math.exp(-DT / 0.45);
const VORTEX_DECAY = Math.exp(-DT / 1.1);

function clamp(val: number, min: number, max: number): number {
  return val < min ? min : val > max ? max : val;
}

function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 1831565813) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function parseHex(hex: string | undefined, fallback: number[]): number[] {
  if (!hex) return fallback;
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) {
    h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return fallback;
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

type Wave = {
  kx: number;
  ky: number;
  om: number;
  ph: number;
  au: number;
  av: number;
};

function makeWave(length: number, speed: number, amp: number, phase: number, dirDeg: number): Wave {
  const k = TWO_PI / length;
  const rad = (dirDeg * Math.PI) / 180;
  return {
    kx: k * Math.cos(rad),
    ky: k * Math.sin(rad),
    om: speed,
    ph: phase,
    au: amp * Math.sin(rad),
    av: -amp * Math.cos(rad),
  };
}

const wave1 = makeWave(380, 0.35, 0.18, 0.7, 16);
const wave2 = makeWave(620, 1.9, 0.27, 2.1, 13);
const wave3 = makeWave(900, 3.4, 0.35, 4.2, 10);

export default function DataRain({
  fullscreen = true,
  className = "",
  count,
  flowSpeed = 1,
  obstacleRadius = 64,
  autopilot = true,
  palette,
}: DataRainProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const bloomCanvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef({ count, flowSpeed, obstacleRadius, autopilot, palette });
  const controlRef = useRef<{ refresh: () => void } | null>(null);

  propsRef.current = { count, flowSpeed, obstacleRadius, autopilot, palette };

  useEffect(() => {
    const root = rootRef.current;
    const mainCanvas = mainCanvasRef.current;
    const bloomCanvas = bloomCanvasRef.current;
    if (!root || !mainCanvas || !bloomCanvas) return;

    const ctx = mainCanvas.getContext("2d");
    const bloomCtx = bloomCanvas.getContext("2d");
    if (!ctx || !bloomCtx) return;

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rand = mulberry32(7);

    let isDestroyed = false;
    let isReady = false;
    let isRunning = false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let bloomW = 1;
    let bloomH = 1;

    // Simulation particle buffers
    const posX = new Float32Array(MAX_PARTICLES);
    const posY = new Float32Array(MAX_PARTICLES);
    const velX = new Float32Array(MAX_PARTICLES);
    const velY = new Float32Array(MAX_PARTICLES);
    const speedScale = new Float32Array(MAX_PARTICLES);
    const baseSpeed = new Float32Array(MAX_PARTICLES);
    const velMagnitude = new Float32Array(MAX_PARTICLES);
    const flashIntensity = new Float32Array(MAX_PARTICLES);
    const tailLengths = new Uint8Array(MAX_PARTICLES);
    const historyX = new Float32Array(MAX_PARTICLES * TAIL_LENGTH);
    const historyY = new Float32Array(MAX_PARTICLES * TAIL_LENGTH);

    let historyHead = 0;
    const buckets: Int32Array[] = [];
    for (let i = 0; i < 6; i++) buckets.push(new Int32Array(MAX_PARTICLES));
    const bucketCounts = new Int32Array(6);
    const strokeStyles = new Array(6 * SEGMENTS).fill("");
    const strokeWidths = new Float32Array(6 * SEGMENTS);
    const coreStyles = ["", ""];
    let puffGradient: CanvasGradient | null = null;

    // Wake / Puff buffers
    const puffX = new Float32Array(PUFF_COUNT);
    const puffY = new Float32Array(PUFF_COUNT);
    const puffVort = new Float32Array(PUFF_COUNT);
    const puffAge = new Float32Array(PUFF_COUNT);
    const puffActive = new Uint8Array(PUFF_COUNT);
    const activePuffX = new Float32Array(PUFF_COUNT);
    const activePuffY = new Float32Array(PUFF_COUNT);
    const activePuffStrength = new Float32Array(PUFF_COUNT);
    const activePuffRadius = new Float32Array(PUFF_COUNT);
    const activePuffRadiusSq = new Float32Array(PUFF_COUNT);

    let activePuffCount = 0;
    let puffHead = 0;
    let puffSign = 1;
    let puffDistanceCounter = 0;
    let waveTime = 0;
    let aliveTime = 0;
    let activeParticles = 0;
    let targetParticleCount = 0;
    let autoScale = 1;
    let hasPointer = false;
    let pointerX = 0;
    let pointerY = 0;
    let pointerLeaveTime = 0;
    let pointerWaitTime = 1.2;
    let pointerActiveState = 0;
    let targetObsX = 0;
    let targetObsY = 0;
    let obsX = 0;
    let obsY = 0;
    let prevObsX = 0;
    let prevObsY = 0;
    let obsVelX = 0;
    let obsVelY = 0;
    let obsInfluence = 0;
    let currentObsRadius = 64;
    let rafId = 0;
    let lastFrameTime = 0;
    let accumulatedTime = 0;
    let avgFrameDelta = 16.7;
    let avgSimDuration = 4;
    let slowCount = 0;
    let fastCount = 0;

    const buildStyles = () => {
      const computed = getComputedStyle(root);
      const userPalette = propsRef.current.palette;
      const calm = parseHex(
        userPalette?.calm ?? computed.getPropertyValue("--dr-calm"),
        DEFAULT_CALM
      );
      const mid = parseHex(
        userPalette?.mid ?? computed.getPropertyValue("--dr-mid"),
        DEFAULT_MID
      );
      const hot = parseHex(
        userPalette?.hot ?? computed.getPropertyValue("--dr-hot"),
        DEFAULT_HOT
      );
      const core = parseHex(
        computed.getPropertyValue("--dr-core"),
        DEFAULT_CORE
      );

      const colorTiers = [calm, mid, hot];
      for (let b = 0; b < 6; b++) {
        const isForeground = b < 3 ? 0 : 1;
        const tier = b % 3;
        const col = colorTiers[tier];
        for (let s = 0; s < SEGMENTS; s++) {
          const t = Math.pow(1 - (s + 0.5) / SEGMENTS, 1.5);
          const alpha = Math.min(0.95, ALPHA_WEIGHTS[tier] * (isForeground === 0 ? 0.55 : 1) * t * OVERALL_V);
          strokeStyles[b * SEGMENTS + s] = `rgba(${col[0]},${col[1]},${col[2]},${alpha.toFixed(3)})`;
          const w = WIDTH_WEIGHTS[tier] * (isForeground === 0 ? 0.75 : 1) * (1 - (0.45 * s) / SEGMENTS);
          strokeWidths[b * SEGMENTS + s] = clamp(w, 0.6, 1.3);
        }
      }

      coreStyles[0] = `rgba(${core[0]},${core[1]},${core[2]},0.5)`;
      coreStyles[1] = `rgba(${core[0]},${core[1]},${core[2]},0.85)`;

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      grad.addColorStop(0, `rgba(${hot[0]},${hot[1]},${hot[2]},1)`);
      grad.addColorStop(0.45, `rgba(${hot[0]},${hot[1]},${hot[2]},0.32)`);
      grad.addColorStop(1, `rgba(${hot[0]},${hot[1]},${hot[2]},0)`);
      puffGradient = grad;
    };

    const seedParticle = (index: number, initialRandomPos: boolean) => {
      let x: number, y: number;
      if (initialRandomPos) {
        x = rand() * width;
        y = rand() * height;
      } else {
        x = -40 + rand() * (width + 80);
        y = -40 - rand() * 80;
      }
      const scale = 0.35 + 0.65 * rand();
      const baseV = 70 + 90 * scale * scale;
      const speedProp = clamp(propsRef.current.flowSpeed ?? 1, 0.05, 5);

      speedScale[index] = scale;
      baseSpeed[index] = baseV;
      tailLengths[index] = 9 + Math.floor(rand() * 11);
      posX[index] = x;
      posY[index] = y;
      velX[index] = 0;
      velY[index] = baseV * speedProp;
      velMagnitude[index] = 1;
      flashIntensity[index] = 0;

      const offset = index * TAIL_LENGTH;
      for (let s = 0; s < TAIL_LENGTH; s++) {
        historyX[offset + s] = x;
        historyY[offset + s] = y;
      }
    };

    const seedAll = () => {
      for (let i = 0; i < MAX_PARTICLES; i++) seedParticle(i, true);
    };

    const setActive = (countVal: number, initial: boolean) => {
      const c = clamp(Math.round(countVal), 1, MAX_PARTICLES);
      for (let i = activeParticles; i < c; i++) seedParticle(i, initial);
      activeParticles = c;
    };

    const applyCount = (initial: boolean) => {
      const autoCount = clamp(Math.round((width * height) / 520), 1200, 5200);
      const userCount = propsRef.current.count;
      targetParticleCount = clamp(Math.round(userCount !== undefined ? userCount : autoCount), 1, MAX_PARTICLES);
      setActive(targetParticleCount * autoScale, initial);
    };

    const spawnPuff = (radius: number, speed: number) => {
      const normVx = obsVelX / speed;
      const normVy = obsVelY / speed;
      const sign = puffSign;
      puffSign = -puffSign;
      const idx = puffHead;
      puffHead = (puffHead + 1) % PUFF_COUNT;

      puffX[idx] = obsX - normVx * 0.6 * radius - normVy * sign * 0.7 * radius;
      puffY[idx] = obsY - normVy * 0.6 * radius + normVx * sign * 0.7 * radius;
      puffVort[idx] = clamp(sign * Math.min(speed, 1200) * radius * 1.5, -105000, 105000);
      puffAge[idx] = 0;
      puffActive[idx] = 1;
    };

    const simulate = () => {
      const props = propsRef.current;
      const speedMul = clamp(props.flowSpeed ?? 1, 0.05, 5);
      const radiusBase = props.obstacleRadius ?? 64;
      const isAutopilot = props.autopilot ?? true;

      historyHead = (historyHead + 1) % TAIL_LENGTH;
      waveTime += DT;
      if (isRunning) aliveTime += DT;

      const runAutopilot = !prefersReducedMotion && isAutopilot && !hasPointer && isRunning && aliveTime - pointerLeaveTime >= pointerWaitTime;
      const obsMode = hasPointer ? 2 : runAutopilot ? 1 : 0;

      if (obsMode === 1) {
        targetObsX = width * (0.5 + 0.32 * Math.sin(0.37 * aliveTime));
        targetObsY = height * (0.5 + 0.28 * Math.sin(0.53 * aliveTime + 1.2));
      } else if (obsMode === 2) {
        targetObsX = pointerX;
        targetObsY = pointerY;
      }

      const isStarting = obsMode !== 0 && pointerActiveState === 0 && obsInfluence < 0.05;
      pointerActiveState = obsMode;

      if (isStarting) {
        obsX = targetObsX;
        obsY = targetObsY;
        prevObsX = obsX;
        prevObsY = obsY;
        obsVelX = 0;
        obsVelY = 0;
      } else {
        prevObsX = obsX;
        prevObsY = obsY;
        obsX += (targetObsX - obsX) * TRACK_SPEED;
        obsY += (targetObsY - obsY) * TRACK_SPEED;
        obsVelX += ((obsX - prevObsX) / DT - obsVelX) * VEL_SMOOTH;
        obsVelY += ((obsY - prevObsY) / DT - obsVelY) * VEL_SMOOTH;
      }

      obsInfluence += ((obsMode !== 0 ? 1 : 0) - obsInfluence) * (obsMode !== 0 ? ENTER_SPEED : EXIT_SPEED);
      const influence = obsInfluence;
      const obsSpeed = Math.sqrt(obsVelX * obsVelX + obsVelY * obsVelY);
      const effectiveRadius = radiusBase + Math.min(obsSpeed * 0.025, 36);
      currentObsRadius = effectiveRadius;

      if (influence > 0.3 && obsSpeed > 60) {
        const dx = obsX - prevObsX;
        const dy = obsY - prevObsY;
        puffDistanceCounter += Math.sqrt(dx * dx + dy * dy);
        let spawned = 0;
        while (puffDistanceCounter >= 28 && spawned < 4) {
          puffDistanceCounter -= 28;
          spawned++;
          spawnPuff(effectiveRadius, obsSpeed);
        }
        if (puffDistanceCounter >= 28) puffDistanceCounter = 0;
      } else {
        puffDistanceCounter = 0;
      }

      activePuffCount = 0;
      const puffDrift = 0.5 * 115 * speedMul * DT;
      for (let i = 0; i < PUFF_COUNT; i++) {
        if (puffActive[i] === 0) continue;
        const age = puffAge[i] + DT;
        if (age > 2.4) {
          puffActive[i] = 0;
          continue;
        }
        puffAge[i] = age;
        puffVort[i] *= VORTEX_DECAY;
        puffY[i] += puffDrift;
        const rad = 676 + 90 * age;
        activePuffX[activePuffCount] = puffX[i];
        activePuffY[activePuffCount] = puffY[i];
        activePuffStrength[activePuffCount] = puffVort[i] / TWO_PI;
        activePuffRadius[activePuffCount] = rad;
        activePuffRadiusSq[activePuffCount] = 36 * rad;
        activePuffCount++;
      }

      const w1Time = wave1.om * waveTime + wave1.ph;
      const w2Time = wave2.om * waveTime + wave2.ph;
      const w3Time = wave3.om * waveTime + wave3.ph;
      const w1Kx = wave1.kx, w1Ky = wave1.ky;
      const w2Kx = wave2.kx, w2Ky = wave2.ky;
      const w3Kx = wave3.kx, w3Ky = wave3.ky;
      const w1Au = wave1.au, w1Av = wave1.av;
      const w2Au = wave2.au, w2Av = wave2.av;
      const w3Au = wave3.au, w3Av = wave3.av;

      const hasWeakObs = influence > 0.002;
      const hasStrongObs = influence > 0.05;
      const scalePush = Math.min(1, influence * 1.5);
      const bottomLimit = height + 40;
      const rightLimit = width + 120;

      for (let i = 0; i < activeParticles; i++) {
        const px = posX[i];
        const py = posY[i];
        const sc = speedScale[i];
        const baseV = baseSpeed[i] * speedMul;

        const c1 = Math.cos(w1Kx * px + w1Ky * py + w1Time);
        const c2 = Math.cos(w2Kx * px + w2Ky * py + w2Time);
        const c3 = Math.cos(w3Kx * px + w3Ky * py + w3Time);

        let waveVx = (w1Au * c1 + w2Au * c2 + w3Au * c3) * sc;
        let waveVy = baseV + (w1Av * c1 + w2Av * c2 + w3Av * c3) * sc;

        const scaleWeight = 0.55 + 0.45 * sc;
        const particleObsRadius = effectiveRadius * scaleWeight;
        const relX = px - obsX;
        const relY = py - obsY;

        let deflectVx = 0;
        let deflectVy = 0;
        let wakeWeight = 0;

        if (hasWeakObs) {
          const distSq = relX * relX + relY * relY;
          let relVx = -obsVelX;
          let relVy = baseV - obsVelY;
          let relSpeed = Math.sqrt(relVx * relVx + relVy * relVy);
          if (relSpeed > 0.001) {
            if (relSpeed > 900) {
              const cap = 900 / relSpeed;
              relVx *= cap;
              relVy *= cap;
              relSpeed = 900;
            }
            const unitVx = relVx / relSpeed;
            const unitVy = relVy / relSpeed;
            const projForward = relX * unitVx + relY * unitVy;
            const projSide = -relX * unitVy + relY * unitVx;

            if (projForward > 0 && projForward < 12 * particleObsRadius) {
              const spread = 0.9 * particleObsRadius + 0.2 * projForward;
              const normSide = projSide / spread;
              wakeWeight = 0.55 * Math.exp(-projForward / (3 * particleObsRadius)) * Math.exp(-normSide * normSide);
            }

            const influenceRadius = 9 * particleObsRadius;
            if (distSq < influenceRadius * influenceRadius) {
              const safeDistSq = Math.max(projForward * projForward + projSide * projSide, particleObsRadius * particleObsRadius * 0.64);
              const pot = (particleObsRadius * particleObsRadius) / (safeDistSq * safeDistSq);
              const potX = -relSpeed * pot * (projForward * projForward - projSide * projSide);
              const potY = -relSpeed * pot * 2 * projForward * projSide;
              let falloff = 1;
              const falloffStart = 5 * particleObsRadius;
              if (distSq > falloffStart * falloffStart) {
                const frac = (Math.sqrt(distSq) - falloffStart) / (4 * particleObsRadius);
                falloff = 1 - frac * frac * (3 - 2 * frac);
              }
              deflectVx = (potX * unitVx - potY * unitVy) * falloff;
              deflectVy = (potX * unitVy + potY * unitVx) * falloff;
            }
          }
        }

        let vortexVx = 0;
        let vortexVy = 0;
        for (let p = 0; p < activePuffCount; p++) {
          const dx = px - activePuffX[p];
          const dy = py - activePuffY[p];
          const dSq = dx * dx + dy * dy + 0.001;
          const maxR = activePuffRadiusSq[p];
          if (dSq < maxR) {
            const rot = (activePuffStrength[p] * (1 - Math.exp(-dSq / activePuffRadius[p]))) / dSq;
            const fall = 1 - dSq / maxR;
            const factor = rot * fall * fall * scaleWeight;
            vortexVx += -dy * factor;
            vortexVy += dx * factor;
          }
        }

        const drag = 1 - wakeWeight * influence;
        waveVx = waveVx * drag + deflectVx * influence + vortexVx;
        waveVy = waveVy * drag + deflectVy * influence + vortexVy;

        let curVx = velX[i] + (waveVx - velX[i]) * DECAY_FAST;
        let curVy = velY[i] + (waveVy - velY[i]) * DECAY_FAST;
        const curSpeedSq = curVx * curVx + curVy * curVy;
        if (curSpeedSq > 810000) {
          const cap = 900 / Math.sqrt(curSpeedSq);
          curVx *= cap;
          curVy *= cap;
        }

        let nextX = px + curVx * DT;
        let nextY = py + curVy * DT;

        if (hasStrongObs) {
          const hardR = particleObsRadius * scalePush;
          const offX = nextX - obsX;
          const offY = nextY - obsY;
          const distSq = offX * offX + offY * offY;
          const innerLimit = 0.98 * hardR;
          if (distSq < innerLimit * innerLimit) {
            const d = Math.sqrt(distSq);
            const normX = d < 0.001 ? 0 : offX / d;
            const normY = d < 0.001 ? 1 : offY / d;
            nextX = obsX + normX * hardR;
            nextY = obsY + normY * hardR;
            const dot = (curVx - obsVelX) * normX + (curVy - obsVelY) * normY;
            if (dot < 0) {
              curVx -= dot * normX;
              curVy -= dot * normY;
            }
          }
        }

        velX[i] = curVx;
        velY[i] = curVy;
        posX[i] = nextX;
        posY[i] = nextY;

        if (nextY > bottomLimit || nextX < -120 || nextX > rightLimit || nextY < -600) {
          seedParticle(i, false);
          continue;
        }

        velMagnitude[i] += (Math.sqrt(curVx * curVx + curVy * curVy) / baseV - velMagnitude[i]) * DECAY_SMOOTH;
        if (rand() < FLASH_RATE) {
          flashIntensity[i] = 1;
        } else {
          const f = flashIntensity[i] * FLASH_DECAY;
          flashIntensity[i] = f < 0.01 ? 0 : f;
        }

        const headOffset = i * TAIL_LENGTH + historyHead;
        historyX[headOffset] = nextX;
        historyY[headOffset] = nextY;
      }
    };

    const render = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (obsInfluence > 0.02 && puffGradient) {
        const obsSpd = Math.sqrt(obsVelX * obsVelX + obsVelY * obsVelY);
        const radius = 1.5 * currentObsRadius;
        ctx.globalAlpha = Math.min(1, (0.05 + Math.min(obsSpd / 4000, 0.07)) * obsInfluence);
        ctx.setTransform(dpr * radius, 0, 0, dpr * radius, dpr * obsX, dpr * obsY);
        ctx.fillStyle = puffGradient;
        ctx.fillRect(-1, -1, 2, 2);
        ctx.globalAlpha = 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      bucketCounts.fill(0);
      for (let i = 0; i < activeParticles; i++) {
        const m = velMagnitude[i];
        let tier = m < 1.25 ? 0 : m < 1.85 ? 1 : 2;
        if (flashIntensity[i] > 0.35 && tier < 2) tier++;
        const bucket = (speedScale[i] < 0.62 ? 0 : 3) + tier;
        buckets[bucket][bucketCounts[bucket]++] = i;
      }

      for (let b = 0; b < 6; b++) {
        const bCount = bucketCounts[b];
        if (bCount === 0) continue;
        const bList = buckets[b];
        for (let s = 0; s < SEGMENTS; s++) {
          const segStart = s * STRIDE;
          const segEnd = segStart + STRIDE;
          ctx.strokeStyle = strokeStyles[b * SEGMENTS + s];
          ctx.lineWidth = strokeWidths[b * SEGMENTS + s];
          ctx.beginPath();
          for (let p = 0; p < bCount; p++) {
            const idx = bList[p];
            const maxLen = tailLengths[idx] - 1;
            if (segStart >= maxLen) continue;
            const off = idx * TAIL_LENGTH;
            const limit = Math.min(segEnd, maxLen);
            let hIdx = (historyHead - segStart + TAIL_LENGTH) % TAIL_LENGTH;
            ctx.moveTo(historyX[off + hIdx], historyY[off + hIdx]);
            for (let st = segStart; st < limit; st++) {
              hIdx = hIdx === 0 ? TAIL_LENGTH - 1 : hIdx - 1;
              ctx.lineTo(historyX[off + hIdx], historyY[off + hIdx]);
            }
          }
          ctx.stroke();
        }
      }

      const prevHead = historyHead === 0 ? TAIL_LENGTH - 1 : historyHead - 1;
      ctx.lineWidth = CORE_WIDTH;
      for (let c = 0; c < 2; c++) {
        ctx.strokeStyle = coreStyles[c];
        ctx.beginPath();
        for (let t = 1; t < 3; t++) {
          const b = c * 3 + t;
          const bCount = bucketCounts[b];
          const bList = buckets[b];
          for (let p = 0; p < bCount; p++) {
            const idx = bList[p];
            if (t === 1 && flashIntensity[idx] <= 0.5) continue;
            const off = idx * TAIL_LENGTH;
            ctx.moveTo(historyX[off + historyHead], historyY[off + historyHead]);
            ctx.lineTo(historyX[off + prevHead], historyY[off + prevHead]);
          }
        }
        ctx.stroke();
      }

      bloomCtx.clearRect(0, 0, bloomW, bloomH);
      bloomCtx.drawImage(mainCanvas, 0, 0, bloomW, bloomH);
    };

    const presimulate = (sec: number) => {
      const steps = Math.round(sec / DT);
      for (let s = 0; s < steps; s++) simulate();
    };

    const rebuildStatic = () => {
      seedAll();
      activeParticles = 0;
      applyCount(true);
      hasPointer = true;
      pointerX = width * 0.4;
      pointerY = height * 0.45;
      targetObsX = pointerX;
      targetObsY = pointerY;
      obsX = prevObsX = pointerX;
      obsY = prevObsY = pointerY;
      obsVelX = 0;
      obsVelY = 0;
      obsInfluence = 1;
      pointerActiveState = 2;
      activePuffCount = 0;
      puffActive.fill(0);
      presimulate(3);
      render();
    };

    const handleResize = () => {
      const rect = root.getBoundingClientRect();
      const w = Math.max(1, rect.width || window.innerWidth);
      const h = Math.max(1, rect.height || window.innerHeight);
      let scale = Math.min(window.devicePixelRatio || 1, 2);
      if (w * h * scale * scale > 4500000) {
        scale = Math.sqrt(4500000 / (w * h));
      }

      if (!(w === width && h === height && scale === dpr)) {
        width = w;
        height = h;
        dpr = scale;
        mainCanvas.width = Math.max(1, Math.round(width * dpr));
        mainCanvas.height = Math.max(1, Math.round(height * dpr));
        bloomW = Math.max(1, Math.ceil(width / 4));
        bloomH = Math.max(1, Math.ceil(height / 4));
        bloomCanvas.width = bloomW;
        bloomCanvas.height = bloomH;
        bloomCtx.imageSmoothingEnabled = true;
        bloomCtx.imageSmoothingQuality = "medium";

        if (isReady) {
          if (prefersReducedMotion) {
            rebuildStatic();
            return;
          }
          for (let i = 0; i < activeParticles; i++) {
            if (posX[i] < -120 || posX[i] > width + 120 || posY[i] > height + 40) {
              seedParticle(i, false);
            }
          }
          applyCount(true);
          render();
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
      hasPointer = true;
    };

    const onPointerLeave = () => {
      if (hasPointer) {
        hasPointer = false;
        pointerLeaveTime = aliveTime;
        pointerWaitTime = 4;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") onPointerLeave();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (isRunning && !isDestroyed) {
        startLoop();
      }
    };

    const onFrame = (now: number) => {
      if (isDestroyed) return;
      const deltaMs = Math.max(0, now - lastFrameTime);
      lastFrameTime = now;
      accumulatedTime += Math.min(0.05, deltaMs / 1000);

      const simStart = performance.now();
      let steps = 0;
      while (accumulatedTime >= DT && steps < 3) {
        simulate();
        accumulatedTime -= DT;
        steps++;
      }
      if (steps === 3) accumulatedTime = 0;
      if (steps > 0) render();

      const simDur = performance.now() - simStart;
      if (deltaMs > 0 && deltaMs < 100) {
        avgFrameDelta += (deltaMs - avgFrameDelta) * 0.05;
        avgSimDuration += (simDur - avgSimDuration) * 0.05;
      }

      if (avgFrameDelta > 20) {
        slowCount++;
        fastCount = 0;
      } else if (avgFrameDelta < 18.5 && avgSimDuration < 12) {
        fastCount++;
        slowCount = 0;
      } else {
        slowCount = 0;
        fastCount = 0;
      }

      if (slowCount >= 60 && autoScale > 0.4) {
        autoScale = Math.max(0.4, autoScale - 0.1);
        slowCount = 0;
        applyCount(false);
      } else if (fastCount >= 180 && autoScale < 1) {
        autoScale = Math.min(1, autoScale + 0.05);
        fastCount = 0;
        applyCount(false);
      }

      rafId = requestAnimationFrame(onFrame);
    };

    const startLoop = () => {
      cancelAnimationFrame(rafId);
      lastFrameTime = performance.now();
      accumulatedTime = 0;
      rafId = requestAnimationFrame(onFrame);
    };

    handleResize();
    buildStyles();
    seedAll();
    applyCount(true);
    obsX = prevObsX = targetObsX = width * 0.5;
    obsY = prevObsY = targetObsY = height * 0.5;

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(root);

    controlRef.current = {
      refresh: () => {
        if (!isDestroyed && isReady) {
          buildStyles();
          if (prefersReducedMotion) rebuildStatic();
          else applyCount(false);
        }
      },
    };

    if (prefersReducedMotion) {
      isReady = true;
      rebuildStatic();
    } else {
      presimulate(2.5);
      render();
      isReady = true;
      isRunning = true;

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerMove, { passive: true });
      window.addEventListener("pointerup", onPointerUp, { passive: true });
      window.addEventListener("pointercancel", onPointerLeave, { passive: true });
      window.addEventListener("blur", onPointerLeave);
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
      document.addEventListener("visibilitychange", onVisibilityChange);
      startLoop();
    }

    return () => {
      isDestroyed = true;
      isRunning = false;
      cancelAnimationFrame(rafId);
      rafId = 0;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.addEventListener("visibilitychange", onVisibilityChange);
      resizeObserver.disconnect();
      controlRef.current = null;
      puffGradient = null;
    };
  }, []);

  const pal = propsRef.current.palette;
  useEffect(() => {
    controlRef.current?.refresh();
  }, [count, pal?.calm, pal?.mid, pal?.hot]);

  const rootClass =
    "dr-root" +
    (fullscreen ? "" : " dr-root--contained") +
    (className ? ` ${className}` : "");

  return (
    <div ref={rootRef} className={rootClass} aria-hidden="true">
      <canvas ref={bloomCanvasRef} className="dr-bloom" />
      <canvas ref={mainCanvasRef} className="dr-main" />
      <div className="dr-vignette" />
      <div className="dr-grain" />
    </div>
  );
}
