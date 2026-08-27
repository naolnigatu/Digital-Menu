import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

pattern = r"setCustomerProfiles\(async prev => \{(.*?)(const updatedProfile =.*?|const updated =.*?)\s*await syncToFirestore\('users', (.*?)\.id, (.*?)\);\s*return \{(.*?)\};\s*\}\);"

def repl(m):
    body = m.group(1)
    updated_decl = m.group(2)
    sync_var1 = m.group(3)
    sync_var2 = m.group(4)
    ret_body = m.group(5)
    
    # We replace 'prev[email]' with 'customerProfiles[email]'
    body = body.replace('prev[email]', 'customerProfiles[email]')
    
    return f"{body}{updated_decl}\n      setCustomerProfiles(prev => ({{{ret_body}}}));\n      syncToFirestore('users', {sync_var1}.id, {sync_var2});"

new_content = re.sub(pattern, repl, content, flags=re.DOTALL)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(new_content)
