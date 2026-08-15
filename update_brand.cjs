const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const navBrandRegex = /<div className="flex items-center gap-2 cursor-pointer shrink-0 group">[\s\S]*?<\/div>\s*<div className="hidden lg:flex items-center gap-8">/;

const newNavBrand = `<div className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0 group">
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 bg-white text-[var(--color-text-primary)] rounded-lg sm:rounded-xl flex items-center justify-center font-serif text-xl sm:text-2xl font-black transform transition-all duration-500 group-hover:rotate-[8deg] group-hover:scale-105 shadow-md overflow-hidden border border-[var(--color-text-primary)]/10">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/80 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out backdrop-blur-[1px] z-10"></div>
                <span className="relative z-0 drop-shadow-sm">A</span>
              </div>
              <span className="text-xl sm:text-2xl tracking-tight flex items-baseline relative drop-shadow-sm">
                <span className="bg-gradient-to-b from-[#2a1b16] to-[#6d4c41] bg-clip-text text-transparent font-serif font-black">
                  Adarsh
                </span>
                <span className="text-[var(--color-accent-pink)] italic tracking-tighter ml-1 relative font-serif font-black">
                  cr8.
                  <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[var(--color-accent-pink)] to-[var(--color-accent-purple)] rounded-full opacity-90 shadow-[0_2px_4px_rgba(236,72,153,0.3)]"></span>
                </span>
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-8">`;

code = code.replace(navBrandRegex, newNavBrand);

const footerBrandRegex = /<div className="flex items-center gap-2 mb-3 md:mb-0 group cursor-pointer">[\s\S]*?<\/div>\s*<p className="mb-3 md:mb-0">/;

const newFooterBrand = `<div className="flex items-center gap-2 mb-3 md:mb-0 group cursor-pointer">
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 bg-white/10 text-white rounded-md flex items-center justify-center font-serif text-base sm:text-lg font-black transform transition-all duration-500 group-hover:rotate-[8deg] group-hover:scale-105 shadow-sm overflow-hidden border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out backdrop-blur-[1px] z-10"></div>
            <span className="relative z-0 drop-shadow-md">A</span>
          </div>
          <span className="text-lg sm:text-xl tracking-tight flex items-baseline relative drop-shadow-md">
            <span className="text-white font-serif font-black">
              Adarsh
            </span>
            <span className="text-[var(--color-accent-pink)] italic tracking-tighter ml-1 relative font-serif font-black">
              cr8.
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--color-accent-pink)] to-[var(--color-accent-purple)] rounded-full opacity-90 shadow-[0_1px_3px_rgba(236,72,153,0.3)]"></span>
            </span>
          </span>
        </div>
        <p className="mb-3 md:mb-0">`;

code = code.replace(footerBrandRegex, newFooterBrand);

fs.writeFileSync('src/App.tsx', code);
