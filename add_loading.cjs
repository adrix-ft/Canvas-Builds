const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldApp = `export default function App() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] font-sans selection:bg-[var(--color-bg-secondary)] selection:text-[var(--color-text-primary)] overflow-x-hidden text-[var(--color-text-primary)]">
      <Navbar />`;
const newApp = `const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-[var(--color-bg-primary)] flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-[4rem] mb-4"
      >
        💝
      </motion.div>
      <motion.div
        className="w-48 h-1 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden"
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          onAnimationComplete={onComplete}
          className="w-full h-full bg-[var(--color-accent-pink)] rounded-full"
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-[var(--color-accent-purple)] font-bold mt-4 font-serif tracking-widest uppercase text-sm"
      >
        Crafting Love...
      </motion.p>
    </motion.div>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] font-sans selection:bg-[var(--color-bg-secondary)] selection:text-[var(--color-text-primary)] overflow-x-hidden text-[var(--color-text-primary)]">
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      <Navbar />`;
code = code.replace(oldApp, newApp);
fs.writeFileSync('src/App.tsx', code);
console.log('Added loading screen');
