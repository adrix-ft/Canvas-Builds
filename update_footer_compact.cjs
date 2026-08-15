const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const footerRegex = /const Footer = \(\) => \{[\s\S]*?return \([\s\S]*?<footer[\s\S]*?<\/footer>\s*\);\s*\};/;

const newFooter = `const Footer = () => {
  const { setLegalModal } = useAppContext();
  return (
    <footer
      id="contact"
      className="max-w-[1400px] mx-auto px-6 py-8 md:py-12 border-t border-[var(--color-bg-secondary)]/50 mt-12 md:mt-20"
    >
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-8">
        <div className="flex flex-col gap-3 md:gap-4 text-left items-start">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8 md:gap-12 text-left w-full md:w-auto">
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-[var(--color-text-primary)]">
              Contact Us
            </h4>
            <a
              href="mailto:adrashyadav07o8@gmail.com"
              className="text-sm text-[var(--color-text-primary)]/70 hover:text-[var(--color-accent-pink)] transition-colors flex items-center justify-start gap-2"
            >
              <span className="w-5 h-5 flex items-center justify-center bg-[var(--color-bg-secondary)]/50 rounded-full text-[var(--color-text-primary)]">
                📧
              </span>
              Email
            </a>
            <a
              href="https://wa.me/917906568743"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--color-text-primary)]/70 hover:text-[var(--color-accent-pink)] transition-colors flex items-center justify-start gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-[var(--color-text-primary)]">
              Legal
            </h4>
            <button
              onClick={() => setLegalModal("terms")}
              className="text-sm text-[var(--color-text-primary)]/70 hover:text-[var(--color-accent-pink)] transition-colors text-left"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setLegalModal("privacy")}
              className="text-sm text-[var(--color-text-primary)]/70 hover:text-[var(--color-accent-pink)] transition-colors text-left"
            >
              Privacy Policy
            </button>
          </div>

          <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
            <h4 className="font-bold text-[var(--color-text-primary)]">
              Socials
            </h4>
            <div className="flex gap-3 justify-start">
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
          </div>
        </div>
      </div>
    </footer>
  );
};`;

code = code.replace(footerRegex, newFooter);

fs.writeFileSync('src/App.tsx', code);
