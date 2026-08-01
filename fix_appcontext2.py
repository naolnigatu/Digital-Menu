import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

old_func = """  const addStaffMember = async (memberData: Omit<Staff, 'id' | 'active'>, tempPassword?: string) => {
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
    }"""

new_func = """  const addStaffMember = async (memberData: Omit<Staff, 'id' | 'active'>, tempPassword?: string) => {
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
    }"""

content = content.replace(old_func, new_func)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(content)
