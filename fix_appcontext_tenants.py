import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

old_tenants_query = """          let tenantsQuery;
          if (currentUser?.role === 'super_admin') {
            tenantsQuery = collection(db, 'tenants');
          } else if (currentUser?.role === 'business_owner' || currentUser?.role === 'owner' || currentUser?.role === 'staff') {
            if (currentUser.id) {
              tenantsQuery = query(collection(db, 'tenants'), where('ownerUid', '==', currentUser.id));
            } else if (currentUser.email) {
              tenantsQuery = query(collection(db, 'tenants'), where('ownerEmail', '==', currentUser.email));
            } else if (currentUser.tenantId) {
              tenantsQuery = query(collection(db, 'tenants'), where('id', '==', currentUser.tenantId));
            } else {
              tenantsQuery = collection(db, 'tenants');
            }
          } else {
            tenantsQuery = collection(db, 'tenants');
          }"""

new_tenants_query = """          let tenantsQuery;
          if (currentUser?.role === 'super_admin') {
            tenantsQuery = collection(db, 'tenants');
          } else if (currentUser?.role === 'customer' || !currentUser) {
            tenantsQuery = collection(db, 'tenants');
          } else {
            // Any business role (owner, manager, waiter, etc.)
            if (currentUser.tenantId) {
              tenantsQuery = query(collection(db, 'tenants'), where('id', '==', currentUser.tenantId));
            } else if (currentUser.role === 'owner' && currentUser.id) {
              tenantsQuery = query(collection(db, 'tenants'), where('ownerUid', '==', currentUser.id));
            } else {
              tenantsQuery = collection(db, 'tenants');
            }
          }"""

content = content.replace(old_tenants_query, new_tenants_query)

old_businesses_query = """          let businessesQuery;
          if (currentUser?.role === 'super_admin') {
            businessesQuery = collection(db, 'businesses');
          } else if (currentUser?.role === 'business_owner' || currentUser?.role === 'owner' || currentUser?.role === 'staff') {
            if (currentUser.id) {
              businessesQuery = query(collection(db, 'businesses'), where('ownerUid', '==', currentUser.id));
            } else if (currentUser.email) {
              businessesQuery = query(collection(db, 'businesses'), where('ownerEmail', '==', currentUser.email));
            } else if (currentUser.tenantId) {
              businessesQuery = query(collection(db, 'businesses'), where('id', '==', currentUser.tenantId));
            } else {
              businessesQuery = collection(db, 'businesses');
            }
          } else {
            businessesQuery = collection(db, 'businesses');
          }"""

new_businesses_query = """          let businessesQuery;
          if (currentUser?.role === 'super_admin') {
            businessesQuery = collection(db, 'businesses');
          } else if (currentUser?.role === 'customer' || !currentUser) {
            businessesQuery = collection(db, 'businesses');
          } else {
            if (currentUser.tenantId) {
              businessesQuery = query(collection(db, 'businesses'), where('id', '==', currentUser.tenantId));
            } else if (currentUser.role === 'owner' && currentUser.id) {
              businessesQuery = query(collection(db, 'businesses'), where('ownerUid', '==', currentUser.id));
            } else {
              businessesQuery = collection(db, 'businesses');
            }
          }"""

content = content.replace(old_businesses_query, new_businesses_query)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(content)
