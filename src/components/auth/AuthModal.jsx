import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, ShieldAlert, Smartphone, KeyRound, Lock, ArrowLeft, CheckCircle2, Shield, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const AuthModal = () => {
  const {
    user,
    isAuthModalOpen,
    authModalStep,
    phone,
    otpCode,
    adminEmail,
    adminPassword,
    authError,
    isLoading,
    setPhone,
    setOtpCode,
    setAdminEmail,
    setAdminPassword,
    closeAuthModal,
    selectRole,
    sendCitizenOtp,
    verifyCitizenOtp,
    loginAsAdmin,
    setAuthModalStep
  } = useAuth();

  const [inputPhone, setInputPhone] = useState(phone || '');
  const [inputOtp, setInputOtp] = useState(otpCode || '123456');
  const [inputAdminEmail, setInputAdminEmail] = useState(adminEmail || 'admin@city.gov.in');
  const [inputAdminPassword, setInputAdminPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    sendCitizenOtp(inputPhone);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    verifyCitizenOtp(inputOtp);
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    loginAsAdmin(inputAdminEmail, inputAdminPassword);
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
          className="relative w-full max-w-xl bg-white rounded-lg border-2 border-[#DDE1E7] shadow-2xl overflow-hidden z-10 font-sans"
        >
          {/* Official Government Header Banner */}
          <div className="bg-[#14213D] text-white px-6 py-4 flex items-center justify-between border-b-4 border-[#E8963C]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center border border-white/20">
                <Shield className="w-6 h-6 text-[#E8963C]" />
              </div>
              <div>
                <span className="text-xs font-mono text-[#E8963C] uppercase tracking-wider block font-semibold">
                  GOVERNMENT OF INDIA • MUNICIPAL PORTAL
                </span>
                <h3 className="text-lg font-bold font-heading">
                  CivicReport Security Gateway
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
            {/* STEP 1: TWO CARD ROLE SELECTION POPUP */}
            {authModalStep === 'role_select' && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <h4 className="text-xl font-bold font-heading text-[#14213D]">
                    Select Portal Access Mode
                  </h4>
                  <p className="text-sm text-gray-600">
                    Choose your portal access role to log in or verify credentials.
                  </p>
                </div>

                {/* 2 CARDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* CARD 1: CITIZEN / USER */}
                  <div
                    onClick={() => selectRole('citizen')}
                    className="group rounded-lg border-2 border-[#DDE1E7] bg-white p-5 cursor-pointer hover:border-[#E8963C] hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-lg bg-[#E8963C]/10 border border-[#E8963C]/30 text-[#E8963C] flex items-center justify-center group-hover:bg-[#E8963C] group-hover:text-white transition-colors">
                        <UserCheck className="w-6 h-6 stroke-[2]" />
                      </div>
                      <div>
                        <span className="text-xs font-mono text-gray-500 uppercase font-semibold block">
                          PUBLIC PORTAL
                        </span>
                        <h5 className="text-lg font-bold font-heading text-[#14213D] group-hover:text-[#E8963C]">
                          Citizen / User
                        </h5>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Report civic issues, track real-time resolution status, and receive SMS updates via mobile OTP.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#DDE1E7] flex items-center justify-between text-xs font-semibold font-mono text-[#14213D]">
                      <span>OTP VERIFY & LOGIN</span>
                      <span>→</span>
                    </div>
                  </div>

                  {/* CARD 2: MUNICIPAL AUTHORITY / ADMIN */}
                  <div
                    onClick={() => selectRole('admin')}
                    className="group rounded-lg border-2 border-[#DDE1E7] bg-white p-5 cursor-pointer hover:border-[#14213D] hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-lg bg-[#14213D]/10 border border-[#14213D]/30 text-[#14213D] flex items-center justify-center group-hover:bg-[#14213D] group-hover:text-white transition-colors">
                        <Building2 className="w-6 h-6 stroke-[2]" />
                      </div>
                      <div>
                        <span className="text-xs font-mono text-gray-500 uppercase font-semibold block">
                          AUTHORITY PORTAL
                        </span>
                        <h5 className="text-lg font-bold font-heading text-[#14213D]">
                          Municipal Authority / Admin
                        </h5>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Manage incoming complaint queues, inspect AI evidence integrity, and update status.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#DDE1E7] flex items-center justify-between text-xs font-semibold font-mono text-[#14213D]">
                      <span>OFFICER LOGIN</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2A: CITIZEN PHONE NUMBER ENTRY */}
            {authModalStep === 'citizen_phone' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-5">
                <button
                  type="button"
                  onClick={() => setAuthModalStep('role_select')}
                  className="inline-flex items-center gap-1 text-xs font-mono text-gray-500 hover:text-[#14213D]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Role Selection
                </button>

                <div className="space-y-1">
                  <span className="text-xs font-mono text-[#E8963C] uppercase font-bold tracking-wider">
                    CITIZEN VERIFICATION
                  </span>
                  <h4 className="text-xl font-bold font-heading text-[#14213D]">
                    Enter Mobile Number
                  </h4>
                  <p className="text-xs text-gray-600">
                    We will send a 6-digit One Time Password (OTP) to verify your citizen identity.
                  </p>
                </div>

                {authError && (
                  <div className="p-3 rounded border border-[#D64545]/30 bg-[#D64545]/10 text-xs font-semibold text-[#D64545]">
                    ⚠️ {authError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#14213D] uppercase font-semibold">
                    MOBILE NUMBER
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-mono font-bold text-gray-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={inputPhone}
                      onChange={(e) => setInputPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-14 pr-3.5 py-2.5 bg-white border border-[#DDE1E7] rounded-lg font-mono text-base text-[#14213D] focus-visible:ring-2 focus-visible:ring-[#E8963C]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="accent"
                  size="md"
                  isLoading={isLoading}
                  className="w-full font-bold"
                >
                  Send OTP Code
                </Button>
              </form>
            )}

            {/* STEP 2B: CITIZEN OTP VERIFICATION */}
            {authModalStep === 'citizen_otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <button
                  type="button"
                  onClick={() => setAuthModalStep('citizen_phone')}
                  className="inline-flex items-center gap-1 text-xs font-mono text-gray-500 hover:text-[#14213D]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change Phone Number (+91 {inputPhone})
                </button>

                <div className="space-y-1">
                  <span className="text-xs font-mono text-[#4A9B6E] uppercase font-bold tracking-wider">
                    OTP SENT TO +91 {inputPhone}
                  </span>
                  <h4 className="text-xl font-bold font-heading text-[#14213D]">
                    Enter 6-Digit OTP Code
                  </h4>
                  <p className="text-xs text-gray-600">
                    Demonstration OTP auto-filled for quick access. Use code: <strong className="font-mono text-[#14213D]">123456</strong>
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
                  className="w-full font-bold"
                >
                  Verify OTP & Enter Citizen Portal
                </Button>
              </form>
            )}

            {/* STEP 3: MUNICIPAL AUTHORITY / ADMIN LOGIN */}
            {authModalStep === 'admin_login' && (
              <form onSubmit={handleAdminSubmit} className="space-y-5">
                <button
                  type="button"
                  onClick={() => setAuthModalStep('role_select')}
                  className="inline-flex items-center gap-1 text-xs font-mono text-gray-500 hover:text-[#14213D]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Role Selection
                </button>

                <div className="space-y-1">
                  <span className="text-xs font-mono text-[#14213D] uppercase font-bold tracking-wider">
                    AUTHORITY LOGIN
                  </span>
                  <h4 className="text-xl font-bold font-heading text-[#14213D]">
                    Municipal Officer Credentials
                  </h4>
                  <p className="text-xs text-gray-600">
                    Demo credentials pre-filled. Officer Password: <strong className="font-mono text-[#14213D]">admin123</strong>
                  </p>
                </div>

                {authError && (
                  <div className="p-3 rounded border border-[#D64545]/30 bg-[#D64545]/10 text-xs font-semibold text-[#D64545]">
                    ⚠️ {authError}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#14213D] uppercase font-semibold">
                      OFFICER EMAIL / ID
                    </label>
                    <input
                      type="email"
                      value={inputAdminEmail}
                      onChange={(e) => setInputAdminEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DDE1E7] rounded-lg font-sans text-sm text-[#14213D] focus-visible:ring-2 focus-visible:ring-[#14213D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#14213D] uppercase font-semibold">
                      SECURE PASSWORD
                    </label>
                    <input
                      type="password"
                      placeholder="admin123"
                      value={inputAdminPassword}
                      onChange={(e) => setInputAdminPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DDE1E7] rounded-lg font-mono text-sm text-[#14213D] focus-visible:ring-2 focus-visible:ring-[#14213D]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  className="w-full font-bold bg-[#14213D]"
                >
                  Log In to Authority Command Center
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
