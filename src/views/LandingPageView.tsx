import React, { useState } from 'react';
import { 
  Building2, ChefHat, Store, Coffee, QrCode, Smartphone, Cloud, 
  Lock, Zap, WifiOff, Users, Calendar, MapPin, 
  BarChart3, PieChart, ShieldCheck, CheckCircle2, 
  ChevronRight, ArrowRight, Menu, X, Play, CreditCard, Star, Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { signInWithGoogle } from '../lib/firebase';

export default function LandingPageView({ onEnterApp }: { onEnterApp: () => void }) {
  const { login } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  const handleLogin = async () => {
    setIsLoginLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      // Fallback
      login('demo@menuflow.com');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Marketplace', href: '#marketplace' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex w-full items-center justify-between py-4">
            <div className="flex items-center">
              <a href="#" className="flex items-center gap-2 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-lg shadow-indigo-200 transition-transform group-hover:scale-105">
                  <ChefHat className="h-6 w-6" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">Dinex</span>
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
              <button 
                onClick={handleLogin}
                disabled={isLoginLoading}
                className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
              >
                {isLoginLoading ? 'Logging in...' : 'Login'}
              </button>
              <button
                onClick={onEnterApp}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                View Demo
              </button>
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
                <a key={link.name} href={link.href} className="block text-base font-medium text-slate-600 hover:text-indigo-600 py-2">
                  {link.name}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <button 
                  onClick={handleLogin}
                  className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Login
                </button>
                <button
                  onClick={onEnterApp}
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-500"
                >
                  View Demo
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="mx-auto max-w-4xl font-display text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
              Modern Digital Restaurant & <br className="hidden sm:block" />
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
                        <div key={i} className={`h-8 rounded-md ${i===1 ? 'bg-indigo-100/50' : 'bg-slate-100'}`}></div>
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
        </div>

        {/* Trust Section */}
        <div className="py-12 bg-white sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-center text-sm font-semibold leading-8 text-slate-500 uppercase tracking-wider mb-8">
              Why businesses choose Dinex
            </p>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6 text-slate-600 font-medium text-sm">
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
        <div id="features" className="py-24 sm:py-32 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Platform Features</p>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                A complete suite of tools designed to streamline your operations and boost customer satisfaction.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {[
                  { name: 'Digital Menu & QR Ordering', description: 'Let customers scan and order instantly from their tables or homes.', icon: QrCode },
                  { name: 'Kitchen Display (KDS)', description: 'Send orders straight to the kitchen. Track prep times and manage tickets.', icon: ChefHat },
                  { name: 'Reservations', description: 'Manage table bookings, walk-ins, and waitlists with ease.', icon: Calendar },
                  { name: 'Delivery Management', description: 'Track drivers, optimize routes, and keep customers updated.', icon: MapPin },
                  { name: 'Customer Loyalty & Subs', description: 'Create meal subscriptions and reward programs to retain customers.', icon: Users },
                  { name: 'Reports & Analytics', description: 'Get insights into sales, popular items, and staff performance.', icon: BarChart3 },
                ].map((feature) => (
                  <div key={feature.name} className="flex flex-col bg-white rounded-2xl p-8 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                      <p className="flex-auto">{feature.description}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">How it Works</h2>
              <p className="mt-4 text-lg text-slate-600">Get up and running in minutes, not days.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
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
        <div id="solutions" className="py-24 bg-slate-900 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built for all F&B Businesses</h2>
              <p className="mt-4 text-lg text-slate-400">Whatever you run, Dinex has the modules you need.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {['Restaurants', 'Coffee Shops', 'Fast Food', 'Bakeries', 'Hotels', 'Food Courts', 'Juice Bars', 'Pizza Shops', 'Ice Cream Shops', 'Food Trucks', 'Catering'].map(type => (
                <span key={type} className="px-4 py-2 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700/50 hover:bg-slate-700 transition-colors">
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" className="py-24 sm:py-32 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Simple, transparent pricing</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">Choose the perfect plan for your business needs.</p>
            </div>
            
            <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-5xl lg:grid-cols-3">
              {[
                { name: 'Free', price: '$0', features: ['1 Branch', 'Basic Menu Design', 'QR Ordering', 'Community Support'] },
                { name: 'Pro', price: '$49', popular: true, features: ['3 Branches', 'Advanced Menu Modifiers', 'Kitchen Display System', 'Priority Support', 'Staff Management'] },
                { name: 'Enterprise', price: 'Custom', features: ['Unlimited Branches', 'White-labeling', 'Custom Integrations', 'Dedicated Account Manager', 'SLA Agreement'] }
              ].map((tier) => (
                <div key={tier.name} className={`flex flex-col justify-between rounded-3xl bg-white p-8 xl:p-10 ring-1 ${tier.popular ? 'ring-indigo-600 shadow-xl relative z-10' : 'ring-slate-200'}`}>
                  {tier.popular && (
                    <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold leading-5 text-white">Recommended</div>
                  )}
                  <div>
                    <div className="flex items-center justify-between gap-x-4">
                      <h3 className={`text-lg font-semibold leading-8 ${tier.popular ? 'text-indigo-600' : 'text-slate-900'}`}>{tier.name}</h3>
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
                  <button className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${tier.popular ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600' : 'bg-slate-50 text-slate-900 ring-1 ring-inset ring-slate-200 hover:ring-slate-300'}`}>
                    {tier.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
               <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">Compare all plan features <span aria-hidden="true">&rarr;</span></button>
            </div>
          </div>
        </div>

        {/* Testimonials - Coming Soon */}
        <div className="py-24 bg-white overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Loved by businesses everywhere</h2>
            <p className="mt-4 text-lg text-slate-600 mb-12">See what our early adopters have to say.</p>
            
            <div className="relative max-w-3xl mx-auto border-2 border-dashed border-slate-200 rounded-3xl p-12 bg-slate-50">
               <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
               <h3 className="text-xl font-medium text-slate-900 mb-2">Customer Testimonials Coming Soon</h3>
               <p className="text-slate-500">We are currently onboarding our first cohort of restaurants. Check back later to see their success stories and reviews!</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Frequently Asked Questions</h2>
            </div>
            <div className="mx-auto max-w-3xl space-y-6">
              {[
                { q: "How does Dinex work?", a: "Dinex provides a unified dashboard to manage your menu, staff, and operations. Customers can order via QR code or app, and orders flow directly to your Kitchen Display System." },
                { q: "Can I use QR menus?", a: "Yes, you can instantly generate QR codes for each table. Customers scan to view the live menu, place orders, and pay without waiting for a server." },
                { q: "Does it work on phones?", a: "Absolutely. Dinex is a Progressive Web App (PWA) that is fully responsive. Managers, staff, and customers can use it on any mobile device." },
                { q: "Can I manage multiple branches?", a: "Yes, our Pro and Enterprise plans allow you to manage multiple locations from a single dashboard, with unified reporting and menu control." },
                { q: "Does Dinex support delivery?", a: "Yes, we have a dedicated delivery management module to track drivers, assign orders, and provide customer ETAs." }
              ].map((faq, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <dt className="font-semibold text-slate-900">{faq.q}</dt>
                  <dd className="mt-2 text-slate-600">{faq.a}</dd>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-indigo-600 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to modernize your business?</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
              Join the future of restaurant management today. Setup takes minutes.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button 
                onClick={handleLogin}
                className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 transition-all hover:scale-105"
              >
                Get Started
              </button>
              <button onClick={onEnterApp} className="text-sm font-semibold leading-6 text-white group flex items-center gap-2">
                View Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <ChefHat className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-slate-900">Dinex</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-indigo-600">Features</a>
              <a href="#pricing" className="hover:text-indigo-600">Pricing</a>
              <a href="#marketplace" className="hover:text-indigo-600">Marketplace</a>
              <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-600">Terms</a>
              <a href="#" className="hover:text-indigo-600">Contact</a>
            </div>
            
            <div className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Dinex Platform. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
