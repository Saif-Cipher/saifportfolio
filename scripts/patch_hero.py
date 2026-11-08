with open('components/hero.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c_norm = c.replace('\r\n', '\n')

c_norm = c_norm.replace(
    'import { Portrait } from "@/components/portrait";',
    'import { Portrait } from "@/components/portrait";\nimport { GradualSpacing } from "@/components/ui/gradual-spacing";\nimport { LiquidButton } from "@/components/ui/liquid-button";'
)

old_role = '<strong className="hero-role-primary">AI ENGINEER</strong>'
new_role = '<strong className="hero-role-primary">\n            <GradualSpacing text="AI ENGINEER" />\n          </strong>'
c_norm = c_norm.replace(old_role, new_role)

old_actions = '''        <motion.div
          className="hero-actions"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.16, ease: easing }}
        >
          <a className="button button--orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-racing-orange active:scale-95" href="#work">
            Explore selected work <span aria-hidden="true">↘</span>
          </a>
          <a className="text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-racing-orange active:scale-95" href="#contact">
            Get in touch <span aria-hidden="true">↗</span>
          </a>
        </motion.div>'''

new_actions = '''        <motion.div
          className="hero-actions flex flex-wrap items-center gap-4 mt-6"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.16, ease: easing }}
        >
          <LiquidButton
            variant="primary"
            href="#work"
            icon={<span>↘</span>}
          >
            EXPLORE SELECTED WORK
          </LiquidButton>
          <LiquidButton
            variant="secondary"
            href="#contact"
            icon={<span>↗</span>}
          >
            GET IN TOUCH
          </LiquidButton>
        </motion.div>'''

if old_actions in c_norm:
    c_norm = c_norm.replace(old_actions, new_actions)
    print("Replaced hero actions with LiquidButton!")
else:
    print("WARNING: old_actions not found exactly in hero.tsx")

with open('components/hero.tsx', 'w', encoding='utf-8') as f:
    f.write(c_norm)

print("Updated components/hero.tsx successfully")
