with open('components/ui/image-auto-slider.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c_norm = c.replace('\r\n', '\n')

# Add imports
c_norm = c_norm.replace(
    'import { type Project } from "@/data/projects";',
    'import { type Project } from "@/data/projects";\nimport { BorderBeam } from "@/components/ui/border-beam";\nimport { RandomLetterSwap } from "@/components/ui/random-letter-swap";\nimport { LiquidButton } from "@/components/ui/liquid-button";'
)

# Add BorderBeam inside article on featured cards
article_target = 'className="relative flex-shrink-0 w-[290px] sm:w-[360px] md:w-[420px] rounded-xl overflow-hidden bg-[#F8F7F2] border border-[#22577A]/25 hover:border-[#FB3640] shadow-xl transition-all duration-300 hover:shadow-[0_12px_32px_rgba(34,87,122,0.28)] hover:-translate-y-1.5 cursor-pointer flex flex-col group/card"'
article_replace = 'className="relative flex-shrink-0 w-[290px] sm:w-[360px] md:w-[420px] rounded-2xl overflow-hidden bg-[#F8F7F2] border border-[#22577A]/25 hover:border-[#FB3640] shadow-xl transition-all duration-300 hover:shadow-[0_12px_32px_rgba(34,87,122,0.28)] hover:-translate-y-1.5 cursor-pointer flex flex-col group/card"'
c_norm = c_norm.replace(article_target, article_replace)

beam_insert_target = '{/* Visual Thumbnail */}'
beam_insert_replace = '''{/* Refined Selective Border Beam on Featured Card */}
              {(project.featured || idx % projects.length === 0) && (
                <BorderBeam
                  size={240}
                  duration={11}
                  borderWidth={1.5}
                  colorFrom="#FB3640"
                  colorTo="#22577A"
                />
              )}

              {/* Visual Thumbnail */}'''
c_norm = c_norm.replace(beam_insert_target, beam_insert_replace)

# Inspect link scramble
inspect_target = '''                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#FB3640] group-hover/card:text-[#22577A] transition-colors shrink-0">
                    INSPECT ↗
                  </span>'''
inspect_replace = '''                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#FB3640] group-hover/card:text-[#133044] transition-colors shrink-0">
                    <RandomLetterSwap text="INSPECT ↗" />
                  </span>'''
c_norm = c_norm.replace(inspect_target, inspect_replace)

# Replace control buttons with LiquidButton
controls_target = '''        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Step Left */}
          <button
            type="button"
            onClick={() => handleScrollBy("left")}
            className="px-3 py-1.5 rounded bg-[#133044] hover:bg-[#22577A] text-[#F8F7F2] border border-[#22577A] text-xs font-mono transition-colors active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB3640]"
            aria-label="Scroll left"
          >
            ← PREV
          </button>

          {/* Toggle Pause / Play */}
          <button
            type="button"
            onClick={() => setManualPause(!manualPause)}
            className={`px-3 py-1.5 rounded border text-xs font-mono transition-colors active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB3640] ${
              manualPause
                ? "bg-[#FB3640] text-[#F8F7F2] border-[#FB3640]"
                : "bg-[#133044] hover:bg-[#22577A] text-[#F8F7F2] border-[#22577A]"
            }`}
            aria-label={manualPause ? "Resume auto-sliding" : "Pause auto-sliding"}
          >
            {manualPause ? "▶ RESUME" : "❚❚ PAUSE"}
          </button>

          {/* Step Right */}
          <button
            type="button"
            onClick={() => handleScrollBy("right")}
            className="px-3 py-1.5 rounded bg-[#133044] hover:bg-[#22577A] text-[#F8F7F2] border border-[#22577A] text-xs font-mono transition-colors active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB3640]"
            aria-label="Scroll right"
          >
            NEXT →
          </button>
        </div>'''

controls_replace = '''        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <LiquidButton
            variant="secondary"
            onClick={() => handleScrollBy("left")}
            className="px-3.5 py-1.5 text-xs"
            aria-label="Scroll left"
          >
            ← PREV
          </LiquidButton>

          <LiquidButton
            variant={manualPause ? "primary" : "secondary"}
            onClick={() => setManualPause(!manualPause)}
            className="px-3.5 py-1.5 text-xs"
            aria-label={manualPause ? "Resume auto-sliding" : "Pause auto-sliding"}
          >
            {manualPause ? "▶ RESUME" : "❚❚ PAUSE"}
          </LiquidButton>

          <LiquidButton
            variant="secondary"
            onClick={() => handleScrollBy("right")}
            className="px-3.5 py-1.5 text-xs"
            aria-label="Scroll right"
          >
            NEXT →
          </LiquidButton>
        </div>'''
c_norm = c_norm.replace(controls_target, controls_replace)

with open('components/ui/image-auto-slider.tsx', 'w', encoding='utf-8') as f:
    f.write(c_norm)

print("Updated components/ui/image-auto-slider.tsx successfully!")
