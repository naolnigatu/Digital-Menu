const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const bellHtml = `
              <Bell className="h-5 w-5" />
`;

const newIconsHtml = `
            {currentUser?.role === 'customer' && (
              <button 
                onClick={() => {
                  // Usually customer goes to CustomerView, but if they want favorites, 
                  // we can trigger an event or they can go to their dashboard.
                  // For now, let's just make it dispatch a custom event.
                  window.dispatchEvent(new CustomEvent('open-customer-dashboard'));
                }}
                className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-rose-500 transition-colors mr-2"
                title="My Favorites"
              >
                <Heart className="h-5 w-5" />
              </button>
            )}
            <button 
`;

code = code.replace(
  /<button \n              id="nav-notif-btn"/,
  "            <button \n              onClick={() => window.dispatchEvent(new CustomEvent('open-customer-dashboard'))}\n              className=\"relative rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-rose-500 transition-colors mr-2\"\n              title=\"My Favorites\"\n            >\n              <Heart className=\"h-5 w-5\" />\n            </button>\n            <button \n              id=\"nav-notif-btn\""
);

fs.writeFileSync('src/components/Navbar.tsx', code);
