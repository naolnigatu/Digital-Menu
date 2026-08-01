import re

with open("src/views/BusinessOwnerView.tsx", "r") as f:
    content = f.read()

state_inject = """  const [staffPassword, setStaffPassword] = useState('');
  const [staffRole, setStaffRole] = useState<string>('waiter');
  const [staffBranch, setStaffBranch] = useState<string>('');
  const [staffStation, setStaffStation] = useState('');
  const [lastCreatedStaff, setLastCreatedStaff] = useState<any>(null);"""

content = content.replace("  const [staffStation, setStaffStation] = useState('');", "  const [staffStation, setStaffStation] = useState('');\n  const [lastCreatedStaff, setLastCreatedStaff] = useState<any>(null);")

handler_success = """      setPermStatusMessage({ type: 'success', text: 'Staff account created successfully.' });
      setLastCreatedStaff({
        name: `${staffFirstName} ${staffLastName}`,
        role: staffRole,
        branchName: branches.find(b => b.id === (staffBranch || activeBranchId))?.name || 'Unknown Branch',
        phone: staffPhone,
        email: staffEmail || 'None',
        password: staffPassword
      });"""

content = content.replace("      setPermStatusMessage({ type: 'success', text: 'Staff account created successfully.' });", handler_success)

ui_inject = """                <form onSubmit={handleAddStaff} className="space-y-3">"""

success_ui = """                {lastCreatedStaff && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4 space-y-2">
                    <h3 className="text-emerald-800 font-bold text-sm">Staff created successfully</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-emerald-700/70 font-semibold">Name:</span> <span className="font-medium text-emerald-900">{lastCreatedStaff.name}</span></div>
                      <div><span className="text-emerald-700/70 font-semibold">Role:</span> <span className="font-medium text-emerald-900">{lastCreatedStaff.role}</span></div>
                      <div><span className="text-emerald-700/70 font-semibold">Branch:</span> <span className="font-medium text-emerald-900">{lastCreatedStaff.branchName}</span></div>
                      <div><span className="text-emerald-700/70 font-semibold">Phone:</span> <span className="font-medium text-emerald-900">{lastCreatedStaff.phone}</span></div>
                      <div><span className="text-emerald-700/70 font-semibold">Email:</span> <span className="font-medium text-emerald-900">{lastCreatedStaff.email}</span></div>
                      <div className="col-span-2 mt-1 p-2 bg-emerald-100/50 rounded flex justify-between items-center">
                        <span className="text-emerald-700/70 font-semibold">Temporary Password:</span> 
                        <span className="font-bold font-mono text-emerald-900 bg-white px-2 py-1 rounded shadow-sm">{lastCreatedStaff.password}</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => setLastCreatedStaff(null)} className="w-full text-[10px] font-bold uppercase text-emerald-700 hover:text-emerald-900 py-1">Dismiss</button>
                  </div>
                )}
                <form onSubmit={handleAddStaff} className="space-y-3">"""

content = content.replace(ui_inject, success_ui)

with open("src/views/BusinessOwnerView.tsx", "w") as f:
    f.write(content)
