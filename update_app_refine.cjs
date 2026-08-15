const fs = require('fs');

const code = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
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
  Download
} from 'lucide-react';

const PRODUCTS = [
  {
    id: 1,
    category: 'Love',
    title: 'Girlfriend Day Special',
    price: '$29.00',
    originalPrice: '$49.00',
    rating: '4.9',
    emoji: '💝',
    gradient: 'from-pink-200 to-rose-100',
    tag: 'Bestseller'
  },
  {
    id: 2,
    category: 'Friendship',
    title: 'Bestie Birthday Surprise',
    price: '$19.00',
    originalPrice: '$29.00',
    rating: '4.8',
    emoji: '👯‍♀️',
    gradient: 'from-[#ffdec7] to-[#ffeddb]'
  },
  {
    id: 3,
    category: 'Anniversary',
    title: 'Our Journey Timeline',
    price: '$39.00',
    originalPrice: '$59.00',
    rating: '5.0',
    emoji: '👩‍❤️‍👨',
    gradient: 'from-[#8b597b]/20 to-[#8b597b]/40',
    tag: 'Premium'
  },
  {
    id: 4,
    category: 'Apology',
    title: 'Cute "I am Sorry" Page',
    price: '$15.00',
    originalPrice: '$25.00',
    rating: '4.7',
    emoji: '🥺',
    gradient: 'from-orange-100 to-amber-50'
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } }
};

