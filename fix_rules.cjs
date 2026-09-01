const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

// For any rule that does `hasTenantAccess(resource.data.tenantId) || hasTenantAccess(request.resource.data.tenantId)`,
// we should enforce that if the document exists (update/delete), they must have access to the existing document's tenant.
// If it's a create, they must have access to the new document's tenant.

// A safer pattern:
// allow create: if hasTenantAccess(request.resource.data.tenantId);
// allow update: if hasTenantAccess(resource.data.tenantId) && hasTenantAccess(request.resource.data.tenantId);
// allow delete: if hasTenantAccess(resource.data.tenantId);

code = code.replace(/allow write: if hasTenantAccess\(resource\.data\.tenantId\) \|\| hasTenantAccess\(request\.resource\.data\.tenantId\);/g, 
  "allow create: if hasTenantAccess(request.resource.data.tenantId);\n      allow update: if hasTenantAccess(resource.data.tenantId) && hasTenantAccess(request.resource.data.tenantId);\n      allow delete: if hasTenantAccess(resource.data.tenantId);");

fs.writeFileSync('firestore.rules', code);
