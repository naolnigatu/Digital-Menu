const fs = require('fs');
let code = fs.readFileSync('src/views/SuperAdminView.tsx', 'utf-8');

const landingPageContent = `
      {/* 0. LANDING PAGE TAB */}
      {activeTab === 'landing_page' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Globe className="h-6 w-6 text-indigo-600" />
              Landing Page Settings
            </h2>
            <p className="text-sm text-slate-500 mb-6">Customize the content and layout of the public-facing Dinex landing page.</p>

            <div className="space-y-6">
              {/* Hero Section */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Hero Section</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Hero Title</label>
                    <input 
                      type="text"
                      className="w-full text-sm rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                      value={globalSettings.landingPageConfig?.heroTitle || ''}
                      onChange={(e) => {
                        const current = globalSettings.landingPageConfig || {};
                        updateGlobalSettings({ landingPageConfig: { ...current, heroTitle: e.target.value } });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Hero Subtitle</label>
                    <input 
                      type="text"
                      className="w-full text-sm rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                      value={globalSettings.landingPageConfig?.heroSubtitle || ''}
                      onChange={(e) => {
                        const current = globalSettings.landingPageConfig || {};
                        updateGlobalSettings({ landingPageConfig: { ...current, heroSubtitle: e.target.value } });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Background Type</label>
                    <select
                      className="w-full text-sm rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                      value={globalSettings.landingPageConfig?.heroBackgroundType || 'color'}
                      onChange={(e) => {
                        const current = globalSettings.landingPageConfig || {};
                        updateGlobalSettings({ landingPageConfig: { ...current, heroBackgroundType: e.target.value as any } });
                      }}
                    >
                      <option value="color">Solid Color / Gradient (Default)</option>
                      <option value="image">Image URL</option>
                      <option value="video">Video URL</option>
                    </select>
                  </div>
                  {(globalSettings.landingPageConfig?.heroBackgroundType === 'image' || globalSettings.landingPageConfig?.heroBackgroundType === 'video') && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700">Media URL (Video or Image)</label>
                      <input 
                        type="url"
                        placeholder="https://..."
                        className="w-full text-sm rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                        value={globalSettings.landingPageConfig?.heroBackgroundUrl || ''}
                        onChange={(e) => {
                          const current = globalSettings.landingPageConfig || {};
                          updateGlobalSettings({ landingPageConfig: { ...current, heroBackgroundUrl: e.target.value } });
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* About / Why Choose */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">About Section</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">About Title</label>
                    <input 
                      type="text"
                      className="w-full text-sm rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                      value={globalSettings.landingPageConfig?.aboutTitle || ''}
                      onChange={(e) => {
                        const current = globalSettings.landingPageConfig || {};
                        updateGlobalSettings({ landingPageConfig: { ...current, aboutTitle: e.target.value } });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">About Text</label>
                    <textarea 
                      className="w-full text-sm rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                      rows={2}
                      value={globalSettings.landingPageConfig?.aboutText || ''}
                      onChange={(e) => {
                        const current = globalSettings.landingPageConfig || {};
                        updateGlobalSettings({ landingPageConfig: { ...current, aboutText: e.target.value } });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Features Overview */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Features Overview</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Features Title</label>
                    <input 
                      type="text"
                      className="w-full text-sm rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                      value={globalSettings.landingPageConfig?.featuresTitle || ''}
                      onChange={(e) => {
                        const current = globalSettings.landingPageConfig || {};
                        updateGlobalSettings({ landingPageConfig: { ...current, featuresTitle: e.target.value } });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Features Subtitle</label>
                    <input 
                      type="text"
                      className="w-full text-sm rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                      value={globalSettings.landingPageConfig?.featuresSubtitle || ''}
                      onChange={(e) => {
                        const current = globalSettings.landingPageConfig || {};
                        updateGlobalSettings({ landingPageConfig: { ...current, featuresSubtitle: e.target.value } });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => {
                   setToast({ type: 'success', text: 'Landing page updated' });
                   setTimeout(() => setToast(null), 3000);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                Save Layout
              </button>
            </div>
          </div>
        </div>
      )}

`;

code = code.replace(
  /\{\/\* 1\. PLATFORM HEALTH TAB \*\/\}/,
  landingPageContent + '{/* 1. PLATFORM HEALTH TAB */}'
);

fs.writeFileSync('src/views/SuperAdminView.tsx', code);
