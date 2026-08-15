const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const landingRegex = /const LandingPage = \(\) => \(\s*<div className="flex flex-col items-center w-full">\s*<Hero \/>\s*<\/div>\s*\);/m;
const newLandingPage = `const LandingPage = () => (
  <div className="flex flex-col items-center w-full">
    <Hero />
    <Testimonials />
  </div>
);`;
code = code.replace(landingRegex, newLandingPage);

const footerRegex = /const Footer = \(\) => \{[\s\S]*?const LandingPage/m;
const newFooter = `const Footer = () => {
  const { setLegalModal } = useAppContext();
  
  return (
    <footer className="max-w-[1400px] mx-auto px-6 py-12 border-t border-[var(--color-bg-secondary)]/50 mt-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-4 text-center md:text-left items-center md:items-start">
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-xl tracking-tight flex items-baseline">
              <span className="font-serif font-black text-[var(--color-text-primary)]">
                Adarsh
              </span>
              <span className="text-[var(--color-accent-pink)] italic tracking-tighter ml-1 font-serif font-black">
                cr8
              </span>
            </span>
          </div>
          <div className="text-sm text-[var(--color-text-primary)]/40">
            © {new Date().getFullYear()} Canvas Builds. All rights reserved.
          </div>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-6">
          <div className="flex gap-4">
            <a
              href="https://wa.me/917906568743"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[var(--color-bg-secondary)]/50 flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-accent-pink)] hover:text-white transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[var(--color-bg-secondary)]/50 flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-accent-pink)] hover:text-white transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/adrix-ft"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[var(--color-bg-secondary)]/50 flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-accent-pink)] hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm font-medium text-[var(--color-text-primary)]/60">
            <button onClick={() => setLegalModal("terms")} className="hover:text-[var(--color-accent-pink)] transition-colors">Terms of Service</button>
            <button onClick={() => setLegalModal("privacy")} className="hover:text-[var(--color-accent-pink)] transition-colors">Privacy Policy</button>
            <a href="mailto:hello@adarshcr8.com" className="hover:text-[var(--color-accent-pink)] transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const LandingPage`;

code = code.replace(footerRegex, newFooter);

fs.writeFileSync('src/App.tsx', code);