const FloatingElement = ({ children, delay = 0, yOffset = 20, duration = 3 }: { children: React.ReactNode, delay?: number, yOffset?: number, duration?: number }) => (
  <motion.div
    animate={{ y: [0, -yOffset, 0] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  >
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
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={\`fixed top-0 left-0 right-0 z-50 transition-all duration-500 \${isScrolled ? 'py-3' : 'py-5'}\`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className={\`flex justify-between items-center bg-white/80 backdrop-blur-xl rounded-full px-4 sm:px-8 transition-all duration-500 \${isScrolled ? 'h-16 shadow-lg shadow-[#efa3a0]/10 border border-white' : 'h-16 shadow-sm border border-[#ffdec7]/50'}\`}>
            
            <div className="flex items-center gap-3 cursor-pointer shrink-0 group">
              <div className="w-10 h-10 bg-[#efa3a0] text-white rounded-xl flex items-center justify-center font-serif text-2xl font-bold transform transition-all duration-300 group-hover:rotate-[15deg] group-hover:scale-110 shadow-md">
                A
              </div>
              <span className="font-bold text-xl tracking-tight text-[#493129] hidden sm:block font-serif">
                Canvas Builds.
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              {['Home', 'Templates', 'Categories', 'Custom Request', 'Pages'].map((item, i) => (
                <a key={i} href="#" className={\`text-sm font-medium transition-colors relative group py-2 \${i === 0 ? 'text-[#efa3a0] font-bold' : 'text-[#493129]/70 hover:text-[#efa3a0]'}\`}>
                  {item}
                  <span className={\`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#efa3a0] transition-all duration-300 group-hover:w-full rounded-full \${i === 0 ? 'w-full' : ''}\`}></span>
                </a>
              ))}
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden xl:flex items-center relative group">
                    <input type="text" placeholder="Search templates..." className="pl-4 pr-10 py-2 bg-[#ffeddb]/50 rounded-full text-sm focus:outline-none focus:bg-white text-[#493129] w-48 focus:w-64 placeholder-[#493129]/40 border border-transparent focus:border-[#ffdec7] transition-all duration-300" />
                    <Search className="w-4 h-4 text-[#493129]/60 absolute right-3 group-hover:text-[#efa3a0] transition-colors" />
                </div>
                <button className="hidden sm:flex hover:bg-[#ffeddb] p-2.5 rounded-full transition-colors text-[#493129]/80 hover:text-[#efa3a0]">
                  <User className="w-5 h-5" />
                </button>
                <button className="relative hover:bg-[#ffeddb] p-2.5 rounded-full transition-colors group text-[#493129]/80 hover:text-[#efa3a0]">
                    <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="absolute top-1 right-1 bg-[#8b597b] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center transform scale-100 shadow-sm border border-white">3</span>
                </button>
                <button 
                  className="lg:hidden p-2.5 text-[#493129]/80 hover:bg-[#ffeddb] hover:text-[#efa3a0] rounded-full transition-colors"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="w-6 h-6" />
                </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#493129]/30 backdrop-blur-md lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl flex flex-col rounded-l-3xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 flex justify-between items-center border-b border-[#ffdec7]/30 bg-[#ffeddb]/30">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-[#efa3a0] text-white rounded-lg flex items-center justify-center font-serif text-xl font-bold">A</div>
                   <span className="font-bold text-xl tracking-tight text-[#493129] font-serif">Menu</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-white hover:bg-[#ffeddb] rounded-full transition-colors text-[#493129] shadow-sm border border-[#ffdec7]/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-6">
                {['Home', 'Templates', 'Categories', 'Custom Request', 'Pages'].map((item, i) => (
                  <motion.a 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    key={i} href="#" 
                    className={\`text-lg font-medium p-3 rounded-2xl transition-colors \${i === 0 ? 'bg-[#efa3a0]/10 text-[#efa3a0]' : 'text-[#493129]/80 hover:bg-[#ffeddb]'}\`}
                  >
                    {item}
                  </motion.a>
                ))}
                <div className="mt-auto pt-8">
                  <div className="flex items-center gap-3 bg-[#ffeddb]/50 p-3.5 rounded-2xl mb-4 border border-[#ffdec7]/50">
                    <Search className="w-5 h-5 text-[#493129]/50" />
                    <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none w-full text-[#493129]" />
                  </div>
                  <button className="w-full flex items-center justify-center gap-3 p-4 bg-[#493129] text-white font-medium hover:bg-[#8b597b] rounded-2xl transition-colors shadow-lg">
                    <User className="w-5 h-5" /> Sign In
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
  return (
    <div className="relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 text-[#efa3a0]/20 text-6xl blur-sm transform -rotate-12 pointer-events-none">💝</div>
      <div className="absolute bottom-20 right-20 text-[#8b597b]/10 text-8xl blur-sm transform rotate-12 pointer-events-none">✨</div>
      <div className="absolute top-40 right-1/3 text-[#ffdec7]/40 text-4xl blur-sm pointer-events-none">💖</div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 md:pt-44 md:pb-28 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex-1 space-y-7 w-full text-center lg:text-left z-10"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white shadow-sm">
              <Sparkles className="w-4 h-4 text-[#efa3a0]" />
              <span className="text-[#8b597b] font-bold text-xs sm:text-sm uppercase tracking-wider">New Heartfelt Templates</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-[5rem] font-serif text-[#493129] leading-[1.05] tracking-tight">
              Share Your Love <br className="hidden lg:block"/> 
              <span className="relative">
                <span className="relative z-10">Through Code</span>
                <span className="absolute bottom-1 sm:bottom-3 left-0 w-full h-3 sm:h-5 bg-[#ffdec7] -z-10 rounded-full opacity-60 transform -rotate-1"></span>
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-[#493129]/70 text-lg sm:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              Cute, aesthetic, and emotional website templates designed to make your special moments unforgettable.
            </motion.p>
            
            <motion.div variants={fadeUp} className="pt-4 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                <button className="bg-[#493129] hover:bg-[#8b597b] text-white px-8 py-4 sm:py-5 rounded-full font-medium transition-all duration-300 flex items-center gap-3 hover:shadow-xl hover:shadow-[#8b597b]/30 hover:-translate-y-1 w-full sm:w-auto justify-center text-lg relative overflow-hidden group">
                  <span className="relative z-10 flex items-center gap-3">Browse Templates <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
                <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md px-6 py-3 rounded-full border border-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex -space-x-3">
                        <FloatingElement delay={0} yOffset={5} duration={4}>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white bg-gradient-to-br from-[#efa3a0] to-rose-300 flex items-center justify-center text-white text-sm shadow-md z-30 transform hover:scale-110 transition-transform cursor-pointer">💖</div>
                        </FloatingElement>
                        <FloatingElement delay={1} yOffset={5} duration={4.5}>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white bg-gradient-to-br from-[#8b597b] to-purple-400 flex items-center justify-center text-white text-sm shadow-md z-20 transform hover:scale-110 transition-transform cursor-pointer">🥰</div>
                        </FloatingElement>
                        <FloatingElement delay={2} yOffset={5} duration={3.5}>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white bg-gradient-to-br from-[#ffdec7] to-orange-200 flex items-center justify-center text-[#493129] text-sm shadow-md z-10 transform hover:scale-110 transition-transform cursor-pointer">🥺</div>
                        </FloatingElement>
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-bold text-[#493129]">10K+ Happy Couples</span>
                        <div className="flex text-[#efa3a0] mt-0.5 gap-0.5">
                            {[...Array(5)].map((_,i) => <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />)}
                        </div>
                    </div>
                </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1.5, bounce: 0.4 }}
            className="flex-1 relative w-full max-w-lg lg:max-w-xl aspect-video lg:aspect-[4/3] lg:mt-0 mt-8"
          >
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#ffdec7]/40 to-[#efa3a0]/20 rounded-[2.5rem] transform -rotate-3 blur-xl"></div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/40 rounded-3xl overflow-hidden shadow-2xl border border-white backdrop-blur-xl flex items-center justify-center group cursor-pointer">
                
                {/* Mock Browser Header */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-white/50 backdrop-blur-md flex items-center px-4 gap-2 border-b border-black/5 z-20">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="mx-auto bg-black/5 h-5 rounded-full w-1/3 max-w-[200px]"></div>
                </div>

                {/* Mock Video Content */}
                <div className="absolute inset-0 top-10 bg-cover bg-center opacity-40 transition-opacity duration-700 group-hover:opacity-60" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23493129\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
                   <div className="w-full h-full bg-gradient-to-br from-[#efa3a0]/30 to-[#8b597b]/30"></div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>
                
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-20 w-24 h-24 bg-white/95 backdrop-blur-xl rounded-full flex items-center justify-center text-[#efa3a0] shadow-2xl border border-white group-hover:bg-white transition-colors"
                >
                    <Play className="w-10 h-10 ml-2 fill-current" />
                    
                    {/* Ripple Effect */}
                    <span className="absolute inset-0 rounded-full border border-white animate-[ping_2s_ease-in-out_infinite] opacity-50"></span>
                </motion.div>
                
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white z-20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                      <div>
                        <span className="text-sm font-bold block drop-shadow-md text-[#ffeddb]">Girlfriend Template</span>
                        <span className="text-xs font-medium text-white/80">Preview Video</span>
                      </div>
                    </div>
                    <div className="text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20">01:24</div>
                </div>
              </div>
              
              <FloatingElement delay={0} yOffset={15} duration={5}>
                <div className="absolute -top-6 right-4 lg:-right-8 z-30 bg-[#efa3a0] text-white p-5 rounded-[2rem] w-32 h-32 flex flex-col items-center justify-center shadow-2xl border-4 border-white cursor-pointer hover:scale-105 transition-transform transform rotate-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/90">Love</span>
                  <span className="text-3xl font-black leading-none my-1 tracking-tighter">100%</span>
                  <div className="flex gap-1 mt-1">
                    {[...Array(3)].map((_,i) => <Heart key={i} className="w-3 h-3 fill-white" />)}
                  </div>
                </div>
              </FloatingElement>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

const TrustBadges = () => (
  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="bg-white/60 backdrop-blur-lg border border-white shadow-xl shadow-[#ffdec7]/30 rounded-[2.5rem] p-6 sm:p-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffdec7] to-transparent -translate-y-1/2"></div>
            {[
                { icon: Download, title: "Instant Access", desc: "Download code immediately" },
                { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure checkout" },
                { icon: RefreshCw, title: "Easy Customization", desc: "Well documented code" },
                { icon: Headphones, title: "Developer Support", desc: "Help when you need it" }
            ].map((badge, idx) => (
                <motion.div variants={fadeUp} key={idx} className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-5 p-4 rounded-3xl hover:bg-white/80 transition-all duration-300 group z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ffeddb] to-[#ffdec7]/50 flex items-center justify-center shrink-0 border border-white shadow-sm transform group-hover:scale-110 group-hover:rotate-6 transition-transform">
                      <badge.icon className="w-7 h-7 text-[#8b597b]" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h4 className="font-bold text-[#493129] text-base mb-1">{badge.title}</h4>
                        <p className="text-sm text-[#493129]/60 font-medium">{badge.desc}</p>
                    </div>
                </motion.div>
            ))}
        </div>
      </motion.div>
  </div>
);

const ProductCard = ({ product }: { product: typeof PRODUCTS[0] }) => (
  <motion.div variants={fadeUp} className="group cursor-pointer flex flex-col h-full bg-white/70 backdrop-blur-md rounded-[2.5rem] p-4 sm:p-5 shadow-lg shadow-[#efa3a0]/5 hover:shadow-2xl hover:shadow-[#efa3a0]/20 transition-all duration-500 border border-white hover:-translate-y-2">
     <div className={\`relative aspect-video rounded-3xl bg-gradient-to-br \${product.gradient} mb-6 flex items-center justify-center overflow-hidden border border-white/50\`}>
        
        {/* Mock Video Thumbnail / Decorative pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 20 20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Ccircle cx=\\'2\\' cy=\\'2\\' r=\\'1\\' fill=\\'%23ffffff\\' fill-opacity=\\'0.4\\'/%3E%3C/svg%3E')] opacity-50"></div>
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        
        <div className="absolute inset-0 flex items-center justify-center z-20">
           <motion.div 
             whileHover={{ scale: 1.15 }}
             whileTap={{ scale: 0.95 }}
             className="w-14 h-14 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-[#efa3a0] shadow-xl transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 border border-white"
           >
              <Play className="w-6 h-6 ml-1 fill-current" />
           </motion.div>
        </div>
        
        {/* Emoji Center */}
        <div className="text-[4rem] sm:text-[5rem] drop-shadow-xl transform group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 relative z-0">
           {product.emoji}
           <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/20 rounded-[100%] blur-md -z-10 group-hover:opacity-50 transition-opacity"></div>
        </div>
        
        {/* Tags & Badges */}
        {product.tag && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#8b597b] text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full z-20 shadow-sm border border-white">
             {product.tag}
          </div>
        )}

        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg z-20 backdrop-blur-md border border-white/20">
           Preview
        </div>

        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-[#493129]/40 hover:text-rose-500 hover:bg-white transition-all z-30 transform hover:scale-110 active:scale-95 border border-white">
           <Heart className="w-5 h-5"/>
        </button>
     </div>
     
     <div className="px-3 flex-1 flex flex-col pb-2">
         <p className="text-[11px] font-black tracking-widest uppercase text-[#8b597b]/80 mb-2">{product.category}</p>
         <h3 className="font-serif font-bold text-[#493129] mb-4 text-xl leading-tight group-hover:text-[#efa3a0] transition-colors">{product.title}</h3>
         <div className="flex justify-between items-end mt-auto pt-4 border-t border-[#ffdec7]/40">
            <div className="flex gap-2.5 items-end">
               <span className="font-bold text-[#493129] text-2xl leading-none">{product.price}</span>
               {product.originalPrice && <span className="text-sm font-bold text-[#493129]/40 line-through mb-0.5">{product.originalPrice}</span>}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#493129] bg-white px-3 py-1.5 rounded-full shadow-sm border border-[#ffdec7]/50">
               {product.rating} <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </div>
         </div>
     </div>
  </motion.div>
);

const PopularProducts = () => (
  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
      <div className="absolute left-0 top-40 w-64 h-64 bg-[#ffdec7]/40 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
         <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-px bg-[#efa3a0]"></span>
              <span className="text-[#efa3a0] font-bold text-sm tracking-widest uppercase">Trending</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#493129]">Popular Templates</h2>
         </div>
         <button className="text-[#493129] font-bold flex items-center gap-2 hover:bg-[#ffeddb] transition-colors group bg-white px-6 py-3 rounded-full shadow-sm border border-[#ffdec7]/50">
            View All <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"/>
         </button>
      </div>
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
      >
         {PRODUCTS.map(p => <ProductCard key={p.id} product={p} />)}
      </motion.div>
  </div>
);

const PromoBanners = () => (
  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Banner 1 */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 50 }}
        className="bg-gradient-to-br from-[#ffdec7] to-[#ffeddb] rounded-[3rem] p-10 md:p-14 flex flex-col justify-center relative overflow-hidden group min-h-[400px] shadow-xl shadow-[#ffdec7]/30 border border-white"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'30\\' height=\\'30\\' viewBox=\\'0 0 30 30\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M15 15c-1.5 0-3-1.5-3-3s1.5-3 3-3 3 1.5 3 3-1.5 3-3 3zm0-8c-2.5 0-5 2.5-5 5s2.5 5 5 5 5-2.5 5-5-2.5-5-5-5z\\' fill=\\'%23ffffff\\' fill-opacity=\\'0.4\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative z-10 w-full sm:w-2/3">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white mb-6">
            <span className="text-[10px] font-black tracking-widest text-[#8b597b] uppercase">New Release</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-serif text-[#493129] mb-4 leading-tight">Anniversary<br/>Special</h3>
          <p className="text-[#efa3a0] font-serif text-3xl mb-10 italic">Interactive Timeline</p>
          <button className="bg-[#493129] text-white px-8 py-4 rounded-full text-sm font-bold flex items-center gap-3 hover:bg-[#8b597b] transition-all duration-300 w-fit hover:shadow-xl hover:shadow-[#8b597b]/30 hover:-translate-y-1">
            Preview Theme <Play className="w-4 h-4 fill-current" />
          </button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-700 pointer-events-none opacity-30 sm:opacity-100">
           <div className="w-72 h-72 bg-white/50 rounded-full absolute -right-10 blur-2xl"></div>
           <div className="text-[8rem] md:text-[10rem] relative z-10 drop-shadow-2xl transform -rotate-12 group-hover:rotate-0 transition-transform duration-700">💍</div>
        </div>
      </motion.div>
      
      {/* Banner 2 */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 50, delay: 0.1 }}
        className="bg-gradient-to-br from-[#efa3a0]/30 to-[#8b597b]/10 rounded-[3rem] p-10 md:p-14 flex flex-col justify-center relative overflow-hidden group min-h-[400px] shadow-xl shadow-[#efa3a0]/10 border border-white"
      >
        <div className="relative z-10 w-full sm:w-2/3">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white mb-6">
            <span className="text-[10px] font-black tracking-widest text-[#8b597b] uppercase">Custom Orders</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-serif text-[#493129] mb-8 leading-tight">Need a bespoke<br/>design?</h3>
          <p className="text-[#493129]/70 text-sm mb-10 max-w-[200px] font-medium">Let's create a unique website crafted specially for your loved one.</p>
          <button className="bg-white text-[#493129] px-8 py-4 rounded-full text-sm font-bold flex items-center gap-3 hover:bg-[#493129] hover:text-white transition-all duration-300 w-fit hover:shadow-xl hover:-translate-y-1 border border-[#ffdec7]/50 group-hover:border-transparent">
            Hire Me <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-700 pointer-events-none opacity-30 sm:opacity-100">
           <div className="w-72 h-72 bg-white/60 rounded-full absolute -right-10 blur-2xl"></div>
           <div className="text-[8rem] md:text-[10rem] relative z-10 drop-shadow-2xl transform rotate-12 group-hover:rotate-0 transition-transform duration-700">🎨</div>
        </div>
      </motion.div>
    </div>
  </div>
);

const WhyChooseUs = () => (
  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
      <div className="absolute right-0 top-0 w-96 h-96 bg-white/50 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      
      <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-px bg-[#efa3a0]"></span>
            <span className="text-[#efa3a0] font-bold text-sm tracking-widest uppercase">Our Value</span>
            <span className="w-8 h-px bg-[#efa3a0]"></span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-[#493129]">Why Buy Our Templates?</h2>
      </div>
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
      >
          {[
              { icon: CheckCircle, title: "Clean Code", desc: "React, Tailwind, and well-structured source code." },
              { icon: CreditCard, title: "One-Time Fee", desc: "No subscriptions, pay once and own forever." },
              { icon: ShieldCheck, title: "Responsive", desc: "Looks perfect on mobile, tablet, and desktop." },
              { icon: Gift, title: "Instant Download", desc: "Get your zip file immediately after purchase." }
          ].map((feature, idx) => (
              <motion.div variants={fadeUp} key={idx} className="flex flex-col items-center text-center p-8 lg:p-10 rounded-[2.5rem] bg-white/60 backdrop-blur-sm shadow-sm border border-white hover:shadow-xl hover:shadow-[#ffdec7]/50 transition-all duration-300 group hover:-translate-y-2">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-[#ffeddb] to-[#ffdec7]/40 group-hover:from-[#ffdec7] group-hover:to-[#efa3a0]/30 transition-colors flex items-center justify-center shrink-0 mb-6 transform group-hover:-translate-y-2 group-hover:rotate-6 duration-300 border border-white shadow-sm">
                      <feature.icon className="w-8 h-8 text-[#8b597b]" strokeWidth={1.5} />
                  </div>
                  <div>
                      <h4 className="font-bold text-[#493129] text-xl mb-3 font-serif">{feature.title}</h4>
                      <p className="text-[15px] text-[#493129]/60 leading-relaxed font-medium">{feature.desc}</p>
                  </div>
              </motion.div>
          ))}
      </motion.div>
  </div>
);

const Footer = () => (
  <footer className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 mt-10">
     <div className="bg-[#493129] rounded-[3rem] sm:rounded-[4rem] overflow-hidden shadow-2xl shadow-[#493129]/30 relative border border-[#493129]">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-full max-w-2xl h-[500px] bg-[#8b597b] rounded-full blur-[150px] opacity-30 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full max-w-xl h-[400px] bg-[#efa3a0] rounded-full blur-[120px] opacity-20 transform -translate-x-1/4 translate-y-1/3 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M20 20.5V18H0v-2h20v-2.5L25 17l-5 3.5zm0-10V8H0V6h20V3.5L25 7l-5 3.5zm0 20v-2.5H0v-2h20v-2.5L25 27l-5 3.5z\\' fill=\\'%23ffffff\\' fill-opacity=\\'0.03\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')] opacity-50"></div>

        <div className="px-6 py-16 md:px-16 md:py-24 flex flex-col lg:flex-row justify-between items-center gap-12 border-b border-white/10 relative z-10">
           <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto text-center sm:text-left">
               <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#8b597b] to-[#efa3a0] flex items-center justify-center shrink-0 shadow-2xl border-4 border-white/10 transform -rotate-3 hover:rotate-0 transition-transform">
                  <Mail className="w-10 h-10 text-white" strokeWidth={1.5} />
               </div>
               <div>
                  <h3 className="text-4xl md:text-5xl font-serif text-white mb-4 tracking-tight">Join our newsletter</h3>
                  <p className="text-white/70 text-base md:text-lg max-w-md">Get notified about new template releases and exclusive discount codes directly to your inbox.</p>
               </div>
           </div>
           
           <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 sm:gap-0 relative z-10 p-2 sm:bg-white/10 sm:backdrop-blur-xl sm:rounded-full sm:border sm:border-white/20">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="px-8 py-5 bg-white/10 sm:bg-transparent border border-white/20 sm:border-none text-white w-full lg:w-80 rounded-full sm:rounded-none focus:outline-none placeholder:text-white/50 transition-colors" 
              />
              <button className="px-10 py-5 bg-[#efa3a0] hover:bg-[#ffdec7] transition-all duration-300 text-[#493129] font-bold rounded-full shrink-0 shadow-lg hover:shadow-[#efa3a0]/30 transform hover:-translate-y-1 sm:hover:translate-y-0">
                Subscribe Now
              </button>
           </div>
        </div>
        
        <div className="px-6 py-12 md:px-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 relative z-10">
            {[
              { icon: ShieldCheck, title: "Secure Checkout", desc: "Stripe integration" },
              { icon: CreditCard, title: "Multiple Payment", desc: "Cards, PayPal & more" },
              { icon: RefreshCw, title: "Updates", desc: "Free lifetime updates" },
              { icon: CheckCircle, title: "Premium Design", desc: "Crafted with love" },
            ].map((item, i) => (
                <div key={i} className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors flex items-center justify-center border border-white/10">
                      <item.icon className="w-6 h-6 text-[#ffdec7]" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h5 className="text-white text-base font-bold mb-1 font-serif">{item.title}</h5>
                        <p className="text-white/50 text-sm">{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="bg-black/20 text-center py-8 text-white/40 text-sm relative z-10 flex flex-col md:flex-row items-center justify-between px-6 md:px-16 border-t border-white/5">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-[#efa3a0] text-white rounded-md flex items-center justify-center font-serif text-xs font-bold">A</div>
              <span className="font-bold text-[#ffdec7] font-serif">Canvas Builds.</span>
            </div>
            <p>© 2026 Canvas Builds. All rights reserved. Crafted with love.</p>
            <div className="flex gap-4 mt-4 md:mt-0 text-white/60">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
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
        <PromoBanners />
        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  );
}
`;

fs.writeFileSync('src/App.tsx', code);
