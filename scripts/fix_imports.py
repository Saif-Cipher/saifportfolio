# Fix components/project-dialog.tsx
with open('components/project-dialog.tsx', 'r', encoding='utf-8') as f:
    pd = f.read()

pd = pd.replace(
    'import type { Project } from "@/data/projects";',
    'import type { Project } from "@/data/projects";\nimport { BorderBeam } from "@/components/ui/border-beam";\nimport { LiquidButton } from "@/components/ui/liquid-button";'
)

with open('components/project-dialog.tsx', 'w', encoding='utf-8') as f:
    f.write(pd)
print("Updated project-dialog.tsx imports!")

# Fix components/ui/image-auto-slider.tsx
with open('components/ui/image-auto-slider.tsx', 'r', encoding='utf-8') as f:
    ias = f.read()

ias = ias.replace(
    'import type { Project } from "@/data/projects";',
    'import type { Project } from "@/data/projects";\nimport { BorderBeam } from "@/components/ui/border-beam";\nimport { RandomLetterSwap } from "@/components/ui/random-letter-swap";\nimport { LiquidButton } from "@/components/ui/liquid-button";'
)

with open('components/ui/image-auto-slider.tsx', 'w', encoding='utf-8') as f:
    f.write(ias)
print("Updated image-auto-slider.tsx imports!")

# Fix components/ui/sterling-gate-kinetic-navigation.tsx
with open('components/ui/sterling-gate-kinetic-navigation.tsx', 'r', encoding='utf-8') as f:
    sg = f.read()

sg = sg.replace(
    '(e: React.MouseEvent<HTMLAnchorElement>, href: string)',
    '(e: React.MouseEvent<any>, href: string)'
)

with open('components/ui/sterling-gate-kinetic-navigation.tsx', 'w', encoding='utf-8') as f:
    f.write(sg)
print("Updated sterling-gate-kinetic-navigation.tsx event type!")
