import React, { useState } from 'react';
import { 
  Building2, ChefHat, Store, Coffee, QrCode, Smartphone, Cloud, 
  Lock, Zap, WifiOff, Users, Calendar, MapPin, 
  BarChart3, PieChart, ShieldCheck, CheckCircle2, 
  ChevronRight, ArrowRight, Menu, X, Play, CreditCard, Star, Clock, ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { signInWithGoogle } from '../lib/firebase';

export default function LandingPageView() {
  const { setCurrentView, pricingPlans, marketplaceExtensions, landingPageConfig } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  const handleLogin = async () => {
    setCurrentView('login');
  };
  
  const config = landingPageConfig;
  
  React.useEffect(() => {
    if (config.seoTitle) document.title = config.seoTitle;
    if (config.seoDescription) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', config.seoDescription);
    }
  }, [config.seoTitle, config.seoDescription]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'QrCode': return QrCode;
      case 'ChefHat': return ChefHat;
      case 'Calendar': return Calendar;
      case 'MapPin': return MapPin;
      case 'Users': return Users;
      case 'BarChart3': return BarChart3;
      case 'Store': return Store;
      case 'Coffee': return Coffee;
      case 'Smartphone': return Smartphone;
      case 'Cloud': return Cloud;
      case 'Lock': return Lock;
      case 'Zap': return Zap;
      case 'WifiOff': return WifiOff;
      case 'PieChart': return PieChart;
      case 'ShieldCheck': return ShieldCheck;
      default: return CheckCircle2;
    }
  };

  const navLinks = [
    ...(config.featuresEnabled ? [{ name: 'Features', href: '#features' }] : []),
    { name: 'About', href: '#about' },
    ...(config.pricingEnabled ? [{ name: 'Pricing', href: '#pricing' }] : []),
    ...(config.faqEnabled ? [{ name: 'FAQ', href: '#faq' }] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex w-full items-center justify-between py-4">
            <div className="flex items-center">
              <a href="#" className="flex items-center gap-2 group">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-lg shadow-indigo-200 transition-transform group-hover:scale-105">
                  <ChefHat className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">Dinex</span>
              </a>
              <div className="hidden ml-10 space-x-8 lg:block">
                {navLinks.map((link) => (
                  <a key={link.name} href={link.href} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                    {link.name}
                  
                  </a>
                ))}
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <button onClick={() => setCurrentView('login')} className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer">Sign In / Sign Up</button>
            </div>
            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-100 space-y-4">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-600 hover:text-indigo-600 py-2">
                    {link.name}
                  </a>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <button 
                  onClick={() => { setMobileMenuOpen(false); setCurrentView('login'); }}
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-500 cursor-pointer"
                >
                  Sign In / Sign Up
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <div className="relative isolate pt-24 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
          {/* Background */}
          {config.heroBackgroundType === 'video' && config.heroBackgroundUrl ? (
            <>
              {(config.heroBackgroundUrl.includes('youtube.com') || config.heroBackgroundUrl.includes('youtu.be')) ? (
                <div className="absolute inset-0 w-full h-full -z-20 overflow-hidden pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 scale-125">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full border-0 pointer-events-none"
                      src={`https://www.youtube.com/embed/${config.heroBackgroundUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)?.[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${config.heroBackgroundUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)?.[1]}&playsinline=1&rel=0&showinfo=0&disablekb=1&modestbranding=1&iv_load_policy=3&fs=0`}
                      allow="autoplay; encrypted-media"
                      title="Background Video"
                    ></iframe>
                  </div>
                </div>
              ) : (
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover -z-20">
                  <source src={config.heroBackgroundUrl} type="video/mp4" />
                </video>
              )}
              <div className="absolute inset-0 bg-slate-900 -z-10" style={{ opacity: (config.heroOverlayOpacity ?? 70) / 100 }}></div>
            </>
          ) : config.heroBackgroundType === 'image' && config.heroBackgroundUrl ? (
            <>
              <img src={config.heroBackgroundUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover -z-20" />
              <div className="absolute inset-0 bg-slate-900 -z-10" style={{ opacity: (config.heroOverlayOpacity ?? 70) / 100 }}></div>
            </>
          ) : (
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
              <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
            </div>
          )}
          
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className={`mx-auto max-w-4xl font-display text-4xl font-extrabold tracking-tight sm:text-7xl ${config.heroBackgroundType === 'color' || !config.heroBackgroundUrl ? 'text-slate-900' : 'text-white drop-shadow-lg'}`}>
              {config.heroTitle}
            </h1>
            <p className={`mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 ${config.heroBackgroundType === 'color' || !config.heroBackgroundUrl ? 'text-slate-600' : 'text-slate-200 drop-shadow-md'}`}>
              {config.heroSubtitle}
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 w-full max-w-sm sm:max-w-none mx-auto">
              <button onClick={() => setCurrentView('customer')} className="w-full sm:w-auto rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 cursor-pointer">
                {config.heroCtaText || 'Get Started'}
              </button>
            </div>
          </div>

          {/* Real Screenshots */}
          {config.screenshotsEnabled && config.screenshots?.length > 0 && (
            <div className="mt-12 sm:mt-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-xl sm:rounded-2xl bg-slate-900/5 p-4 sm:p-8 ring-1 ring-inset ring-slate-900/10 lg:-m-4 lg:rounded-3xl shadow-2xl overflow-hidden text-center">
                <h3 className="text-2xl font-bold mb-4">{config.screenshotsTitle || 'Platform Overview'}</h3>
                <p className="text-slate-600 mb-8">{config.screenshotsSubtitle}</p>
                <div className="grid gap-6 md:grid-cols-2">
                  {config.screenshots.filter(s => s.enabled).sort((a,b) => a.order - b.order).map(screenshot => (
                    <div key={screenshot.id} className="relative rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                      <img src={screenshot.imageUrl} alt={screenshot.title} className="w-full h-auto object-cover aspect-video" />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4 text-left">
                         <h4 className="text-white font-semibold">{screenshot.title}</h4>
                         <p className="text-slate-300 text-sm">{screenshot.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trust Section */}
        <div id="about" className="py-12 bg-white sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs sm:text-sm font-semibold leading-8 text-slate-500 uppercase tracking-wider mb-6 sm:mb-8">
              Why businesses choose Dinex
            </p>
            <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-6 text-slate-600 font-medium text-xs sm:text-sm">
              <div className="flex flex-col items-center gap-2">
                <Cloud className="h-8 w-8 text-indigo-500" /> Cloud Based
              </div>
              <div className="flex flex-col items-center gap-2">
                <Building2 className="h-8 w-8 text-indigo-500" /> Multi Tenant
              </div>
              <div className="flex flex-col items-center gap-2">
                <Smartphone className="h-8 w-8 text-indigo-500" /> Mobile Friendly
              </div>
              <div className="flex flex-col items-center gap-2">
                <Lock className="h-8 w-8 text-indigo-500" /> Secure
              </div>
              <div className="flex flex-col items-center gap-2">
                <Zap className="h-8 w-8 text-indigo-500" /> Fast
              </div>
              <div className="flex flex-col items-center gap-2">
                <WifiOff className="h-8 w-8 text-indigo-500" /> Offline Ready
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        {config.featuresEnabled && (
          <div id="features" className="py-16 sm:py-24 lg:py-32 bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{config.featuresTitle || 'Platform Features'}</p>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-slate-600">
                  {config.featuresSubtitle || 'A complete suite of tools designed to streamline your operations and boost customer satisfaction.'}
                </p>
              </div>
              <div className="mx-auto mt-12 sm:mt-16 lg:mt-20 lg:max-w-none">
                <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-8 sm:gap-y-16 lg:max-w-none lg:grid-cols-3">
                  {config.features.filter(f => f.enabled).sort((a, b) => a.order - b.order).map((feature) => {
                    const IconComponent = getIcon(feature.icon);
                    return (
                    <div key={feature.id} className="flex flex-col bg-white rounded-2xl p-6 sm:p-8 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
                      <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                          <IconComponent className="h-6 w-6" aria-hidden="true" />
                        </div>
                        {feature.title}
                      </dt>
                      <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                        <p className="flex-auto">{feature.description}</p>
                      </dd>
                    </div>
                  )})}
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* How it Works */}
        <div className="py-16 sm:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">How it Works</h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600">Get up and running in minutes, not days.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-10 sm:gap-8 md:grid-cols-4 relative">
              <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-slate-100 -z-10"></div>
              {[
                { step: '01', title: 'Register Business', desc: 'Sign up and configure your restaurant profile.' },
                { step: '02', title: 'Customize Menu', desc: 'Add items, modifiers, categories, and photos.' },
                { step: '03', title: 'Receive Orders', desc: 'Start accepting dine-in, pickup, or delivery orders.' },
                { step: '04', title: 'Grow Business', desc: 'Use analytics and marketing tools to expand.' },
              ].map((step, idx) => (
                <div key={idx} className="relative flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-indigo-50 shadow-sm text-indigo-600 font-bold text-xl mb-4 relative z-10">
                     {step.step}
                   </div>
                   <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                   <p className="text-sm text-slate-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Business Types */}
        {config.businessTypesEnabled && (
          <div id="solutions" className="py-16 sm:py-24 bg-slate-900 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-10 sm:mb-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{config.businessTypesTitle || 'Built for all F&B Businesses'}</h2>
                <p className="mt-4 text-base sm:text-lg text-slate-400">{config.businessTypesSubtitle || 'Whatever you run, Dinex has the modules you need.'}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {config.businessTypes.filter(b => b.enabled).sort((a, b) => a.order - b.order).map(type => (
                  <span key={type.id} className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700/50 hover:bg-slate-700 transition-colors">
                    {type.type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pricing */}
        {config.pricingEnabled && (
          <div id="pricing" className="py-16 sm:py-24 lg:py-32 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Simple, transparent pricing</h2>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-slate-600">Choose the perfect plan for your business needs.</p>
            </div>
            
            <div className="mx-auto grid max-w-md grid-cols-1 gap-6 sm:gap-8 lg:max-w-5xl lg:grid-cols-3">
              {config.pricingPlans?.filter(p => p.enabled).map((tier) => {
                const isPopular = tier.isRecommended;
                const yearlyUSD = tier.yearlyPrice;
                const monthlyUSD = tier.monthlyPrice;
                const monthlyETB = tier.priceETB;
                const discount = tier.yearlyDiscount;
                const isFree = monthlyUSD === 0;
                
                return (
                <div key={tier.id} className={`flex flex-col justify-between rounded-3xl bg-white p-6 sm:p-8 xl:p-10 ring-1 ${isPopular ? 'ring-indigo-600 shadow-xl relative z-10' : 'ring-slate-200'}`}>
                  {isPopular && (
                    <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold leading-5 text-white">Recommended</div>
                  )}
                  <div>
                    <div className="flex items-center justify-between gap-x-4">
                      <h3 className={`text-lg font-semibold leading-8 ${isPopular ? 'text-indigo-600' : 'text-slate-900'}`}>{tier.name}</h3>
                      {!isFree && discount > 0 && (
                         <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-100">
                           Save {discount}%
                         </span>
                      )}
                    </div>
                    <p className="mt-4 text-sm text-slate-500 line-clamp-2 h-10">{tier.description}</p>
                    
                    <div className="mt-6 flex flex-col gap-1">
                      <p className="flex items-baseline gap-x-1">
                        <span className="text-4xl font-bold tracking-tight text-slate-900">${isFree ? 0 : yearlyUSD}</span>
                        <span className="text-sm font-semibold leading-6 text-slate-600">/year</span>
                      </p>
                      {!isFree && (
                        <>
                          <p className="text-sm font-medium text-slate-500">
                            or ${monthlyUSD}/mo (≈ {monthlyETB.toLocaleString('en-US', { maximumFractionDigits: 0 })} ETB/mo)
                          </p>
                        </>
                      )}
                      {isFree && (
                         <p className="text-sm font-medium text-slate-500">
                            Forever Free
                         </p>
                      )}
                    </div>
                    
                    <ul className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex gap-x-3">
                          <CheckCircle2 className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => setCurrentView('signup')} className={`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors cursor-pointer ${isPopular ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600' : 'bg-slate-50 text-slate-900 ring-1 ring-inset ring-slate-200 hover:ring-slate-300'}`}>Get Started</button>
                </div>
              )})}
            </div>
            
            <div className="mt-10 text-center">
               <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">Compare all plan features <span aria-hidden="true">&rarr;</span></button>
            </div>
          </div>
        </div>
        )}

        {/* Testimonials */}
        {config.testimonialsEnabled && (
        <div className="py-16 sm:py-24 bg-white overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{config.testimonialsTitle || 'Loved by businesses everywhere'}</h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 mb-10 sm:mb-12">{config.testimonialsSubtitle || 'See what our early adopters have to say.'}</p>
            
            {config.testimonials.length === 0 ? (
            <div className="relative max-w-3xl mx-auto border-2 border-dashed border-slate-200 rounded-2xl sm:rounded-3xl p-8 sm:p-12 bg-slate-50">
               <Star className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-4" />
               <h3 className="text-lg sm:text-xl font-medium text-slate-900 mb-2">Customer Testimonials Coming Soon</h3>
               <p className="text-sm sm:text-base text-slate-500">We are currently onboarding our first cohort of restaurants. Check back later to see their success stories and reviews!</p>
            </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {config.testimonials.filter(t => t.enabled).sort((a,b) => a.order - b.order).map(testimonial => (
                  <div key={testimonial.id} className="bg-slate-50 p-6 rounded-2xl text-left shadow-sm">
                    <Star className="w-8 h-8 text-indigo-400 mb-4" />
                    <p className="text-slate-600 italic mb-6">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      {testimonial.imageUrl ? (
                        <img src={testimonial.imageUrl} alt={testimonial.author} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">{testimonial.author.charAt(0)}</div>
                      )}
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{testimonial.author}</h4>
                        <p className="text-xs text-slate-500">{testimonial.role}, {testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}

        {/* FAQ Section */}
        {config.faqEnabled && (
        <div id="faq" className="py-16 sm:py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">{config.faqTitle || 'Frequently Asked Questions'}</h2>
              {config.faqSubtitle && <p className="mt-4 text-base text-slate-600">{config.faqSubtitle}</p>}
            </div>
            <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
              {config.faqs.filter(q => q.enabled).sort((a,b) => a.order - b.order).map((faq, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div key={faq.id} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <button 
                      onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                      className="flex w-full items-center justify-between gap-4 text-left font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-lg cursor-pointer"
                    >
                      <span className="text-base sm:text-lg">{faq.question}</span>
                      <ChevronDown className={`h-5 w-5 flex-shrink-0 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div 
                      id={`faq-answer-${faq.id}`}
                      className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}
                      role="region"
                      aria-labelledby={`faq-question-${faq.id}`}
                    >
                      <div className="overflow-hidden">
                        <dd className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">{faq.answer}</dd>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        )}

        {/* CTA Section */}
        <div className="bg-indigo-600 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to modernize your business?</h2>
            <p className="mx-auto mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-7 sm:leading-8 text-indigo-100">
              Join the future of restaurant management today. Setup takes minutes.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 w-full max-w-sm sm:max-w-none mx-auto">
              <button 
                onClick={() => setCurrentView('customer')}
                className="w-full sm:w-auto rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 transition-all hover:scale-105 cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-10 sm:py-12 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <ChefHat className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-slate-900">Dinex</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 sm:gap-x-8 sm:gap-y-4 text-xs sm:text-sm font-medium text-slate-600">
              {config.footerLinks.sort((a,b) => a.order - b.order).map(link => (
                <a key={link.id} href={link.url} className="hover:text-indigo-600">{link.label}</a>
              ))}
              {config.footerPrivacyUrl && <a href={config.footerPrivacyUrl} className="hover:text-indigo-600">Privacy Policy</a>}
              {config.footerTermsUrl && <a href={config.footerTermsUrl} className="hover:text-indigo-600">Terms</a>}
              {config.contactEmail && <a href={`mailto:${config.contactEmail}`} className="hover:text-indigo-600">Contact</a>}
            </div>
            
            <div className="text-xs sm:text-sm text-slate-500 text-center">
              {config.footerCopyright}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
