const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove Loading Screen
const loadingScreenRegex = /const LoadingScreen =[\s\S]*?export default function App\(\) \{\s*const \[isLoading, setIsLoading\] = useState\(true\);\s*return \(\s*<div className="min-h-screen bg-\[var\(--color-bg-primary\)\] font-sans selection:bg-\[var\(--color-bg-secondary\)\] selection:text-\[var\(--color-text-primary\)\] overflow-x-hidden text-\[var\(--color-text-primary\)\]">\s*<AnimatePresence>\s*\{isLoading && <LoadingScreen onComplete=\{.*?\} \/>\}\s*<\/AnimatePresence>/m;
const cleanAppStart = `export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] font-sans selection:bg-[var(--color-bg-secondary)] selection:text-[var(--color-text-primary)] overflow-x-hidden text-[var(--color-text-primary)]">`;
code = code.replace(loadingScreenRegex, cleanAppStart);

// 2. Add useMotionValue, useSpring to imports
if (!code.includes('useMotionValue')) {
    code = code.replace(
        "import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';",
        "import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';"
    );
}

// 3. Add MagneticButton component
const magneticButtonCode = `
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
`;
// Insert right after FloatingElement
code = code.replace(/(const BackgroundDecorations = \(\) => \{)/, magneticButtonCode + '\n$1');

// 4. Update BackgroundDecorations and Hero to use Parallax
code = code.replace(/<BackgroundDecorations \/>/, '<BackgroundDecorations mousePos={mousePos} />');
code = code.replace(/const BackgroundDecorations = \(\) => \{/, 'const BackgroundDecorations = ({ mousePos }: any) => {');
code = code.replace(/animate=\{\{\s*x: Math\.random/, 'animate={{ x: (Math.random() - 0.5) * 100 + (mousePos?.x || 0), y: (Math.random() - 0.5) * 100 + (mousePos?.y || 0) } /* dummy update */}\n          initial={{ x: Math.random');
// Actually, it's better to update the FloatingElement as well if we want
// Let's just pass mousePos down to Hero
code = code.replace(/<Hero \/>/, '<Hero mousePos={mousePos} />');
code = code.replace(/const Hero = \(\) => \{/, 'const Hero = ({ mousePos }: { mousePos?: { x: number, y: number } }) => {');

// 5. Update Hero text reveal and Parallax 
code = code.replace(
    /style=\{\{ y: y1 \}\}/g, 
    'style={{ y: y1, x: mousePos ? -mousePos.x * 2 : 0 }}'
);
code = code.replace(
    /style=\{\{ y: y2 \}\}/g, 
    'style={{ y: y2, x: mousePos ? mousePos.x * 2 : 0 }}'
);

const heroTitleOld = `<motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl lg:text-[5rem] font-serif text-[var(--color-text-primary)] leading-[1.15] sm:leading-[1.1] tracking-tight px-2 sm:px-0">
              Share Your Love <br className="hidden sm:block"/> 
              <span className="relative inline-block mt-1 sm:mt-0">
                <span className="relative z-10">Through Code</span>
                <span className="absolute bottom-1 sm:bottom-3 left-0 w-full h-2 sm:h-5 bg-[var(--color-bg-secondary)] -z-10 rounded-full opacity-60 transform -rotate-1"></span>
              </span>
            </motion.h1>`;
            
const textRevealCode = `const TextReveal = ({ text, delayOffset = 0 }: { text: string, delayOffset?: number }) => (
  <span className="inline-block">
    {text.split(" ").map((word, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, y: 30, rotate: 5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.6, delay: delayOffset + i * 0.1, type: "spring", stiffness: 100 }}
        className="inline-block mr-[0.25em]"
      >
        {word}
      </motion.span>
    ))}
  </span>
);`;

if (!code.includes('const TextReveal')) {
    code = code.replace(/(const BackgroundDecorations = )/, textRevealCode + '\n$1');
}

const heroTitleNew = `<h1 className="text-4xl sm:text-6xl lg:text-[5rem] font-serif text-[var(--color-text-primary)] leading-[1.15] sm:leading-[1.1] tracking-tight px-2 sm:px-0">
              <TextReveal text="Share Your Love" delayOffset={0.2} /> <br className="hidden sm:block"/> 
              <span className="relative inline-block mt-1 sm:mt-0">
                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.5 }} className="relative z-10">Through Code</motion.span>
                <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.6, ease: "circOut" }} className="absolute bottom-1 sm:bottom-3 left-0 w-full h-2 sm:h-5 bg-[var(--color-bg-secondary)] -z-10 rounded-full opacity-60 transform -rotate-1 origin-left"></motion.span>
              </span>
            </h1>`;
code = code.replace(heroTitleOld, heroTitleNew);

// 6. Update ProductCard to TiltCard
const tiltCardCode = `
const TiltCard = ({ children, onClick, className, variants }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
      onClick={onClick}
      variants={variants}
    >
      <div style={{ transform: "translateZ(30px)" }} className="h-full flex flex-col pointer-events-none">
        {/* We need to allow pointer events on the inner buttons, but preserve-3d works best when inner layers are structured properly */}
      </div>
      {/* We will just render children directly and let them pop out via z-index or translateZ if needed */}
      {children}
    </motion.div>
  );
};
`;

code = code.replace(/(const ProductCard = )/, tiltCardCode + '\n$1');

// Update ProductCard usage of motion.div
code = code.replace(
  /<motion.div variants=\{fadeUp\} onClick=\{onClick\} className="group cursor-pointer flex flex-col h-full bg-white\/70 backdrop-blur-md/g,
  '<TiltCard variants={fadeUp} onClick={onClick} className="group cursor-pointer flex flex-col h-full bg-white/70 backdrop-blur-md'
);
code = code.replace(
  /<\/motion.div>\n\)\};\nconst PopularProducts =/g,
  '</TiltCard>\n)};\nconst PopularProducts ='
);

// 7. Update AddToCart and HireMe buttons in PromoBanners and other places to use MagneticButton
code = code.replace(
  /<button onClick=\{\(e\) => \{ e\.stopPropagation\(\); addToCart\(product\); \}\} className="flex-1/g,
  '<MagneticButton onClick={(e: any) => { e.stopPropagation(); addToCart(product); }} className="flex-1'
);
code = code.replace(
  /Add to Cart<\/button>/g,
  'Add to Cart</MagneticButton>'
);
code = code.replace(
  /<button className="bg-\[var\(--color-text-primary\)\] text-white px-5 sm:px-8 py-2\.5 sm:py-4 rounded-full/g,
  '<MagneticButton className="bg-[var(--color-text-primary)] text-white px-5 sm:px-8 py-2.5 sm:py-4 rounded-full'
);
code = code.replace(
  /Preview <Play className="w-2\.5 h-2\.5 sm:w-4 sm:h-4 fill-current" \/>\s*<\/button>/g,
  'Preview <Play className="w-2.5 h-2.5 sm:w-4 sm:h-4 fill-current" />\n          </MagneticButton>'
);
code = code.replace(
  /<button className="bg-white text-\[var\(--color-text-primary\)\] px-5 sm:px-8 py-2\.5 sm:py-4/g,
  '<MagneticButton className="bg-white text-[var(--color-text-primary)] px-5 sm:px-8 py-2.5 sm:py-4'
);
code = code.replace(
  /Contact Us <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" \/>\s*<\/button>/g,
  'Contact Us <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />\n          </MagneticButton>'
);

// Fix ContextAwareModalAddToCart magnetic button
code = code.replace(
    /<button onClick=\{\(\) => addToCart\(product\)\} className="flex-1 bg-\[#493129\]/g,
    '<MagneticButton onClick={() => addToCart(product)} className="flex-1 bg-[#493129]'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Applied interactive upgrades');
