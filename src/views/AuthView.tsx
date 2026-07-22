import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChefHat, ArrowLeft, Mail, AlertCircle, Check, Lock, UserCircle } from 'lucide-react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../lib/firebase';

type AuthMode = 'signin' | 'signup';

export default function AuthView({ defaultMode = 'signin' }: { defaultMode?: AuthMode }) {
  const { login, registerUser, setCurrentView } = useApp();
  
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [signupRole, setSignupRole] = useState<'customer' | 'owner'>('owner');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const user = await signInWithGoogle();
      if (!user.email) throw new Error("No email provided by Google.");
      
      const exists = await login(user.email);
      if (!exists) {
        if (mode === 'signup') {
          await registerUser(user.email, user.displayName || 'User', signupRole);
          await login(user.email);
          setSuccessMsg('Account created successfully!');
        } else {
          setErrorMsg('Account not found in our records. Please sign up.');
        }
      } else {
        setSuccessMsg('Successfully logged in!');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to authenticate with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (mode === 'signup' && !name) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      if (mode === 'signin') {
        const user = await signInWithEmail(email, password);
        if (!user.email) throw new Error("No email returned.");
        const exists = await login(user.email);
        if (exists) {
          setSuccessMsg('Successfully logged in!');
        } else {
          setErrorMsg('Account not found in our records. Please sign up.');
        }
      } else {
        const user = await signUpWithEmail(email, password);
        if (!user.email) throw new Error("No email returned.");
        await registerUser(user.email, name, signupRole);
        await login(user.email);
        setSuccessMsg('Account created successfully!');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8 relative">
      <button 
        onClick={() => setCurrentView('landing')}
        className="absolute top-6 left-6 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-100 text-slate-600 hover:text-slate-950 hover:border-slate-200 shadow-sm transition-all text-xs font-bold cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg mb-4">
          <ChefHat className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {mode === 'signin' ? 'Sign In to Dinex' : 'Create Your Account'}
        </h2>
        <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
          {mode === 'signin' 
            ? 'Enter your credentials to access your account' 
            : 'Sign up to start managing or exploring on Dinex'}
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-100/50 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-xs font-medium flex gap-2.5 items-start">
              <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="leading-normal">{errorMsg}</p>
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-medium flex gap-2.5 items-start">
              <Check className="h-4 w-4 bg-emerald-500 text-white rounded-full p-0.5 shrink-0 mt-0.5" />
              <p className="leading-normal">{successMsg}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-3 rounded-xl bg-white border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase">
              <span className="bg-white px-2.5 text-[9px] text-slate-400 tracking-wider">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                  <button
                    type="button"
                    onClick={() => setSignupRole('customer')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      signupRole === 'customer'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('owner')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      signupRole === 'owner'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Business Owner
                  </button>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors cursor-pointer mt-2 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
            </button>
          </form>
          
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-indigo-600 hover:text-indigo-500 font-bold underline cursor-pointer"
              >
                {mode === 'signin' ? "Sign up here" : "Sign in here"}
              </button>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
