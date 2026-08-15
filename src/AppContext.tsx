import React, { createContext, useContext, useState, ReactNode } from "react";

type Toast = { id: number; message: string; type: "success" | "info" };

type CartItem = {
  id: number;
  title: string;
  price: string;
  image?: string;
  gradient: string;
  emoji: ReactNode; // Fixed to support React Icons instead of broken emojis
};

interface AppContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  toasts: Toast[];
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
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const clearCart = () => setCart([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | null>(null);

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
    addToast(`Added ${item.title} to cart!`, "success");
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item, index) => index !== id));
  };

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

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <AppContext.Provider
      value={{
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