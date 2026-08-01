import re

with open("src/views/CustomerView.tsx", "r") as f:
    content = f.read()

content = content.replace("{['ready', 'served', 'preparing'].includes(currentLiveOrder.status) && (", "{currentLiveOrder.status === 'served' && (")
content = content.replace("Confirm Delivery", "Confirm Received")

with open("src/views/CustomerView.tsx", "w") as f:
    f.write(content)
