const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Revert App mouse pos state
code = code.replace(/const \[mousePos, setMousePos\] = useState\(\{ x: 0, y: 0 \}\);\s*useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);\s*/, '');

// 2. Revert BackgroundDecorations
code = code.replace(/const BackgroundDecorations = \(\{ mousePos \}: any\) => \{/, 'const BackgroundDecorations = () => {');
code = code.replace(/animate=\{\{ x: \(Math.random\(\) - 0\.5\) \* 100 \+ \(mousePos\?\.x \|\| 0\), y: \(Math.random\(\) - 0\.5\) \* 100 \+ \(mousePos\?\.y \|\| 0\) \} \/\* dummy update \*\/\}/g, 'animate={{}}');
// Wait, before the upgrade it was:
//          initial={{ 
//             x: Math.random() * ...
code = code.replace(/<BackgroundDecorations mousePos=\{mousePos\} \/>/g, '<BackgroundDecorations />');

// 3. Revert Hero
code = code.replace(/const Hero = \(\{ mousePos \}: \{ mousePos\?: \{ x: number, y: number \} \}\) => \{/, 'const Hero = () => {');
code = code.replace(/<Hero mousePos=\{mousePos\} \/>/g, '<Hero />');
code = code.replace(/style=\{\{ y: y1, x: mousePos \? -mousePos\.x \* 2 : 0 \}\}/g, 'style={{ y: y1 }}');
code = code.replace(/style=\{\{ y: y2, x: mousePos \? mousePos\.x \* 2 : 0 \}\}/g, 'style={{ y: y2 }}');

// 4. Revert TiltCard -> motion.div
code = code.replace(/const TiltCard = \(\{ children, onClick, className, variants \}: any\) => \{[\s\S]*?return \([\s\S]*?<\/motion\.div>\n  \);\n\};/, '');
code = code.replace(/<TiltCard/g, '<motion.div');
code = code.replace(/<\/TiltCard>/g, '</motion.div>');
code = code.replace(/<div style=\{\{ transform: "translateZ\(30px\)" \}\} className="h-full flex flex-col pointer-events-none">[\s\S]*?<\/div>/g, '');

fs.writeFileSync('src/App.tsx', code);
console.log('Reverted');
