with open('components/hero.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = '''        <motion.div
          className="hero-role"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.96, ease: easing }}
        >
          <span className="hero-role-kicker">AI AUTOMATION SPECIALIST</span>
          <div className="hero-role-lead">
            <strong className="hero-role-primary">AI ENGINEER</strong>
            <span className="hero-role-divider" aria-hidden="true">/</span>
            <span className="hero-role-secondary">WEB DEVELOPER</span>
          </div>
        </motion.div>'''

replacement = '''        <motion.div
          className="hero-role"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.96, ease: easing }}
        >
          <span className="hero-role-kicker">AI AUTOMATION SPECIALIST</span>
          <strong className="hero-role-primary">AI ENGINEER</strong>
          <div className="hero-role-subline">
            <span className="hero-role-divider" aria-hidden="true">/</span>
            <span className="hero-role-secondary">WEB DEVELOPER</span>
          </div>
        </motion.div>'''

c_norm = c.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in c_norm:
    c_norm = c_norm.replace(target_norm, replacement_norm)
    print("Replaced in hero.tsx!")
else:
    print("Target not found in hero.tsx")

with open('components/hero.tsx', 'w', encoding='utf-8') as f:
    f.write(c_norm)


with open('app/globals.css', 'r', encoding='utf-8') as f:
    css = f.read()

css_norm = css.replace('\r\n', '\n')

css_target = '''.hero-role {
  margin: 20px 0 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.hero-role-kicker {
  font-family: var(--display);
  font-size: clamp(0.95rem, 1.4vw, 1.45rem);
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--peach);
  text-transform: uppercase;
  line-height: 1.1;
}
.hero-role-lead {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px 14px;
  line-height: 0.95;
}
.hero-role-primary {
  font-family: var(--display);
  font-size: clamp(2.4rem, 4.6vw, 4.8rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--vivid-red);
  text-transform: uppercase;
  line-height: 1;
  text-shadow: 0 0 35px rgba(251, 54, 64, 0.3);
}
.hero-role-divider {
  font-family: var(--display);
  font-size: clamp(1.4rem, 2.5vw, 2.4rem);
  color: var(--peach);
  font-weight: 400;
  opacity: 0.7;
}
.hero-role-secondary {
  font-family: var(--display);
  font-size: clamp(1.25rem, 2.1vw, 2.1rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text-main);
  text-transform: uppercase;
  line-height: 1;
}'''

css_replace = '''.hero-role {
  margin: 18px 0 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.hero-role-kicker {
  font-family: var(--display);
  font-size: clamp(0.92rem, 1.3vw, 1.35rem);
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--peach);
  text-transform: uppercase;
  line-height: 1.1;
}
.hero-role-primary {
  display: block;
  font-family: var(--display);
  font-size: clamp(2.4rem, 4.4vw, 4.6rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--vivid-red);
  text-transform: uppercase;
  line-height: 0.98;
  margin: 2px 0;
  text-shadow: 0 0 35px rgba(251, 54, 64, 0.32);
}
.hero-role-subline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  line-height: 1;
}
.hero-role-divider {
  font-family: var(--display);
  font-size: clamp(1.2rem, 1.8vw, 1.8rem);
  color: var(--peach);
  font-weight: 400;
  opacity: 0.7;
}
.hero-role-secondary {
  font-family: var(--display);
  font-size: clamp(1.15rem, 1.9vw, 1.95rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--text-main);
  text-transform: uppercase;
  line-height: 1;
}'''

if css_target in css_norm:
    css_norm = css_norm.replace(css_target, css_replace)
    print("Replaced in globals.css!")
else:
    print("Target not found in globals.css")

with open('app/globals.css', 'w', encoding='utf-8') as f:
    f.write(css_norm)
