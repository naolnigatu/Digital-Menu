const fs = require('fs');
let code = fs.readFileSync('src/views/BusinessOwnerView.tsx', 'utf8');

const itemReplace = `                              <span className="font-extrabold text-slate-900">{item.name}</span>
                              {item.portionName && <span className="ml-2 text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 rounded">Portion: {item.portionName}</span>}`;

code = code.replace(
  /\<span className="font-extrabold text-slate-900"\>\{item\.name\}\<\/span\>/g,
  itemReplace
);

fs.writeFileSync('src/views/BusinessOwnerView.tsx', code);
