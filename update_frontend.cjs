const fs = require('fs');

const code = `import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  Search, User, ShoppingCart, Heart, Star, Truck, ShieldCheck, 
  RefreshCw, Headphones, ArrowRight, Mail, CheckCircle, CreditCard, 
  Menu, X, Play, Sparkles, Gift, Download, ChevronRight, Quote, 
  ChevronDown, MessageCircle, Check
} from 'lucide-react';

const CATEGORIES = ['All', 'Love', 'Friendship', 'Anniversary', 'Apology'];

const PRODUCTS = [
  { id: 1, category: 'Love', title: 'Girlfriend Day Special', price: '₹2,499', originalPrice: '₹3,999', rating: '4.9', emoji: '💝', gradient: 'from-pink-200 to-rose-100', tag: 'Bestseller' },
  { id: 2, category: 'Friendship', title: 'Bestie Birthday Surprise', price: '₹1,499', originalPrice: '₹2,499', rating: '4.8', emoji: '👯‍♀️', gradient: 'from-[#ffdec7] to-[#ffeddb]' },
  { id: 3, category: 'Anniversary', title: 'Our Journey Timeline', price: '₹3,499', originalPrice: '₹4,999', rating: '5.0', emoji: '👩‍❤️‍👨', gradient: 'from-[#8b597b]/20 to-[#8b597b]/40', tag: 'Premium' },
  { id: 4, category: 'Apology', title: 'Cute "I am Sorry" Page', price: '₹999', originalPrice: '₹1,999', rating: '4.7', emoji: '🥺', gradient: 'from-orange-100 to-amber-50' },
  { id: 5, category: 'Love', title: '100 Reasons Why I Love You', price: '₹1,999', originalPrice: '₹2,999', rating: '4.9', emoji: '💌', gradient: 'from-rose-100 to-pink-50' },
  { id: 6, category: 'Friendship', title: 'Squad Goals Gallery', price: '₹2,299', originalPrice: '₹3,499', rating: '4.8', emoji: '📸', gradient: 'from-purple-100 to-fuchsia-50' },
  { id: 7, category: 'Anniversary', title: 'Digital Memory Book', price: '₹2,999', originalPrice: '₹4,499', rating: '5.0', emoji: '📖', gradient: 'from-amber-100 to-orange-50', tag: 'Trending' },
  { id: 8, category: 'Love', title: 'Long Distance Countdown', price: '₹1,299', originalPrice: '₹1,999', rating: '4.6', emoji: '✈️', gradient: 'from-blue-100 to-cyan-50' },
];

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'Bought for Anniversary', text: 'This saved my anniversary! I have zero coding experience but the guide was so easy to follow. My boyfriend loved it! ❤️' },
  { name: 'Rahul K.', role: 'Bought for Apology', text: 'She was so mad at me, but this cute apology template actually made her smile. Worth every penny.' },
  { name: 'Ananya M.', role: 'Bought for Bestie', text: 'My best friend literally cried when she opened the link. Such a unique and thoughtful gift idea! ✨' },
  { name: 'Vikram D.', role: 'Bought for Girlfriend', text: 'The animations are so smooth and it looks amazing on mobile. Hosted it for free on Vercel in 5 mins.' },
  { name: 'Neha R.', role: 'Bought for Anniversary', text: 'Beautifully crafted code. As a dev myself, I appreciate the clean React structure and Tailwind styling.' }
];

const FAQS = [
  { q: "Do I need coding experience to use these?", a: "Not at all! We provide a step-by-step PDF guide with every purchase. You just need to change the text and images to your own, and we show you exactly how to do it." },
  { q: "Is this a one-time payment or a subscription?", a: "It's a one-time payment! You pay once and get lifetime access to the source code, plus any future updates to that specific template." },
  { q: "How do I host the website?", a: "We include detailed instructions on how to host your website for completely FREE using platforms like Vercel, Netlify, or GitHub Pages. It takes less than 5 minutes." },
  { q: "Can I get a refund if I don't like it?", a: "Due to the digital nature of the product (source code), we generally do not offer refunds once the files are downloaded. However, our support team is always here to help if you face any technical issues!" }
];

const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } } };

const FloatingElement = ({ children, delay = 0, yOffset = 20, duration = 3 }: { children: React.ReactNode, delay?: number, yOffset?: number, duration?: number }) => (
  <motion.div animate={{ y: [0, -yOffset, 0] }} transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}>
    {children}
  </motion.div>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={\`fixed top-0 left-0 right-0 z-50 transition-all duration-300 \${isScrolled ? 'py-2 sm:py-3' : 'py-3 sm:py-5'}\`}
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className={\`flex justify-between items-center bg-white/90 backdrop-blur-xl rounded-full px-4 sm:px-8 transition-all duration-300 \${isScrolled ? 'h-14 sm:h-16 shadow-lg shadow-[#efa3a0]/10 border border-white' : 'h-14 sm:h-16 shadow-sm border border-[#ffdec7]/50'}\`}>
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#efa3a0] text-white rounded-lg sm:rounded-xl flex items-center justify-center font-serif text-lg sm:text-2xl font-bold transform transition-all duration-300 group-hover:rotate-[15deg] group-hover:scale-110 shadow-md">A</div>
              <span className="font-bold text-lg sm:text-xl tracking-tight text-[#493129] font-serif">Canvas Builds.</span>
            </div>
            <div className="hidden lg:flex items-center gap-8">
              {['Home', 'Templates', 'Reviews', 'FAQ', 'Contact'].map((item, i) => (
                <a key={i} href="#" className={\`text-sm font-medium transition-colors relative group py-2 \${i === 0 ? 'text-[#efa3a0] font-bold' : 'text-[#493129]/70 hover:text-[#efa3a0]'}\`}>
                  {item}
                  <span className={\`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#efa3a0] transition-all duration-300 group-hover:w-full rounded-full \${i === 0 ? 'w-full' : ''}\`}></span>
                </a>
              ))}
            </div>
            <div className="flex items-center gap-1 sm:gap-3">
                <div className="hidden xl:flex items-center relative group">
                    <input type="text" placeholder="Search templates..." className="pl-4 pr-10 py-2 bg-[#ffeddb]/50 rounded-full text-sm focus:outline-none focus:bg-white text-[#493129] w-48 focus:w-64 placeholder-[#493129]/40 border border-transparent focus:border-[#ffdec7] transition-all duration-300" />
                    <Search className="w-4 h-4 text-[#493129]/60 absolute right-3 group-hover:text-[#efa3a0] transition-colors" />
                </div>
                <button className="hidden sm:flex hover:bg-[#ffeddb] p-2 sm:p-2.5 rounded-full transition-colors text-[#493129]/80 hover:text-[#efa3a0]">
                  <User className="w-5 h-5" />
                </button>
                <button className="relative hover:bg-[#ffeddb] p-2 sm:p-2.5 rounded-full transition-colors group text-[#493129]/80 hover:text-[#efa3a0]">
                    <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-[#8b597b] text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center transform scale-100 shadow-sm border border-white">3</span>
                </button>
                <button className="lg:hidden p-2 text-[#493129]/80 hover:bg-[#ffeddb] hover:text-[#efa3a0] rounded-full transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu className="w-6 h-6" />
                </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-[#493129]/40 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-[#ffeddb] shadow-2xl flex flex-col rounded-l-[2rem] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-4 sm:p-5 flex justify-between items-center border-b border-[#ffdec7]/50 bg-white/50 backdrop-blur-md">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-[#efa3a0] text-white rounded-lg flex items-center justify-center font-serif text-xl font-bold">A</div>
                   <span className="font-bold text-xl tracking-tight text-[#493129] font-serif">Menu</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white hover:bg-[#ffdec7] rounded-full transition-colors text-[#493129] shadow-sm"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-3">
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-3.5 rounded-2xl mb-2 border border-white">
                  <Search className="w-5 h-5 text-[#493129]/50" />
                  <input type="text" placeholder="Search templates..." className="bg-transparent border-none outline-none w-full text-[#493129] text-[15px]" />
                </div>
                {['Home', 'Templates', 'Reviews', 'FAQ', 'Contact'].map((item, i) => (
                  <motion.a initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} key={i} href="#" className={\`flex items-center justify-between text-[15px] font-bold p-4 rounded-2xl transition-colors \${i === 0 ? 'bg-white text-[#efa3a0] shadow-sm' : 'text-[#493129]/80 hover:bg-white/50'}\`}>
                    {item}
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </motion.a>
                ))}
                <div className="mt-auto pt-6">
                  <button className="w-full flex items-center justify-center gap-2 p-4 bg-[#493129] text-white font-bold hover:bg-[#8b597b] rounded-2xl transition-colors shadow-lg shadow-[#493129]/20">
                    <User className="w-5 h-5" /> Sign In / Account
                  </button>
                </div>
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
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <div className="relative overflow-hidden">
      <motion.div style={{ y: y1 }} className="absolute top-20 left-4 sm:left-10 text-[#efa3a0]/20 text-4xl sm:text-6xl blur-[2px] transform -rotate-12 pointer-events-none">💝</motion.div>
      <motion.div style={{ y: y2 }} className="absolute bottom-10 right-4 sm:right-20 text-[#8b597b]/10 text-6xl sm:text-8xl blur-[2px] transform rotate-12 pointer-events-none">✨</motion.div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 sm:pt-36 sm:pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex-1 space-y-5 sm:space-y-6 w-full text-center lg:text-left z-10 pt-4">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/60 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-white shadow-sm mt-4 sm:mt-0">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#efa3a0]" />
              <span className="text-[#8b597b] font-bold text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest">New Heartfelt Templates</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl lg:text-[5rem] font-serif text-[#493129] leading-[1.15] sm:leading-[1.1] tracking-tight px-2 sm:px-0">
              Share Your Love <br className="hidden sm:block"/> 
              <span className="relative inline-block mt-1 sm:mt-0">
                <span className="relative z-10">Through Code</span>
                <span className="absolute bottom-1 sm:bottom-3 left-0 w-full h-2 sm:h-5 bg-[#ffdec7] -z-10 rounded-full opacity-60 transform -rotate-1"></span>
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-[#493129]/70 text-sm sm:text-xl max-w-[280px] sm:max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              Cute, aesthetic, and emotional website templates designed to make your special moments unforgettable.
            </motion.p>
            
            <motion.div variants={fadeUp} className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center lg:justify-start">
                <button className="bg-[#493129] hover:bg-[#8b597b] text-white px-8 py-3.5 sm:py-5 rounded-full font-bold transition-all duration-300 flex items-center gap-2 sm:gap-3 hover:shadow-xl hover:shadow-[#8b597b]/30 hover:-translate-y-1 w-full sm:w-auto justify-center text-[15px] sm:text-lg relative overflow-hidden group">
                  <span className="relative z-10 flex items-center gap-2">Browse Templates <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" /></span>
                </button>
                <div className="flex items-center justify-center gap-3 bg-white/60 backdrop-blur-md px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white shadow-sm w-full sm:w-auto">
                    <div className="flex -space-x-2">
                        <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gradient-to-br from-[#efa3a0] to-rose-300 flex items-center justify-center text-white text-[10px] sm:text-xs shadow-md z-30">💖</div>
                        <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gradient-to-br from-[#8b597b] to-purple-400 flex items-center justify-center text-white text-[10px] sm:text-xs shadow-md z-20">🥰</div>
                        <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gradient-to-br from-[#ffdec7] to-orange-200 flex items-center justify-center text-[#493129] text-[10px] sm:text-xs shadow-md z-10">🥺</div>
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-[11px] sm:text-sm font-bold text-[#493129]">10K+ Happy Couples</span>
                        <div className="flex text-[#efa3a0] gap-0.5 mt-0.5">
                            {[...Array(5)].map((_,i) => <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />)}
                        </div>
                    </div>
                </div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", duration: 1.5 }} className="flex-1 relative w-full max-w-sm sm:max-w-md mx-auto aspect-[4/3] mt-6 sm:mt-6">
              <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-tr from-[#ffdec7]/50 to-[#efa3a0]/30 rounded-[2rem] sm:rounded-[2.5rem] transform -rotate-3 blur-lg sm:blur-xl animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white backdrop-blur-xl flex items-center justify-center group cursor-pointer">
                <div className="absolute top-0 left-0 right-0 h-8 sm:h-10 bg-white/60 backdrop-blur-md flex items-center px-3 sm:px-4 gap-1.5 sm:gap-2 border-b border-black/5 z-20">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-400"></div>
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="mx-auto bg-black/5 h-3 sm:h-4 rounded-full w-1/3 max-w-[120px] sm:max-w-[150px]"></div>
                </div>
                <div className="absolute inset-0 top-8 sm:top-10 bg-cover bg-center opacity-40 transition-opacity duration-700 group-hover:opacity-60" style={{ backgroundImage: \`url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23493129' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")\` }}>
                   <div className="w-full h-full bg-gradient-to-br from-[#efa3a0]/30 to-[#8b597b]/30"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>
                <div className="relative z-20 w-14 h-14 sm:w-20 sm:h-20 bg-white/95 backdrop-blur-xl rounded-full flex items-center justify-center text-[#efa3a0] shadow-xl border border-white group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 sm:w-8 sm:h-8 ml-1 sm:ml-1.5 fill-current" />
                </div>
                <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 flex items-center justify-between text-white z-20">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
                          <Play className="w-2.5 h-2.5 sm:w-4 sm:h-4 fill-white ml-0.5" />
                      </div>
                      <div>
                        <span className="text-[11px] sm:text-sm font-bold block drop-shadow-md text-[#ffeddb] truncate max-w-[120px] sm:max-w-none">Girlfriend Template</span>
                        <span className="text-[9px] sm:text-xs font-medium text-white/80 hidden sm:block">Preview Video</span>
                      </div>
                    </div>
                    <div className="text-[9px] sm:text-xs font-bold bg-black/40 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-md border border-white/20">01:24</div>
                </div>
              </div>
              <div className="absolute -top-3 sm:-top-4 right-1 sm:right-4 z-30 bg-[#efa3a0] text-white p-2.5 sm:p-4 rounded-3xl w-20 h-20 sm:w-28 sm:h-28 flex flex-col items-center justify-center shadow-xl border-[3px] sm:border-4 border-white transform rotate-6 animate-bounce" style={{animationDuration: '3s'}}>
                  <span className="text-[8px] sm:text-[11px] font-bold uppercase tracking-wider text-white/90">Love</span>
                  <span className="text-xl sm:text-3xl font-black leading-none my-0.5 sm:my-1 tracking-tighter">100%</span>
                  <div className="flex gap-0.5 sm:gap-1 mt-0.5">
                    {[...Array(3)].map((_,i) => <Heart key={i} className="w-2 h-2 sm:w-3 sm:h-3 fill-white" />)}
                  </div>
              </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const TrustBadges = () => (
  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="bg-white/60 backdrop-blur-lg border border-white shadow-xl shadow-[#ffdec7]/30 rounded-[1.5rem] sm:rounded-[2.5rem] py-4 px-2 sm:p-8">
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffdec7] to-transparent -translate-y-1/2"></div>
        <div className="flex overflow-x-auto hide-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 px-2 sm:px-0 snap-x snap-mandatory">
            {[
                { icon: Download, title: "Instant Access", desc: "Download immediately" },
                { icon: ShieldCheck, title: "Secure Pay", desc: "100% secure checkout" },
                { icon: RefreshCw, title: "Customization", desc: "Well documented" },
                { icon: Headphones, title: "Dev Support", desc: "Help when you need it" }
            ].map((badge, idx) => (
                <motion.div variants={fadeUp} key={idx} className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/50 hover:bg-white/90 sm:bg-transparent sm:hover:bg-white/80 transition-all duration-300 z-10 w-[45vw] sm:w-auto shrink-0 snap-center border border-white/50 sm:border-transparent">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-[10px] sm:rounded-2xl bg-gradient-to-br from-[#ffeddb] to-[#ffdec7]/50 flex items-center justify-center shrink-0 border border-white shadow-sm">
                      <badge.icon className="w-5 h-5 sm:w-7 sm:h-7 text-[#8b597b]" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h4 className="font-bold text-[#493129] text-[11px] sm:text-base mb-0.5 sm:mb-1">{badge.title}</h4>
                        <p className="text-[9px] sm:text-sm text-[#493129]/60 font-medium hidden sm:block">{badge.desc}</p>
                    </div>
                </motion.div>
            ))}
        </div>
      </motion.div>
  </div>
);

const ProductModal = ({ product, onClose }: { product: typeof PRODUCTS[0], onClose: () => void }) => {
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#493129]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} onClick={e => e.stopPropagation()} className="bg-white w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
          {/* Visual Side */}
          <div className={\`w-full md:w-1/2 bg-gradient-to-br \${product.gradient} p-8 flex flex-col items-center justify-center relative min-h-[250px] md:min-h-full\`}>
             <button onClick={onClose} className="absolute top-4 left-4 w-8 h-8 bg-white/50 hover:bg-white rounded-full flex items-center justify-center md:hidden transition-colors"><X className="w-4 h-4 text-[#493129]" /></button>
             <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 20 20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Ccircle cx=\\'2\\' cy=\\'2\\' r=\\'1\\' fill=\\'%23ffffff\\' fill-opacity=\\'0.4\\'/%3E%3C/svg%3E')] opacity-50"></div>
             <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="text-[6rem] md:text-[8rem] drop-shadow-2xl relative z-10">{product.emoji}</motion.div>
             <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#efa3a0] shadow-xl absolute z-20 cursor-pointer hover:scale-110 transition-transform">
                <Play className="w-6 h-6 ml-1 fill-current" />
             </div>
          </div>
          {/* Content Side */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
             <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-[#8b597b]/80 mb-2">{product.category}</p>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#493129]">{product.title}</h2>
                </div>
                <button onClick={onClose} className="hidden md:flex w-8 h-8 bg-[#ffeddb] hover:bg-[#ffdec7] rounded-full items-center justify-center transition-colors"><X className="w-4 h-4 text-[#493129]" /></button>
             </div>
             <div className="flex items-center gap-2 mb-6">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-sm font-bold text-[#493129]">{product.rating} (120+ Reviews)</span>
             </div>
             <div className="flex items-end gap-3 mb-8">
               <span className="text-3xl font-bold text-[#493129] leading-none">{product.price}</span>
               <span className="text-lg font-bold text-[#493129]/40 line-through mb-1">{product.originalPrice}</span>
               <span className="bg-[#efa3a0]/20 text-[#efa3a0] text-xs font-bold px-2 py-1 rounded-md mb-1 ml-2">Save 35%</span>
             </div>
             
             <div className="space-y-4 mb-8 flex-1">
               <h4 className="font-bold text-[#493129]">What's Included:</h4>
               <ul className="space-y-3">
                 {["Fully responsive source code", "Customizable colors & text", "Easy setup guide (PDF)", "Free hosting instructions"].map((feature, i) => (
                   <li key={i} className="flex items-center gap-3 text-sm text-[#493129]/70 font-medium">
                     <div className="w-5 h-5 rounded-full bg-[#ffeddb] flex items-center justify-center shrink-0">
                       <Check className="w-3 h-3 text-[#efa3a0]" />
                     </div>
                     {feature}
                   </li>
                 ))}
               </ul>
             </div>

             <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-[#ffdec7]/50">
                <button className="flex-1 bg-[#493129] text-white py-4 rounded-xl font-bold hover:bg-[#8b597b] transition-colors shadow-lg shadow-[#493129]/20 flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
                <button className="w-full sm:w-auto px-6 py-4 bg-[#ffeddb] text-[#493129] font-bold rounded-xl hover:bg-[#ffdec7] transition-colors flex items-center justify-center gap-2">
                   Live Preview <ArrowRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ProductCard = ({ product, onClick }: { product: typeof PRODUCTS[0], onClick: () => void }) => (
  <motion.div variants={fadeUp} onClick={onClick} className="group cursor-pointer flex flex-col h-full bg-white/70 backdrop-blur-md rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-4 shadow-md hover:shadow-xl hover:shadow-[#efa3a0]/20 transition-all duration-300 border border-white sm:hover:-translate-y-1">
     <div className={\`relative aspect-[4/3] sm:aspect-video rounded-xl sm:rounded-2xl bg-gradient-to-br \${product.gradient} mb-3 sm:mb-4 flex items-center justify-center overflow-hidden border border-white/50\`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 20 20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Ccircle cx=\\'2\\' cy=\\'2\\' r=\\'1\\' fill=\\'%23ffffff\\' fill-opacity=\\'0.4\\'/%3E%3C/svg%3E')] opacity-50"></div>
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
           <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-[#efa3a0] shadow-xl transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 border border-white">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5 sm:ml-1 fill-current" />
           </div>
        </div>
        <div className="text-[3.5rem] sm:text-[4.5rem] drop-shadow-xl transform group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 relative z-0">
           {product.emoji}
           <div className="absolute -bottom-2 sm:-bottom-4 left-1/2 -translate-x-1/2 w-10 sm:w-16 h-2.5 sm:h-4 bg-black/20 rounded-[100%] blur-md -z-10 group-hover:opacity-50 transition-opacity"></div>
        </div>
        {product.tag && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-sm text-[#8b597b] text-[8px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full z-20 shadow-sm border border-white">
             {product.tag}
          </div>
        )}
        <button onClick={(e) => { e.stopPropagation(); }} className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-[#493129]/40 hover:text-rose-500 hover:bg-white transition-colors z-30 border border-white">
           <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4"/>
        </button>
     </div>
     <div className="px-1.5 sm:px-3 flex-1 flex flex-col pb-1">
         <p className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-[#8b597b]/80 mb-1 sm:mb-1.5">{product.category}</p>
         <h3 className="font-serif font-bold text-[#493129] mb-2 sm:mb-3 text-[15px] sm:text-lg leading-tight group-hover:text-[#efa3a0] transition-colors line-clamp-1">{product.title}</h3>
         <div className="flex justify-between items-end mt-auto pt-2.5 sm:pt-3 border-t border-[#ffdec7]/40">
            <div className="flex gap-1.5 sm:gap-2 items-baseline sm:items-end">
               <span className="font-bold text-[#493129] text-base sm:text-xl leading-none">{product.price}</span>
               {product.originalPrice && <span className="text-[9px] sm:text-xs font-bold text-[#493129]/40 line-through mb-0.5">{product.originalPrice}</span>}
            </div>
            <div className="flex items-center gap-1 text-[9px] sm:text-xs font-bold text-[#493129] bg-white px-2 py-1 rounded-full shadow-sm border border-[#ffdec7]/50">
               {product.rating} <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 fill-amber-400" />
            </div>
         </div>
     </div>
  </motion.div>
);

const PopularProducts = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  
  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-10 gap-4">
           <div>
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <span className="w-5 sm:w-8 h-px bg-[#efa3a0]"></span>
                <span className="text-[#efa3a0] font-bold text-[9px] sm:text-xs tracking-widest uppercase">Templates</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#493129]">Find the Perfect Gift</h2>
           </div>
           
           {/* Categories */}
           <div className="flex overflow-x-auto hide-scrollbar w-full md:w-auto gap-2 pb-2 md:pb-0">
             {CATEGORIES.map(cat => (
               <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={\`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 \${activeCategory === cat ? 'bg-[#493129] text-white shadow-md' : 'bg-white text-[#493129]/60 hover:bg-[#ffeddb] hover:text-[#493129] border border-[#ffdec7]/50'}\`}
               >
                 {cat}
               </button>
             ))}
           </div>
        </div>
        
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
           <AnimatePresence>
             {filteredProducts.map(p => (
                <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }} key={p.id}>
                  <ProductCard product={p} onClick={() => setSelectedProduct(p)} />
                </motion.div>
             ))}
           </AnimatePresence>
        </motion.div>
        
        {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
};

const Testimonials = () => (
  <div className="py-16 sm:py-24 bg-white/40 border-y border-[#ffdec7]/50 overflow-hidden relative">
    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#ffeddb] to-transparent z-10 pointer-events-none"></div>
    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#ffeddb] to-transparent z-10 pointer-events-none"></div>
    
    <div className="text-center mb-10 sm:mb-14 px-4">
        <h2 className="text-3xl sm:text-4xl font-serif text-[#493129] mb-4">Loved by Thousands</h2>
        <p className="text-[#493129]/60 font-medium">Hear what our happy customers have to say about their special gifts.</p>
    </div>

    <div className="flex whitespace-nowrap">
      <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 30 }} className="flex gap-6 sm:gap-8 px-4">
         {[...TESTIMONIALS, ...TESTIMONIALS].map((test, i) => (
           <div key={i} className="w-[300px] sm:w-[400px] bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#ffdec7]/50 shrink-0 flex flex-col whitespace-normal">
              <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-[#493129]/80 font-medium leading-relaxed mb-6 flex-1 italic relative">
                <Quote className="w-8 h-8 text-[#ffdec7]/40 absolute -top-2 -left-2 -z-10" />
                "{test.text}"
              </p>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#efa3a0] to-[#8b597b] flex items-center justify-center text-white font-bold">{test.name.charAt(0)}</div>
                 <div>
                    <h5 className="font-bold text-[#493129] text-sm">{test.name}</h5>
                    <p className="text-xs text-[#8b597b] font-medium">{test.role}</p>
                 </div>
              </div>
           </div>
         ))}
      </motion.div>
    </div>
  </div>
);

const PromoBanners = () => (
  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 50 }} className="bg-gradient-to-br from-[#ffdec7] to-[#ffeddb] rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 flex flex-col justify-center relative overflow-hidden group min-h-[260px] sm:min-h-[380px] shadow-lg shadow-[#ffdec7]/30 border border-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'30\\' height=\\'30\\' viewBox=\\'0 0 30 30\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M15 15c-1.5 0-3-1.5-3-3s1.5-3 3-3 3 1.5 3 3-1.5 3-3 3zm0-8c-2.5 0-5 2.5-5 5s2.5 5 5 5 5-2.5 5-5-2.5-5-5-5z\\' fill=\\'%23ffffff\\' fill-opacity=\\'0.4\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')] opacity-30"></div>
        <div className="relative z-10 w-2/3 sm:w-2/3">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full border border-white mb-3 sm:mb-5">
            <span className="text-[8px] sm:text-[10px] font-black tracking-widest text-[#8b597b] uppercase">New Release</span>
          </div>
          <h3 className="text-2xl sm:text-4xl md:text-5xl font-serif text-[#493129] mb-1 sm:mb-4 leading-tight">Anniversary<br/>Special</h3>
          <p className="text-[#efa3a0] font-serif text-[15px] sm:text-2xl mb-4 sm:mb-8 italic">Interactive Timeline</p>
          <button className="bg-[#493129] text-white px-5 sm:px-8 py-2.5 sm:py-4 rounded-full text-[11px] sm:text-sm font-bold flex items-center gap-2 sm:gap-3 hover:bg-[#8b597b] transition-all duration-300 w-fit shadow-md">
            Preview <Play className="w-2.5 h-2.5 sm:w-4 sm:h-4 fill-current" />
          </button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-700 pointer-events-none">
           <div className="w-32 h-32 sm:w-64 sm:h-64 bg-white/50 rounded-full absolute -right-5 sm:-right-10 blur-xl sm:blur-2xl"></div>
           <div className="text-[5rem] sm:text-[9rem] relative z-10 drop-shadow-2xl transform -rotate-12 group-hover:rotate-0 transition-transform duration-700">💍</div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 50, delay: 0.1 }} className="bg-gradient-to-br from-[#efa3a0]/30 to-[#8b597b]/10 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 flex flex-col justify-center relative overflow-hidden group min-h-[260px] sm:min-h-[380px] shadow-lg shadow-[#efa3a0]/10 border border-white">
        <div className="relative z-10 w-2/3 sm:w-2/3">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full border border-white mb-3 sm:mb-5">
            <span className="text-[8px] sm:text-[10px] font-black tracking-widest text-[#8b597b] uppercase">Custom Orders</span>
          </div>
          <h3 className="text-2xl sm:text-4xl md:text-5xl font-serif text-[#493129] mb-2 sm:mb-6 leading-tight">Need a bespoke<br/>design?</h3>
          <p className="text-[#493129]/70 text-[10px] sm:text-sm mb-4 sm:mb-8 max-w-[150px] sm:max-w-[200px] font-medium leading-relaxed hidden sm:block">Let's create a unique website crafted specially for your loved one.</p>
          <button className="bg-white text-[#493129] px-5 sm:px-8 py-2.5 sm:py-4 rounded-full text-[11px] sm:text-sm font-bold flex items-center gap-2 sm:gap-3 hover:bg-[#493129] hover:text-white transition-all duration-300 w-fit shadow-sm border border-[#ffdec7]/50 mt-2 sm:mt-0">
            Hire Me <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-700 pointer-events-none">
           <div className="w-32 h-32 sm:w-64 sm:h-64 bg-white/60 rounded-full absolute -right-5 sm:-right-10 blur-xl sm:blur-2xl"></div>
           <div className="text-[5rem] sm:text-[9rem] relative z-10 drop-shadow-2xl transform rotate-12 group-hover:rotate-0 transition-transform duration-700">🎨</div>
        </div>
      </motion.div>
    </div>
  </div>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative">
       <div className="text-center mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-px bg-[#efa3a0]"></span>
            <span className="text-[#efa3a0] font-bold text-xs tracking-widest uppercase">Support</span>
            <span className="w-8 h-px bg-[#efa3a0]"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#493129] mb-4">Frequently Asked Questions</h2>
       </div>
       <div className="space-y-4">
          {FAQS.map((faq, index) => (
             <div key={index} className="bg-white/60 backdrop-blur-md border border-white shadow-sm rounded-2xl overflow-hidden transition-all duration-300">
                <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex items-center justify-between p-5 sm:p-6 text-left">
                   <span className="font-bold text-[#493129] text-[15px] sm:text-lg pr-4">{faq.q}</span>
                   <div className={\`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors \${openIndex === index ? 'bg-[#493129] text-white' : 'bg-[#ffeddb] text-[#493129]'}\`}>
                     <ChevronDown className={\`w-4 h-4 transition-transform duration-300 \${openIndex === index ? 'rotate-180' : ''}\`} />
                   </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                       <div className="p-5 sm:p-6 pt-0 text-[#493129]/70 font-medium text-sm sm:text-base leading-relaxed border-t border-[#ffdec7]/30 mt-2">
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

const WhyChooseUs = () => (
  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
              { icon: CheckCircle, title: "Clean Code", desc: "React, Tailwind, & well-structured code." },
              { icon: CreditCard, title: "One-Time Fee", desc: "No subscriptions, own it forever." },
              { icon: ShieldCheck, title: "Responsive", desc: "Looks perfect on all devices." },
              { icon: Gift, title: "Instant Access", desc: "Get zip file immediately after purchase." }
          ].map((feature, idx) => (
              <motion.div variants={fadeUp} key={idx} className="flex flex-col items-center text-center p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] bg-white/60 backdrop-blur-sm shadow-sm border border-white transition-all duration-300">
                  <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-[0.75rem] sm:rounded-[1.5rem] bg-gradient-to-br from-[#ffeddb] to-[#ffdec7]/40 flex items-center justify-center shrink-0 mb-3 sm:mb-5 border border-white shadow-sm">
                      <feature.icon className="w-5 h-5 sm:w-8 sm:h-8 text-[#8b597b]" strokeWidth={1.5} />
                  </div>
                  <div>
                      <h4 className="font-bold text-[#493129] text-[13px] sm:text-xl mb-1 sm:mb-2 font-serif">{feature.title}</h4>
                      <p className="text-[9px] sm:text-[15px] text-[#493129]/60 leading-relaxed font-medium">{feature.desc}</p>
                  </div>
              </motion.div>
          ))}
      </motion.div>
  </div>
);

const Footer = () => (
  <footer className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 mb-4 sm:mb-6 mt-4 sm:mt-10">
     <div className="bg-[#493129] rounded-[2rem] sm:rounded-[4rem] overflow-hidden shadow-2xl shadow-[#493129]/30 relative border border-[#493129]">
        <div className="absolute top-0 right-0 w-full max-w-lg sm:max-w-2xl h-[300px] sm:h-[500px] bg-[#8b597b] rounded-full blur-[100px] sm:blur-[150px] opacity-30 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full max-w-sm sm:max-w-xl h-[300px] sm:h-[400px] bg-[#efa3a0] rounded-full blur-[100px] sm:blur-[120px] opacity-20 transform -translate-x-1/4 translate-y-1/3 pointer-events-none"></div>

        <div className="px-5 py-10 sm:py-12 md:px-16 md:py-20 flex flex-col lg:flex-row justify-between items-center gap-6 sm:gap-10 border-b border-white/10 relative z-10">
           <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 w-full lg:w-auto text-center sm:text-left">
               <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-[1.25rem] sm:rounded-[2rem] bg-gradient-to-br from-[#8b597b] to-[#efa3a0] flex items-center justify-center shrink-0 shadow-2xl border-[3px] sm:border-4 border-white/10 transform -rotate-3">
                  <Mail className="w-6 h-6 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />
               </div>
               <div>
                  <h3 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white mb-2 sm:mb-4 tracking-tight">Join our newsletter</h3>
                  <p className="text-white/70 text-[11px] sm:text-base md:text-lg max-w-[280px] sm:max-w-md mx-auto sm:mx-0">Get notified about new template releases and exclusive discount codes directly to your inbox.</p>
               </div>
           </div>
           
           <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-2 sm:gap-0 relative z-10 p-1 sm:bg-white/10 sm:backdrop-blur-xl sm:rounded-full sm:border sm:border-white/20 mt-2 sm:mt-0">
              <input type="email" placeholder="Enter your email address" className="px-5 sm:px-8 py-3.5 sm:py-5 bg-white/10 sm:bg-transparent border border-white/20 sm:border-none text-white w-full lg:w-80 rounded-[1rem] sm:rounded-none focus:outline-none placeholder:text-white/50 text-[13px] sm:text-base" />
              <button className="px-6 sm:px-10 py-3.5 sm:py-5 bg-[#efa3a0] text-[#493129] font-bold rounded-[1rem] sm:rounded-full shrink-0 shadow-lg text-[13px] sm:text-base w-full sm:w-auto hover:bg-[#ffdec7] transition-colors">
                Subscribe Now
              </button>
           </div>
        </div>
        
        <div className="px-5 py-8 md:px-16 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 relative z-10">
            {[
              { icon: ShieldCheck, title: "Secure Checkout", desc: "Stripe integration" },
              { icon: CreditCard, title: "Multiple Payment", desc: "Cards, PayPal & more" },
              { icon: RefreshCw, title: "Updates", desc: "Free lifetime updates" },
              { icon: CheckCircle, title: "Premium Design", desc: "Crafted with love" },
            ].map((item, i) => (
                <div key={i} className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-[0.5rem] sm:rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      <item.icon className="w-4 h-4 sm:w-6 sm:h-6 text-[#ffdec7]" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h5 className="text-white text-[11px] sm:text-base font-bold mb-0.5 sm:mb-1 font-serif">{item.title}</h5>
                        <p className="text-white/50 text-[9px] sm:text-xs">{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="bg-black/20 text-center py-5 sm:py-8 text-white/40 text-[9px] sm:text-xs relative z-10 flex flex-col md:flex-row items-center justify-between px-5 md:px-16 border-t border-white/5">
            <div className="flex items-center gap-2 mb-3 md:mb-0">
              <div className="w-4 h-4 sm:w-6 sm:h-6 bg-[#efa3a0] text-white rounded-[4px] sm:rounded-md flex items-center justify-center font-serif text-[9px] sm:text-xs font-bold">A</div>
              <span className="font-bold text-[#ffdec7] font-serif text-[11px] sm:text-sm">Canvas Builds.</span>
            </div>
            <p className="mb-3 md:mb-0">© 2026 Canvas Builds. All rights reserved. Crafted with love.</p>
            <div className="flex gap-4 text-white/60">
               <a href="#" className="hover:text-white transition-colors">Privacy</a>
               <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
        </div>
     </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen bg-[#ffeddb] font-sans selection:bg-[#ffdec7] selection:text-[#493129] overflow-x-hidden text-[#493129]">
      <Navbar />
      <main>
        <Hero />
        <TrustBadges />
        <PopularProducts />
        <Testimonials />
        <PromoBanners />
        <FAQSection />
        <WhyChooseUs />
      </main>
      <Footer />
      
      {/* Floating Action Button for Mobile Chat/Support */}
      <motion.button 
         initial={{ scale: 0, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         transition={{ delay: 2, type: "spring" }}
         className="fixed bottom-6 right-6 w-14 h-14 bg-[#493129] text-white rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 hover:bg-[#8b597b] transition-all duration-300 md:hidden"
      >
         <MessageCircle className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
`

fs.writeFileSync('src/App.tsx', code);
