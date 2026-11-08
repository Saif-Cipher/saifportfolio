with open('components/ui/sterling-gate-kinetic-navigation.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c_norm = c.replace('\r\n', '\n')

c_norm = c_norm.replace(
    'import { AnimatePresence, motion, useReducedMotion } from "motion/react";',
    'import { AnimatePresence, motion, useReducedMotion } from "motion/react";\nimport { LiquidButton } from "@/components/ui/liquid-button";'
)

old_header_start = '      {/* Top Fixed Header Bar */}\n      <header className="sg-header">'
old_header_end = '      </header>'

start_idx = c_norm.find(old_header_start)
end_idx = c_norm.find(old_header_end)

if start_idx != -1 and end_idx != -1:
    end_idx += len(old_header_end)
    floating_controls = '''      {/* Floating Glass Controls (Detached, Top-Right) */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-8 z-50 flex items-center gap-2.5 sm:gap-3 pointer-events-auto select-none">
        <LiquidButton
          variant="floating-glass"
          href="#contact"
          onClick={(e) => handleLinkClick(e, "#contact")}
          icon={<span className="text-[#FB3640]">↗</span>}
          className="shadow-2xl text-[11px] sm:text-xs px-4 py-2 sm:px-5 sm:py-2.5 border-[#F8F7F2]/25"
        >
          LET'S TALK
        </LiquidButton>

        <LiquidButton
          variant="floating-glass"
          onClick={toggleMenu}
          icon={
            <span
              className="text-[#FB3640] inline-block transition-transform duration-300"
              style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
            >
              {isOpen ? "✕" : "☰"}
            </span>
          }
          iconPosition="left"
          className="shadow-2xl text-[11px] sm:text-xs px-4 py-2 sm:px-5 sm:py-2.5 border-[#F8F7F2]/25"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isOpen ? "CLOSE" : "MENU"}
        </LiquidButton>
      </div>'''
    c_norm = c_norm[:start_idx] + floating_controls + c_norm[end_idx:]
    print("Replaced header with floating glass controls successfully!")
else:
    print(f"Error finding indices: start={start_idx}, end={end_idx}")

with open('components/ui/sterling-gate-kinetic-navigation.tsx', 'w', encoding='utf-8') as f:
    f.write(c_norm)
