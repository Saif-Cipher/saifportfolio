with open('components/ui/doodle-crew-footer.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = '''      {/* Top Brand & Navigation Columns */}
      <div className="dcf-top max-w-7xl mx-auto px-6 sm:px-10 pt-12 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Brand & Blurb */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full border-2 border-[#F8F7F2] bg-[#133044] flex items-center justify-center font-mono font-bold text-sm text-[#FB3640] shadow-md">
              SH
            </span>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#F8F7F2]">
              {brand}
            </span>
          </div>
          <p className="font-sans text-sm sm:text-base text-[#F8F7F2]/80 leading-relaxed max-w-md">
            {blurb}
          </p>
        </div>

        {/* Navigation Columns */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
          {columns.map((col) => (
            <div key={col.title} className="space-y-3">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FB3640]">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-sans text-xs sm:text-sm text-[#F8F7F2]/75 hover:text-[#F8F7F2] transition-colors inline-block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FB3640]"
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>'''

replacement = '''      {/* Top Brand & Navigation Columns */}
      <div className="dcf-top max-w-7xl mx-auto px-6 sm:px-10 pt-16 pb-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Brand & Blurb */}
        <div className="md:col-span-5 lg:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full border-2 border-[#FB3640] bg-[#102B3E] flex items-center justify-center font-mono font-bold text-sm text-[#F8F7F2] shadow-md">
              SH
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-[#F8F7F2]">
              {brand}<span className="text-[#FB3640]">.</span>
            </span>
          </div>
          <p className="font-body text-sm text-[#F8F7F2]/80 leading-relaxed max-w-sm">
            {blurb}
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#FB3640]">
            <span className="w-2 h-2 rounded-full bg-[#FB3640] animate-pulse" />
            <span>AVAILABLE FOR Q1 2026 ENGAGEMENTS</span>
          </div>
        </div>

        {/* Navigation, Verified Systems, Live Products Columns */}
        <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {columns.map((col) => (
            <div key={col.title} className="space-y-3.5">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FB3640] pb-2 border-b border-[#22577A]/40 flex items-center justify-between">
                <span>{col.title}</span>
                <span className="text-[10px] text-[#F8F7F2]/40 font-normal">0{col.links.length}</span>
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group font-body text-xs sm:text-sm text-[#F8F7F2]/80 hover:text-[#FB3640] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FB3640]"
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      <span className="text-[#22577A] group-hover:text-[#FB3640] transition-colors">›</span>
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>'''

c_norm = c.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in c_norm:
    c_norm = c_norm.replace(target_norm, replacement_norm)
    print("Replaced footer columns!")
else:
    print("ERROR: Target not found")

tagline_target = '<p className="font-serif text-lg sm:text-2xl text-[#F8F7F2] tracking-tight">'
tagline_replace = '<p className="font-display text-xl sm:text-2xl font-bold text-[#F8F7F2] tracking-tight">'
if tagline_target in c_norm:
    c_norm = c_norm.replace(tagline_target, tagline_replace)
    print("Replaced tagline font!")

with open('components/ui/doodle-crew-footer.tsx', 'w', encoding='utf-8') as f:
    f.write(c_norm)
