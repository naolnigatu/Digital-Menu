const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf-8');

code = code.replace(/for \(const sub of eligibleSubsToRedeem\) {/g, `for (const sub of validSubsToRedeem) {`);
code = code.replace(/const sub = eligibleSubsToRedeem\.find/g, `const sub = validSubsToRedeem.find`);
code = code.replace(/eligibleSubsToRedeem\.find/g, `validSubsToRedeem.find`);

fs.writeFileSync('src/views/CustomerView.tsx', code);
