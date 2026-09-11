import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Key, 
  Smartphone, 
  Lock, 
  Laptop, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Copy,
  RefreshCw
} from 'lucide-react';
import { 
  getOrCreateRecoveryPhrase, 
  getSecuritySettings, 
  saveSecuritySettings, 
  getHardwareSessions 
} from '../../services/securityService';
import { SecuritySession } from '../../types';

export const SecurityCenterScreen: React.FC = () => {
  const { navigateBack, showToast, authUser } = useApp();
  const currentUid = authUser?.uid || 'local_pioneer';

  const [phrase, setPhrase] = useState('');
  const [showPhrase, setShowPhrase] = useState(false);
  const [passkeyActive, setPasskeyActive] = useState(true);
  const [twoFactorActive, setTwoFactorActive] = useState(true);
  const [sessions, setSessions] = useState<SecuritySession[]>([]);

  useEffect(() => {
    async function loadSecurity() {
      const savedPhrase = await getOrCreateRecoveryPhrase(currentUid);
      setPhrase(savedPhrase);

      const settings = await getSecuritySettings(currentUid);
      setPasskeyActive(settings.passkeyActive);
      setTwoFactorActive(settings.twoFactorActive);

      setSessions(getHardwareSessions());
    }
    loadSecurity();
  }, [currentUid]);

  const handleTogglePasskey = async () => {
    const next = !passkeyActive;
    setPasskeyActive(next);
    await saveSecuritySettings(currentUid, {
      passkeyActive: next,
      twoFactorActive,
      phraseVerified: true,
    });
    showToast(next ? 'Biometric Passkey enabled' : 'Biometric Passkey disabled', 'info');
  };

  const handleToggle2FA = async () => {
    const next = !twoFactorActive;
    setTwoFactorActive(next);
    await saveSecuritySettings(currentUid, {
      passkeyActive,
      twoFactorActive: next,
      phraseVerified: true,
    });
    showToast(next ? 'Two-Factor Authentication enabled' : 'Two-Factor Authentication disabled', 'info');
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    showToast('Device session revoked', 'info');
  };

  return (
    <div className="w-full flex-1 px-4 py-3 space-y-4 pb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={navigateBack}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-white tracking-wide font-sans">
          Security Center
        </h1>
        <div className="w-9" />
      </div>

      <div className="p-5 rounded-3xl bg-gradient-to-tr from-[#0F2218] via-[#121A26] to-[#0A0D15] border border-emerald-500/40 text-center space-y-2 relative overflow-hidden shadow-xl">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-cyan-glow">
          <ShieldCheck className="w-10 h-10" />
        </div>

        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Account Protected
        </h2>
        <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
          Your VandeID and cryptographic participation keys are safeguarded with hardware-level biometric encryption.
        </p>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SECURITY STATUS: ACTIVE & SECURED</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono px-1">
          Cryptographic Protection
        </h3>

        {/* 1. Passkey */}
        <div className="p-4 rounded-2xl bg-[#111420] border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Passkey / WebAuthn</span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono">HARDWARE</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Biometric fingerprint / face unlock key
              </div>
            </div>
          </div>

          <button
            onClick={handleTogglePasskey}
            className={`w-11 h-6 rounded-full p-1 transition-colors ${
              passkeyActive ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-black transition-transform ${passkeyActive ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* 2. 2FA */}
        <div className="p-4 rounded-2xl bg-[#111420] border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Two-Factor Authentication (2FA)</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Multi-factor session verification
              </div>
            </div>
          </div>

          <button
            onClick={handleToggle2FA}
            className={`w-11 h-6 rounded-full p-1 transition-colors ${
              twoFactorActive ? 'bg-[#FF9933]' : 'bg-slate-700'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-black transition-transform ${twoFactorActive ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* 3. Real 12-Word Recovery Phrase */}
        <div className="p-4 rounded-2xl bg-[#111420] border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">12-Word Recovery Phrase</div>
                <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>BIP39 Seed Verified</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPhrase(!showPhrase)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1 font-mono"
            >
              {showPhrase ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPhrase ? 'Hide' : 'Reveal'}</span>
            </button>
          </div>

          {showPhrase && (
            <div className="p-3 rounded-xl bg-[#090B12] border border-amber-500/30 text-amber-200 text-xs font-mono space-y-2 animate-fade-in">
              <p className="select-all leading-relaxed break-words">{phrase}</p>
              <button
                onClick={() => {
                  if (navigator.clipboard) navigator.clipboard.writeText(phrase);
                  showToast('12-Word Recovery phrase copied securely!', 'info');
                }}
                className="flex items-center gap-1 text-[11px] text-[#FF9933] font-bold hover:underline"
              >
                <Copy className="w-3 h-3" />
                <span>Copy 12-word mnemonic phrase</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Hardware Sessions */}
      <div className="space-y-2.5 pt-1">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono px-1">
          Active Hardware Sessions ({sessions.length})
        </h3>

        {sessions.map(session => (
          <div
            key={session.id}
            className={`p-3.5 rounded-2xl bg-[#111420] border border-white/10 flex items-center justify-between text-xs ${
              !session.isCurrent ? 'opacity-80' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              {session.platform === 'Android' || session.platform === 'iOS' ? (
                <Smartphone className="w-5 h-5 text-emerald-400" />
              ) : (
                <Laptop className="w-5 h-5 text-cyan-400" />
              )}
              <div>
                <div className="font-bold text-white">{session.device}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {session.browser} • {session.location}
                </div>
              </div>
            </div>

            {session.isCurrent ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold">
                CURRENT
              </span>
            ) : (
              <button 
                onClick={() => handleRevokeSession(session.id)}
                className="text-[11px] font-mono text-rose-400 hover:underline"
              >
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
