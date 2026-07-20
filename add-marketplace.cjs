const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf-8');

const anchorPoint = "{/* Testimonials - Coming Soon */}";

const marketplaceSection = `        {/* Marketplace Section */}
        <div id="marketplace" className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Platform Integrations</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">Extend your Dinex capabilities with third-party tools and plugins from our marketplace.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(marketplaceExtensions && marketplaceExtensions.length > 0 ? marketplaceExtensions : [
                { id: 'ext-stripe', name: 'Stripe Payments', description: 'Accept credit card payments globally.', provider: 'Stripe', price: 'Free', iconUrl: '' },
                { id: 'ext-chapa', name: 'Chapa Integration', description: 'Local payment gateway integration.', provider: 'Chapa', price: 'Free', iconUrl: '' },
                { id: 'ext-whatsapp', name: 'WhatsApp Bot', description: 'Automated order notifications via WhatsApp.', provider: 'Dinex Auth', price: '$9/mo', iconUrl: '' }
              ]).map((ext) => (
                <div key={ext.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">
                      {ext.iconUrl ? <img src={ext.iconUrl} alt={ext.name} className="w-8 h-8 rounded" /> : <Cloud className="w-6 h-6" />}
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-200/50 px-2.5 py-1 rounded-full">{ext.price === '0' ? 'Free' : (ext.price || 'Free')}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{ext.name}</h3>
                  <p className="text-xs text-slate-500 mb-4 mt-1">by {ext.provider}</p>
                  <p className="text-sm text-slate-600 line-clamp-2">{ext.description}</p>
                  <button onClick={handleLogin} className="mt-6 w-full text-center text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2 rounded-lg transition-colors">
                    Add Integration
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        `;

code = code.replace(anchorPoint, marketplaceSection + anchorPoint);
fs.writeFileSync('src/views/LandingPageView.tsx', code);
