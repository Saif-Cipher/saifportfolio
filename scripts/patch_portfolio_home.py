with open('components/portfolio-home.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c_norm = c.replace('\r\n', '\n')

c_norm = c_norm.replace(
    'import { DoodleCrewFooter } from "@/components/ui/doodle-crew-footer";',
    'import { MotionFooter } from "@/components/ui/motion-footer";\nimport { LiquidButton } from "@/components/ui/liquid-button";'
)

c_norm = c_norm.replace(
    '<DoodleCrewFooter />',
    '<MotionFooter />'
)

old_btn = '''            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="mailto:saifhossain.dev@gmail.com"
                className="button button--orange inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-racing-orange active:scale-95"
              >
                Start a conversation <span aria-hidden="true">↗</span>
              </a>
              <span className="text-xs font-medium text-ink-soft">
                Chattogram, Bangladesh
              </span>
            </div>'''

new_btn = '''            <div className="mt-8 flex flex-wrap items-center gap-4">
              <LiquidButton
                variant="primary"
                href="mailto:saifhossain.dev@gmail.com"
                icon={<span>↗</span>}
              >
                START A CONVERSATION
              </LiquidButton>
              <span className="text-xs font-mono text-[#F8F7F2]/65">
                Chattogram, Bangladesh
              </span>
            </div>'''

if old_btn in c_norm:
    c_norm = c_norm.replace(old_btn, new_btn)
    print("Replaced contact button with LiquidButton!")
else:
    print("Old contact button target not found, trying partial replace...")
    c_norm = c_norm.replace(
        'className="button button--orange inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-racing-orange active:scale-95"',
        'className="inline-flex items-center gap-3"'
    )

with open('components/portfolio-home.tsx', 'w', encoding='utf-8') as f:
    f.write(c_norm)

print("Updated components/portfolio-home.tsx successfully")
