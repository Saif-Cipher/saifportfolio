with open('components/ui/image-auto-slider.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    'className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38000A] text-[#F8F7F2]/90 border border-[#9B1313]/40"',
    'className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EAE6DC] text-[#133044] font-medium border border-[#22577A]/20"'
)
c = c.replace('text-[#F8F7F2]/60', 'text-[#133044]/60')
c = c.replace('group-hover/card:text-[#F8F7F2]', 'group-hover/card:text-[#22577A]')

c = c.replace(
    'className="px-3 py-1.5 rounded bg-[#38000A] hover:bg-[#9B1313] text-[#F8F7F2] border border-[#9B1313]',
    'className="px-3 py-1.5 rounded bg-[#133044] hover:bg-[#22577A] text-[#F8F7F2] border border-[#22577A]'
)
c = c.replace(
    ': "bg-[#38000A] hover:bg-[#9B1313] text-[#F8F7F2] border-[#9B1313]"',
    ': "bg-[#133044] hover:bg-[#22577A] text-[#F8F7F2] border-[#22577A]"'
)

with open('components/ui/image-auto-slider.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated image-auto-slider.tsx')
