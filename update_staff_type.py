import re

with open("src/types.ts", "r") as f:
    content = f.read()

old_staff = """export interface Staff {
  mustChangePassword?: boolean;
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  tenantId: string;
  branchId: string; // Scoped branch
  stationId?: string; // Scoped station for KDS
  active: boolean;
  permissions?: string[];
}"""

new_staff = """export interface Staff {
  id: string;
  uid?: string;
  tenantId: string;
  branchId: string; // Scoped branch
  stationId?: string; // Scoped station for KDS
  firstName?: string;
  lastName?: string;
  name: string; // Keep for backward compatibility or computed
  phone?: string;
  email: string;
  role: UserRole | string;
  status?: string; // active, inactive
  active: boolean;
  mustChangePassword?: boolean;
  createdBy?: string;
  createdAt?: string;
  permissions?: string[];
}"""

content = content.replace(old_staff, new_staff)
with open("src/types.ts", "w") as f:
    f.write(content)
