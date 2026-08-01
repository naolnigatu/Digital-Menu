import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

old_login_lookup = """        // A. Primary Lookup by Firebase UID in 'users' collection
        if (uid) {
          const uSnap = await getDoc(doc(db, 'users', uid));
          if (uSnap.exists()) {
            userDocData = uSnap.data();
            userDocId = uSnap.id;
          }
        }

        // B. Secondary Lookup by Email in 'users' collection
        if (!userDocData && cleanEmail) {
          const uQuery = query((currentUser?.role === 'super_admin' || !currentUser?.tenantId ? collection(db, 'users') : query(collection(db, 'users'), where('tenantId', '==', currentUser?.tenantId))), where('email', '==', cleanEmail));
          const uQuerySnap = await getDocs(uQuery);
          if (!uQuerySnap.empty) {
            userDocData = uQuerySnap.docs[0].data();
            userDocId = uQuerySnap.docs[0].id;
          }
        }

        // C. Check 'staff' collection by UID or Email
        if (!userDocData && uid) {
          const sSnap = await getDoc(doc(db, 'staff', uid));
          if (sSnap.exists()) {
            userDocData = sSnap.data();
            userDocId = sSnap.id;
          }
        }
        if (!userDocData && cleanEmail) {
          const sQuery = query((currentUser?.role === 'super_admin' || !currentUser?.tenantId ? collection(db, 'staff') : query(collection(db, 'staff'), where('tenantId', '==', currentUser?.tenantId))), where('email', '==', cleanEmail));
          const sQuerySnap = await getDocs(sQuery);
          if (!sQuerySnap.empty) {
            userDocData = sQuerySnap.docs[0].data();
            userDocId = sQuerySnap.docs[0].id;
          }
        }"""

new_login_lookup = """        // 1. Check 'staff' collection FIRST (Staff take priority over generic customer accounts)
        if (uid) {
          const sSnap = await getDoc(doc(db, 'staff', uid));
          if (sSnap.exists()) {
            userDocData = sSnap.data();
            userDocId = sSnap.id;
          }
        }
        if (!userDocData && cleanEmail) {
          const sQuery = query(collection(db, 'staff'), where('email', '==', cleanEmail));
          const sQuerySnap = await getDocs(sQuery);
          if (!sQuerySnap.empty) {
            userDocData = sQuerySnap.docs[0].data();
            userDocId = sQuerySnap.docs[0].id;
          }
        }

        // 2. If not staff, check 'users' collection
        if (!userDocData && uid) {
          const uSnap = await getDoc(doc(db, 'users', uid));
          if (uSnap.exists()) {
            userDocData = uSnap.data();
            userDocId = uSnap.id;
          }
        }
        if (!userDocData && cleanEmail) {
          const uQuery = query(collection(db, 'users'), where('email', '==', cleanEmail));
          const uQuerySnap = await getDocs(uQuery);
          if (!uQuerySnap.empty) {
            userDocData = uQuerySnap.docs[0].data();
            userDocId = uQuerySnap.docs[0].id;
          }
        }"""

content = content.replace(old_login_lookup, new_login_lookup)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(content)
