const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Title size
code = code.replace(
  /className="text-\[2\.75rem\] leading-\[1\.15\] sm:text-6xl lg:text-\[5\.5rem\] sm:leading-\[1\.1\] font-serif text-\[var\(--color-text-primary\)\] tracking-tight"/g,
  'className="text-4xl leading-[1.2] sm:text-6xl lg:text-[5.5rem] sm:leading-[1.1] font-serif text-[var(--color-text-primary)] tracking-tight"'
);

// Gap
code = code.replace(
  /className="flex flex-col items-center text-center gap-5 sm:gap-8"/g,
  'className="flex flex-col items-center text-center gap-6 sm:gap-8"'
);

// Button width
code = code.replace(
  /className="mt-4 bg-\[var\(--color-text-primary\)\] text-white px-10 py-4 rounded-full font-medium transition-all duration-300 flex items-center gap-3 hover:bg-\[var\(--color-accent-purple\)\] hover:shadow-lg hover:-translate-y-0\.5"/g,
  'className="mt-4 bg-[var(--color-text-primary)] text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center w-full sm:w-auto gap-3 hover:bg-[var(--color-accent-purple)] hover:shadow-lg hover:-translate-y-0.5"'
);

// Padding top and min-height
code = code.replace(
  /className="relative overflow-hidden min-h-\[85vh\] flex items-center justify-center w-full"/g,
  'className="relative overflow-hidden min-h-[90vh] sm:min-h-[85vh] flex items-center justify-center w-full pt-10 sm:pt-0"'
);

code = code.replace(
  /className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-24 sm:pt-20"/g,
  'className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-28 sm:pt-20"'
);

fs.writeFileSync('src/App.tsx', code);
