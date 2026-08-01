with open("src/views/BusinessOwnerView.tsx", "r") as f:
    content = f.read()

with open("station_modal.txt", "r") as f:
    station_modal = f.read()

content = content.replace("      {/* Toast Notification Banner */}", station_modal + "\n      {/* Toast Notification Banner */}")

with open("src/views/BusinessOwnerView.tsx", "w") as f:
    f.write(content)
