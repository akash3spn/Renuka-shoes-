import React from 'react';
import { useAuth } from '../lib/auth';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-24 min-h-screen">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">My Account</h1>
      
      <div className="bg-white p-8 rounded-sm shadow-sm border border-neutral-100 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center font-bold text-xl uppercase">
            {user.email?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.displayName || 'User'}</h2>
            <p className="text-neutral-500">{user.email}</p>
            {isAdmin && <span className="inline-block mt-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm uppercase">Admin</span>}
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="bg-neutral-100 hover:bg-neutral-200 text-black px-6 py-3 rounded-sm font-bold uppercase text-sm tracking-wider transition-colors"
        >
          Sign Out
        </button>
      </div>

    </div>
  );
}
