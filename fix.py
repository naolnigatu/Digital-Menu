with open("src/views/BusinessOwnerView.tsx", "r") as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "{/* Menu Items Grid */}" in line and start_idx == -1:
        start_idx = i
    if '<div className="lg:col-span-2 space-y-3">' in line and start_idx != -1:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    with open("station_ui.txt", "r") as f2:
        station_ui = f2.read()
    
    new_lines = lines[:start_idx] + [
        "            </div>\n",
        "            {/* Menu Items Grid */}\n",
        "            <div className=\"lg:col-span-2 space-y-3\">\n"
    ] + lines[end_idx+1:]
    
    with open("src/views/BusinessOwnerView.tsx", "w") as f:
        f.writelines(new_lines)

    # Now let's inject station_ui before "{/* Menu Items Grid */}"
    with open("src/views/BusinessOwnerView.tsx", "r") as f:
        content = f.read()
    
    content = content.replace("            </div>\n            {/* Menu Items Grid */}", station_ui + "\n            </div>\n            {/* Menu Items Grid */}")
    
    with open("src/views/BusinessOwnerView.tsx", "w") as f:
        f.write(content)
