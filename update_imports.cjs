const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import \{\s*BrowserRouter as Router,\s*Routes,\s*Route,\s*useNavigate,\s*Link,\s*\} from "react-router-dom";/, 'import { BrowserRouter as Router, Routes, Route, useNavigate, Link, useLocation } from "react-router-dom";');

if (!code.includes('useLocation')) {
    code = code.replace(/useNavigate,\s*Link,/, 'useNavigate, Link, useLocation,');
}

const scrollHandlerCode = `
const ScrollHandler = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};
`;

if (!code.includes('const ScrollHandler = () => {')) {
    code = code.replace(/export default function App\(\) \{/, scrollHandlerCode + '\nexport default function App() {');
}

code = code.replace(/<Router>\s*<div/, '<Router>\n      <ScrollHandler />\n      <div');

fs.writeFileSync('src/App.tsx', code);
