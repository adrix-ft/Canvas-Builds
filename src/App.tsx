import { LegalModal } from "./LegalModal";
import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useAppContext } from "./AppContext";
import {
  ToastContainer,
  CartDrawer,
  FloatingChat,
  AnimatedCounter,
  BundleSection,
  MeetCreator,
  SearchModal,
} from "./NewComponents";
import {
  Search,
  User,
  ShoppingCart,
  Heart,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  ArrowRight,
  Mail,
  CheckCircle,
  CreditCard,
  Menu,
  X,
  Play,
  Sparkles,
  Gift,
  Download,
  ChevronRight,
  Quote,
  Github,
  Instagram,
  ChevronDown,
  MessageCircle,
  Check,
  Moon,
  Sun,
  Code,
  GraduationCap,
  Terminal,
  Users,
  Book,
  Plane
} from "lucide-react";

const CATEGORIES = ["All", "Love", "Friendship", "Anniversary", "Apology"];

const PRODUCTS = [
  {
    id: 1,
    category: "Love",
    title: "Girlfriend Day Special",
    price: "Rs. 249",
    originalPrice: "Rs. 399",
    rating: "4.9",
    emoji: <Heart className="w-12 h-12 text-pink-500 fill-current" />,
    gradient: "from-pink-200 to-rose-100",
    tag: "Bestseller",
  },
  {
    id: 2,
    category: "Friendship",
    title: "Bestie Birthday Surprise",
    price: "Rs. 199",
    originalPrice: "Rs. 299",
    rating: "4.8",
    emoji: <Users className="w-12 h-12 text-[var(--color-text-primary)]" />,
    gradient: "from-[var(--color-bg-secondary)] to-[var(--color-bg-primary)]",
  },
  {
    id: 3,
    category: "Anniversary",
    title: "Our Journey Timeline",
    price: "Rs. 299",
    originalPrice: "Rs. 499",
    rating: "5.0",
    emoji: <Code className="w-12 h-12 text-[var(--color-accent-purple)]" />,
    gradient: "from-[var(--color-accent-purple)]/20 to-[var(--color-accent-purple)]/40",
    tag: "Premium",
  },
  {
    id: 4,
    category: "Apology",
    title: 'Cute "I am Sorry" Page',
    price: "Rs. 149",
    originalPrice: "Rs. 249",
    rating: "4.7",
    emoji: <Heart className="w-12 h-12 text-orange-400" />,
    gradient: "from-orange-100 to-amber-50",
  },
  {
    id: 5,
    category: "Love",
    title: "100 Reasons Why I Love You",
    price: "Rs. 199",
    originalPrice: "Rs. 349",
    rating: "4.9",
    emoji: <Mail className="w-12 h-12 text-rose-400" />,
    gradient: "from-rose-100 to-pink-50",
  },
  {
    id: 6,
    category: "Friendship",
    title: "Squad Goals Gallery",
    price: "Rs. 249",
    originalPrice: "Rs. 399",
    rating: "4.8",
    emoji: <Users className="w-12 h-12 text-purple-500" />,
    gradient: "from-purple-100 to-fuchsia-50",
  },
  {
    id: 7,
    category: "Anniversary",
    title: "Digital Memory Book",
    price: "Rs. 279",
    originalPrice: "Rs. 449",
    rating: "5.0",
    emoji: <Book className="w-12 h-12 text-amber-500" />,
    gradient: "from-amber-100 to-orange-50",
    tag: "Trending",
  },
  {
    id: 8,
    category: "Love",
    title: "Long Distance Countdown",
    price: "Rs. 199",
    originalPrice: "Rs. 299",
    rating: "4.6",
    emoji: <Plane className="w-12 h-12 text-cyan-500" />,
    gradient: "from-blue-100 to-cyan-50",
  },
];

const INITIAL_TESTIMONIALS = [
  {
    name: "Priya S.",
    role: "Bought for Anniversary",
    text: "This saved my anniversary! I have zero coding experience but the guide was so easy to follow. My boyfriend loved it!",
  },
  {
    name: "Rahul K.",
    role: "Bought for Apology",
    text: "She was so mad at me, but this cute apology template actually made her smile. Worth every penny.",
  },
  {
    name: "Ananya M.",
    role: "Bought for Bestie",
    text: "My best friend literally cried when she opened the link. Such a unique and thoughtful gift idea!",
  },
  {
    name: "Vikram D.",
    role: "Bought for Girlfriend",
    text: "The animations are so smooth and it looks amazing on mobile. Hosted it for free on Vercel in 5 mins.",
  },
  {
    name: "Neha R.",
    role: "Bought for Anniversary",
    text: "Beautifully crafted code. As a dev myself, I appreciate the clean React structure and Tailwind styling.",
  },
];

