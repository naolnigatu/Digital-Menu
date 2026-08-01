import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

old_func = """  const addStaffMember = async (memberData: Omit<Staff, 'id' | 'active'>, tempPassword?: string) => {
    let id = `s-${Date.now()}`;
    
    if (tempPassword) {
      try {
        const { createSecondaryUser } = await import('../lib/firebase');
        const authUser = await createSecondaryUser(memberData.email, tempPassword);
        if (authUser) {
          id = authUser.uid;
        }
      } catch (err: any) {
        console.error("Error creating auth user:", err);
        throw new Error(err.message || "Failed to create authentication account");
      }
    }

    const newStaff: Staff & { mustChangePassword?: boolean } = {
      ...memberData,
      id,
      active: true,
      mustChangePassword: !!tempPassword
    };
    setStaff(prev => [...prev, newStaff]);
    addLog('Add Staff', `Added employee ${memberData.name} as ${memberData.role}.`);
    await syncToFirestore('users', id, newStaff);
  };"""

new_func = """  const addStaffMember = async (memberData: Omit<Staff, 'id' | 'active'>, tempPassword?: string) => {
    let id = `s-${Date.now()}`;
    
    // Check permissions
    if (currentUser) {
      const allowedRolesForOwner = ['manager', 'cashier', 'waiter', 'kitchen', 'bar', 'coffee', 'delivery', 'reception', 'inventory'];
      const allowedRolesForManager = ['cashier', 'waiter', 'kitchen', 'bar', 'coffee', 'delivery', 'reception', 'inventory'];
      
      if (currentUser.role === 'manager' && !allowedRolesForManager.includes(memberData.role)) {
        throw new Error("Branch Managers cannot create staff with role: " + memberData.role);
      }
      if ((currentUser.role === 'owner' || currentUser.role === 'super_admin') && !allowedRolesForOwner.includes(memberData.role)) {
        throw new Error("Owners cannot create staff with role: " + memberData.role);
      }
    }

    let uid = undefined;
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

content = content.replace(old_func, new_func)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(content)
