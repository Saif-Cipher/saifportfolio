"use client";

import { useState } from "react";
import { LiquidButton } from "@/components/ui/liquid-button";
import { TextGlitch } from "@/components/ui/text-glitch";

export function CapabilityRadar({ capabilities }: { capabilities: string[] }) {
  const [active, setActive] = useState(0);
  const serial = String(active + 1).padStart(2, "0");

  return (
    <div className="power-profile">
      <div className="power-controls" role="group" aria-label="Core capabilities">
        {capabilities.map((name, index) => (
          <div className="power-row" key={name}>
            <span className="signal-meta">PWR-{String(index + 1).padStart(2, "0")}</span>
            <LiquidButton variant={active === index ? "primary" : "secondary"}
              aria-pressed={active === index}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}>
              {name}
            </LiquidButton>
          </div>
        ))}
      </div>
      <div className="power-panel">
        <p className="signal-meta">SCAN / PWR-{serial} <span>LIVE</span></p>
        <div className="power-chart" aria-hidden="true">
          <div className="power-sweep" />
          <svg viewBox="0 0 200 200">
            {[1, .75, .5, .25].map(scale => (
              <polygon key={scale} points="100,10 186,72 153,173 47,173 14,72"
                transform={`translate(${100 * (1 - scale)} ${100 * (1 - scale)}) scale(${scale})`} />
            ))}
            <polygon className="power-signal" points="100,25 163,79 139,153 61,153 29,77"
              style={{ rotate: `${active * 72}deg` }} />
          </svg>
        </div>
        <h3 key={serial}><TextGlitch text={capabilities[active]} /></h3>
      </div>
    </div>
  );
}
