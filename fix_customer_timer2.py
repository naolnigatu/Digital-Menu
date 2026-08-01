import re

with open("src/views/CustomerView.tsx", "r") as f:
    content = f.read()

# Remove from top
top_timer = """  const [prepTimeRemaining, setPrepTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentLiveOrder && currentLiveOrder.estimatedReadyTime && ['accepted', 'preparing'].includes(currentLiveOrder.status)) {
      interval = setInterval(() => {
        const remaining = new Date(currentLiveOrder.estimatedReadyTime!).getTime() - Date.now();
        setPrepTimeRemaining(Math.max(0, Math.floor(remaining / 1000)));
      }, 1000);
    } else {
      setPrepTimeRemaining(null);
    }
    return () => {
      if (interval) clearInterval(interval);
    }
  }, [currentLiveOrder]);

  const formatRemainingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
"""

content = content.replace(top_timer, "")

# Add after currentLiveOrder
target = "  const currentLiveOrder = activeCustomerOrder \n    ? orders.find(o => o.id === activeCustomerOrder.id)\n    : undefined;"
content = content.replace(target, target + "\n\n" + top_timer)

with open("src/views/CustomerView.tsx", "w") as f:
    f.write(content)
