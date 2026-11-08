with open('components/ui/image-auto-slider.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = '''                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F8F7F2] group-hover/card:text-[#22577A] transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#F8F7F2]/75 line-clamp-2 mt-1 mb-3 leading-relaxed">'''

replacement = '''                    <h3 className="font-display text-lg sm:text-xl font-bold text-[#133044] group-hover/card:text-[#FB3640] transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#133044]/80 line-clamp-2 mt-1 mb-3 leading-relaxed">'''

if target in c:
    c = c.replace(target, replacement)
    print("Found exact target and replaced!")
else:
    # try normalized line endings
    c_norm = c.replace('\r\n', '\n')
    target_norm = target.replace('\r\n', '\n')
    replacement_norm = replacement.replace('\r\n', '\n')
    if target_norm in c_norm:
        c_norm = c_norm.replace(target_norm, replacement_norm)
        c = c_norm
        print("Replaced normalized!")
    else:
        print("ERROR: Target not found in file")

with open('components/ui/image-auto-slider.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
