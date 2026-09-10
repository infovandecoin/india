import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Mail, 
  Key, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Cloud,
  Loader2,
  UserCheck
} from 'lucide-react';
import { VdcLogo } from '../../assets/VdcLogo';

export const AuthScreen: React.FC = () => {
  const { 
    navigateTo, 
    showToast, 
    loginWithEmail, 
    registerWithEmail, 
    loginAsGuest, 
    isCloudConnected 
  } = useApp();
  const [authMode, setAuthMode] = useState<'create' | 'login'>('create');
  const [handle, setHandle] = useState('VandeExplorer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCompleteAuth = async () => {
    if (!email || !password) {
      showToast('Please enter both email and password', 'info');
      return;
    }

    setIsLoading(true);
    let success = false;
    if (authMode === 'create') {
      success = await registerWithEmail(email, password, handle.startsWith('@') ? handle : `@${handle}`);
    } else {
      success = await loginWithEmail(email, password);
    }
    setIsLoading(false);

    if (success) {
      navigateTo('setup-journey');
    }
  };

  const handleGuestAuth = async () => {
    setIsLoading(true);
    const success = await loginAsGuest();
    setIsLoading(false);
    if (success) {
      navigateTo('home');
    }
  };

  return (
    <div className="w-full flex-1 px-5 py-6 flex flex-col justify-between select-none pb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('onboarding')}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <VdcLogo size={26} variant="mark" />
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
          <Cloud className="w-3 h-3" />
          <span>{isCloudConnected ? 'Cloud Active' : 'Offline'}</span>
        </div>
      </div>

      <div className="space-y-5 my-auto py-2">
        <div className="flex flex-col items-center justify-center text-center space-y-2.5">
          <div className="p-3 rounded-2xl bg-gradient-to-b from-[#181C2A] to-[#0D1017] border border-[#FF9933]/30 shadow-gold-glow">
            <VdcLogo size={52} variant="mark" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {authMode === 'create' ? 'Create VandeID' : 'Welcome Back'}
            </h1>
            <p className="text-[10px] font-mono tracking-widest text-[#009944] uppercase font-bold">
              BUILT FOR A BRIGHTER INDIA
            </p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto pt-0.5">
              {authMode === 'create'
                ? 'Join a global digital ecosystem based on authentic participation and learning.'
                : 'Sign in to access your verified VDC balance and streaks across devices.'}
            </p>
          </div>
        </div>

        <div className="flex rounded-xl bg-[#111420] p-1 border border-white/10 text-xs">
          <button
            onClick={() => setAuthMode('create')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              authMode === 'create' ? 'bg-[#FF9933] text-black shadow-gold-glow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              authMode === 'login' ? 'bg-[#FF9933] text-black shadow-gold-glow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
        </div>

        <div className="space-y-2.5">
          {authMode === 'create' && (
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Choose Your Global Handle
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-500 font-mono text-xs">@</span>
                <input
                  type="text"
                  value={handle}
                  onChange={e => setHandle(e.target.value)}
                  className="w-full pl-8 pr-9 py-2.5 rounded-xl bg-[#111420] border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-[#FF9933]"
                  placeholder="username"
                />
                <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#111420] border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-[#FF9933]"
                placeholder="pioneer@vandecoin.network"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#111420] border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-[#FF9933]"
                placeholder="••••••••••••"
                onKeyDown={e => e.key === 'Enter' && handleCompleteAuth()}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleCompleteAuth}
          disabled={isLoading}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#FF9933] to-[#F59E0B] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>{authMode === 'create' ? 'CREATE SECURE VANDEID' : 'SIGN IN TO CLOUD'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] font-mono text-slate-500 uppercase">OR QUICK ACCESS</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleGuestAuth}
            disabled={isLoading}
            className="py-2.5 px-3 rounded-xl bg-[#111420] border border-white/10 hover:border-cyan-500/40 text-xs font-semibold text-white flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>Guest Pioneer</span>
          </button>

          <button
            onClick={() => {
              showToast('Passkey biometrics enabled', 'gold');
              navigateTo('setup-journey');
            }}
            className="py-2.5 px-3 rounded-xl bg-[#111420] border border-white/10 hover:border-emerald-500/40 text-xs font-semibold text-white flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Passkey</span>
          </button>
        </div>
      </div>

      <div className="text-center text-[11px] text-slate-500 font-sans leading-relaxed pt-4">
        By continuing, you agree to the VandeCoin Decentralized Participation Terms. No private keys are stored on central cloud servers.
      </div>
    </div>
  );
};
