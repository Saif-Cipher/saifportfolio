import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

export const launchFps = 30;
export const launchFrames = 36;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export function RocketLaunch() {
  const frame = useCurrentFrame();
  const ascent = interpolate(frame, [9, 32], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const ignition = interpolate(frame, [3, 9, 26, 33], [0, 1, .9, 0], clamp);
  const scene = interpolate(frame, [0, 5, 27, 35], [0, 1, 1, 0], clamp);
  const plume = ignition * (1 + Math.sin(frame * 2.1) * .13);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <svg viewBox="0 0 960 540" width="100%" height="100%" style={{ opacity: scene }}>
        <defs>
          <pattern id="launch-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="#65baff" strokeOpacity=".13" />
          </pattern>
          <linearGradient id="launch-steel">
            <stop stopColor="#5e6c7d" />
            <stop offset=".46" stopColor="#edf1f6" />
            <stop offset="1" stopColor="#7b899a" />
          </linearGradient>
          <linearGradient id="launch-flame" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#ffecbd" />
            <stop offset=".4" stopColor="#ff5a1f" />
            <stop offset="1" stopColor="#ff5a1f" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="210" y="42" width="540" height="456" fill="url(#launch-grid)" />
        <path d="M210 76V42h34m472 0h34v34m0 388v34h-34m-472 0h-34v-34" fill="none" stroke="#ff5a1f" strokeOpacity=".7" />
        <circle cx="480" cy="316" r={54 + ignition * 24} fill="none" stroke="#65baff" strokeOpacity={.22 + ignition * .15} strokeDasharray="4 7" />
        <path d="M260 397H700" stroke="#65baff" strokeOpacity=".24" />
        {Array.from({ length: 9 }, (_, index) => (
          <circle key={index} cx={480 + (index - 4) * (8 + ascent * 13)}
            cy={370 + ((index * 17 + frame * 5) % 63)} r={2 + index % 3}
            fill={index % 2 ? "#ff5a1f" : "#65baff"} opacity={ignition * (1 - ascent) * .55} />
        ))}
        <g transform={`translate(${480 + ascent * 220} ${345 - ascent * 540}) rotate(${-7 + ascent * 27})`}>
          <path d="M-14 12Q-20 38 0 105Q20 38 14 12Z" fill="url(#launch-flame)"
            transform={`scale(1 ${plume})`} opacity={ignition} />
          <path d="M-23-43Q-52-24-51 10L-22-4M23-43Q52-24 51 10L22-4" fill="#ff5a1f" stroke="#10141c" strokeWidth="3" />
          <path d="M-15-5h30l-3 18h-24Z" fill="#313e50" stroke="#91a2b6" strokeWidth="2" />
          <path d="M0-144C29-120 35-65 20-7H-20C-35-65-29-120 0-144Z" fill="url(#launch-steel)" stroke="#10141c" strokeWidth="3" />
          <path d="M0-144Q14-132 20-113H-20Q-14-132 0-144Z" fill="#ff5a1f" />
          <circle cy="-77" r="14" fill="#10141c" stroke="#546d86" strokeWidth="3" />
          <circle cy="-77" r="8" fill="#65baff" />
          <path d="M-19-24H19" stroke="#ff5a1f" strokeWidth="5" />
        </g>
        <g fontFamily="monospace" fontSize="13" letterSpacing="2">
          <text x="228" y="67" fill="#ff8b64">FLIGHT / 01</text>
          <text x="732" y="480" fill="#9bd5ff" textAnchor="end">{frame < 9 ? "IGNITION" : "SELECTED WORKS"}</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
}
