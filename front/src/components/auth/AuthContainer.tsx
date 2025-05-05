import React, { useState } from 'react';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import ForgotPasswordPage from './ForgotPasswordPage';

// This container handles switching between auth pages
const AuthContainer: React.FC = () => {
  // Track which authentication page to show
  const [authPage, setAuthPage] = useState<'login' | 'signup' | 'forgot-password'>('login');

  const handleShowLogin = () => setAuthPage('login');
  const handleShowSignUp = () => setAuthPage('signup');
  const handleShowForgotPassword = () => setAuthPage('forgot-password');

  // Render the appropriate authentication page based on state
  return (
    <>
      {authPage === 'login' && (
        <LoginPage 
          onSignUp={handleShowSignUp} 
          onForgotPassword={handleShowForgotPassword}
        />
      )}
      
      {authPage === 'signup' && (
        <SignUpPage 
          onBack={handleShowLogin}
        />
      )}
      
      {authPage === 'forgot-password' && (
        <ForgotPasswordPage 
          onBack={handleShowLogin}
        />
      )}
    </>
  );
};

export default AuthContainer;