const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const backgroundHearts = `
const BackgroundDecorations = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ 
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
            y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 100,
            opacity: 0.1 + Math.random() * 0.3,
            scale: 0.5 + Math.random() * 1.5,
            rotate: Math.random() * 360
          }}
          animate={{
            y: -100,
            rotate: Math.random() * 360 + 360,
          }}
          transition={{
            duration: 15 + Math.random() * 25,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * -30,
          }}
        >
          {['❤️', '✨', '🌸', '💖', '💌'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}
    </div>
  );
};
`;

if (!code.includes('const BackgroundDecorations')) {
   code = code.replace('const Navbar = () => {', backgroundHearts + '\n' + 'const Navbar = () => {');
}

if (code.includes('className="relative overflow-hidden"')) {
   code = code.replace('className="relative overflow-hidden">', 'className="relative overflow-hidden">\n      <BackgroundDecorations />');
}

fs.writeFileSync('src/App.tsx', code);
console.log('Parallax added successfully');
