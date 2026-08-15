const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add HowItWorks
const howItWorksCode = `
const HowItWorks = () => (
  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
    <div className="text-center mb-10 sm:mb-16">
       <div className="flex items-center justify-center gap-2 mb-3">
         <span className="w-8 h-px bg-[#efa3a0]"></span>
         <span className="text-[#efa3a0] font-bold text-xs tracking-widest uppercase">Simple Process</span>
         <span className="w-8 h-px bg-[#efa3a0]"></span>
       </div>
       <h2 className="text-3xl sm:text-4xl font-serif text-[#493129] mb-4">How It Works</h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
       {/* Connecting line for desktop */}
       <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-[#efa3a0]/50 to-transparent z-0 border-t-2 border-dashed border-[#efa3a0]/30"></div>
       
       {[
         { step: "01", title: "Choose a Template", desc: "Select the perfect design for your special moment and complete the secure checkout.", icon: ShoppingCart },
         { step: "02", title: "Customize & Edit", desc: "Follow our easy PDF guide to replace text and images with your own memories.", icon: Gift },
         { step: "03", title: "Publish & Share", desc: "Host it for free using our instructions and share the link with your loved one!", icon: ArrowRight }
       ].map((item, idx) => (
         <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: idx * 0.2 }} key={idx} className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-xl shadow-[#ffdec7]/50 border-4 border-[#ffeddb] flex items-center justify-center mb-6 relative group hover:scale-110 transition-transform duration-300">
               <div className="absolute inset-0 bg-gradient-to-br from-[#ffdec7] to-[#ffeddb] rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
               <item.icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#8b597b] relative z-10" />
               <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#efa3a0] rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-white">{item.step}</div>
            </div>
            <h4 className="text-xl font-bold font-serif text-[#493129] mb-3">{item.title}</h4>
            <p className="text-[#493129]/70 font-medium leading-relaxed px-4">{item.desc}</p>
         </motion.div>
       ))}
    </div>
  </div>
);
`;

const floatingActionCode = `
const FloatingAction = () => {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setShow(latest > 300);
    });
  }, [scrollY]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.5 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          exit={{ opacity: 0, y: 50, scale: 0.5 }}
          className="fixed bottom-6 right-6 z-40 md:hidden flex flex-col gap-3"
        >
          <button className="w-14 h-14 bg-[#efa3a0] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#efa3a0]/50 border-2 border-white hover:scale-110 transition-transform relative group">
             <ShoppingCart className="w-6 h-6" />
             <span className="absolute -top-2 -right-2 bg-[#8b597b] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm border border-white">3</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
`;

// Insert after PromoBanners
if (!code.includes('const HowItWorks')) {
    code = code.replace('const FAQSection = () => {', howItWorksCode + '\n' + 'const FAQSection = () => {');
}

if (!code.includes('const FloatingAction')) {
    code = code.replace('const Footer = () => (', floatingActionCode + '\n' + 'const Footer = () => (');
}

// Update App return
const appReturnOld = `
      <main>
        <Hero />
        <TrustBadges />
        <PopularProducts />
        <PromoBanners />
        <WhyChooseUs />
      </main>
`;
const appReturnNew = `
      <main>
        <Hero />
        <TrustBadges />
        <PopularProducts />
        <HowItWorks />
        <PromoBanners />
        <Testimonials />
        <FAQSection />
        <WhyChooseUs />
      </main>
      <FloatingAction />
`;

// we need to make sure we replace the main block correctly, it might have been modified.
// Let's do a more robust replace for the main block.
code = code.replace(/<main>[\s\S]*?<\/main>/, appReturnNew.trim());

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx updated successfully');