const FAQS = [
  {
    q: "Do I need coding experience?",
    a: "Not at all! We provide an easy guide to edit the raw code yourself. Or, skip the hassle we can customize and deploy the site for you!",
  },
  {
    q: "Is this a one-time payment?",
    a: "Yes, a one-time fee gives you lifetime access to the raw code. If you want us to handle customization and deployment, simply reach out after purchase.",
  },
  {
    q: "How do I host the website?",
    a: "You can host it yourself for FREE using our 5-minute guide. Alternatively, ask us to deploy it and we'll send you a ready-to-share live link.",
  },
  {
    q: "What do I get after purchasing?",
    a: "You instantly receive a zip file with the raw source code and instructions. From there, choose your path: DIY or let us customize it!",
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 60, damping: 15 },
  },
};

const MagneticButton = ({ children, className, onClick }: any) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

const Navbar = () => {
  const { cart, setIsCartOpen, setIsSearchOpen, isDarkMode, toggleDarkMode } =
    useAppContext();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-2 sm:py-3" : "py-3 sm:py-5"}`}
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
          <div
            className={`flex justify-between items-center bg-white/90 backdrop-blur-xl rounded-full px-4 sm:px-8 transition-all duration-300 ${isScrolled ? "h-14 sm:h-16 shadow-lg shadow-[var(--color-accent-pink)]/10 border border-white" : "h-14 sm:h-16 shadow-sm border border-[var(--color-bg-secondary)]/50"}`}
          >
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0 group"
            >
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 bg-white text-[var(--color-text-primary)] rounded-lg sm:rounded-xl flex items-center justify-center font-serif text-xl sm:text-2xl font-black transform transition-all duration-500 group-hover:rotate-[8deg] group-hover:scale-105 shadow-md overflow-hidden border border-[var(--color-text-primary)]/10">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/80 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out backdrop-blur-[1px] z-10"></div>
                <span className="relative z-0 drop-shadow-sm">CB</span>
              </div>
              <span className="text-xl sm:text-2xl tracking-tight flex items-baseline relative drop-shadow-sm">
                <span className="bg-gradient-to-b from-[#2a1b16] to-[#6d4c41] bg-clip-text text-transparent font-serif font-black">
                  Canvas
                </span>
                <span className="text-[var(--color-accent-pink)] italic tracking-tighter ml-1 relative font-serif font-black">
                  Builds
                  <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[var(--color-accent-pink)] to-[var(--color-accent-purple)] rounded-full opacity-90 shadow-[0_2px_4px_rgba(236,72,153,0.3)]"></span>
                </span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {[
                { name: "Home", path: "/" },
                { name: "Templates", path: "/store" },
                { name: "Reviews", path: "/reviews" },
                { name: "FAQ", path: "/faq" },
                { name: "About Us", path: "/about" },
              ].map((item, i) => (
                <Link
                  key={i}
                  to={item.path}
                  className={`text-sm font-medium transition-colors relative group py-2 ${pathname === item.path ? "text-[var(--color-accent-pink)] font-bold" : "text-[var(--color-text-primary)]/70 hover:text-[var(--color-accent-pink)]"}`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[var(--color-accent-pink)] transition-all duration-300 group-hover:w-full rounded-full ${pathname === item.path ? "w-full" : ""}`}
                  ></span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1 sm:gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hover:bg-[var(--color-bg-primary)] p-2 sm:p-2.5 rounded-full transition-colors text-[var(--color-text-primary)]/80 hover:text-[var(--color-accent-pink)]"
              >
                <Search className="w-5 h-5" />
              </button>
              <button className="hidden sm:flex hover:bg-[var(--color-bg-primary)] p-2 sm:p-2.5 rounded-full transition-colors text-[var(--color-text-primary)]/80 hover:text-[var(--color-accent-pink)]">
                <User className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative hover:bg-[var(--color-bg-primary)] p-2 sm:p-2.5 rounded-full transition-colors group text-[var(--color-text-primary)]/80 hover:text-[var(--color-accent-pink)]"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cart.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-[var(--color-accent-purple)] text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm border border-white">
                    {cart.length}
                  </span>
                )}
              </button>
              <button
                className="lg:hidden p-2 text-[var(--color-text-primary)]/80 hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-accent-pink)] rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[var(--color-text-primary)]/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-[var(--color-bg-primary)] shadow-2xl flex flex-col rounded-l-[2rem] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-5 flex justify-between items-center border-b border-[var(--color-bg-secondary)]/50 bg-white/50 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[var(--color-accent-pink)] text-white rounded-lg flex items-center justify-center font-serif text-xl font-bold">
                    A
                  </div>
                  <span className="font-bold text-xl tracking-tight text-[var(--color-text-primary)] font-serif">
                    Menu
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-white hover:bg-[var(--color-bg-secondary)] rounded-full transition-colors text-[var(--color-text-primary)] shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-3">
                <div
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-3.5 rounded-2xl mb-2 border border-white cursor-pointer hover:bg-white transition-colors"
                >
                  <Search className="w-5 h-5 text-[var(--color-text-primary)]/50" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    readOnly
                    className="bg-transparent border-none outline-none w-full text-[var(--color-text-primary)] text-[15px] cursor-pointer pointer-events-none"
                  />
                </div>
                {[
                  { name: "Home", path: "/" },
                  { name: "Templates", path: "/store" },
                  { name: "Reviews", path: "/reviews" },
                  { name: "FAQ", path: "/faq" },
                  { name: "About Us", path: "/about" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between text-[15px] font-bold p-4 rounded-2xl transition-colors ${pathname === item.path ? "bg-white text-[var(--color-accent-pink)] shadow-sm" : "text-[var(--color-text-primary)]/80 hover:bg-white/50"}`}
                    >
                      {item.name}
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative overflow-hidden min-h-[90vh] sm:min-h-[85vh] flex items-center justify-center w-full pt-10 sm:pt-0">
      
      {/* Rich Background Textures */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft atmospheric gradient splashes */}
        <div className="absolute top-[10%] left-[20%] w-[35rem] h-[35rem] bg-blue-500/[0.08] rounded-full blur-[130px]"></div>
        <div className="absolute bottom-[20%] right-[15%] w-[35rem] h-[35rem] bg-indigo-500/[0.06] rounded-full blur-[130px]"></div>
        
        {/* Crisp Dot Matrix Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.55]" 
          style={{ 
            backgroundImage: 'radial-gradient(#475569 1.5px, transparent 1.5px)', 
            backgroundSize: '28px 28px' 
          }}
        ></div>
        
        {/* Soft vignette/fade gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white"></div>
      </div>

      <motion.div
        style={{ y, opacity }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-28 sm:pt-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center gap-6 sm:gap-8"
        >
          <h1 className="text-4xl leading-[1.2] sm:text-6xl lg:text-[5.5rem] sm:leading-[1.1] font-serif text-[var(--color-text-primary)] tracking-tight">
            Share Your Love <br />
            <span className="italic text-[var(--color-accent-pink)]">
              Through Code
            </span>
          </h1>
          <p className="text-[var(--color-text-primary)]/70 text-base sm:text-lg leading-relaxed max-w-2xl font-light px-2 sm:px-0">
            Crafting elegant, digital experiences to celebrate your most
            cherished moments. No coding required. Just pure, aesthetic
            expressions of love.
          </p>
          <Link
            to="/store"
            className="mt-4 bg-[var(--color-text-primary)] text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center w-full sm:w-auto gap-3 hover:bg-[var(--color-accent-pink)] hover:shadow-lg hover:-translate-y-0.5"
          >
            Explore Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

const ContextAwareModalAddToCart = ({
  product,
}: {
  product: (typeof PRODUCTS)[0];
}) => {
  const { addToCart, addToast } = useAppContext();
  return (
    <div className="flex flex-1 gap-3 min-w-[240px]">
      <MagneticButton
        onClick={() => addToCart(product)}
        className="flex-1 h-[48px] md:h-[56px] bg-[var(--color-text-primary)] hover:bg-[var(--color-accent-purple)] text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-[var(--color-text-primary)]/20 hover:-translate-y-1 flex items-center justify-center gap-2"
      >
        <ShoppingCart className="w-5 h-5" /> Add to Cart
      </MagneticButton>
      <button
        onClick={() => addToast("Added to favorites!", "info")}
        className="w-[48px] h-[48px] md:w-[56px] md:h-[56px] bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-accent-pink)] rounded-xl flex items-center justify-center transition-colors shrink-0"
      >
        <Heart className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </div>
  );
};

const ProductModal = ({
  product,
  onClose,
}: {
  product: (typeof PRODUCTS)[0];
  onClose: () => void;
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[var(--color-text-primary)]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        >
          <div
            className={`w-full md:w-1/2 bg-gradient-to-br ${product.gradient} p-8 flex flex-col items-center justify-center relative min-h-[300px] md:min-h-full overflow-hidden group`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 left-4 w-8 h-8 bg-white/50 hover:bg-white rounded-full flex items-center justify-center md:hidden transition-colors z-50"
            >
              <X className="w-4 h-4 text-[var(--color-text-primary)]" />
            </button>
            <div className="w-48 sm:w-56 h-[80%] max-h-[400px] bg-white/20 backdrop-blur-md rounded-[2rem] border-4 border-white/40 shadow-2xl relative overflow-hidden flex flex-col items-center p-4">
              <div className="w-12 h-3 bg-white/50 rounded-full mb-6 mt-2"></div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="text-[4rem] sm:text-[5rem] drop-shadow-2xl relative z-10 mb-4 flex justify-center items-center"
              >
                {product.emoji}
              </motion.div>
              <div className="w-full space-y-2 mt-auto">
                <div className="w-[80%] h-2 bg-white/40 rounded-full mx-auto"></div>
                <div className="w-[60%] h-2 bg-white/40 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-black tracking-widest uppercase text-[var(--color-accent-purple)]/80 mb-2">
                  {product.category}
                </p>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-text-primary)]">
                  {product.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="hidden md:flex w-8 h-8 bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] rounded-full items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-[var(--color-text-primary)]" />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm font-bold text-[var(--color-text-primary)]">
                {product.rating} (120+ Reviews)
              </span>
            </div>
            <div className="flex items-end gap-3 mb-8">
              <span className="text-3xl font-bold text-[var(--color-text-primary)] leading-none">
                {product.price}
              </span>
              <span className="text-lg font-bold text-[var(--color-text-primary)]/40 line-through mb-1">
                {product.originalPrice}
              </span>
              <span className="bg-[var(--color-accent-pink)]/20 text-[var(--color-accent-pink)] text-xs font-bold px-2 py-1 rounded-md mb-1 ml-2">
                Save 35%
              </span>
            </div>
            <div className="space-y-4 mb-8 flex-1">
              <h4 className="font-bold text-[var(--color-text-primary)]">
                What's Included:
              </h4>
              <ul className="space-y-3">
                {[
                  "Fully responsive source code",
                  "Customizable colors & text",
                  "Easy setup guide (PDF)",
                  "Free hosting instructions",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm text-[var(--color-text-primary)]/70 font-medium"
                  >
                    <div className="w-5 h-5 rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[var(--color-accent-pink)]" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap w-full gap-3 mt-auto pt-4 border-t border-[var(--color-bg-secondary)]/50">
              <ContextAwareModalAddToCart product={product} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ProductCard = ({
  product,
  onClick,
}: {
  product: (typeof PRODUCTS)[0];
  onClick: () => void;
}) => {
  return (
    <motion.div
      variants={fadeUp}
      onClick={onClick}
      className="group cursor-pointer flex flex-col w-full bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1 border border-black/[0.04]"
    >
      <div
        className={`relative w-full aspect-[16/9] bg-gradient-to-br ${product.gradient} flex items-center justify-center overflow-hidden shrink-0`}
      >
        <div className="text-[2.5rem] sm:text-[5.5rem] drop-shadow-xl transform group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 relative z-0 flex justify-center items-center">
          {product.emoji}
        </div>
        {product.tag && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white text-[var(--color-text-primary)] text-[8px] sm:text-[10px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full z-20 shadow-sm border border-black/5 uppercase tracking-wider">
            {product.tag}
          </div>
        )}
      </div>
      <div className="p-2 sm:p-6 flex-1 flex flex-col bg-white z-20 relative">
        <p className="text-[8px] sm:text-xs font-bold tracking-widest uppercase text-[var(--color-text-primary)]/50 mb-0.5 sm:mb-1.5">
          {product.category}
        </p>
        <h3 className="font-serif font-bold text-[var(--color-text-primary)] mb-1 sm:mb-2 text-sm sm:text-xl leading-tight group-hover:text-[var(--color-accent-pink)] transition-colors line-clamp-1">
          {product.title}
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 mt-auto pt-1 sm:pt-2">
          <span className="font-bold text-[var(--color-text-primary)] text-sm sm:text-2xl leading-none">
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-[10px] sm:text-sm font-bold text-[var(--color-text-primary)]/40 line-through">
              {product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const PopularProducts = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof PRODUCTS)[0] | null
  >(null);
  const [showAll, setShowAll] = useState(false);
  const filteredProducts =
    activeCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);
  const displayedProducts = showAll
    ? filteredProducts
    : filteredProducts.slice(0, 6);

  return (
    <div
      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 relative"
      id="templates"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-10 gap-4 sticky top-14 sm:top-16 z-30 bg-[var(--color-bg-primary)]/90 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <span className="w-5 sm:w-8 h-px bg-[var(--color-accent-pink)]"></span>
            <span className="text-[var(--color-accent-pink)] font-bold text-[9px] sm:text-xs tracking-widest uppercase">
              Templates
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[var(--color-text-primary)]">
            Find the Perfect Gift
          </h2>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar w-full md:w-auto gap-2 pb-2 md:pb-0 snap-x">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setShowAll(false);
              }}
              className={`snap-start px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${activeCategory === cat ? "bg-[var(--color-text-primary)] text-white shadow-lg shadow-[var(--color-text-primary)]/20 scale-105" : "bg-white/80 text-[var(--color-text-primary)]/60 hover:bg-white hover:text-[var(--color-text-primary)] border border-[var(--color-bg-secondary)]/50"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <motion.div
        layout
        className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 min-h-[400px]"
      >
        <AnimatePresence mode="popLayout">
          {displayedProducts.map((p) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.3, type: "spring" }}
              key={p.id}
            >
              <ProductCard product={p} onClick={() => setSelectedProduct(p)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {filteredProducts.length > 6 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3 bg-white text-[var(--color-text-primary)] font-bold rounded-full shadow-sm hover:shadow-md transition-all border border-[var(--color-bg-secondary)]/50 flex items-center gap-2"
          >
            {showAll ? "Show Less" : "View More"}
            <ArrowRight
              className={`w-4 h-4 transition-transform ${showAll ? "-rotate-90" : "rotate-90"}`}
            />
          </button>
        </div>
      )}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

const Testimonials = () => (
  <div
    id="reviews"
    className="py-16 sm:py-16 bg-white/40 border-y border-[var(--color-bg-secondary)]/50 overflow-hidden relative"
  >
    <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-[var(--color-bg-primary)] to-transparent z-10 pointer-events-none"></div>
    <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[var(--color-bg-primary)] to-transparent z-10 pointer-events-none"></div>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center mb-10 sm:mb-14 px-4"
    >
      <h2 className="text-3xl sm:text-4xl font-serif text-[var(--color-text-primary)] mb-4">
        Loved by Thousands
      </h2>
      <p className="text-[var(--color-text-primary)]/60 font-medium">
        Hear what our happy customers have to say about their special gifts.
      </p>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="flex whitespace-nowrap"
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        className="flex gap-6 sm:gap-8 px-4"
      >
        {[...INITIAL_TESTIMONIALS, ...INITIAL_TESTIMONIALS].map((test, i) => (
          <div
            key={i}
            className="w-[300px] sm:w-[400px] bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[var(--color-bg-secondary)]/50 shrink-0 flex flex-col whitespace-normal"
          >
            <div className="flex text-amber-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-[var(--color-text-primary)]/80 font-medium leading-relaxed mb-6 flex-1 italic relative">
              <Quote className="w-8 h-8 text-[var(--color-bg-secondary)]/40 absolute -top-2 -left-2 -z-10" />
              "{test.text}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent-pink)] to-[var(--color-accent-purple)] flex items-center justify-center text-white font-bold">
                {test.name.charAt(0)}
              </div>
              <div>
                <h5 className="font-bold text-[var(--color-text-primary)] text-sm">
                  {test.name}
                </h5>
                <p className="text-xs text-[var(--color-accent-purple)] font-medium">
                  {test.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  </div>
);

const PromoBanners = () => (
  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
      
      {/* Custom Template Request Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 50 }}
        className="bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-primary)] rounded-[2rem] sm:rounded-2xl p-6 sm:p-12 flex flex-col justify-center relative overflow-hidden group min-h-[260px] sm:min-h-[380px] shadow-lg shadow-[var(--color-bg-secondary)]/30 border border-white"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'30\' height=\'30\' viewBox=\'0 0 30 30\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M15 15c-1.5 0-3-1.5-3-3s1.5-3 3-3 3 1.5 3 3-1.5 3-3 3zm0-8c-2.5 0-5 2.5-5 5s2.5 5 5 5 5-2.5 5-5-2.5-5-5-5z\' fill=\'%23ffffff\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')] opacity-30"></div>
        <div className="relative z-10 w-2/3 sm:w-2/3">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full border border-white mb-3 sm:mb-5">
            <span className="text-[8px] sm:text-[10px] font-black tracking-widest text-[var(--color-accent-purple)] uppercase">
              Request
            </span>
          </div>
          <h3 className="text-2xl sm:text-4xl md:text-5xl font-serif text-[var(--color-text-primary)] mb-1 sm:mb-4 leading-tight">
            Custom
            <br />
            Template
          </h3>
          <p className="text-[var(--color-accent-pink)] font-serif text-[15px] sm:text-2xl mb-4 sm:mb-8 italic">
            Built From Your Ideas
          </p>
          <MagneticButton 
            onClick={() => window.open("https://wa.me/917906568743?text=Hi%20Adarsh,%20I%20would%20like%20to%20request%20a%20custom%20website%20template!", "_blank")}
            className="bg-[var(--color-text-primary)] text-white px-5 sm:px-8 py-2.5 sm:py-4 rounded-full text-[11px] sm:text-sm font-bold flex items-center gap-2 sm:gap-3 hover:bg-[var(--color-accent-purple)] transition-all duration-300 w-fit shadow-md cursor-pointer"
          >
            Request Now <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </MagneticButton>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 sm:w-64 sm:h-64 bg-white/50 rounded-full absolute top-1/2 -translate-y-1/2 -right-5 sm:-right-10 blur-xl sm:blur-2xl"></div>
          <img 
            src="/assets/custom.png" 
            alt="Custom Template Request" 
            className="absolute bottom-0 right-0 translate-x-[22%] sm:translate-x-[22%] h-[75%] sm:h-[85%] w-auto max-w-none object-contain object-bottom drop-shadow-2xl z-10"
          />
        </div>
      </motion.div>

      {/* Right Banner (Deploy It) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 50, delay: 0.1 }}
        className="bg-gradient-to-br from-[var(--color-accent-pink)]/30 to-[var(--color-accent-purple)]/10 rounded-[2rem] sm:rounded-2xl p-6 sm:p-12 flex flex-col justify-center relative overflow-hidden group min-h-[260px] sm:min-h-[380px] shadow-lg shadow-[var(--color-accent-pink)]/10 border border-white"
      >
        <div className="relative z-10 w-2/3 sm:w-2/3">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full border border-white mb-3 sm:mb-5">
            <span className="text-[8px] sm:text-[10px] font-black tracking-widest text-[var(--color-accent-purple)] uppercase">
              Done For You
            </span>
          </div>
          <h3 className="text-2xl sm:text-4xl md:text-5xl font-serif text-[var(--color-text-primary)] mb-2 sm:mb-6 leading-tight">
            Want us to
            <br />
            deploy it?
          </h3>
          <p className="text-[var(--color-text-primary)]/70 text-[10px] sm:text-sm mb-4 sm:mb-8 max-w-[150px] sm:max-w-[200px] font-medium leading-relaxed hidden sm:block">
            We can customize your template and host it for you. Get a
            ready-to-share link!
          </p>
          <MagneticButton className="bg-white text-[var(--color-text-primary)] px-5 sm:px-8 py-2.5 sm:py-4 rounded-full text-[11px] sm:text-sm font-bold flex items-center gap-2 sm:gap-3 hover:bg-[var(--color-text-primary)] hover:text-white transition-all duration-300 w-fit shadow-sm border border-[var(--color-bg-secondary)]/50 mt-2 sm:mt-0">
            Contact Us <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </MagneticButton>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 sm:w-64 sm:h-64 bg-white/60 rounded-full absolute top-1/2 -translate-y-1/2 -right-5 sm:-right-10 blur-xl sm:blur-2xl"></div>
          <img 
            src="/assets/admin.png" 
            alt="Support Admin" 
            className="absolute bottom-0 right-0 translate-x-[30%] sm:translate-x-[25%] h-[85%] sm:h-[95%] w-auto max-w-none object-contain object-bottom drop-shadow-2xl z-10"
          />
        </div>
      </motion.div>

    </div>
  </div>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div
      id="faq"
      className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-16 relative"
    >
      <div className="text-center mb-10 sm:mb-14">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="w-8 h-px bg-[var(--color-accent-pink)]"></span>
          <span className="text-[var(--color-accent-pink)] font-bold text-xs tracking-widest uppercase">
            Support
          </span>
          <span className="w-8 h-px bg-[var(--color-accent-pink)]"></span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-[var(--color-text-primary)] mb-4">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="space-y-4">
        {FAQS.map((faq, index) => (
          <div
            key={index}
            className="bg-white/60 backdrop-blur-md border border-white shadow-sm rounded-2xl overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
            >
              <span className="font-bold text-[var(--color-text-primary)] text-[15px] sm:text-lg pr-4">
                {faq.q}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openIndex === index ? "bg-[var(--color-text-primary)] text-white" : "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"}`}
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                />
              </div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 sm:p-6 pt-0 text-[var(--color-text-primary)]/70 font-medium text-sm sm:text-base leading-relaxed border-t border-[var(--color-bg-secondary)]/30 mt-2">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

const Footer = () => {
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
                Canvas
              </span>
              <span className="text-[var(--color-accent-pink)] italic tracking-tighter ml-1 font-serif font-black">
                Builds
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
              Get in Touch
            </h4>
            <a
              href="mailto:adrashyadav07o8@gmail.com"
              className="text-sm text-[var(--color-text-primary)]/70 hover:text-[var(--color-accent-pink)] transition-colors flex items-center justify-start gap-2"
            >
              Email Us
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
};

const services = [
  {
    id: "anniversary",
    title: "Celebrate Milestones",
    description: "Create unforgettable digital memories for your anniversaries. From timeline journeys to interactive memory books, make every year count.",
    icon: <Heart className="w-6 h-6 text-rose-500" />,
    color: "bg-rose-100",
    image: "/assets/anniversary.png", 
    badge1: "Interactive Timeline",
    badge2: "Memory Gallery",
    align: "right",
  },
  {
    id: "friendship",
    title: "Best Friends Forever",
    description: "Because standard cards are boring. Build a custom 'Squad Goals' gallery or a hilarious inside-joke compilation for your best friend.",
    icon: <Users className="w-6 h-6 text-purple-500" />,
    color: "bg-purple-100",
    image: "/assets/friend.png", 
    badge1: "Inside Jokes",
    badge2: "Photo Dump",
    align: "left",
  },
  {
    id: "special",
    title: "Apologies & Surprises",
    description: "Messed up? Say sorry with a cute, interactive page. Or just send a '100 Reasons Why I Love You' site to brighten their day randomly.",
    icon: <Sparkles className="w-6 h-6 text-amber-500" />,
    color: "bg-amber-100",
    image: "/assets/apology.png", 
    badge1: "Forgiveness Guaranteed*",
    badge2: "Cute Animations",
    align: "right",
  },
];

const ServicesShowcase = () => {
  return (
    <div className="py-16 bg-white/40 border-y border-[var(--color-bg-secondary)]/50 overflow-hidden w-full">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl sm:text-5xl font-serif text-[var(--color-text-primary)] mb-6 tracking-tight">
            Bring your favorite moments to life
          </h2>
          <p className="text-[var(--color-text-primary)]/70 text-lg sm:text-xl font-light">
            With Canvas Builds, you unlock beautiful, code-driven templates that spark joy and help you express exactly how you feel.
          </p>
        </div>

        {/* Alternating Sections */}
        <div className="space-y-32">
          {services.map((service) => {
            const isImagePath =
              typeof service.image === "string" &&
              (service.image.startsWith("/") ||
                service.image.startsWith("http") ||
                service.image.includes("."));

            return (
              <div 
                key={service.id}
                className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${
                  service.align === 'left' ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Image/Visual Side */}
                <motion.div 
                  initial={{ opacity: 0, x: service.align === 'right' ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                  className="w-full lg:w-1/2"
                >
                  <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-[var(--color-bg-primary)] rounded-2xl overflow-hidden flex items-center justify-center shadow-xl border border-[var(--color-bg-secondary)]/50 group">
                    {/* Subtle Background Elements */}
                    <div className={`absolute inset-0 ${service.color} opacity-10 blur-3xl rounded-full scale-150`}></div>
                    
                    {/* Main Image */}
                    {isImagePath ? (
                      <motion.img 
                        whileHover={{ scale: 1.05 }}
                        src={service.image} 
                        alt={service.title} 
                        className="relative z-10 w-full h-full object-cover object-[75%] transition-transform duration-500"
                      />
                    ) : (
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: [-5, 5, 0] }}
                        className="text-[8rem] sm:text-[12rem] relative z-10 drop-shadow-2xl transition-transform duration-500 leading-none select-none flex justify-center items-center"
                      >
                        {service.image}
                      </motion.div>
                    )}

                  </div>
                </motion.div>

                {/* Text Side */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left"
                >
                  <div className={`w-12 h-12 rounded-2xl ${service.color} flex items-center justify-center mb-6 shadow-sm border border-white`}>
                    {service.icon}
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-text-primary)] mb-6">
                    {service.title}
                  </h3>
                  <p className="text-[var(--color-text-primary)]/70 text-lg leading-relaxed mb-8 max-w-md">
                    {service.description}
                  </p>
                  <Link 
                    to="/store"
                    className="bg-[var(--color-text-primary)] hover:bg-[var(--color-accent-purple)] text-white font-bold py-3.5 px-8 rounded-full transition-all shadow-lg shadow-[var(--color-text-primary)]/10 flex items-center gap-2 group hover:-translate-y-1"
                  >
                    Explore Templates
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => (
  <div className="flex flex-col items-center w-full">
    <Hero />
    <ServicesShowcase />
  </div>
);

const StorePage = () => (
  <div className="pt-24 pb-10">
    <BundleSection />
    <PopularProducts />
    <PromoBanners />
  </div>
);

const ReviewsPage = () => {
  const [reviewsList, setReviewsList] = useState(INITIAL_TESTIMONIALS);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const { addToast } = useAppContext();

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      addToast("Please enter your name and review message.", "info");
      return;
    }

    const newReview = {
      name: name.trim(),
      role: role.trim() || "Verified Buyer",
      text: text.trim(),
    };

    setReviewsList([newReview, ...reviewsList]);
    setName("");
    setRole("");
    setText("");
    setRating(5);
    addToast("Thank you! Your review has been added.", "success");
  };

  return (
    <div className="pt-24 pb-16 min-h-[70vh]">
      <Testimonials />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
        <div className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-xl border border-[var(--color-bg-secondary)]/50">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-text-primary)] mb-2">
              Share Your Experience
            </h3>
            <p className="text-[var(--color-text-primary)]/70 text-sm">
              Bought a template or had a custom build? Let us know what you think!
            </p>
          </div>

          <form onSubmit={handleAddReview} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Adarsh Yadav"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--color-bg-primary)]/50 border border-[var(--color-bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-pink)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-1.5">
                  What did you buy? / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bought for Anniversary"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[var(--color-bg-primary)]/50 border border-[var(--color-bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-pink)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-1.5">
                Rating
              </label>
              <div className="flex gap-2 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-6 h-6 cursor-pointer transition-transform hover:scale-110 ${
                      star <= rating ? "fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-1.5">
                Your Review
              </label>
              <textarea
                rows={4}
                placeholder="Write your experience here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-[var(--color-bg-primary)]/50 border border-[var(--color-bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-pink)] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--color-text-primary)] hover:bg-[var(--color-accent-purple)] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[var(--color-text-primary)]/10"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const FAQPage = () => (
  <div className="pt-24 min-h-[70vh]">
    <FAQSection />
  </div>
);

const AboutPage = () => (
  <div className="pt-32 pb-24 min-h-[85vh] flex flex-col items-center">
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
      
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[var(--color-text-primary)] mb-4 tracking-tight leading-tight">
          Get to Know the Creator
        </h1>
        <p className="text-[var(--color-text-primary)]/70 text-base sm:text-lg font-light leading-relaxed">
          Welcome! I build high-performance, beautiful websites and custom digital experiences.
        </p>
      </div>

      {/* Unified Portfolio Card */}
      <div className="bg-gradient-to-br from-white via-white to-[var(--color-accent-pink)]/20 rounded-[2.5rem] p-6 sm:p-12 shadow-2xl border border-white relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[var(--color-accent-pink)]/15 to-[var(--color-accent-purple)]/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Left Side: Bio Content & Direct Contact Options (Span 7 cols) */}
        <div className="lg:col-span-7 relative z-10 flex flex-col justify-center lg:pr-8">
          <div className="inline-flex items-center gap-2 bg-[var(--color-bg-primary)] px-3.5 py-1 rounded-full text-[var(--color-accent-purple)] font-bold text-xs uppercase tracking-wider mb-4 border border-[var(--color-bg-secondary)] w-fit">
            <Code className="w-3.5 h-3.5" /> Student & Freelancer
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-text-primary)] mb-4">
            Hi, I'm Adarsh
          </h2>
          <p className="text-[var(--color-text-primary)]/80 text-sm sm:text-base leading-relaxed font-medium mb-6">
            I am a dedicated software developer focused on crafting clean code, smooth animations, and user-centric web applications. Through Canvas Builds, I bridge the gap between technical architecture and elegant design, delivering production-ready digital solutions.
          </p>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--color-bg-secondary)]/60 mb-6">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-[var(--color-bg-secondary)] flex items-center gap-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-[var(--color-accent-pink)]" />
              <span className="text-xs font-bold text-[var(--color-text-primary)]">React, Tailwind & TypeScript</span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-[var(--color-bg-secondary)] flex items-center gap-2 shadow-sm">
              <Terminal className="w-4 h-4 text-[var(--color-accent-purple)]" />
              <span className="text-xs font-bold text-[var(--color-text-primary)]">Logic & Performance</span>
            </div>
          </div>

          {/* Integrated Direct Contact Links */}
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:adrashyadav07o8@gmail.com"
              className="bg-white hover:bg-[var(--color-bg-primary)] border border-[var(--color-bg-secondary)] shadow-sm px-4 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 w-full sm:w-auto"
            >
              <span className="w-9 h-9 bg-rose-100 text-[var(--color-accent-pink)] rounded-xl flex items-center justify-center text-sm shrink-0 shadow-inner">
                 <Mail className="w-5 h-5" />
              </span>
              <div className="text-left">
                <div className="font-bold text-[var(--color-text-primary)] text-xs">Email Me</div>
                <div className="text-[11px] text-[var(--color-text-primary)]/60">adrashyadav07o8@gmail.com</div>
              </div>
            </a>

            <a
              href="https://wa.me/917906568743"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-[var(--color-bg-primary)] border border-[var(--color-bg-secondary)] shadow-sm px-4 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 w-full sm:w-auto"
            >
              <div className="w-9 h-9 bg-purple-100 text-[var(--color-accent-purple)] rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-[var(--color-text-primary)] text-xs">WhatsApp</div>
                <div className="text-[11px] text-[var(--color-text-primary)]/60">+91 79065 68743</div>
              </div>
            </a>
          </div>
        </div>

        {/* Right Side: Fixed Absolute Character Display for all screen sizes */}
        <div className="lg:col-span-5 relative flex items-end justify-center min-h-[320px] sm:min-h-[380px] lg:min-h-[440px] mt-8 lg:mt-0">
          <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white/60 rounded-full absolute top-1/2 -translate-y-1/2 right-4 blur-2xl pointer-events-none"></div>
          
          <img 
            src="/assets/dev.png" 
            alt="Adarsh Representation" 
            className="absolute bottom-[-1rem] lg:bottom-[-3rem] right-[-9rem] lg:right-[-12rem] h-[340px] sm:h-[400px] lg:h-[115%] w-auto max-w-none object-contain object-bottom drop-shadow-2xl z-10 pointer-events-none"
          />

          <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white text-[10px] font-bold text-[var(--color-text-primary)]/70 uppercase tracking-widest z-20 shadow-sm">
            The Developer
          </div>
        </div>

      </div>

    </div>
  </div>
);

const ScrollHandler = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

export default function App() {
  const { isSearchOpen } = useAppContext();
  return (
    <Router>
      <ScrollHandler />
      <div className="min-h-screen bg-[var(--color-bg-primary)] font-sans selection:bg-[var(--color-bg-secondary)] selection:text-[var(--color-text-primary)] overflow-x-hidden text-[var(--color-text-primary)]">
        <Navbar />
        <ToastContainer />
        <CartDrawer />
        <AnimatePresence>
          {isSearchOpen && <SearchModal products={PRODUCTS} />}
        </AnimatePresence>
        <LegalModal />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <FloatingChat />
        <Footer />
      </div>
    </Router>
  );
}