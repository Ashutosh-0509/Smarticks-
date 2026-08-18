import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const AuthModal = () => {
  const {
    user,
    isAuthModalOpen,
    authModalStep,
    email,
    otpCode,
    authError,
    isLoading,
    setEmail,
    setOtpCode,
    closeAuthModal,
    sendOtp,
    verifyOtp,
    setAuthModalStep
  } = useAuth();

  const [inputEmail, setInputEmail] = useState(email || '');
  const [inputOtp, setInputOtp] = useState(otpCode || '');

  if (!isAuthModalOpen) return null;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const success = await sendOtp(inputEmail);
    if (success) {
      // Clear OTP field on new send
      setInputOtp('');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const result = await verifyOtp(inputOtp);
    if (result) {
      // Redirect based on role
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
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#14213D]/60 backdrop-blur-none"
          onClick={() => {
            if (user) closeAuthModal();
          }}
        />

        {/* Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-md bg-white rounded-lg border-2 border-[#DDE1E7] shadow-2xl overflow-hidden z-10 font-sans"
        >
          {/* Official Government Header Banner */}
          <div className="bg-[#14213D] text-white px-6 py-4 flex items-center justify-between border-b-4 border-[#E8963C]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center border border-white/20">
                <Shield className="w-6 h-6 text-[#E8963C]" />
              </div>
              <div>
                <span className="text-xs font-mono text-[#E8963C] uppercase tracking-wider block font-semibold">
                  GOVERNMENT OF INDIA
                </span>
                <h3 className="text-lg font-bold font-heading">
                  CivicReport Security
                </h3>
              </div>
            </div>
            {user && (
              <button
                type="button"
                onClick={closeAuthModal}
                className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded hover:bg-white/20 text-gray-300"
              >
                CLOSE ✕
              </button>
            )}
          </div>

          <div className="p-6 space-y-6">
            {/* STEP 1: EMAIL ENTRY */}
            {authModalStep === 'email_input' && (
              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h4 className="text-xl font-bold font-heading text-[#14213D]">
                    Sign In
                  </h4>
                  <p className="text-sm text-gray-600">
                    Enter your email to receive a secure login code.
                  </p>
                </div>

                {authError && (
                  <div className="p-3 rounded border border-[#D64545]/30 bg-[#D64545]/10 text-xs font-semibold text-[#D64545]">
                    ⚠️ {authError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#14213D] uppercase font-semibold">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DDE1E7] rounded-lg font-sans text-base text-[#14213D] focus-visible:ring-2 focus-visible:ring-[#E8963C]"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  className="w-full font-bold bg-[#14213D] hover:bg-[#1a2b50]"
                >
                  Send OTP Code
                </Button>
              </form>
            )}

            {/* STEP 2: OTP VERIFICATION */}
            {authModalStep === 'otp_input' && (
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <button
                  type="button"
                  onClick={() => setAuthModalStep('email_input')}
                  className="inline-flex items-center gap-1 text-xs font-mono text-gray-500 hover:text-[#14213D]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change Email ({inputEmail})
                </button>

                <div className="space-y-1">
                  <span className="text-xs font-mono text-[#4A9B6E] uppercase font-bold tracking-wider">
                    OTP SENT TO INBOX
                  </span>
                  <h4 className="text-xl font-bold font-heading text-[#14213D]">
                    Enter 6-Digit OTP Code
                  </h4>
                  <p className="text-xs text-gray-600">
                    Please check your email for the code. It expires in 5 minutes.
                  </p>
                </div>

                {authError && (
                  <div className="p-3 rounded border border-[#D64545]/30 bg-[#D64545]/10 text-xs font-semibold text-[#D64545]">
                    ⚠️ {authError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#14213D] uppercase font-semibold">
                    ONE TIME PASSWORD (OTP)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={inputOtp}
                    onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center tracking-[0.5em] px-3.5 py-3 bg-white border border-[#DDE1E7] rounded-lg font-mono text-2xl font-bold text-[#14213D] focus-visible:ring-2 focus-visible:ring-[#E8963C]"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  className="w-full font-bold bg-[#14213D] hover:bg-[#1a2b50]"
                >
                  Verify & Enter Portal
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
