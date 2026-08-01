import re

with open("src/views/BusinessOwnerView.tsx", "r") as f:
    content = f.read()

old_form = """                <form onSubmit={handleAddStaff} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                    <input
                      type="text"
                      required
                      
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium focus:border-slate-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Operational Email Address</label>
                    <input
                      type="email"
                      required
                      
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium focus:border-slate-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Operational Role</label>
                    <select
                      value={staffRole}
                      onChange={(e: any) => setStaffRole(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium bg-white focus:outline-none focus:border-slate-400"
                    >
                      <optgroup label="Standard Roles">
                        <option value="waiter">Floor Waiter</option>
                        <option value="cashier">Cashier Operator</option>
                        <option value="kitchen">Kitchen Staff (KDS)</option>
                        <option value="manager">Branch Operations Manager</option>
                        <option value="delivery">Delivery Staff</option>
                      </optgroup>
                      {customRoles.filter(cr => cr.businessId === activeTenantId).length > 0 && (
                        <optgroup label="Custom Access Roles (Dinex Core)">
                          {customRoles.filter(cr => cr.businessId === activeTenantId).map(cr => (
                            <option key={cr.id} value={cr.id}>{cr.name}</option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>

                  {staffRole === 'kitchen' && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Assign KDS Station</label>
                      <select
                        value={staffStation}
                        onChange={(e) => setStaffStation(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium bg-white focus:outline-none"
                      >
                        <option value="">Choose preparation target...</option>
                        {stations.filter(s => s.branchId === activeBranchId).map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-slate-950 text-white py-2 text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    Send Invitation Token
                  </button>
                </form>"""

new_form = """                <form onSubmit={handleAddStaff} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">First Name</label>
                      <input
                        type="text"
                        required
                        value={staffFirstName}
                        onChange={(e) => setStaffFirstName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium focus:border-slate-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Last Name</label>
                      <input
                        type="text"
                        required
                        value={staffLastName}
                        onChange={(e) => setStaffLastName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium focus:border-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number (Required)</label>
                    <input
                      type="tel"
                      required
                      value={staffPhone}
                      onChange={(e) => setStaffPhone(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium focus:border-slate-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium focus:border-slate-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Operational Role</label>
                    <select
                      value={staffRole}
                      onChange={(e: any) => setStaffRole(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium bg-white focus:outline-none focus:border-slate-400"
                    >
                      <optgroup label="Standard Roles">
                        {(currentUser?.role === 'owner' || currentUser?.role === 'super_admin') && (
                          <option value="manager">Branch Manager</option>
                        )}
                        <option value="cashier">Cashier</option>
                        <option value="waiter">Waiter</option>
                        <option value="kitchen">Kitchen Staff</option>
                        <option value="bar">Bar Staff</option>
                        <option value="coffee">Coffee Staff</option>
                        <option value="delivery">Delivery Staff</option>
                        <option value="reception">Reception / Host</option>
                        <option value="inventory">Inventory Staff</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Branch</label>
                    <select
                      value={staffBranch || activeBranchId}
                      onChange={(e) => setStaffBranch(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium bg-white focus:outline-none focus:border-slate-400"
                    >
                      {branches.filter(b => b.tenantId === activeTenantId).map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  {staffRole === 'kitchen' && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Assign KDS Station</label>
                      <select
                        value={staffStation}
                        onChange={(e) => setStaffStation(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium bg-white focus:outline-none"
                      >
                        <option value="">Choose preparation target...</option>
                        {stations.filter(s => s.branchId === (staffBranch || activeBranchId)).map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Temporary Password</label>
                      <button 
                        type="button" 
                        onClick={() => setStaffPassword(Math.random().toString(36).slice(-8) + 'A1!')} 
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        Generate Password
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium focus:border-indigo-400 focus:outline-none"
                      placeholder="Must be at least 6 characters"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-slate-950 text-white py-2 text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    Create Staff
                  </button>
                </form>"""

content = content.replace(old_form, new_form)

# And replace `staffName` usage in old UI list if it broke
# Actually, the requested display is:
# Name, Role, Branch, Phone, Email, Temporary Password (this is shown *after* creation, wait - it just says "After successful creation show:")
# We can just show it in the table or in a success modal. The list can show Phone, Email, Role.
# Let's fix the list view.

old_list = """                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-950">{member.name}</span>
                              <span className="rounded bg-indigo-50 border border-indigo-100/40 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 uppercase">
                                {displayRoleName(member.role)}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">{member.email}</p>"""

new_list = """                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-950">{member.name || `${member.firstName} ${member.lastName}`}</span>
                              <span className="rounded bg-indigo-50 border border-indigo-100/40 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 uppercase">
                                {displayRoleName(member.role)}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">{member.phone || member.email}</p>"""
content = content.replace(old_list, new_list)

with open("src/views/BusinessOwnerView.tsx", "w") as f:
    f.write(content)
