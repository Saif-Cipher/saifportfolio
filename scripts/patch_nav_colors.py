with open('components/ui/sterling-gate-kinetic-navigation.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('bg-[#120004]/80', 'bg-[#0B1E2B]/80')
c = c.replace('fill="rgba(205,28,24,0.18)"', 'fill="rgba(251,54,64,0.18)"')
c = c.replace('fill="rgba(155,19,19,0.25)"', 'fill="rgba(34,87,122,0.35)"')
c = c.replace('fill="rgba(255,168,150,0.12)"', 'fill="rgba(248,247,242,0.15)"')
c = c.replace('stroke="rgba(205,28,24,0.22)"', 'stroke="rgba(251,54,64,0.25)"')
c = c.replace('stroke="rgba(155,19,19,0.2)"', 'stroke="rgba(34,87,122,0.25)"')
c = c.replace('fill="rgba(255,168,150,0.22)"', 'fill="rgba(248,247,242,0.25)"')
c = c.replace('fill="rgba(205,28,24,0.14)"', 'fill="rgba(251,54,64,0.18)"')
c = c.replace('fill="rgba(155,19,19,0.18)"', 'fill="rgba(34,87,122,0.25)"')
c = c.replace('stroke="rgba(255,168,150,0.16)"', 'stroke="rgba(248,247,242,0.2)"')

with open('components/ui/sterling-gate-kinetic-navigation.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

with open('app/globals.css', 'r', encoding='utf-8') as f:
    g = f.read()

g = g.replace('background: rgba(155, 19, 19, 0.25);', 'background: rgba(34, 87, 122, 0.35);')
g = g.replace('rgba(205, 28, 24, 0.18)', 'rgba(251, 54, 64, 0.2)')

with open('app/globals.css', 'w', encoding='utf-8') as f:
    f.write(g)

print('Updated navigation and globals colors successfully')
