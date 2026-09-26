import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthMode } from './types';
import { useAuthService } from './hooks/useAuthService';
import { RedirectBridge } from './components/RedirectBridge';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { ForgotPasswordView } from './views/ForgotPasswordView';
import { ResetPasswordView } from './views/ResetPasswordView';

export default function App() {
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '#/');
  const {
    loading,
    error,
    setError,
    redirectState,
    login,
    register,
    loginWithGoogle,
    requestForgotPassword,
    resetPassword,
  } = useAuthService();

  // Listen to hash changes
  useEffect(() => {
    const onHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
      setError(null);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [setError]);

  // Extract query parameters from both search and hash
  // e.g. ?return_to=http://localhost:5174 or #/reset-password?token=abc
  const { returnTo, resetToken, mode } = useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);
    let returnToVal = searchParams.get('return_to');

    // Also check inside hash if present
    const hashPart = currentHash.replace(/^#\/?/, '');
    const [routePath, hashQuery] = hashPart.split('?');
    const hashParams = new URLSearchParams(hashQuery || '');

    if (!returnToVal && hashParams.get('return_to')) {
      returnToVal = hashParams.get('return_to');
    }

    const tokenVal = searchParams.get('token') || hashParams.get('token') || '';

    let resolvedMode: AuthMode = 'login';
    if (routePath === 'register') {
      resolvedMode = 'register';
    } else if (routePath === 'forgot-password') {
      resolvedMode = 'forgot-password';
    } else if (routePath === 'reset-password') {
      resolvedMode = 'reset-password';
    }

    return {
      returnTo: returnToVal,
      resetToken: tokenVal,
      mode: resolvedMode,
    };
  }, [currentHash]);

  const navigateTo = useCallback((hash: string) => {
    window.location.hash = hash;
  }, []);

  const handleLogin = useCallback(
    async (email: string, pass: string) => {
      await login(email, pass, returnTo);
    },
    [login, returnTo]
  );

  const handleRegister = useCallback(
    async (name: string, email: string, pass: string) => {
      await register(name, email, pass, returnTo);
    },
    [register, returnTo]
  );

  const handleGoogleLogin = useCallback(
    async (credential: string) => {
      await loginWithGoogle(credential, returnTo);
    },
    [loginWithGoogle, returnTo]
  );

  return (
    <div className="relative min-h-screen bg-surface flex flex-col justify-center items-center p-4 sm:p-6 overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Background Decorative Ambient Gradients */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-secondary/8 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-tertiary/6 blur-3xl" />
      </div>

      {/* Main Content View */}
      {mode === 'register' ? (
        <RegisterView
          onRegister={handleRegister}
          onGoogleLogin={handleGoogleLogin}
          onSwitchToLogin={() => navigateTo('#/')}
          isLoading={loading}
          error={error}
          onErrorChange={setError}
          returnTo={returnTo}
        />
      ) : mode === 'forgot-password' ? (
        <ForgotPasswordView
          onSubmit={requestForgotPassword}
          onBackToLogin={() => navigateTo('#/')}
          isLoading={loading}
          error={error}
          onErrorChange={setError}
        />
      ) : mode === 'reset-password' ? (
        <ResetPasswordView
          token={resetToken}
          onSubmit={resetPassword}
          onSuccess={() => navigateTo('#/')}
          isLoading={loading}
          error={error}
          onErrorChange={setError}
        />
      ) : (
        <LoginView
          onLogin={handleLogin}
          onGoogleLogin={handleGoogleLogin}
          onSwitchToRegister={() => navigateTo('#/register')}
          onForgotPassword={() => navigateTo('#/forgot-password')}
          isLoading={loading}
          error={error}
          onErrorChange={setError}
          returnTo={returnTo}
        />
      )}

      {/* Transition Overlay saat redirect ke portal/console */}
      {redirectState && redirectState.isRedirecting && (
        <RedirectBridge state={redirectState} />
      )}
    </div>
  );
}
