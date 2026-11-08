import re

# 1. Patch components/hero.tsx
with open('components/hero.tsx', 'r', encoding='utf-8') as f:
    hero = f.read()

hero_target = '''        <motion.p
          className="hero-role"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.96, ease: easing }}
        >
          AI Automation Specialist
          <br />
          AI Engineer <span aria-hidden="true">/</span> Web Developer
        </motion.p>'''

hero_replace = '''        <motion.div
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

hero_norm = hero.replace('\r\n', '\n')
hero_target_norm = hero_target.replace('\r\n', '\n')
hero_replace_norm = hero_replace.replace('\r\n', '\n')

if hero_target_norm in hero_norm:
    hero_norm = hero_norm.replace(hero_target_norm, hero_replace_norm)
    print("Replaced hero-role in hero.tsx!")
else:
    print("ERROR: hero_target not found in hero.tsx")

with open('components/hero.tsx', 'w', encoding='utf-8') as f:
    f.write(hero_norm)


# 2. Patch components/ui/sterling-gate-kinetic-navigation.tsx
with open('components/ui/sterling-gate-kinetic-navigation.tsx', 'r', encoding='utf-8') as f:
    sg = f.read()

sg_target = '''          {/* Logo / Wordmark */}
          <a
            href="#home"
            className="wordmark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vivid-red"
            aria-label="Saif Hossain homepage"
          >
            SAIF HOSSAIN<span className="text-vivid-red">.</span>
          </a>'''

sg_replace = '''          {/* Logo / Wordmark */}
          <a
            href="#home"
            className="wordmark shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vivid-red"
            aria-label="Saif Hossain homepage"
          >
            SAIF HOSSAIN<span className="text-vivid-red">.</span>
          </a>'''

sg_norm = sg.replace('\r\n', '\n')
sg_target_norm = sg_target.replace('\r\n', '\n')
sg_replace_norm = sg_replace.replace('\r\n', '\n')

if sg_target_norm in sg_norm:
    sg_norm = sg_norm.replace(sg_target_norm, sg_replace_norm)
    print("Replaced wordmark classes in sterling-gate-kinetic-navigation.tsx!")
else:
    print("ERROR: sg_target not found")

with open('components/ui/sterling-gate-kinetic-navigation.tsx', 'w', encoding='utf-8') as f:
    f.write(sg_norm)


# 3. Patch app/globals.css
with open('app/globals.css', 'r', encoding='utf-8') as f:
    css = f.read()

css_norm = css.replace('\r\n', '\n')

# Wordmark styling
wordmark_target = '''.wordmark {
  display: inline-flex;
  align-items: baseline;
  font-family: var(--display);
  font-size: 1.45rem;
  letter-spacing: -0.01em;
  line-height: 1;
  white-space: nowrap;
  color: var(--text-main);
}'''

wordmark_replace = '''.wordmark {
  display: inline-flex;
  align-items: baseline;
  flex-shrink: 0;
  white-space: nowrap;
  font-family: var(--display);
  font-size: clamp(1.15rem, 2vw, 1.45rem);
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1;
  color: var(--text-main);
}'''

if wordmark_target in css_norm:
    css_norm = css_norm.replace(wordmark_target, wordmark_replace)
    print("Updated .wordmark in globals.css!")
else:
    print("ERROR: wordmark_target not found in globals.css")

# Desktop nav & header responsive media queries
media_target = '''@media (max-width: 820px) {
  .sg-desktop-nav { display: none; }
  .sg-header-inner { padding: 0 5vw; }
  .sg-gate-stage,
  .sg-gate-layer-1,
  .sg-gate-layer-2 {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

@media (max-width: 520px) {
  .sg-header-cta { display: none; }
  .sg-header-inner { gap: 0.75rem; }
}'''

media_replace = '''@media (max-width: 1120px) {
  .sg-desktop-nav { gap: clamp(14px, 1.8vw, 24px); }
  .sg-desktop-nav a { font-size: 0.8rem; }
}

@media (max-width: 960px) {
  .sg-desktop-nav { display: none; }
}

@media (max-width: 820px) {
  .sg-header-inner { padding: 0 4.5vw; }
  .sg-gate-stage,
  .sg-gate-layer-1,
  .sg-gate-layer-2 {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

@media (max-width: 600px) {
  .sg-header-cta { display: none; }
  .sg-header-inner { padding: 0 4vw; gap: 0.5rem; }
}'''

if media_target in css_norm:
    css_norm = css_norm.replace(media_target, media_replace)
    print("Updated header media queries in globals.css!")
else:
    print("ERROR: media_target not found in globals.css")

# Hero role styling
hero_role_target = '''.hero-role {
  margin: 24px 0 0;
  color: var(--vivid-red);
  font-family: var(--display);
  font-size: clamp(1.45rem, 2.25vw, 2.55rem);
  letter-spacing: 0.025em;
  line-height: 1.02;
}
.hero-role span { color: var(--text-main); }'''

hero_role_replace = '''.hero-role {
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

if hero_role_target in css_norm:
    css_norm = css_norm.replace(hero_role_target, hero_role_replace)
    print("Updated .hero-role in globals.css!")
else:
    print("ERROR: hero_role_target not found in globals.css")

# Responsive hero role overrides in media queries
css_norm = css_norm.replace(
    '.hero-role { margin-top: 14px; font-size: clamp(1.35rem, 4vw, 2rem); }',
    '.hero-role { margin-top: 14px; } .hero-role-primary { font-size: clamp(2rem, 5.8vw, 3.2rem); } .hero-role-kicker { font-size: 0.95rem; } .hero-role-secondary { font-size: 1.15rem; }'
)
css_norm = css_norm.replace(
    '.hero-role { font-size: 1.35rem; }',
    '.hero-role-primary { font-size: clamp(1.75rem, 7.8vw, 2.35rem); } .hero-role-kicker { font-size: 0.85rem; } .hero-role-secondary { font-size: 1.05rem; } .hero-role-lead { gap: 4px 8px; }'
)

with open('app/globals.css', 'w', encoding='utf-8') as f:
    f.write(css_norm)

print("Done patching all files!")
