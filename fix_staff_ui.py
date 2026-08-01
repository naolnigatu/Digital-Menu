import re

with open("src/views/BusinessOwnerView.tsx", "r") as f:
    content = f.read()

# 1. Add password state
if "const [staffPassword, setStaffPassword] = useState('');" not in content:
    content = content.replace("const [staffEmail, setStaffEmail] = useState('');", "const [staffEmail, setStaffEmail] = useState('');\n  const [staffPassword, setStaffPassword] = useState('');")

# 2. Update handleAddStaff function
old_handle = """  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const nameCheck = sanitizeName(staffName);
    if (!nameCheck.valid) { setPermStatusMessage({ type: 'error', text: nameCheck.error || '' }); return; }
    const emailCheck = validateEmail(staffEmail);
    if (!emailCheck.valid) { setPermStatusMessage({ type: 'error', text: emailCheck.error || '' }); return; }
    addStaffMember({
      name: staffName,
      email: staffEmail,
      role: staffRole,
      tenantId: activeTenantId,
      branchId: activeBranchId,
      stationId: staffRole === 'kitchen' ? staffStation : undefined
    });
    setStaffName('');
    setStaffEmail('');
  };"""

new_handle = """  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameCheck = sanitizeName(staffName);
    if (!nameCheck.valid) { setPermStatusMessage({ type: 'error', text: nameCheck.error || '' }); return; }
    const emailCheck = validateEmail(staffEmail);
    if (!emailCheck.valid) { setPermStatusMessage({ type: 'error', text: emailCheck.error || '' }); return; }
    if (!staffPassword || staffPassword.length < 6) { setPermStatusMessage({ type: 'error', text: 'Password must be at least 6 characters' }); return; }

    try {
      await addStaffMember({
        name: staffName,
        email: staffEmail,
        role: staffRole,
        tenantId: activeTenantId,
        branchId: activeBranchId,
        stationId: staffRole === 'kitchen' ? staffStation : undefined
      }, staffPassword);
      setStaffName('');
      setStaffEmail('');
      setStaffPassword('');
      setPermStatusMessage({ type: 'success', text: 'Staff account created successfully.' });
    } catch (err: any) {
      setPermStatusMessage({ type: 'error', text: err.message || 'Failed to create staff' });
    }
  };"""

content = content.replace(old_handle, new_handle)

# 3. Add password input field to the UI
# Let's find the email input
email_block = """                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                    <input
                      type="email"
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium focus:border-indigo-400 focus:outline-none"
                      required
                    />
                  </div>"""

pw_block = email_block + """
                  <div>
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Temporary Password</label>
                      <button type="button" onClick={() => setStaffPassword(Math.random().toString(36).slice(-8) + 'A1!')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800">Generate</button>
                    </div>
                    <input
                      type="text"
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium focus:border-indigo-400 focus:outline-none"
                      required
                      placeholder="Must be at least 6 characters"
                    />
                  </div>"""

content = content.replace(email_block, pw_block)

# 4. Change "Invite Operational Staff" to "Add Operational Staff"
content = content.replace(">Invite Operational Staff<", ">Add Operational Staff<")
content = content.replace("Send Invite", "Create Account")
content = content.replace("Add team members to specific access groups. They can login instantly with their email credentials.", "Create team member accounts directly. They will be prompted to change their password on first login.")

with open("src/views/BusinessOwnerView.tsx", "w") as f:
    f.write(content)

