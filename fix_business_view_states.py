import re

with open("src/views/BusinessOwnerView.tsx", "r") as f:
    content = f.read()

old_states = """  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffRole, setStaffRole] = useState<string>('waiter');
  const [staffStation, setStaffStation] = useState('');"""

new_states = """  const [staffFirstName, setStaffFirstName] = useState('');
  const [staffLastName, setStaffLastName] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffRole, setStaffRole] = useState<string>('waiter');
  const [staffBranch, setStaffBranch] = useState<string>('');
  const [staffStation, setStaffStation] = useState('');"""

content = content.replace(old_states, new_states)

old_handler = """  const handleAddStaff = async (e: React.FormEvent) => {
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

new_handler = """  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!staffFirstName || !staffLastName) {
        setPermStatusMessage({ type: 'error', text: 'First and Last name are required.' });
        return;
    }
    
    if (!staffPhone) {
        setPermStatusMessage({ type: 'error', text: 'Phone number is required.' });
        return;
    }

    if (staffEmail) {
        const emailCheck = validateEmail(staffEmail);
        if (!emailCheck.valid) { setPermStatusMessage({ type: 'error', text: emailCheck.error || '' }); return; }
    }
    
    if (!staffPassword || staffPassword.length < 6) { setPermStatusMessage({ type: 'error', text: 'Password must be at least 6 characters' }); return; }

    try {
      await addStaffMember({
        firstName: staffFirstName,
        lastName: staffLastName,
        name: `${staffFirstName} ${staffLastName}`,
        phone: staffPhone,
        email: staffEmail || `${staffPhone}@no-email.local`, // Provide dummy email if empty but auth is needed? wait, auth requires email. Let's see if the request says email is optional for Firebase Auth? 
        // Actually, if email is optional, we might need a placeholder or the user doesn't get auth. But the prompt says "Generate Password button" and "Email (optional)".
        role: staffRole,
        tenantId: activeTenantId,
        branchId: staffBranch || activeBranchId,
        stationId: staffRole === 'kitchen' ? staffStation : undefined
      }, staffPassword);
      setStaffFirstName('');
      setStaffLastName('');
      setStaffPhone('');
      setStaffEmail('');
      setStaffPassword('');
      setPermStatusMessage({ type: 'success', text: 'Staff account created successfully.' });
    } catch (err: any) {
      setPermStatusMessage({ type: 'error', text: err.message || 'Failed to create staff' });
    }
  };"""

content = content.replace(old_handler, new_handler)

with open("src/views/BusinessOwnerView.tsx", "w") as f:
    f.write(content)
