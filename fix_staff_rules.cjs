const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

code = code.replace(/allow update, delete: if request\.auth != null && \(\n        isSuperAdmin\(\) \|\| hasTenantAccess\(resource\.data\.tenantId\)\n      \);/g,
  "allow update: if request.auth != null && (isSuperAdmin() || (hasTenantAccess(resource.data.tenantId) && hasTenantAccess(request.resource.data.tenantId)));\n      allow delete: if request.auth != null && (isSuperAdmin() || hasTenantAccess(resource.data.tenantId));");

fs.writeFileSync('firestore.rules', code);
