const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

code = code.replace(
  /    if \(cleanEmail === 'manager@menuflow\.com'\) \{\s*setCurrentUser\(\{ id: 's-09', email: cleanEmail, role: 'manager', name: 'Manager Demo', tenantId: 't-01', branchId: 'b-01' \}\);\s*setActiveTenantId\('t-01'\); setActiveBranchId\('b-01'\); return true;\s*\}\s*return false;/g,
  `    if (cleanEmail === 'manager@menuflow.com') {
      setCurrentUser({ id: 's-09', email: cleanEmail, role: 'manager', name: 'Manager Demo', tenantId: 't-01', branchId: 'b-01' });
      setActiveTenantId('t-01'); setActiveBranchId('b-01'); return true;
    }

    // 5. If not found, log them in as a brand new owner
    setCurrentUser({
      id: \`u-\${Date.now()}\`,
      email: cleanEmail,
      role: 'owner',
      name: cleanEmail.split('@')[0],
      tenantId: '',
      branchId: ''
    });
    return true;`
);

fs.writeFileSync('src/context/AppContext.tsx', code);
