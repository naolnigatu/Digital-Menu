const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf-8');

const oldHero = `        {/* Hero Section */}
        <div className="relative isolate pt-14 pb-20 sm:pt-20 lg:pb-32 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="text-center mt-32 sm:mt-40">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                The All-in-One <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Business Management Platform</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Manage menus, orders, staff, kitchen, reservations, delivery, customers, payments, analytics, and more—all from one platform.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <button 
                  onClick={handleLogin}
                  className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
                >
                  Get Started
                </button>
                <button 
                  onClick={onEnterApp}
                  className="text-sm font-semibold leading-6 text-slate-900 group flex items-center gap-2"
                >
                  View Demo <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Abstract Dashboard Mockup */}
          <div className="mt-16 sm:mt-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-2xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:-m-4 lg:rounded-3xl lg:p-4 shadow-2xl overflow-hidden">
               <div className="rounded-xl overflow-hidden border border-slate-200/50 bg-white flex flex-col shadow-inner aspect-[16/9] sm:aspect-[2/1] relative">
                  {/* Mockup Header */}
                  <div className="h-12 border-b border-slate-100 flex items-center px-4 justify-between bg-slate-50/80">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="w-48 h-6 bg-slate-200 rounded-md"></div>
                    <div className="w-8 h-8 rounded-full bg-indigo-100"></div>
                  </div>
                  {/* Mockup Body */}
                  <div className="flex-1 flex p-4 gap-4 bg-slate-50/50">
                    {/* Sidebar */}
                    <div className="w-48 hidden sm:flex flex-col gap-3">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={\`h-8 rounded-md \${i===1 ? 'bg-indigo-100/50' : 'bg-slate-100'}\`}></div>
                      ))}
                    </div>
                    {/* Main Content */}
                    <div className="flex-1 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <div className="h-8 w-40 bg-slate-200 rounded-lg"></div>
                        <div className="h-8 w-24 bg-indigo-500/20 rounded-lg"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[1,2,3].map(i => (
                          <div key={i} className="h-24 bg-white rounded-xl border border-slate-100 p-4 flex flex-col justify-between shadow-sm">
                            <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
                            <div className="h-8 w-3/4 bg-slate-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                      <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                         <div className="h-4 w-1/3 bg-slate-100 rounded mb-4"></div>
                         <div className="space-y-3">
                            {[1,2,3,4].map(i => (
                              <div key={i} className="h-10 bg-slate-50 rounded-lg border border-slate-50"></div>
                            ))}
                         </div>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>`;

const newHero = `        {/* Hero Section */}
        <div className="relative isolate pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              {/* Text Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                  The All-in-One <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Business Management Platform</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto lg:mx-0">
                  Manage menus, orders, staff, kitchen, reservations, delivery, customers, payments, analytics, and more—all from one platform.
                </p>
                <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                  <button 
                    onClick={handleLogin}
                    className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
                  >
                    Get Started
                  </button>
                  <a 
                    href="#demo-video"
                    className="text-sm font-semibold leading-6 text-slate-900 group flex items-center gap-2 cursor-pointer"
                  >
                    View Demo <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Video Embed */}
              <div id="demo-video" className="w-full max-w-2xl mx-auto scroll-mt-24">
                <div className="text-center mb-4 lg:hidden">
                  <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Watch Dinex in Action</h2>
                </div>
                <div className="hidden lg:block text-left mb-4">
                  <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Watch Dinex in Action</h2>
                </div>
                <div className="relative rounded-2xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 shadow-2xl overflow-hidden aspect-video">
                  <iframe 
                    className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-xl bg-slate-900"
                    src="https://www.youtube.com/embed/7A8rk8dU3FQ" 
                    title="Dinex Product Demonstration"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>`;

code = code.replace(oldHero, newHero);
fs.writeFileSync('src/views/LandingPageView.tsx', code);
