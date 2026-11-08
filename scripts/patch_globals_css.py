with open('app/globals.css', 'r', encoding='utf-8') as f:
    css = f.read()

css_norm = css.replace('\r\n', '\n')

# Append border-beam and marquee animations
animations = '''
/* ==========================================================================
   BORDER BEAM ANIMATION (21st.dev hyperiux/border-beam)
   ========================================================================== */
@keyframes border-beam {
  100% {
    offset-distance: 100%;
  }
}
.animate-border-beam {
  animation: border-beam calc(var(--duration) * 1s) infinite linear;
}

/* ==========================================================================
   CINEMATIC MARQUEE ANIMATION (Motion Footer)
   ========================================================================== */
@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee-scroll 28s linear infinite;
  will-change: transform;
}
.animate-marquee:hover {
  animation-play-state: paused;
}
'''

if '@keyframes border-beam' not in css_norm:
    css_norm += animations
    print("Added border-beam and marquee animations!")

with open('app/globals.css', 'w', encoding='utf-8') as f:
    f.write(css_norm)

print("Updated app/globals.css successfully!")
