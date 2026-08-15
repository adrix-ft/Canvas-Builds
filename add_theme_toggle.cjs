const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldIcons = `import {
  Search, User, ShoppingCart, Heart, Star, Truck, ShieldCheck, 
  RefreshCw, Headphones, ArrowRight, Mail, CheckCircle, CreditCard, 
  Menu, X, Play, Sparkles, Gift, Download, ChevronRight, Quote, 
  ChevronDown, MessageCircle, Check
} from 'lucide-react';`;
const newIcons = `import {
  Search, User, ShoppingCart, Heart, Star, Truck, ShieldCheck, 
  RefreshCw, Headphones, ArrowRight, Mail, CheckCircle, CreditCard, 
  Menu, X, Play, Sparkles, Gift, Download, ChevronRight, Quote, 
  ChevronDown, MessageCircle, Check, Moon, Sun
} from 'lucide-react';`;
code = code.replace(oldIcons, newIcons);

const oldNavbar = `const Navbar = () => {
  const { cart, setIsCartOpen } = useAppContext();`;
const newNavbar = `const Navbar = () => {
  const { cart, setIsCartOpen, isDarkMode, toggleDarkMode } = useAppContext();
  
  // Apply dark mode to body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
`;
code = code.replace(oldNavbar, newNavbar);

const oldCartBtn = `{cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[var(--color-accent-purple)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">{cart.length}</span>}
              </button>`;
const newCartBtn = `{cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[var(--color-accent-purple)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">{cart.length}</span>}
              </button>
              <button onClick={toggleDarkMode} className="w-10 h-10 bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-full hidden sm:flex items-center justify-center transition-colors shadow-sm">
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>`;
code = code.replace(oldCartBtn, newCartBtn);

const oldMobileCartBtn = `{cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[var(--color-accent-purple)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
              </button>`;
const newMobileCartBtn = `{cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[var(--color-accent-purple)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
              </button>
              <button onClick={toggleDarkMode} className="w-10 h-10 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-full flex items-center justify-center">
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>`;
code = code.replace(oldMobileCartBtn, newMobileCartBtn);

fs.writeFileSync('src/App.tsx', code);
console.log('Theme toggle added');
