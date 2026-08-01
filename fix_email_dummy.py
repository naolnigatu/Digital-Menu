import re

with open("src/views/BusinessOwnerView.tsx", "r") as f:
    content = f.read()

old_str = "email: staffEmail || `${staffPhone}@no-email.local`,"
new_str = "email: staffEmail || `${staffPhone.replace(/\\D/g, '')}@${activeTenantId}.app`,"

content = content.replace(old_str, new_str)

with open("src/views/BusinessOwnerView.tsx", "w") as f:
    f.write(content)
