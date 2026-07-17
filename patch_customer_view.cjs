const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  `              <div className="flex items-center gap-2">
                <img 
                  src={activeTenant.logoUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=80'} 
                  alt={activeTenant.name} 
                  className="h-8 w-8 rounded-full border border-white/20 object-cover"`,
  `              <div className="flex items-center gap-2 min-w-0">
                <img 
                  src={activeTenant.logoUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=80'} 
                  alt={activeTenant.name} 
                  className="h-8 w-8 shrink-0 rounded-full border border-white/20 object-cover"`
);

code = code.replace(
  `                <div className="flex flex-col">
                  <span className="font-sans font-extrabold text-sm leading-tight">{activeTenant.name}</span>`,
  `                <div className="flex flex-col min-w-0">
                  <span className="font-sans font-extrabold text-sm leading-tight truncate">{activeTenant.name}</span>`
);

code = code.replace(
  '              <div className="flex items-center gap-1 shrink-0">',
  '              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">'
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
