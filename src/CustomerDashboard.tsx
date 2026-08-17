import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Heart, Clock, Sparkles, ArrowRight, ShieldCheck, Trash2, Loader2 } from 'lucide-react';
import { useAppContext } from './AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';

export const CustomerDashboard = () => {
  const { user, addToast } = useAppContext();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  // Redirect to home if they try to access this page without being logged in
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url;
  const fullName = user.user_metadata?.full_name || 'Valued Customer';
  const firstName = fullName.split(' ')[0];

  const handleDataDeletion = async () => {
    const confirmDelete = window.confirm(
      "DPDP Act Right to Erasure: Are you sure you want to permanently delete your account and all associated personal data? This action cannot be undone."
    );
    
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    try {
      // Securely invoke the backend deletion function
      const { error } = await supabase.rpc('delete_user_account');
      
      if (error) throw error;
      
      addToast("Account and personal data successfully erased.", "success");
      await supabase.auth.signOut();
      navigate('/');
    } catch (err: any) {
      console.error("Deletion error:", err);
      // Graceful fallback if the SQL RPC hasn't been executed yet
      addToast("Automated deletion failed. Please email canvasbuildsofficial@gmail.com to process your DPDP erasure request.", "info");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden w-full">
      {/* Decorative Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-gradient-to-b from-[var(--color-accent-mint)]/10 to-transparent blur-3xl pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto relative z-10 flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-accent-mint)] to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-slate-800 shadow-lg">
                  {firstName.charAt(0)}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-text-primary)]">
                Hi, {firstName}
              </h1>
              <p className="text-[var(--color-text-primary)]/60 font-medium">{user.email}</p>
            </div>
          </div>
          
          <Link to="/store" className="bg-white dark:bg-slate-900 border border-[var(--color-bg-secondary)] dark:border-slate-800 px-6 py-3 rounded-xl text-sm font-bold text-[var(--color-text-primary)] hover:border-[var(--color-accent-mint)] transition-all shadow-sm flex items-center gap-2">
            Browse Templates <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Orders Area */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--color-text-primary)]">
              <Package className="w-5 h-5 text-[var(--color-accent-purple)]" /> My Orders
            </h3>
            
            {/* Empty State Placeholder */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-3xl p-10 sm:p-16 text-center shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-[var(--color-bg-primary)] dark:bg-slate-950 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Heart className="w-8 h-8 text-[var(--color-text-primary)]/20 dark:text-slate-700" />
              </div>
              <h4 className="text-2xl font-serif font-bold text-[var(--color-text-primary)] mb-3">No orders yet</h4>
              <p className="text-[var(--color-text-primary)]/60 max-w-md mx-auto mb-8 leading-relaxed">
                When you purchase a template or a ready-made website, it will securely appear here along with your download links and hosting details.
              </p>
              <Link to="/store" className="bg-[var(--color-text-primary)] text-white dark:bg-slate-100 dark:text-slate-900 px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Find the Perfect Gift
              </Link>
            </div>
          </div>

          {/* Side Info Panels */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 opacity-0 select-none hidden lg:flex">
              Panel
            </h3>
            
            {/* Support Panel */}
            <div className="bg-gradient-to-br from-[var(--color-bg-secondary)]/50 to-[var(--color-bg-primary)] dark:from-slate-800/50 dark:to-slate-900 rounded-3xl p-6 border border-[var(--color-bg-secondary)] dark:border-slate-800 shadow-sm">
              <h4 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-[var(--color-text-primary)]/70">
                <Clock className="w-4 h-4" /> Need Help?
              </h4>
              <p className="text-sm text-[var(--color-text-primary)]/80 leading-relaxed mb-6">
                If you recently placed an order via WhatsApp or UPI, please allow up to <span className="font-bold text-[var(--color-accent-mint)]">2 hours</span> for it to sync with your dashboard account.
              </p>
              <a href="https://wa.me/917906568743" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-white dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-700 py-3 rounded-xl text-sm font-bold hover:text-[var(--color-accent-mint)] transition-colors shadow-sm">
                Contact Support
              </a>
            </div>

            {/* DPDP Compliance & Privacy Panel */}
            <div className="bg-rose-50 dark:bg-rose-950/20 rounded-3xl p-6 border border-rose-100 dark:border-rose-900/30 shadow-sm">
              <h4 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-rose-700 dark:text-rose-400">
                <ShieldCheck className="w-4 h-4" /> Data & Privacy
              </h4>
              <p className="text-xs text-rose-600/80 dark:text-rose-300/70 leading-relaxed mb-6 font-medium">
                Under the DPDP Act (2023), you have the right to withdraw consent and request the permanent erasure of your personal data from Canvas Builds.
              </p>
              <button 
                onClick={handleDataDeletion}
                disabled={isDeleting}
                className="w-full flex items-center justify-center gap-2 bg-rose-100 dark:bg-rose-900/50 hover:bg-rose-200 dark:hover:bg-rose-800 text-rose-700 dark:text-rose-300 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {isDeleting ? "Erasing Data..." : "Delete My Account"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};