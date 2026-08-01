import re

with open("src/App.tsx", "r") as f:
    content = f.read()

old_switch = """    switch (currentUser.role) {
      case 'super_admin':
        return <SuperAdminView />;
      case 'owner':
      case 'manager':
        return <BusinessOwnerView />;
      case 'waiter':
        return <WaiterView />;
      case 'kitchen':
        return <KDSView />;
      case 'cashier':
        return <CashierView />;
      case 'delivery':
        return <DeliveryStaffView />;
      default:
        return <CustomerView />;
    }"""

new_switch = """    switch (currentUser.role) {
      case 'super_admin':
        return <SuperAdminView />;
      case 'owner':
      case 'manager':
      case 'reception':
      case 'inventory':
        return <BusinessOwnerView />;
      case 'waiter':
        return <WaiterView />;
      case 'kitchen':
      case 'bar':
      case 'coffee':
        return <KDSView />;
      case 'cashier':
        return <CashierView />;
      case 'delivery':
        return <DeliveryStaffView />;
      case 'customer':
      default:
        return <CustomerView />;
    }"""

content = content.replace(old_switch, new_switch)

with open("src/App.tsx", "w") as f:
    f.write(content)
