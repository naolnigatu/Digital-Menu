import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

old_log = "addLog('Login', `User ${userObj.name} (${userObj.role}) loaded from Firestore.`);"
new_log = """console.log("STAFF LOGIN DEBUG:", {
            role: userObj.role,
            tenantId: userObj.tenantId,
            branchId: userObj.branchId,
            uid: userObj.uid
          });
          addLog('Login', `User ${userObj.name} (${userObj.role}) loaded from Firestore.`);"""

content = content.replace(old_log, new_log)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(content)
