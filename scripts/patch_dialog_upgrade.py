with open('components/project-dialog.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c_norm = c.replace('\r\n', '\n')

c_norm = c_norm.replace(
    'import { type Project } from "@/data/projects";',
    'import { type Project } from "@/data/projects";\nimport { BorderBeam } from "@/components/ui/border-beam";\nimport { LiquidButton } from "@/components/ui/liquid-button";'
)

old_card = 'className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-none border border-[#22577A]/25 bg-[#F8F7F2] text-[#133044] shadow-2xl"'
new_card = 'className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#22577A]/30 bg-[#F8F7F2] text-[#133044] shadow-2xl"'
c_norm = c_norm.replace(old_card, new_card)

# Insert BorderBeam inside dialog modal
insert_target = '{/* Top Toolbar */}'
insert_replace = '''{/* Refined Border Beam */}
            <BorderBeam
              size={320}
              duration={14}
              borderWidth={1.5}
              colorFrom="#FB3640"
              colorTo="#22577A"
            />

            {/* Top Toolbar */}'''
c_norm = c_norm.replace(insert_target, insert_replace)

old_actions = '''              <div className="border-t border-[#22577A]/25 pt-6 flex flex-wrap items-center justify-between gap-4">
                {project.externalUrl ? (
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 bg-vivid-red px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#133044] transition-colors hover:bg-deep-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vivid-red"
                  >
                    Open Live Deployment <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="font-mono text-xs text-[#22577A]">
                    Automated Workflow System · Verified Implementation
                  </span>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-[#22577A]/25 text-xs font-bold uppercase tracking-wider text-[#133044] transition-colors hover:bg-deep-red/40"
                >
                  Close Window
                </button>
              </div>'''

new_actions = '''              <div className="border-t border-[#22577A]/25 pt-6 flex flex-wrap items-center justify-between gap-4">
                {project.externalUrl ? (
                  <LiquidButton
                    variant="primary"
                    href={project.externalUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    icon={<span>↗</span>}
                  >
                    OPEN LIVE DEPLOYMENT
                  </LiquidButton>
                ) : (
                  <span className="font-mono text-xs text-[#22577A] font-semibold">
                    Automated Workflow System · Verified Implementation
                  </span>
                )}
                <LiquidButton
                  variant="secondary"
                  onClick={onClose}
                >
                  CLOSE WINDOW
                </LiquidButton>
              </div>'''

c_norm = c_norm.replace(old_actions, new_actions)

with open('components/project-dialog.tsx', 'w', encoding='utf-8') as f:
    f.write(c_norm)

print("Updated components/project-dialog.tsx successfully!")
