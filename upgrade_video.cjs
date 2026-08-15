const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldVideoPlaceholder = `<div className="absolute inset-0 top-8 sm:top-10 bg-cover bg-center opacity-40 transition-opacity duration-700 group-hover:opacity-60" style={{ backgroundImage: \`url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23493129' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")\` }}>
                   <div className="w-full h-full bg-gradient-to-br from-[#efa3a0]/30 to-[#8b597b]/30"></div>
                </div>`;
                
const newVideoPlaceholder = `<div className="absolute inset-0 top-8 sm:top-10 bg-[#ffdec7]/20 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#efa3a0]/30 to-[#8b597b]/30 transition-opacity duration-700 group-hover:opacity-80"></div>
                   
                   {/* Animated Mock Content */}
                   <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-40 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-105">
                      <div className="w-24 sm:w-32 h-3 sm:h-4 bg-white/50 rounded-full"></div>
                      <div className="w-16 sm:w-20 h-3 sm:h-4 bg-white/50 rounded-full"></div>
                      <div className="w-20 sm:w-24 h-20 sm:h-24 bg-white/30 rounded-2xl mt-4 border border-white/50"></div>
                   </div>
                   
                   {/* Continuous floating shapes in the screen */}
                   {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-xl sm:text-3xl"
                        initial={{ y: 200, x: 20 + i * 40, opacity: 0 }}
                        animate={{ y: -50, opacity: [0, 1, 0] }}
                        transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
                      >
                        {['❤️', '✨', '🥺'][i % 3]}
                      </motion.div>
                   ))}
                </div>`;

if (code.includes(oldVideoPlaceholder)) {
    code = code.replace(oldVideoPlaceholder, newVideoPlaceholder);
    fs.writeFileSync('src/App.tsx', code);
    console.log('Video placeholder upgraded successfully');
} else {
    console.log('Video placeholder not found, might have been modified');
}
