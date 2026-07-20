const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf-8');

const match = `            <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-5xl lg:grid-cols-3">
              {[
                { name: 'Free', price: '$0', features: ['1 Branch', 'Basic Menu Design', 'QR Ordering', 'Community Support'] },
                { name: 'Pro', price: '$49', popular: true, features: ['3 Branches', 'Advanced Menu Modifiers', 'Kitchen Display System', 'Priority Support', 'Staff Management'] },
                { name: 'Enterprise', price: 'Custom', features: ['Unlimited Branches', 'White-labeling', 'Custom Integrations', 'Dedicated Account Manager', 'SLA Agreement'] }
              ].map((tier) => (
                <div key={tier.name} className={\`flex flex-col justify-between rounded-3xl bg-white p-8 xl:p-10 ring-1 \${tier.popular ? 'ring-indigo-600 shadow-xl relative z-10' : 'ring-slate-200'}\`}>
                  {tier.popular && (
                    <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold leading-5 text-white">Recommended</div>
                  )}
                  <div>
                    <div className="flex items-center justify-between gap-x-4">
                      <h3 className={\`text-lg font-semibold leading-8 \${tier.popular ? 'text-indigo-600' : 'text-slate-900'}\`}>{tier.name}</h3>
                    </div>
                    <p className="mt-6 flex items-baseline gap-x-1">
                      <span className="text-4xl font-bold tracking-tight text-slate-900">{tier.price}</span>
                      {tier.price !== 'Custom' && <span className="text-sm font-semibold leading-6 text-slate-600">/month</span>}
                    </p>
                    <ul className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckCircle2 className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className={\`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 \${tier.popular ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600' : 'bg-slate-50 text-slate-900 ring-1 ring-inset ring-slate-200 hover:ring-slate-300'}\`}>
                    {tier.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                  </button>
                </div>
              ))}
            </div>`;

const replace = `            <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-5xl lg:grid-cols-3">
              {pricingPlans.map((tier, idx) => {
                const isPopular = idx === 1; // Middle plan is popular
                return (
                <div key={tier.id} className={\`flex flex-col justify-between rounded-3xl bg-white p-8 xl:p-10 ring-1 \${isPopular ? 'ring-indigo-600 shadow-xl relative z-10' : 'ring-slate-200'}\`}>
                  {isPopular && (
                    <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold leading-5 text-white">Recommended</div>
                  )}
                  <div>
                    <div className="flex items-center justify-between gap-x-4">
                      <h3 className={\`text-lg font-semibold leading-8 \${isPopular ? 'text-indigo-600' : 'text-slate-900'}\`}>{tier.name}</h3>
                    </div>
                    <p className="mt-4 text-sm text-slate-500 line-clamp-2 h-10">{tier.description}</p>
                    <p className="mt-6 flex items-baseline gap-x-1">
                      <span className="text-4xl font-bold tracking-tight text-slate-900">\${tier.priceUSD}</span>
                      <span className="text-sm font-semibold leading-6 text-slate-600">/month</span>
                    </p>
                    <ul className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex gap-x-3">
                          <CheckCircle2 className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={handleLogin} className={\`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors \${isPopular ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600' : 'bg-slate-50 text-slate-900 ring-1 ring-inset ring-slate-200 hover:ring-slate-300'}\`}>
                    Get Started
                  </button>
                </div>
              )})}
            </div>`;

code = code.replace(match, replace);
fs.writeFileSync('src/views/LandingPageView.tsx', code);
