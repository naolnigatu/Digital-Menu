import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

if "import { createSecondaryUser }" not in content:
    content = content.replace("import { getDB }", "import { getDB, createSecondaryUser }")

old_func = """  const addStaffMember = async (memberData: Omit<Staff, 'id' | 'active'>) => {
    const id = `s-${Date.now()}`;
    const newStaff: Staff = {
      ...memberData,
      id,
      active: true
    };
    setStaff(prev => [...prev, newStaff]);
    addLog('Invite Staff', `Invited employee ${memberData.name} as ${memberData.role}.`);
    await syncToFirestore('users', id, newStaff);
  };"""

new_func = """  const addStaffMember = async (memberData: Omit<Staff, 'id' | 'active'>, tempPassword?: string) => {
    let id = `s-${Date.now()}`;
    
    if (tempPassword) {
      try {
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

content = content.replace(old_func, new_func)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(content)
