import { useConversation, ConversationProvider } from "@elevenlabs/react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  X,
  MessageCircle,
  Heart,
  Star,
  Gift,
  Check,
  Trash2,
  Search,
  Headphones,
  Code,
  Minus,
  Plus
} from "lucide-react";
import { useAppContext } from "./AppContext";
import { supabase } from "./supabaseClient";
import { getProductIcon } from "./iconHelper";

export const ToastContainer = () => {
  const { toasts, removeToast } = useAppContext();
  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border backdrop-blur-md ${
              toast.type === "success"
                ? "bg-green-500/90 text-white border-green-400"
                : "bg-white/90 text-[var(--color-text-primary)] border-[var(--color-bg-secondary)]"
            }`}
          >
            {toast.type === "success" ? (
              <Check className="w-5 h-5" />
            ) : (
              <Heart className="w-5 h-5 text-[var(--color-accent-pink)] fill-[var(--color-accent-pink)]" />
            )}
            <span className="font-medium text-sm">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 hover:opacity-70 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    clearCart,
    addToast,
  } = useAppContext();

  const [isCheckingOut, setIsCheckingOut] = React.useState(false);

  // Pure integer math! No regex needed.
  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/create-test-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, customerEmail: "guest@example.com" }),
      });
      
      if (!response.ok) throw new Error("Backend unavailable");
      
      const data = await response.json();
      
      setTimeout(() => {
        setIsCheckingOut(false);
        clearCart();
        setIsCartOpen(false);
        addToast(`Order ${data.orderId} placed successfully! 🎉`, "success");
      }, 1000);

    } catch (err) {
      // Formats the message cleanly based on what they added to the cart
      const orderDetails = cart
        .map((item) => `• ${item.title} (${item.priceType === 'ready' ? 'Ready Website' : 'Premium Code'} - ₹${item.price})`)
        .join("%0A");
      
      const waText = `Hi Adarsh! I would like to checkout my cart:%0A%0A${orderDetails}%0A%0ATotal: *₹${subtotal.toLocaleString('en-IN')}*%0A%0APlease share the payment steps!`;
      
      window.open(`https://wa.me/917906568743?text=${waText}`, "_blank");
      
      setIsCheckingOut(false);
      clearCart();
      setIsCartOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[var(--color-bg-primary)] z-[101] shadow-2xl flex flex-col border-l border-[var(--color-bg-secondary)] dark:border-slate-800"
          >
            <div className="p-6 border-b border-[var(--color-bg-secondary)]/50 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-[var(--color-accent-pink)]" />
                  Your Cart
                </h2>
                <p className="text-xs text-[var(--color-text-primary)]/60 mt-0.5">
                  {cart.length} {cart.length === 1 ? "item" : "items"} selected
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-[var(--color-bg-secondary)] dark:hover:bg-slate-700 transition-colors cursor-pointer text-[var(--color-text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-50 text-[var(--color-text-primary)]">
                  <ShoppingCart className="w-16 h-16 mb-4" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <p className="text-sm">Explore our catalog and add a template!</p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={index}
                    className="flex gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-[var(--color-bg-secondary)]/40 dark:border-slate-800 items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-xl shrink-0 text-white shadow-inner`}
                      >
                        {React.isValidElement(item.emoji) ? item.emoji : <Gift className="w-6 h-6 text-white" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-[var(--color-text-primary)] text-sm truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.priceType === 'ready' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'}`}>
                            {item.priceType === 'ready' ? 'Ready Website' : 'Source Code'}
                          </span>
                          <span className="text-sm font-black text-[var(--color-accent-purple)] dark:text-purple-300">
                            ₹{item.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(index)}
                      className="w-8 h-8 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-full flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white dark:bg-slate-900 border-t border-[var(--color-bg-secondary)]/50 dark:border-slate-800 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[var(--color-text-primary)]/70 font-bold uppercase tracking-wider text-xs">
                    Subtotal ({cart.length} item{cart.length > 1 ? "s" : ""})
                  </span>
                  <span className="text-2xl font-black text-[var(--color-text-primary)]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-[var(--color-text-primary)] text-white dark:bg-slate-800 dark:hover:bg-[var(--color-accent-pink)] hover:bg-[var(--color-accent-purple)] py-4 rounded-xl font-bold transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {isCheckingOut ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const FloatingChat = () => {
  return (
    <ConversationProvider>
      <FloatingChatInner />
    </ConversationProvider>
  );
};

const FloatingChatInner = () => {
  const { addToast } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs agent");
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs agent");
    },
    onError: (error) => {
      console.error("ElevenLabs Error:", error);
      addToast("Voice session encountered an error.", "info");
    },
  });

  const { status, isSpeaking } = conversation;
  const isConnecting = status === "connecting";
  const isConnected = status === "connected";

  const toggleVoiceAgent = async () => {
    try {
      if (isConnected) {
        await conversation.endSession();
        setIsMenuOpen(false);
      } else {
        const agentId = (import.meta as any).env.VITE_ELEVENLABS_AGENT_ID;
        if (!agentId) {
          addToast(
            "Please set VITE_ELEVENLABS_AGENT_ID in your environment variables (.env)",
            "info"
          );
          return;
        }
        
        await navigator.mediaDevices.getUserMedia({ 
           audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
         });
        
        await conversation.startSession({
          agentId: agentId,
        });
        
        setIsMenuOpen(false);
      }
    } catch (error) {
      console.error("Failed to start conversation", error);
      addToast("Microphone permission denied or connection failed.", "info");
    }
  };

  const handleWhatsApp = () => {
    setIsMenuOpen(false);
    window.open("https://wa.me/917906568743", "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isMenuOpen && !isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-[var(--color-bg-secondary)] shadow-2xl rounded-[1.5rem] p-3 flex flex-col gap-2 min-w-[260px] pointer-events-auto origin-bottom-right"
          >
            <div className="px-3 py-2 border-b border-[var(--color-bg-secondary)]">
              <h4 className="font-bold text-[var(--color-text-primary)] text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse"></span>
                AI Voice Assistant
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                Talk to our AI agent to find templates, ask pricing questions, or get instant help!
              </p>
            </div>
            
            <button
              onClick={toggleVoiceAgent}
              disabled={isConnecting}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors text-left group disabled:opacity-50 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-[var(--color-text-primary)] text-[13px]">
                  {isConnecting ? "Connecting..." : "Talk with AI Agent"}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {isConnecting ? "Establishing audio stream..." : "Click to start live voice chat"}
                </div>
              </div>
            </button>
            
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 transition-colors group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-[var(--color-text-primary)] text-[13px]">WhatsApp Chat</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Message a human agent directly</div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => {
          if (isConnected) {
            toggleVoiceAgent();
          } else {
            setIsMenuOpen(!isMenuOpen);
          }
        }}
        className={`w-14 h-14 ${
          isConnected ? "bg-rose-500" : "bg-[var(--color-text-primary)] text-[var(--color-bg-primary)]"
        } rounded-full flex items-center justify-center shadow-2xl ${
          isConnected
            ? "shadow-rose-500/40 text-white"
            : "shadow-black/20 dark:shadow-black/60"
        } border-2 border-transparent hover:scale-110 transition-transform group relative pointer-events-auto cursor-pointer`}
        title={isConnected ? "Click to end call" : "Open support menu"}
      >
        <div
          className={`absolute inset-0 rounded-full ${
            isConnected ? "bg-rose-500" : "bg-[var(--color-bg-primary)]"
          } animate-ping opacity-30 ${isSpeaking ? "animate-pulse duration-75" : ""}`}
        ></div>
        
        {isConnected ? (
          <X className="w-6 h-6 relative z-10" />
        ) : isMenuOpen ? (
          <X className="w-6 h-6 relative z-10" />
        ) : (
          <MessageCircle className="w-6 h-6 relative z-10" />
        )}

        {isConnected && (
          <span className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-[var(--color-bg-primary)] shadow-sm animate-pulse"></span>
        )}
      </motion.button>
    </div>
  );
};

