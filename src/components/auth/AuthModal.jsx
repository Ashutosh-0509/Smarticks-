import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ArrowLeft, X, UserCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const AuthModal = () => {
  const {
    user,
    isAuthModalOpen,
    authModalStep,
    requestedRole,
    email,
    name,
    otpCode,
    authError,
    isLoading,
    setRequestedRole,
    setEmail,
    setName,
    setOtpCode,
    closeAuthModal,
    sendOtp,
    verifyOtp,
    setAuthModalStep
  } = useAuth();

  const [inputEmail, setInputEmail] = useState(email || '');
  const [inputName, setInputName] = useState(name || '');
  const [inputOtp, setInputOtp] = useState(otpCode || '');
  const [timeLeft, setTimeLeft] = useState(272);

  React.useEffect(() => {
    if (authModalStep === 'otp_input') {
      setTimeLeft(272);
      const timer = setInterval(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [authModalStep]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (/\D/.test(value)) return;
    const newOtp = inputOtp.padEnd(6, '').split('');
    newOtp[index] = value;
    const finalOtp = newOtp.join('').slice(0, 6);
    setInputOtp(finalOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !inputOtp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      setInputOtp(pastedData);
      if (pastedData.length === 6) {
        document.getElementById('otp-5')?.focus();
      }
    }
  };

  if (!isAuthModalOpen) return null;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const isRegistration = authModalStep === 'register_input';
    const success = await sendOtp(inputEmail, isRegistration, user?.role || requestedRole);
    if (success) {
      if (isRegistration) {
        setName(inputName);
      }
      setInputOtp('');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const result = await verifyOtp(inputOtp, name);
    if (result) {
      if (result.role === 'staff') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop - Plain black semi-transparent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0B1E3D]/50 backdrop-blur-none"
          onClick={closeAuthModal}
        />

        {/* Container - max-w-sm, border, shadow-sm */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-sm bg-white rounded-lg border border-[var(--border-color)] shadow-sm overflow-hidden z-10 font-sans p-6"
        >
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-[#D64545] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Emblem + Product Name */}
          <div className="flex flex-col items-center justify-center mb-6 pt-2">
            <div className="w-12 h-12 rounded-lg bg-[var(--surface)] text-[var(--accent)] flex items-center justify-center border border-[var(--border-color)] mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-heading text-[var(--ink)]">CivicReport</h2>
            <p className="text-sm text-gray-500 mt-1">Government Online Services</p>
          </div>

          <div className="space-y-6">
            {/* STEP 0: ROLE SELECTION */}
            {authModalStep === 'role_selection' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setRequestedRole('citizen');
                      setAuthModalStep('email_input');
                    }}
                    className="flex flex-col items-center justify-center p-6 border-2 border-[var(--border-color)] rounded-lg hover:border-[#C49A45] bg-[var(--surface)] hover:bg-[#FDF8F3] transition-all text-center cursor-pointer group"
                  >
                    <UserCheck className="w-8 h-8 text-gray-400 group-hover:text-[#C49A45] mb-3 transition-colors" />
                    <span className="font-bold text-[var(--ink)] text-base">Citizen Portal</span>
                    <span className="text-xs text-gray-500 mt-1">Report & track issues</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRequestedRole('staff');
                      setAuthModalStep('email_input');
                    }}
                    className="flex flex-col items-center justify-center p-6 border-2 border-[var(--border-color)] rounded-lg hover:border-[#C49A45] bg-[var(--surface)] hover:bg-[#FDF8F3] transition-all text-center cursor-pointer group"
                  >
                    <ShieldCheck className="w-8 h-8 text-gray-400 group-hover:text-[#C49A45] mb-3 transition-colors" />
                    <span className="font-bold text-[var(--ink)] text-base">Municipal Authority</span>
                    <span className="text-xs text-gray-500 mt-1">Official dispatch center</span>
                  </button>
                </div>

                {/* Instant 1-Click Demo Login */}
                <div className="pt-3 border-t border-[var(--border-color)] space-y-2">
                  <span className="text-[11px] font-mono font-semibold text-gray-500 uppercase block text-center">
                    ⚡ Quick Instant Demo Login
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => quickLogin('citizen')}
                      className="px-3 py-2 bg-[#14213D] hover:bg-[#1f3057] text-white text-xs font-semibold rounded cursor-pointer transition-colors text-center"
                    >
                      Demo Citizen
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        quickLogin('staff');
                        window.location.href = '/dashboard';
                      }}
                      className="px-3 py-2 bg-[#C49A45] hover:bg-[#a88235] text-white text-xs font-semibold rounded cursor-pointer transition-colors text-center"
                    >
                      Demo Officer (Staff)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: EMAIL ENTRY */}
            {authModalStep === 'email_input' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setAuthModalStep('role_selection')}
                    className="p-1 -ml-1 text-gray-400 hover:text-[var(--ink)] cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h3 className="text-lg font-bold font-heading text-[var(--ink)]">
                    {requestedRole === 'staff' ? 'Authority Sign In' : 'Citizen Sign In'}
                  </h3>
                </div>

                {authError && (
                  <div className="p-3 rounded border border-[#D64545]/30 bg-[#D64545]/10 text-xs flex flex-col gap-2">
                    <span className="font-semibold text-[#D64545]">{authError}</span>
                    {authError.includes('register first') && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setAuthModalStep('register_input');
                        }}
                        className="self-start px-3 py-1.5 bg-white text-[#14213D] border border-[#DDE1E7] rounded font-bold hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        Register Now
                      </button>
                    )}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[var(--border-color)] rounded font-sans text-sm text-[var(--ink)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  className="w-full font-semibold bg-[var(--ink)] hover:bg-black"
                >
                  Send OTP Code
                </Button>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setAuthModalStep('register_input')}
                    className="text-xs text-[var(--ink)] hover:text-[#C49A45] hover:underline font-semibold"
                  >
                    New here? Register
                  </button>
                </div>
              </form>
            )}

            {/* STEP 1.5: REGISTRATION */}
            {authModalStep === 'register_input' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setAuthModalStep('email_input')}
                    className="p-1 -ml-1 text-gray-400 hover:text-[var(--ink)] cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h3 className="text-lg font-bold font-heading text-[var(--ink)]">
                    {requestedRole === 'staff' ? 'Register Municipal Authority' : 'Register as Citizen'}
                  </h3>
                </div>

                {authError && (
                  <div className="p-3 rounded border border-[#D64545]/30 bg-[#D64545]/10 text-xs font-semibold text-[#D64545]">
                    {authError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[var(--border-color)] rounded font-sans text-sm text-[var(--ink)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[var(--border-color)] rounded font-sans text-sm text-[var(--ink)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  className="w-full font-semibold bg-[var(--ink)] hover:bg-black mt-2"
                >
                  Send OTP Code
                </Button>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setAuthModalStep('email_input')}
                    className="text-xs text-[var(--ink)] hover:text-[#C49A45] hover:underline font-semibold"
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: OTP VERIFICATION */}
            {authModalStep === 'otp_input' && (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setAuthModalStep('email_input')}
                    className="p-1 -ml-1 text-gray-400 hover:text-[var(--ink)] cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h3 className="text-lg font-bold font-heading text-[var(--ink)]">Enter OTP</h3>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-600">
                    Code sent to <strong>{inputEmail}</strong>
                  </p>
                  <p className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em]">
                    Code expires in <span className="text-[#D64545] font-mono">{formatTime(timeLeft)}</span>
                  </p>
                </div>

                {authError && (
                  <div className="p-3 rounded border border-[#D64545]/30 bg-[#D64545]/10 text-xs font-semibold text-[#D64545]">
                    {authError}
                  </div>
                )}

                <div className="pt-2">
                  <label className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] block mb-2">
                    Enter 6-Digit Verification Code
                  </label>
                  <div className="flex items-center justify-between gap-2" onPaste={handlePaste}>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength={1}
                        value={inputOtp[i] || ''}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-12 h-14 text-center text-xl font-bold font-mono bg-white border border-[var(--border-color)] rounded focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                      />
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  className="w-full font-semibold bg-[var(--ink)] hover:bg-black"
                >
                  Verify & Enter
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
