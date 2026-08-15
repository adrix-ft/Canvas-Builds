const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const ProductCard = \(\{[\s\S]*?<\/motion\.div>\s*\);\s*\};/m;

const newProductCard = `const ProductCard = ({
  product,
  onClick,
}: {
  product: (typeof PRODUCTS)[0];
  onClick: () => void;
}) => {
  const { addToCart, addToast } = useAppContext();
  return (
    <motion.div
      variants={fadeUp}
      onClick={onClick}
      className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1 border border-black/[0.04]"
    >
      <div
        className={\`relative aspect-[4/5] bg-gradient-to-br \${product.gradient} flex items-center justify-center overflow-hidden\`}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 20 20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Ccircle cx=\\'2\\' cy=\\'2\\' r=\\'1\\' fill=\\'%23ffffff\\' fill-opacity=\\'0.4\\'/%3E%3C/svg%3E')] opacity-50"></div>
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--color-text-primary)] shadow-lg transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
            <Play className="w-5 h-5 ml-1 fill-current" />
          </div>
        </div>
        <div className="text-[4rem] sm:text-[5.5rem] drop-shadow-xl transform group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 relative z-0">
          {product.emoji}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/20 rounded-[100%] blur-md -z-10 group-hover:opacity-50 transition-opacity"></div>
        </div>
        {product.tag && (
          <div className="absolute top-4 left-4 bg-white text-[var(--color-text-primary)] text-[10px] font-bold px-3 py-1 rounded-full z-20 shadow-sm border border-black/5 uppercase tracking-wider">
            {product.tag}
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToast("Added to favorites!", "info");
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-[var(--color-text-primary)]/40 hover:text-[var(--color-accent-pink)] transition-colors z-30 border border-black/5"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>
      <div className="px-5 py-5 flex-1 flex flex-col bg-white z-20 relative">
        <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-text-primary)]/50 mb-2">
          {product.category}
        </p>
        <h3 className="font-serif font-bold text-[var(--color-text-primary)] mb-3 text-lg leading-tight group-hover:text-[var(--color-accent-pink)] transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mt-auto">
          <span className="font-bold text-[var(--color-text-primary)] text-xl leading-none">
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs font-bold text-[var(--color-text-primary)]/40 line-through">
              {product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};`;

code = code.replace(regex, newProductCard);
fs.writeFileSync('src/App.tsx', code);
