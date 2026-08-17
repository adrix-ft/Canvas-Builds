import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User as UserIcon, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { supabase } from './supabaseClient';
import { useAppContext } from './AppContext';
import { useNavigate } from 'react-router-dom';

export const AuthModal = () => {
  const { isAuthOpen, setIsAuthOpen, addToast, user, isAdmin, handleLogout } = useAppContext();
  const navigate = useNavigate();

  if (!isAuthOpen) return null;

  const closeModal = () => {
    setIsAuthOpen(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      addToast("Failed to connect to Google", "info");
    }
  };

  const handleGoToDashboard = () => {
    closeModal();
    navigate('/account'); 
  };

  const handleGoToAdmin = () => {
    closeModal();
    navigate('/admin');
  };

  // Extract the user's Google profile picture and name from Supabase auth metadata
  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Welcome Back';

  return (
    <AnimatePresence>
      {isAuthOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl relative z-10 flex flex-col border border-[var(--color-bg-secondary)] dark:border-slate-800"
          >
            <div className="p-6 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-[var(--color-bg-primary)]/50 dark:bg-slate-950/50">
              <h2 className="text-xl font-serif font-bold text-[var(--color-text-primary)]">
                {user ? 'My Account' : 'Sign In'}
              </h2>
              <button onClick={closeModal} className="p-2 bg-white dark:bg-slate-800 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-colors cursor-pointer shadow-sm text-[var(--color-text-primary)]/70">
                <X className="w-5 h-5" />
              </button>
            </div>

            {user ? (
              <div className="p-8 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={fullName} 
                      className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white dark:border-slate-800" 
                      referrerPolicy="no-referrer" // Prevents Google from blocking the image load
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-[var(--color-accent-mint)] to-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-slate-800">
                      <UserIcon className="w-10 h-10" />
                    </div>
                  )}
                  {isAdmin && (
                    <div className="absolute bottom-0 right-0 bg-rose-500 text-white p-1.5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" title="Admin">
                      <Shield className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                <h2 className="text-2xl font-serif font-bold text-[var(--color-text-primary)] mb-1">{fullName}</h2>
                <p className="text-[var(--color-text-primary)]/60 font-medium mb-8 text-sm">{user.email}</p>

                <div className="flex flex-col gap-3 w-full">
                  {isAdmin && (
                    <button
                      onClick={handleGoToAdmin}
                      className="w-full py-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Shield className="w-5 h-5" /> Admin Panel
                    </button>
                  )}
                  <button
                    onClick={handleGoToDashboard}
                    className="w-full py-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 hover:border-[var(--color-accent-mint)] text-[var(--color-text-primary)] font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LayoutDashboard className="w-5 h-5 opacity-70" /> My Orders
                  </button>
                  <button
                    onClick={() => { handleLogout(); closeModal(); }}
                    className="w-full py-4 bg-[var(--color-text-primary)] text-white dark:bg-slate-100 dark:text-slate-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-5 h-5 opacity-70" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 sm:p-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[var(--color-bg-primary)] dark:bg-slate-950 rounded-2xl flex items-center justify-center mb-6 border border-[var(--color-bg-secondary)] dark:border-slate-800 shadow-sm">
                  <img src="/icon.png" alt="Icon" className="w-8 h-8 object-contain dark:hidden" />
                  <img src="/icon2.png" alt="Icon" className="w-8 h-8 object-contain hidden dark:block" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-[var(--color-text-primary)] mb-3">
                  Welcome Back
                </h2>
                <p className="text-[var(--color-text-primary)]/60 text-sm font-medium mb-8">
                  Sign in to access your digital gifts, templates, and orders.
                </p>
                
                <button
                  onClick={handleGoogleLogin}
                  className="w-full py-4 bg-white dark:bg-slate-800 border border-[var(--color-bg-secondary)] dark:border-slate-700 hover:border-blue-500 text-[var(--color-text-primary)] font-bold rounded-xl transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
                
                <p className="text-[10px] text-[var(--color-text-primary)]/40 mt-6 max-w-xs leading-relaxed">
                  By continuing, you agree to Canvas Builds' Terms of Service and Privacy Policy.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};