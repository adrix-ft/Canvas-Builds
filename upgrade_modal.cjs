const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldModalVisual = `<div className={\`w-full md:w-1/2 bg-gradient-to-br \${product.gradient} p-8 flex flex-col items-center justify-center relative min-h-[250px] md:min-h-full\`}>
             <button onClick={onClose} className="absolute top-4 left-4 w-8 h-8 bg-white/50 hover:bg-white rounded-full flex items-center justify-center md:hidden transition-colors"><X className="w-4 h-4 text-[#493129]" /></button>
             <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 20 20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Ccircle cx=\\'2\\' cy=\\'2\\' r=\\'1\\' fill=\\'%23ffffff\\' fill-opacity=\\'0.4\\'/%3E%3C/svg%3E')] opacity-50"></div>
             <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="text-[6rem] md:text-[8rem] drop-shadow-2xl relative z-10">{product.emoji}</motion.div>
             <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#efa3a0] shadow-xl absolute z-20 cursor-pointer hover:scale-110 transition-transform">
                <Play className="w-6 h-6 ml-1 fill-current" />
             </div>
          </div>`;
          
const newModalVisual = `<div className={\`w-full md:w-1/2 bg-gradient-to-br \${product.gradient} p-8 flex flex-col items-center justify-center relative min-h-[300px] md:min-h-full overflow-hidden group\`}>
             <button onClick={onClose} className="absolute top-4 left-4 w-8 h-8 bg-white/50 hover:bg-white rounded-full flex items-center justify-center md:hidden transition-colors z-50"><X className="w-4 h-4 text-[#493129]" /></button>
             
             {/* Simulated Phone Screen inside Modal */}
             <div className="w-48 sm:w-56 h-[80%] max-h-[400px] bg-white/20 backdrop-blur-md rounded-[2rem] border-4 border-white/40 shadow-2xl relative overflow-hidden flex flex-col items-center p-4">
                 <div className="w-12 h-3 bg-white/50 rounded-full mb-6 mt-2"></div>
                 <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="text-[4rem] sm:text-[5rem] drop-shadow-2xl relative z-10 mb-4">{product.emoji}</motion.div>
                 <div className="w-full space-y-2 mt-auto">
                    <div className="w-[80%] h-2 bg-white/40 rounded-full mx-auto"></div>
                    <div className="w-[60%] h-2 bg-white/40 rounded-full mx-auto"></div>
                 </div>
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10 backdrop-blur-sm z-30">
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center text-[#efa3a0] shadow-xl cursor-pointer hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-1 fill-current" />
                    </div>
                 </div>
             </div>
             
             {/* Floating ambient elements */}
             {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl opacity-50 pointer-events-none"
                  initial={{ y: 20, x: -50 + i * 50 }}
                  animate={{ y: -20, opacity: [0.2, 0.8, 0.2] }}
                  transition={{ duration: 2 + i, repeat: Infinity, ease: "easeInOut" }}
                >
                  ✨
                </motion.div>
             ))}
          </div>`;

if (code.includes('md:min-h-full`}>')) {
    // using substring replace to be safe
    const startIndex = code.indexOf('<div className={`w-full md:w-1/2 bg-gradient-to-br ${product.gradient}');
    const endIndex = code.indexOf('          {/* Content Side */}');
    
    if (startIndex !== -1 && endIndex !== -1) {
        code = code.substring(0, startIndex) + newModalVisual + "\n" + code.substring(endIndex);
        fs.writeFileSync('src/App.tsx', code);
        console.log('Modal visual upgraded successfully');
    } else {
        console.log('Could not find start or end index');
    }
} else {
    console.log('Modal visual not found');
}
