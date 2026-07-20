const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const oldRouter = "function AppRouter() {\n  const { currentUser } = useApp();\n  const [showApp, setShowApp] = useState(window.location.hash === '#app' || window.location.hash === '#demo');\n\n  useEffect(() => {\n    const handleHash = () => {\n      if (window.location.hash === '#app' || window.location.hash === '#demo') {\n        setShowApp(true);\n      }\n    };\n    window.addEventListener('hashchange', handleHash);\n    return () => window.removeEventListener('hashchange', handleHash);\n  }, []);\n\n  if (!currentUser && !showApp) {\n    return <LandingPageView onEnterApp={() => { window.location.hash = 'app'; setShowApp(true); }} />;\n  }\n\n  return <DashboardShell />;\n}";

const newRouter = "function AppRouter() {\n  const { currentUser } = useApp();\n\n  if (!currentUser) {\n    return <LandingPageView />;\n  }\n\n  return <DashboardShell />;\n}";

code = code.replace(oldRouter, newRouter);
fs.writeFileSync('src/App.tsx', code);
