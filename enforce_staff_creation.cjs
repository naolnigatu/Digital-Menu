const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const replacement = `const newStaff: Staff & { mustChangePassword?: boolean } = {
      ...memberData,
      id,
      uid: uid || id,
      tenantId: currentUser?.role === 'super_admin' ? memberData.tenantId : (currentUser?.tenantId || activeTenantId),
      branchId: (currentUser?.role === 'manager' || currentUser?.role === 'cashier') ? currentUser.branchId : memberData.branchId,
      active: true,
      status: 'active',
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
      createdBy: currentUser ? currentUser.id : 'system'
    };`;

code = code.replace(/const newStaff: Staff & \{ mustChangePassword\?: boolean \} = \{[\s\S]*?\};\s*/m, replacement + '\n    ');

fs.writeFileSync('src/context/AppContext.tsx', code);
