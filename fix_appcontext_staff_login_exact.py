import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

old_user_obj = """          const userObj = {
            ...userDocData,
            id: userDocId,
            uid: uid || userDocId,
            email: cleanEmail || userDocData.email,
            role,
            name: userDocData.name || (userDocData.firstName ? `${userDocData.firstName} ${userDocData.lastName || ''}`.trim() : cleanEmail.split('@')[0]),
            tenantId: tenantId || loadedBusiness?.id || '',
            branchId: userDocData.branchId || '',
            stationId: userDocData.stationId,
            permissions: loadedPermissions
          };
          if (loadedBusiness) {
            setTenants(prev => [...prev.filter(t => t.id !== loadedBusiness!.id), loadedBusiness!]);
            setActiveTenantId(loadedBusiness.id);
          } else if (tenantId) {
            setActiveTenantId(tenantId);
          }
          if (userDocData.branchId) {
            setActiveBranchId(userDocData.branchId);
          }
          setCurrentUser(userObj);"""

new_user_obj = """          const businessId = tenantId || loadedBusiness?.id || '';
          const userObj = {
            ...userDocData,
            id: userDocId,
            uid: uid || userDocId,
            firstName: userDocData.firstName || '',
            lastName: userDocData.lastName || '',
            phone: userDocData.phone || '',
            email: cleanEmail || userDocData.email,
            role,
            tenantId: businessId,
            branchId: userDocData.branchId || '',
            businessId: businessId,
            permissions: loadedPermissions,
            // Keep name for backward compatibility
            name: userDocData.name || (userDocData.firstName ? `${userDocData.firstName} ${userDocData.lastName || ''}`.trim() : cleanEmail.split('@')[0])
          };
          
          if (loadedBusiness) {
            setTenants(prev => {
              const exists = prev.find(t => t.id === loadedBusiness!.id);
              if (exists) return prev.map(t => t.id === loadedBusiness!.id ? loadedBusiness! : t);
              return [...prev, loadedBusiness!];
            });
          }
          
          if (userObj.tenantId) {
            setActiveTenantId(userObj.tenantId);
          }
          if (userObj.branchId) {
            setActiveBranchId(userObj.branchId);
          }
          
          setCurrentUser(userObj);"""

content = content.replace(old_user_obj, new_user_obj)

old_orders_query = """          const targetOrdersTenantId = currentUser?.tenantId || activeTenantId;
          const ordersQuery = (currentUser?.role === 'super_admin' || currentUser?.role === 'customer' || !currentUser)
            ? collection(db, 'orders')
            : query(collection(db, 'orders'), where('tenantId', '==', targetOrdersTenantId));"""

new_orders_query = """          const targetOrdersTenantId = currentUser?.tenantId || activeTenantId;
          const ordersQuery = (currentUser?.role === 'super_admin' || !currentUser)
            ? collection(db, 'orders')
            : (currentUser?.role === 'customer' 
                ? query(collection(db, 'orders'), where('customerEmail', '==', currentUser.email)) 
                : query(collection(db, 'orders'), where('tenantId', '==', targetOrdersTenantId)));"""

content = content.replace(old_orders_query, new_orders_query)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(content)
