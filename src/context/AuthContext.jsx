import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Load saved session if present in localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('civic_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Controls whether the 2-card role selection / auth modal is active
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => {
    return !localStorage.getItem('civic_user');
  });

  // Auth flow step: 'role_select' | 'citizen_phone' | 'citizen_otp' | 'admin_login'
  const [authModalStep, setAuthModalStep] = useState('role_select');

  // Input states
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [adminEmail, setAdminEmail] = useState('admin@city.gov.in');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('civic_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('civic_user');
    }
  }, [user]);

  const openAuthModal = (initialStep = 'role_select') => {
    setAuthModalStep(initialStep);
    setAuthError('');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError('');
  };

  const selectRole = (role) => {
    setAuthError('');
    if (role === 'citizen') {
      setAuthModalStep('citizen_phone');
    } else if (role === 'admin') {
      setAuthModalStep('admin_login');
    }
  };

  const sendCitizenOtp = async (inputPhone) => {
    if (!inputPhone || inputPhone.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      return false;
    }
    setIsLoading(true);
    setAuthError('');
    // Simulating SMS gateway trigger
    await new Promise((res) => setTimeout(res, 600));
    setIsLoading(false);
    setPhone(inputPhone);
    setOtpCode('123456'); // Pre-fill mock OTP for easy demo
    setAuthModalStep('citizen_otp');
    return true;
  };

  const verifyCitizenOtp = async (inputOtp) => {
    if (inputOtp !== '123456') {
      setAuthError('Invalid OTP code. Use demo OTP 123456.');
      return false;
    }
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    setIsLoading(false);

    const citizenUser = {
      role: 'citizen',
      name: `Citizen (${phone.slice(-4)})`,
      phone: phone,
      email: `citizen_${phone}@civic.gov.in`
    };

    setUser(citizenUser);
    setIsAuthModalOpen(false);
    setAuthError('');
    return true;
  };

  const loginAsAdmin = async (email, password) => {
    if (!email || !password) {
      setAuthError('Please enter municipal officer email and password.');
      return false;
    }
    setIsLoading(true);
    setAuthError('');
    await new Promise((res) => setTimeout(res, 600));
    setIsLoading(false);

    if (password !== 'admin123' && password !== 'admin') {
      setAuthError('Invalid credentials. Use demo password: admin123');
      return false;
    }

    const adminUser = {
      role: 'admin',
      name: 'Officer A. Sharma',
      email: email,
      department: 'Central Municipal Control Room',
      employeeId: 'MNC-8842'
    };

    setUser(adminUser);
    setIsAuthModalOpen(false);
    setAuthError('');
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('civic_user');
    setIsAuthModalOpen(true);
    setAuthModalStep('role_select');
  };

  return (
    <AuthContext.Provider
      value={{
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
        openAuthModal,
        closeAuthModal,
        selectRole,
        sendCitizenOtp,
        verifyCitizenOtp,
        loginAsAdmin,
        logout,
        setAuthModalStep
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