export const AnimatedCounter = ({
  value,
  duration = 2,
}: {
  value: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const totalMilSecDur = duration * 1000;
      const incrementTime = 30; // ms
      const totalSteps = Math.ceil(totalMilSecDur / incrementTime);
      const step = end / totalSteps;

      const timer = setInterval(() => {
        start += step;
        if (start > end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

export const BundleSection = () => {
  const { addToCart } = useAppContext();
  const [bundleProducts, setBundleProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBundleData = async () => {
      try {
        setLoading(true);
        // Fetch products from your database table
        const { data, error } = await supabase.from("products").select("*").limit(3);
        if (error) throw error;
        
        if (data && data.length > 0) {
          setBundleProducts(data);
        }
      } catch (err) {
        console.error("Error fetching bundle products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBundleData();
  }, []);

  // --- BUNDLE SKELETON PREVIEW ---
  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16" id="bundles">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-5 bg-amber-500 rounded-full"></span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-primary)] tracking-wide uppercase">
            Exclusive Template Bundles
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-[var(--color-bg-secondary)] dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center gap-6 animate-pulse">
            
            {/* Stacked Cards Skeleton */}
            <div className="relative shrink-0 w-full sm:w-44 h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>

            {/* Details Skeleton */}
            <div className="flex-1 flex flex-col justify-between w-full text-left">
              <div>
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-3"></div>
                <div className="h-6 sm:h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
                
                {/* Items Box Skeleton */}
                <div className="bg-[var(--color-bg-primary)] dark:bg-slate-950/60 rounded-xl p-3.5 border border-[var(--color-bg-secondary)] dark:border-slate-800/80 mb-6 space-y-2">
                  <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                  <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
              </div>

              {/* Price & Buy Button Row Skeleton */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--color-bg-secondary)] dark:border-slate-800/60">
                <div className="flex flex-col gap-1">
                  <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
                <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (bundleProducts.length === 0) return null;

  // Extract titles to show in the itemized list
  const includedTitles = bundleProducts.map((p) => p.title);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16" id="bundles">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2 h-5 bg-amber-500 rounded-full"></span>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-primary)] tracking-wide uppercase">
          Exclusive Template Bundles
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-[var(--color-bg-secondary)] dark:border-slate-800 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center gap-6 group transition-all">
          
          {/* Ambient background glow */}
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Stacked Cards Preview Art using live product data */}
          <div className="relative shrink-0 flex items-center justify-center w-full sm:w-44 h-48">
            <div className="absolute w-28 h-40 bg-gradient-to-br from-rose-500 to-red-700 rounded-xl shadow-lg transform -rotate-12 -translate-x-6 border border-white/20 opacity-75 flex items-center justify-center text-white font-bold text-xs p-2 text-center">
              {bundleProducts[0]?.title || "Template 1"}
            </div>
            <div className="absolute w-28 h-40 bg-gradient-to-br from-purple-500 to-indigo-700 rounded-xl shadow-xl transform -rotate-6 -translate-x-2 border border-white/20 opacity-90 flex items-center justify-center text-white font-bold text-xs p-2 text-center">
              {bundleProducts[1]?.title || "Template 2"}
            </div>
            <div className="absolute w-32 h-44 bg-gradient-to-br from-slate-900 to-slate-950 dark:from-slate-800 dark:to-slate-950 rounded-2xl shadow-2xl transform rotate-3 translate-x-4 border border-white/20 flex flex-col items-center justify-center p-3 text-white text-center">
              <Heart className="w-8 h-8 text-rose-500 fill-current mb-2" />
              <span className="font-bold text-xs line-clamp-2">Ultimate Pack</span>
            </div>
          </div>

          {/* Details & Pricing */}
          <div className="flex-1 flex flex-col justify-between w-full text-left z-10">
            <div>
              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                BUNDLE DEAL
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-primary)] mt-3 mb-3">
                THE ULTIMATE TEMPLATE BUNDLE
              </h3>
              
              {/* Dynamic Items Box from Products Table */}
              <div className="bg-[var(--color-bg-primary)] dark:bg-slate-950/60 rounded-xl p-3.5 border border-[var(--color-bg-secondary)] dark:border-slate-800/80 mb-6">
                <p className="text-[10px] font-bold text-[var(--color-text-primary)]/50 uppercase tracking-widest mb-2">
                  Items Included:
                </p>
                <ul className="space-y-1.5">
                  {includedTitles.map((title, idx) => (
                    <li key={idx} className="text-xs text-[var(--color-text-primary)]/80 dark:text-slate-300 flex items-center gap-2 font-medium">
                      <span className="text-amber-500 font-bold">+</span> {title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Price & Buy Button Row */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-bg-secondary)] dark:border-slate-800/60">
              <div className="flex flex-col">
                <span className="text-xs text-[var(--color-text-primary)]/40 line-through font-semibold">
                  ₹899
                </span>
                <span className="text-xl sm:text-2xl font-black text-[var(--color-text-primary)]">
                  ₹499
                </span>
              </div>
              <button
                onClick={() =>
                  addToCart({
                    id: 999,
                    title: "Ultimate Template Bundle",
                    price: "Rs. 499",
                    gradient: "from-slate-900 to-slate-950",
                    emoji: <Gift className="w-6 h-6 text-white" />,
                  })
                }
                className="bg-[var(--color-text-primary)] text-white dark:bg-slate-800 hover:bg-[var(--color-accent-pink)] px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 shadow-md cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-amber-400" /> Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen } = useAppContext();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCatalog = async () => {
      const { data } = await supabase.from("products").select("*");
      if (data) {
        const formatted = data.map((item) => ({
          id: item.id,
          category: item.category,
          title: item.title,
          price: item.price,
          gradient: item.gradient || "from-pink-200 to-rose-100",
          emoji: getProductIcon(item.icon_name),
        }));
        setProducts(formatted);
      }
    };
    if (isSearchOpen) fetchCatalog();
  }, [isSearchOpen]);

  const filtered = query
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsSearchOpen(false)}
      ></div>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="bg-[var(--color-bg-primary)] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-[var(--color-bg-secondary)]/50"
      >
        <div className="p-4 border-b border-[var(--color-bg-secondary)] flex items-center gap-3">
          <Search className="w-5 h-5 text-[var(--color-text-primary)]/50" />
          <input
            autoFocus
            type="text"
            placeholder="Search templates, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-lg text-[var(--color-text-primary)]"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 hover:bg-white rounded-full transition-colors text-[var(--color-text-primary)]/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query && filtered.length === 0 ? (
            <div className="p-8 text-center text-[var(--color-text-primary)]/50">
              No results found for "{query}"
            </div>
          ) : (
            <div className="flex flex-col">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    navigate(`/product/${p.id}`);
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center gap-4 p-3 hover:bg-[var(--color-bg-secondary)] rounded-xl transition-colors cursor-pointer border border-transparent hover:border-[var(--color-bg-secondary)]/50 group"
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${p.gradient} flex items-center justify-center text-2xl`}
                  >
                    {React.isValidElement(p.emoji) ? p.emoji : <Gift className="w-6 h-6 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-pink)] transition-colors">
                      {p.title}
                    </h4>
                    <span className="text-xs text-[var(--color-text-primary)]/50 font-bold uppercase tracking-wider">
                      {p.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[var(--color-text-primary)]">
                      {p.price}
                    </div>
                  </div>
                </div>
              ))}
              {!query && (
                <div className="p-8 text-center text-[var(--color-text-primary)]/50">
                  Type to search for templates...
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};