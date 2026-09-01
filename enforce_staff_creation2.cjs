const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(
  "tenantId: currentUser?.role === 'super_admin' ? memberData.tenantId : (currentUser?.tenantId || activeTenantId),",
  "tenantId: (currentUser?.role === 'super_admin' || currentUser?.role === 'owner') ? activeTenantId : currentUser?.tenantId,"
);

fs.writeFileSync('src/context/AppContext.tsx', code);
