import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

old_userobj = """          const userObj = {
            id: userDocId,
            uid: uid || userDocId,
            email: cleanEmail || userDocData.email,
            role,
            name: userDocData.name || cleanEmail.split('@')[0],
            tenantId: tenantId || loadedBusiness?.id || '',
            branchId: userDocData.branchId || '',
            stationId: userDocData.stationId,
            permissions: loadedPermissions
          };"""

new_userobj = """          const userObj = {
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
          };"""

content = content.replace(old_userobj, new_userobj)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(content)
