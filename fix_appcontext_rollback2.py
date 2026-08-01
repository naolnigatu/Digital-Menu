import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

old_rollback = """      if (authUserObj) {
        try {
          const { deleteUser } = await import('firebase/auth');
          await deleteUser(authUserObj);
        } catch (delErr) {
          console.error("Failed to rollback auth user:", delErr);
        }
      }"""

new_rollback = """      if (authUserObj && tempPassword && memberData.email) {
        try {
          const { rollbackSecondaryUser } = await import('../lib/firebase');
          await rollbackSecondaryUser(memberData.email, tempPassword);
        } catch (delErr) {
          console.error("Failed to rollback auth user:", delErr);
        }
      }"""

content = content.replace(old_rollback, new_rollback)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(content)
