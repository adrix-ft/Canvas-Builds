const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const LandingPage = \(\) => \(\s*<div className="flex flex-col items-center w-full">\s*<Hero \/>\s*<\/div>\s*\);/m;
const replacement = `const LandingPage = () => (
  <div className="flex flex-col items-center w-full">
    <Hero />
    <Testimonials />
  </div>
);`;

code = code.replace(regex, replacement);
code = code.replace(/path: "\/reviews"/g, 'path: "/#reviews"');

fs.writeFileSync('src/App.tsx', code);
