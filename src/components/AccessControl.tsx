import React, { useState } from 'react';
import { SailLogo } from './SailLogo';
import { loginUser, registerUser } from '../utils/db';
import { User } from '../types';
import { KeyRound, Mail, UserPlus, Milestone, Briefcase, LogIn, Lock, Info } from 'lucide-react';

interface AccessControlProps {
  onLoginSuccess: (user: User) => void;
}

export const AccessControl: React.FC<AccessControlProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup fields
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupDept, setSignupDept] = useState('');
  const [signupRole, setSignupRole] = useState<'Admin' | 'Staff' | 'Chief Engineer'>('Staff');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  
  // Feedback alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginEmail || !loginPassword) {
      setErrorMsg("Please enter both corporate email and password.");
      return;
    }

    const result = loginUser(loginEmail, loginPassword);
    if (typeof result === 'string') {
      setErrorMsg(result);
    } else {
      setSuccessMsg("Access Granted. Authorization verified.");
      setTimeout(() => {
        onLoginSuccess(result);
      }, 500);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validations
    if (!signupFullName || !signupEmail || !signupDept || !signupPassword) {
      setErrorMsg("All registration fields are strictly required.");
      return;
    }

    if (signupPassword.length < 6) {
      setErrorMsg("Security constraint: Password must be at least 6 characters long.");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMsg("Password verification failed. Passwords do not match.");
      return;
    }

    // Call DB signup helper
    const result = registerUser(signupEmail, signupFullName, signupDept, signupRole, signupPassword);
    if (typeof result === 'string') {
      setErrorMsg(result);
    } else {
      setSuccessMsg("Account registered successfully. Signing in...");
      setTimeout(() => {
        onLoginSuccess(result);
      }, 700);
    }
  };

  const handleQuickDemoFill = (type: 'admin' | 'engineer') => {
    setErrorMsg(null);
    if (type === 'admin') {
      setLoginEmail('admin@sail.co.in');
      setLoginPassword('password123');
    } else {
      setLoginEmail('engineer@sail.co.in');
      setLoginPassword('password123');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center relative px-4" id="access-page-root">
      
      {/* Visual background grid pattern for technical steel aura */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Decorative metal support line at top and bottom */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#002d62] pointer-events-none" />
      <div className="absolute top-1.5 left-0 w-full h-1 bg-[#ff8c00] pointer-events-none" />

      <div className="w-full max-w-lg relative bg-white border border-slate-200 rounded-none shadow-xl overflow-hidden p-8 z-10" id="login-container-card">
        
        {/* SAIL Logo branding */}
        <div className="flex flex-col items-center text-center mb-8" id="access-logo-header">
          <div className="bg-white p-3 rounded-none inline-block shadow-sm border border-slate-100 mb-3">
            <SailLogo size={52} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#002d62] mt-1">
            DEPARTMENTAL STORES &amp; INVENTORY PORTAL
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm leading-relaxed">
            Centralized ERP Registry for Inward Refills, Outward Issued Logs, Technical Audit &amp; Stocks Analysis.
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="bg-rose-50 border-l-4 border-rose-600 text-rose-900 px-4 py-3 rounded-none text-sm mb-5 flex items-start gap-2.5 animate-fadeIn" id="login-error">
            <Info className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-50 border-l-4 border-emerald-600 text-emerald-900 px-4 py-3 rounded-none text-sm mb-5 flex items-start gap-2.5 animate-fadeIn" id="login-success">
            <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Selector Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-none mb-6 border border-slate-200" id="form-toggle-switch">
          <button 
            onClick={() => { setIsLogin(true); setErrorMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isLogin 
                ? 'bg-white text-[#002d62] font-black shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
            id="btn-switch-login"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In to Portal
          </button>
          <button 
            onClick={() => { setIsLogin(false); setErrorMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer ${
              !isLogin 
                ? 'bg-white text-[#002d62] font-black shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
            id="btn-switch-signup"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Create Account
          </button>
        </div>

        {isLogin ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4" id="login-form">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. admin@sail.co.in"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-none pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00] transition-all font-mono"
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Portal Access Password
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-none pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00] transition-all font-mono"
                  required
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#002d62] hover:bg-[#00224b] text-white py-2.5 rounded-none text-xs font-bold uppercase tracking-wider transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#ff8c00] border-b-4 border-[#ff8c00] mt-4 flex items-center justify-center gap-2 cursor-pointer"
              id="submit-login"
            >
              <LogIn className="w-4 h-4 text-[#ff8c00]" />
              Authorize &amp; Sign In
            </button>

            {/* Quick Demo Credentials pre-fill info panel */}
            <div className="bg-slate-50 p-4 rounded-none border border-slate-200 mt-6" id="demo-credentials-panel">
              <span className="text-[10px] font-bold text-slate-500 block mb-2 tracking-wider uppercase">
                ⚙️ Quick Access (Evaluators Demo Accounts)
              </span>
              <div className="grid grid-cols-2 gap-2" id="demo-buttons-grid">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('admin')}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-1.5 px-3 rounded-none text-xs font-semibold transition-all text-left flex items-center justify-between cursor-pointer"
                  id="btn-demo-admin"
                >
                  <span>Admin Demo</span>
                  <span className="text-[9px] bg-blue-50 text-[#002d62] px-1.5 py-0.5 rounded font-mono font-bold border border-blue-200/50">BSP</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('engineer')}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-1.5 px-3 rounded-none text-xs font-semibold transition-all text-left flex items-center justify-between cursor-pointer"
                  id="btn-demo-engineer"
                >
                  <span>Engineer Demo</span>
                  <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-mono font-bold border border-amber-200/50">RSP</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                Password is <strong>password123</strong> for pre-loaded system accounts. No setup is needed.
              </p>
            </div>
          </form>
        ) : (
          /* SIGNUP FORM */
          <form onSubmit={handleSignupSubmit} className="space-y-4 animate-fadeIn" id="signup-form">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Full Name &amp; Initial
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    placeholder="e.g. S. K. Mahapatra"
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-none pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00] transition-all font-sans"
                    required
                  />
                  <Milestone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  SAIL Corporate Email
                </label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@sail.co.in"
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-none pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00] transition-all font-mono"
                    required
                  />
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Department Division
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={signupDept}
                    onChange={(e) => setSignupDept(e.target.value)}
                    placeholder="e.g. Structurals Yard 3"
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-none pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00] transition-all font-sans"
                    required
                  />
                  <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Administrative Clearance Role
                </label>
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-none px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00] transition-all"
                >
                  <option value="Staff">Warehouse Staff Operator</option>
                  <option value="Chief Engineer">Chief Technical Engineer</option>
                  <option value="Admin">Portal Administrator</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Choose Safe Password
                </label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-none pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00] transition-all font-mono"
                    required
                  />
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Verify Password
                </label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-none pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00] transition-all font-mono"
                    required
                  />
                  <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#002d62] hover:bg-[#00224b] text-white py-2.5 rounded-none text-xs font-bold uppercase tracking-wider transition-all shadow-md focus:outline-none border-b-4 border-[#ff8c00] mt-4 flex items-center justify-center gap-2 cursor-pointer"
              id="submit-signup"
            >
              <UserPlus className="w-4 h-4 text-[#ff8c00]" />
              Register Store Officer
            </button>
          </form>
        )}
      </div>

      {/* Decorative corporate technical disclaimer at bottom */}
      <p className="text-[10px] text-slate-500 text-center mt-6 tracking-wide leading-relaxed uppercase" id="login-copyright">
        &copy; {new Date().getFullYear()} Steel Authority of India Limited. Authorized Central Stores ERP Gate.<br/>
        SAIL Corporate Computer network rules &amp; Information Security policies apply.
      </p>
    </div>
  );
};
