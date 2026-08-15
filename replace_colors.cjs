const fs = require('fs');

function replaceColors(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/#ffeddb/g, 'var(--color-bg-primary)');
  code = code.replace(/#ffdec7/g, 'var(--color-bg-secondary)');
  code = code.replace(/#493129/g, 'var(--color-text-primary)');
  code = code.replace(/#efa3a0/g, 'var(--color-accent-pink)');
  code = code.replace(/#8b597b/g, 'var(--color-accent-purple)');
  fs.writeFileSync(file, code);
}

replaceColors('src/App.tsx');
replaceColors('src/NewComponents.tsx');
console.log('Colors replaced with CSS variables!');
