const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf-8');

code = code.replace(
  /<span className="text-xl font-extrabold tracking-tight text-slate-900">Dinex<\/span>\s*<\/button>/g,
  '<span className="text-xl font-extrabold tracking-tight text-slate-900">Dinex</span>\n              </a>'
);

code = code.replace(
  /<a href="#demo-video"\s*onClick=\{handleLogin\}\s*disabled=\{isLoginLoading\}\s*className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"\s*>\s*\{isLoginLoading \? 'Logging in\.\.\.' : 'Login'\}\s*<\/a>/g,
  "<button onClick={handleLogin} disabled={isLoginLoading} className=\"text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors\">{isLoginLoading ? 'Logging in...' : 'Login'}</button>"
);

code = code.replace(
  /<a href="#demo-video" onClick=\{\(\) => setMobileMenuOpen\(!mobileMenuOpen\)\} className="p-2 text-slate-600">\s*\{mobileMenuOpen \? <X className="h-6 w-6" \/> : <Menu className="h-6 w-6" \/>\}\s*<\/button>/g,
  "<button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className=\"p-2 text-slate-600\">\n                {mobileMenuOpen ? <X className=\"h-6 w-6\" /> : <Menu className=\"h-6 w-6\" />}\n              </button>"
);

fs.writeFileSync('src/views/LandingPageView.tsx', code);
