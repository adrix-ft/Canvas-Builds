import { ArrowLeft, HardHat, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const DemoUnavailablePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // This grabs the product name if we passed it in the redirect, otherwise defaults to "this template"
  const productName = location.state?.productName || "this template";

  return (
    <div className="pt-32 pb-20 min-h-[70vh] flex flex-col items-center justify-center px-4 bg-[var(--color-bg-primary)]">
      <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-[2rem] p-8 sm:p-12 shadow-xl border border-[var(--color-bg-secondary)] dark:border-slate-800 text-center relative overflow-hidden">
        
        {/* Background decorative gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-[var(--color-accent-mint)]/10 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="w-20 h-20 bg-[var(--color-bg-secondary)] dark:bg-slate-800 text-[var(--color-accent-mint)] rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <HardHat className="w-10 h-10" />
            <Sparkles className="w-5 h-5 absolute -top-1 -right-1 text-[var(--color-accent-pink)] animate-pulse" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-text-primary)] mb-4">
            Demo in Progress
          </h1>
          
          <p className="text-[var(--color-text-primary)]/70 mb-8 text-lg">
            We are currently putting the final touches on the live preview for <span className="font-bold text-[var(--color-text-primary)]">{productName}</span>. 
            <br className="hidden sm:block" /> Check back soon to see it in action!
          </p>

          <button
            onClick={() => navigate(-1)} // Takes them exactly back to the product page they came from
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--color-text-primary)] hover:bg-[var(--color-accent-mint)] text-white dark:bg-slate-100 dark:text-slate-900 px-8 py-3.5 rounded-xl font-bold transition-colors shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" /> Return to Template
          </button>
        </div>
      </div>
    </div>
  );
};
