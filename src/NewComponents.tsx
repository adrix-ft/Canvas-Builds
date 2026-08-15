import { useConversation, ConversationProvider } from "@elevenlabs/react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
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
  Code
} from "lucide-react";
import { useAppContext } from "./AppContext";

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
              className="ml-2 hover:opacity-70"
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

  const subtotal = cart.reduce((acc, item) => {
    const priceStr = item.price.toString().replace(/[^0-9.]/g, "");
    const priceNum = parseFloat(priceStr);
    return acc + (isNaN(priceNum) ? 0 : priceNum);
  }, 0);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      clearCart();
      setIsCartOpen(false);
      addToast("Payment successful! Check your email.", "success");
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-[var(--color-bg-primary)] z-[101] shadow-2xl flex flex-col border-l border-[var(--color-bg-secondary)]"
          >
            <div className="p-6 border-b border-[var(--color-bg-secondary)]/50 flex justify-between items-center bg-white/50 backdrop-blur-md">
              <h2 className="text-2xl font-serif font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-[var(--color-accent-pink)]" />{" "}
                Your Cart
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                <X className="w-5 h-5 text-[var(--color-text-primary)]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-50 text-[var(--color-text-primary)]">
                  <ShoppingCart className="w-16 h-16 mb-4" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <p className="text-sm">Add some beautiful templates!</p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={index}
                    className="flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-[var(--color-bg-secondary)]/30 items-center"
                  >
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-3xl shrink-0`}
                    >
                      {item.emoji}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[var(--color-text-primary)] text-sm line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-[var(--color-accent-purple)] font-bold mt-1">
                        {item.price}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      disabled={isCheckingOut}
                      className="w-8 h-8 text-rose-400 hover:bg-rose-50 rounded-full flex items-center justify-center transition-colors shrink-0 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-[var(--color-bg-secondary)]/50 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[var(--color-text-primary)] font-medium text-lg">
                    Subtotal
                  </span>
                  <span className="text-2xl font-bold text-[var(--color-text-primary)]">
                     Rs. {subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-[var(--color-text-primary)] hover:bg-[var(--color-accent-purple)] text-white py-4 rounded-xl font-bold transition-all hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {isCheckingOut ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  {isCheckingOut ? "Processing..." : "Secure Checkout"}
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
        
        // Request microphone explicitly with constraints to stabilize sample rates
        await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        
        // Start session
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
            className="mb-4 bg-white/95 backdrop-blur-xl border border-[var(--color-bg-secondary)] shadow-2xl rounded-[1.5rem] p-3 flex flex-col gap-2 min-w-[260px] pointer-events-auto origin-bottom-right"
          >
            <div className="px-3 py-2 border-b border-[var(--color-bg-secondary)]/50">
              <h4 className="font-bold text-[var(--color-text-primary)] text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                AI Voice Assistant
              </h4>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">
                Talk to our AI agent to find templates, ask pricing questions, or get instant help!
              </p>
            </div>
            
            <button
              onClick={toggleVoiceAgent}
              disabled={isConnecting}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--color-bg-primary)] transition-colors text-left group disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-[var(--color-text-primary)] text-[13px]">
                  {isConnecting ? "Connecting..." : "Talk with AI Agent"}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {isConnecting ? "Establishing audio stream..." : "Click to start live voice chat"}
                </div>
              </div>
            </button>
            
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--color-bg-primary)] transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 shrink-0 transition-colors group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-[var(--color-text-primary)] text-[13px]">WhatsApp Chat</div>
                <div className="text-[10px] text-slate-500 font-medium">Message a human agent directly</div>
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
          isConnected ? "bg-rose-500" : "bg-[var(--color-text-primary)]"
        } text-white rounded-full flex items-center justify-center shadow-2xl ${
          isConnected
            ? "shadow-rose-500/40"
            : "shadow-black/20"
        } border-2 border-white hover:scale-110 transition-transform group relative pointer-events-auto`}
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
          <span className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
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
  return (
    <div
      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative"
      id="bundles"
    >
      <div className="bg-gradient-to-br from-[var(--color-accent-purple)] to-[var(--color-text-primary)] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-12">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-[var(--color-accent-pink)]/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-gradient-to-tr from-[var(--color-bg-secondary)]/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        <div className="relative z-10 flex-1 text-center md:text-left flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 mb-4 self-center md:self-start">
            <Gift className="w-3.5 h-3.5 text-[var(--color-accent-pink)]" />
            <span className="text-white font-bold text-[10px] uppercase tracking-widest">
              Special Offer
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif text-white mb-3">
            The Ultimate Anniversary Bundle
          </h2>
          <p className="text-white/80 text-sm sm:text-base mb-6 max-w-lg mx-auto md:mx-0 line-clamp-2">
            Get our top 3 most popular romantic templates (Girlfriend, Anniversary, & Proposal) for a fraction of the price.
          </p>
          <div className="flex flex-row items-center justify-center md:justify-start gap-4 mb-6 md:mb-0">
            <div className="flex items-end gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-[var(--color-bg-secondary)]">Rs. 499</span>
              <span className="text-sm sm:text-base text-white/50 line-through mb-1">Rs. 899</span>
            </div>
            <span className="bg-rose-500/80 text-white px-2.5 py-0.5 rounded-full text-xs font-bold ml-2">
              Save 40%
            </span>
          </div>
        </div>
        <div className="relative z-10 shrink-0 w-full md:w-auto flex flex-col items-center">
          <div className="flex -space-x-4 mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[var(--color-bg-secondary)] to-orange-200 rounded-2xl shadow-xl border-2 border-white/20 flex items-center justify-center z-10 -rotate-12">
               <Heart className="w-8 h-8 text-rose-500 fill-current" />
            </div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[var(--color-accent-pink)] to-rose-300 rounded-2xl shadow-2xl border-2 border-white flex items-center justify-center z-30 -mt-4">
               <Star className="w-10 h-10 text-white fill-current" />
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[var(--color-accent-purple)] to-purple-400 rounded-2xl shadow-xl border-2 border-white/20 flex items-center justify-center z-20 rotate-12">
               <Gift className="w-8 h-8 text-white" />
            </div>
          </div>
          <button
            onClick={() =>
              addToCart({
                id: 999,
                title: "Ultimate Anniversary Bundle",
                price: "Rs. 499",
                gradient: "from-[var(--color-accent-purple)] to-[var(--color-text-primary)]",
                emoji: <Gift className="w-6 h-6 text-white" />,
              })
            }
            className="w-full md:w-auto bg-[var(--color-accent-pink)] hover:bg-white hover:text-[var(--color-text-primary)] text-white px-8 py-3.5 rounded-full font-bold text-base transition-all duration-300 shadow-lg hover:scale-105"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export const MeetCreator = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16 shadow-xl border border-[var(--color-bg-secondary)]/50 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[var(--color-bg-primary)] to-transparent"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 lg:gap-16">
          <div className="w-40 h-40 sm:w-64 sm:h-64 shrink-0 rounded-full bg-gradient-to-br from-[var(--color-accent-pink)] to-[var(--color-accent-purple)] p-2 shadow-2xl">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden relative">
              <Code className="w-16 h-16 sm:w-24 sm:h-24 text-[var(--color-accent-pink)] relative z-10" />
              <div className="absolute inset-0 bg-[var(--color-accent-pink)]/10"></div>
            </div>
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <span className="w-8 h-px bg-[var(--color-accent-pink)]"></span>
              <span className="text-[var(--color-accent-pink)] font-bold text-xs tracking-widest uppercase">
                Meet the Creator
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-[var(--color-text-primary)] mb-4">
              Hi, I'm Adarsh
            </h2>
            <p className="text-[var(--color-text-primary)]/70 text-lg leading-relaxed mb-6">
              I started creating these templates when I wanted to do something
              unique for my partner's birthday. The reaction was so priceless
              that I decided to refine the code and share it with the world.
            </p>
            <p className="text-[var(--color-text-primary)]/70 text-lg leading-relaxed mb-8">
              My mission is to help people express their love through beautiful,
              aesthetic digital experiences, even if they don't know how to
              code.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-6">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-[var(--color-text-primary)] font-serif">
                  50+
                </span>
                <span className="text-sm font-bold text-[var(--color-accent-pink)] uppercase tracking-wider">
                  Templates
                </span>
              </div>
              <div className="w-px h-10 bg-[var(--color-bg-secondary)]"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-[var(--color-text-primary)] font-serif">
                  <AnimatedCounter value={10000} />+
                </span>
                <span className="text-sm font-bold text-[var(--color-accent-pink)] uppercase tracking-wider">
                  Happy Users
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SearchModal = ({ products }: { products: any[] }) => {
  const { isSearchOpen, setIsSearchOpen, addToCart } = useAppContext();
  const [query, setQuery] = useState("");
  const filtered = query
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
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
            className="p-1 hover:bg-white rounded-full transition-colors text-[var(--color-text-primary)]/60"
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
                    addToCart(p);
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center gap-4 p-3 hover:bg-white rounded-xl transition-colors cursor-pointer border border-transparent hover:border-[var(--color-bg-secondary)]/50 group"
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${p.gradient} flex items-center justify-center text-2xl`}
                  >
                    {p.emoji}
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