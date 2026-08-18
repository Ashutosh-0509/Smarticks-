import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Ensure token hasn't expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('auth_token');
          return null;
        }
        return decoded;
      } catch (e) {
        localStorage.removeItem('auth_token');
        return null;
      }
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => !localStorage.getItem('auth_token'));
  const [authModalStep, setAuthModalStep] = useState('role_selection'); // 'role_selection' | 'email_input' | 'otp_input'
  const [requestedRole, setRequestedRole] = useState('citizen');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If the token expires or is removed elsewhere, update user
    const handleStorageChange = () => {
      const token = localStorage.getItem('auth_token');
      if (!token) setUser(null);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const openAuthModal = () => {
    setAuthModalStep('role_selection');
    setAuthError('');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError('');
  };

  const sendOtp = async (inputEmail) => {
    if (!inputEmail || !inputEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return false;
    }
    setIsLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      
      setEmail(inputEmail);
      setAuthModalStep('otp_input');
      return true;
    } catch (err) {
      setAuthError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (inputOtp) => {
    if (!inputOtp || inputOtp.length !== 6) {
      setAuthError('Please enter a valid 6-digit OTP code.');
      return false;
    }
    setIsLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: inputOtp, requested_role: requestedRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');
      
      localStorage.setItem('auth_token', data.token);
      const decoded = jwtDecode(data.token);
      setUser(decoded);
      setIsAuthModalOpen(false);
      
      // We will let the router handle redirection in App.jsx or Login component
      return decoded;
    } catch (err) {
      setAuthError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    setIsAuthModalOpen(true);
    setAuthModalStep('role_selection');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        authModalStep,
        requestedRole,
        email,
        otpCode,
        authError,
        isLoading,
        setRequestedRole,
        setEmail,
        setOtpCode,
        openAuthModal,
        closeAuthModal,
        sendOtp,
        verifyOtp,
        logout,
        setAuthModalStep
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
