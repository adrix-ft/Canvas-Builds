import React, { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { supabase } from "./supabaseClient";
import { Link } from "react-router-dom";

export const UnsubscribePage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    try {
      // Securely call the backend RPC function
      const { data: success, error } = await supabase.rpc("unsubscribe_user", {
        target_email: email.trim()
      });

      if (error) throw error;

      if (!success) {
        setStatus("error");
        setMessage("We couldn't find that email in our list.");
      } else {
        setStatus("success");
      }
    } catch (err) {
      console.error("Error unsubscribing:", err);
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-[70vh] flex flex-col items-center justify-center px-4 bg-[var(--color-bg-primary)]">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-xl border border-[var(--color-bg-secondary)] dark:border-slate-800 text-center">
        
        {status === "success" ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[var(--color-text-primary)] mb-2">
              Unsubscribed
            </h2>
            <p className="text-[var(--color-text-primary)]/70 mb-8">
              We're sorry to see you go. You will no longer receive template updates from Canvas Builds.
            </p>
            <Link to="/" className="text-[var(--color-accent-mint)] font-bold hover:underline">
              Return to Homepage
            </Link>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-[var(--color-bg-secondary)] dark:bg-slate-800 text-[var(--color-text-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[var(--color-text-primary)] mb-2">
              Unsubscribe
            </h2>
            <p className="text-[var(--color-text-primary)]/70 mb-8 text-sm">
              Enter your email address to opt out of future Canvas Builds updates.
            </p>

            <form onSubmit={handleUnsubscribe} className="space-y-4 text-left">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--color-bg-primary)]/50 dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-pink)] transition-colors"
                  required
                />
              </div>
              
              {status === "error" && (
                <p className="text-rose-500 text-xs font-bold">{message}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[var(--color-text-primary)] hover:bg-[var(--color-accent-pink)] text-white font-bold py-3.5 rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {status === "loading" ? "Processing..." : "Unsubscribe me"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};