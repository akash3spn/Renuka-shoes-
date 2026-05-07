import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // If auth state is verified and user is logged in, redirect
    if (user && !loading) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, isAdmin, navigate, loading]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Wait for useEffect to redirect
    } catch (error: any) {
      console.error(error);
      
      // Auto-create admin if the account hasn't been set up yet, to make it seamless
      if (email === 'mdsamirmolla87@gmail.com' && error.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          return; // Success, user will be redirected by useEffect
        } catch (createError: any) {
          if (createError.code === 'auth/email-already-in-use') {
            setErrorMsg('Invalid password for admin account.');
          } else {
            setErrorMsg(createError.message || 'Failed to authenticate admin.');
          }
        }
      } else {
        // Normal error handling
        switch (error.code) {
          case 'auth/invalid-credential':
            setErrorMsg('Invalid email or password. Please try again.');
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
             setErrorMsg('Invalid email or password.');
             break;
          case 'auth/too-many-requests':
            setErrorMsg('Account temporarily disabled due to many failed attempts. Try again later.');
            break;
          case 'auth/network-request-failed':
            setErrorMsg('Network error. Please check your internet connection.');
            break;
          default:
            setErrorMsg(error.message || 'Failed to sign in.');
        }
      }
    } finally {
      if (email !== 'mdsamirmolla87@gmail.com') {
        setLoading(false);
      } else {
        // Let component unmount handle loading state clearing on seamless admin auth
        setTimeout(() => setLoading(false), 2000); 
      }
    }
  };

  return (
    <div className="min-h-[calc(100dvh-80px)] flex items-center justify-center bg-neutral-50 px-4 py-16">
      <div className="bg-white p-8 sm:p-10 rounded-sm shadow-xl max-w-md w-full border border-neutral-100 text-center relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-neutral-200 to-transparent opacity-20 pointer-events-none"></div>

        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 text-black">Admin Access</h1>
        <p className="text-neutral-500 mb-8 max-w-sm mx-auto text-sm">Sign in to securely manage products, orders, and settings.</p>
        
        {errorMsg && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-sm mb-6 text-left animate-in fade-in slide-in-from-top-2">
            <strong>Authentication Error:</strong><br />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div className="text-left">
            <label className="block text-xs font-bold text-neutral-700 mb-1 tracking-wide uppercase">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-300 rounded-sm p-3.5 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-black appearance-none"
              placeholder="admin@example.com"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div className="text-left">
            <label className="block text-xs font-bold text-neutral-700 mb-1 tracking-wide uppercase">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-neutral-300 rounded-sm p-3.5 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-black appearance-none"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center space-x-3 text-white px-6 py-4 rounded-sm font-bold uppercase tracking-wider transition-all duration-300 transform mt-4 
              ${loading ? 'bg-neutral-800 cursor-not-allowed opacity-80' : 'bg-black hover:bg-neutral-800 hover:-translate-y-0.5 shadow-md hover:shadow-lg active:translate-y-0'}
            `}
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            <span>{loading ? 'Authenticating...' : 'Secure Login'}</span>
          </button>
        </form>

        <p className="text-xs text-neutral-400 mt-8 tracking-wide">
          Secured by Firebase Authentication.
        </p>
      </div>
    </div>
  );
}
