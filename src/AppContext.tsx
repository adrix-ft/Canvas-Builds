import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "./supabaseClient";
import { User, Session } from "@supabase/supabase-js";
import { jwtDecode } from "jwt-decode";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  priceType: "code" | "ready";
  gradient: string;
  emoji: ReactNode;
};

interface AppContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthOpen: boolean;
  setIsAuthOpen: (isOpen: boolean) => void;
  handleLogout: () => Promise<void>;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartIndex: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  toasts: { id: number; message: string; type: "success" | "info" }[];
  addToast: (message: string, type?: "success" | "info") => void;
  removeToast: (id: number) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  legalModal: "privacy" | "terms" | null;
  setLegalModal: (type: "privacy" | "terms" | null) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const verifyAdminStatus = (session: Session | null) => {
      if (session?.access_token) {
        try {
          const decodedJwt = jwtDecode<any>(session.access_token);
          setIsAdmin(decodedJwt.user_role === 'admin');
        } catch (err) {
          console.error("Failed to decode token:", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      verifyAdminStatus(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      verifyAdminStatus(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    addToast("Logged out successfully", "info");
  };

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const clearCart = () => setCart([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: "success" | "info" }[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | null>(null);

  const addToast = (message: string, type: "success" | "info" = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (item: CartItem) => {
    const exists = cart.some((i) => i.id === item.id && i.priceType === item.priceType);
    if (exists) {
      addToast(`${item.title} (${item.priceType === 'ready' ? 'Ready Website' : 'Code'}) is already in your cart!`, "info");
      setIsCartOpen(true);
      return;
    }
    setCart((prev) => [...prev, item]);
    addToast(`Added ${item.title} to cart!`, "success");
    setIsCartOpen(true);
  };

  const removeFromCart = (cartIndex: number) => {
    setCart((prev) => prev.filter((_, index) => index !== cartIndex));
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <AppContext.Provider
      value={{
        user,
        isAdmin,
        isAuthOpen,
        setIsAuthOpen,
        handleLogout,
        cart,
        addToCart,
        removeFromCart,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        toasts,
        addToast,
        removeToast,
        isDarkMode,
        toggleDarkMode,
        legalModal,
        setLegalModal,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};