with open("src/views/BusinessOwnerView.tsx", "r") as f:
    content = f.read()

with open("save_station.txt", "r") as f:
    save_station = f.read()

content = content.replace("  const handleSaveCat = async () => {", save_station + "\n  const handleSaveCat = async () => {")

with open("src/views/BusinessOwnerView.tsx", "w") as f:
    f.write(content)
