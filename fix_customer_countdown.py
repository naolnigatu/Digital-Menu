import re

with open("src/views/CustomerView.tsx", "r") as f:
    content = f.read()

timer_state = """  const [showConfetti, setShowConfetti] = useState(false);
  const [prepTimeRemaining, setPrepTimeRemaining] = useState<number | null>(null);

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

if "const [prepTimeRemaining" not in content:
    content = content.replace("  const [showConfetti, setShowConfetti] = useState(false);", timer_state)

timer_ui = """            {/* Step Timeline */}
            {prepTimeRemaining !== null && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Estimated Prep Time</p>
                <div className="text-3xl font-black text-indigo-700 tracking-tighter tabular-nums">
                  {formatRemainingTime(prepTimeRemaining)}
                </div>
              </div>
            )}
            <div className="space-y-4 pt-2">"""

content = content.replace("            {/* Step Timeline */}\n            <div className=\"space-y-4 pt-2\">", timer_ui)

with open("src/views/CustomerView.tsx", "w") as f:
    f.write(content)
