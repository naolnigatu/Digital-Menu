import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

old_func = """    // Create exactly one Firestore document in the staff collection, not users
    try {
      await syncToFirestore('staff', id, newStaff);
      setStaff(prev => [...prev, newStaff]);
      addLog('Add Staff', `Added employee ${memberData.name || memberData.firstName} as ${memberData.role}.`);
    } catch (err: any) {
      console.error("Error creating staff doc:", err);
      throw new Error("Failed to create staff record");
    }
  };"""

new_func = """    let authUserObj: any = null;
    if (tempPassword && memberData.email) {
      try {
        const { createSecondaryUser } = await import('../lib/firebase');
        authUserObj = await createSecondaryUser(memberData.email, tempPassword);
        if (authUserObj) {
          id = authUserObj.uid;
          uid = authUserObj.uid;
        }
      } catch (err: any) {
        console.error("Error creating auth user:", err);
        throw new Error(err.message || "Failed to create authentication account");
      }
    }

    const newStaff: Staff & { mustChangePassword?: boolean } = {
      ...memberData,
      id,
      uid: uid || id,
      active: true,
      status: 'active',
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
      createdBy: currentUser ? currentUser.id : 'system'
    };
    
    // Create exactly one Firestore document in the staff collection, not users
    try {
      await syncToFirestore('staff', id, newStaff);
      setStaff(prev => [...prev, newStaff]);
      addLog('Add Staff', `Added employee ${memberData.name || memberData.firstName} as ${memberData.role}.`);
    } catch (err: any) {
      console.error("Error creating staff doc:", err);
      if (authUserObj) {
        try {
          const { deleteUser } = await import('firebase/auth');
          await deleteUser(authUserObj);
        } catch (delErr) {
          console.error("Failed to rollback auth user:", delErr);
        }
      }
      throw new Error("Failed to create staff record. Document creation failed.");
    }
  };"""

# Let's replace the whole block starting from `let uid = undefined;` to avoid duplicates
block_to_replace = """    let uid = undefined;
    if (tempPassword && memberData.email) {
      try {
        const { createSecondaryUser } = await import('../lib/firebase');
        const authUser = await createSecondaryUser(memberData.email, tempPassword);
        if (authUser) {
          id = authUser.uid;
          uid = authUser.uid;
        }
      } catch (err: any) {
        console.error("Error creating auth user:", err);
        throw new Error(err.message || "Failed to create authentication account");
      }
    }

    const newStaff: Staff & { mustChangePassword?: boolean } = {
      ...memberData,
      id,
      uid: uid || id,
      active: true,
      status: 'active',
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
      createdBy: currentUser ? currentUser.id : 'system'
    };
    
    // Create exactly one Firestore document in the staff collection, not users
    try {
      await syncToFirestore('staff', id, newStaff);
      setStaff(prev => [...prev, newStaff]);
      addLog('Add Staff', `Added employee ${memberData.name || memberData.firstName} as ${memberData.role}.`);
    } catch (err: any) {
      console.error("Error creating staff doc:", err);
      throw new Error("Failed to create staff record");
    }
  };"""

content = content.replace(block_to_replace, "    let uid = undefined;\n" + new_func)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(content)
