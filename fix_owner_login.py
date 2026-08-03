import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

old_logic = """          if (role !== 'customer' && tenantId) {
            // Load Business from Firestore
            const bSnap = await getDoc(doc(db, 'businesses', tenantId));
            if (bSnap.exists()) {
              loadedBusiness = {
                id: bSnap.id,
                ...bSnap.data()
              } as Tenant;
            }
            if (loadedBusiness) {
              const pQuery = query(collection(db, 'permissions'), where('userId', '==', uid || userDocId));
              const pSnap = await getDocs(pQuery);
              if (!pSnap.empty) {
                loadedPermissions = pSnap.docs[0].data().permissions || [];
              }
            }
          }"""

new_logic = """          if (role !== 'customer') {
            // Load Business from Firestore
            if (tenantId) {
              const bSnap = await getDoc(doc(db, 'businesses', tenantId));
              if (bSnap.exists()) {
                loadedBusiness = { id: bSnap.id, ...bSnap.data() } as Tenant;
              }
            }
            
            // Fallback for older owner accounts that might miss tenantId in their user doc
            if (!loadedBusiness && role === 'owner') {
               const bQuery = query(collection(db, 'businesses'), where('ownerEmail', '==', cleanEmail));
               const bSnap = await getDocs(bQuery);
               if (!bSnap.empty) {
                 loadedBusiness = { id: bSnap.docs[0].id, ...bSnap.docs[0].data() } as Tenant;
                 tenantId = loadedBusiness.id;
               }
            }

            if (loadedBusiness) {
              const pQuery = query(collection(db, 'permissions'), where('userId', '==', uid || userDocId));
              const pSnap = await getDocs(pQuery);
              if (!pSnap.empty) {
                loadedPermissions = pSnap.docs[0].data().permissions || [];
              }
            }
          }"""

content = content.replace(old_logic, new_logic)
with open("src/context/AppContext.tsx", "w") as f:
    f.write(content)
