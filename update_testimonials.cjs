const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Reduce fade feather
code = code.replace(
  /<div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-\[var\(--color-bg-primary\)\] to-transparent z-10 pointer-events-none"><\/div>/g,
  '<div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-[var(--color-bg-primary)] to-transparent z-10 pointer-events-none"></div>'
);
code = code.replace(
  /<div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-\[var\(--color-bg-primary\)\] to-transparent z-10 pointer-events-none"><\/div>/g,
  '<div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[var(--color-bg-primary)] to-transparent z-10 pointer-events-none"></div>'
);

// Remove once: true
code = code.replace(
  /viewport=\{\{ once: true, margin: "-100px" \}\}/g,
  'viewport={{ once: false, margin: "-100px" }}'
);
code = code.replace(
  /viewport=\{\{ once: true, margin: "-50px" \}\}/g,
  'viewport={{ once: false, margin: "-50px" }}'
);

fs.writeFileSync('src/App.tsx', code);
