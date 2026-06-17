const fs = require('fs');
let content = fs.readFileSync('src/app/pages/Escaner.jsx', 'utf8');

const reps = [
  [/bg-gray-950/g, 'bg-gray-50 dark:bg-gray-950'],
  [/bg-gray-900/g, 'bg-white dark:bg-gray-900'],
  [/bg-gray-800/g, 'bg-gray-100 dark:bg-gray-800'],
  [/bg-gray-700/g, 'bg-gray-200 dark:bg-gray-700'],
  [/border-gray-800/g, 'border-gray-200 dark:border-gray-800'],
  [/border-gray-700/g, 'border-gray-300 dark:border-gray-700'],
  [/text-white/g, 'text-gray-900 dark:text-white'],
  [/text-gray-400/g, 'text-gray-500 dark:text-gray-400'],
  [/text-gray-300/g, 'text-gray-600 dark:text-gray-300']
];

reps.forEach(([regex, replacement]) => {
  content = content.replace(regex, replacement);
});

if (!content.includes('Sun, Moon')) {
  content = content.replace(/Keyboard, X,/g, 'Keyboard, X, Sun, Moon,');
}

content = content.replace('const [lastCode, setLastCode]   = useState(\\'\\')', 'const [lastCode, setLastCode]   = useState(\\'\\')\\n  const [isDark, setIsDark]       = useState(true)');

const headerCode = '<div className="flex items-center justify-between">';
const toggleButton = `
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-between flex-1">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Escáner</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">QR, EAN-13, CODE128 y más</p>
            </div>
            
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 mr-3 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              title="Alternar tema"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
`;

// Replace the old header
content = content.replace(/<div className="flex items-center justify-between">\s*<div>\s*<h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Escáner<\/h1>\s*<p className="text-gray-500 dark:text-gray-400 text-sm mt-0\.5">QR, EAN-13, CODE128 y más<\/p>\s*<\/div>/, toggleButton);

content = content.replace('return (\n    <div className="absolute', 'return (\n    <div className={isDark ? \\'dark\\' : \\'\\'}><div className="absolute');
content = content.replace(/\n  \)\n}\s*$/, '\n    </div>\n  )\n}');

fs.writeFileSync('src/app/pages/Escaner.jsx', content);
console.log('Escaner.jsx updated!');
