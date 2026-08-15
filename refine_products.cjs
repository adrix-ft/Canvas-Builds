const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const newPopularProducts = `const PopularProducts = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  
  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 relative" id="templates">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-10 gap-4 sticky top-14 sm:top-16 z-30 bg-[#ffeddb]/90 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
           <div>
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <span className="w-5 sm:w-8 h-px bg-[#efa3a0]"></span>
                <span className="text-[#efa3a0] font-bold text-[9px] sm:text-xs tracking-widest uppercase">Templates</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#493129]">Find the Perfect Gift</h2>
           </div>
           
           {/* Categories */}
           <div className="flex overflow-x-auto hide-scrollbar w-full md:w-auto gap-2 pb-2 md:pb-0 snap-x">
             {CATEGORIES.map(cat => (
               <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={\`snap-start px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 \${activeCategory === cat ? 'bg-[#493129] text-white shadow-lg shadow-[#493129]/20 scale-105' : 'bg-white/80 text-[#493129]/60 hover:bg-white hover:text-[#493129] border border-[#ffdec7]/50'}\`}
               >
                 {cat}
               </button>
             ))}
           </div>
        </div>
        
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 min-h-[400px]">
           <AnimatePresence mode="popLayout">
             {filteredProducts.map(p => (
                <motion.div layout initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: -20 }} transition={{ duration: 0.3, type: "spring" }} key={p.id}>
                  <ProductCard product={p} onClick={() => setSelectedProduct(p)} />
                </motion.div>
             ))}
           </AnimatePresence>
        </motion.div>
        
        {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
};`;

// replace PopularProducts
code = code.replace(/const PopularProducts = \(\) => \{[\s\S]*?\{selectedProduct && <ProductModal product=\{selectedProduct\} onClose=\{\(\) => setSelectedProduct\(null\)\} \/>\}\s*<\/div>\s*\);\s*\};/, newPopularProducts);

fs.writeFileSync('src/App.tsx', code);
console.log('PopularProducts updated successfully');
