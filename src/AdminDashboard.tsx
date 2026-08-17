import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, Layers, Users, Mail, LogOut, 
  Trash2, Loader2, Save, Edit2, X, ShieldAlert, Plus, Search, Reply, Send, CheckSquare, Square, EyeOff
} from 'lucide-react';
import { supabase } from './supabaseClient';
import { useAppContext } from './AppContext';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard = () => {
  const { addToast, user, isAdmin, setIsAuthOpen, handleLogout } = useAppContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'bundles' | 'subscribers' | 'messages'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Data States
  const [products, setProducts] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  // Modal & Form States
  const [showProductModal, setShowProductModal] = useState(false);
  const [showBundleModal, setShowBundleModal] = useState(false);
  const [replyState, setReplyState] = useState<{ id: number, email: string, name: string, message: string } | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  
  const defaultProduct = { id: null, category: 'Special', title: '', code_price: 0, ready_price: 0, original_price: 0, rating: '5.0', icon_name: 'Heart', gradient: 'from-pink-200 to-rose-100', tag: '', youtube_url: '', file_url: '', is_hidden: false };
  const defaultBundle = { id: null, title: '', description: '', price: '', original_price: '', tag: '', gradient: 'from-slate-900 to-slate-950', included_items: '[]', emoji_list: '["🎁"]', is_hidden: false };
  
  const [productForm, setProductForm] = useState<any>(defaultProduct);
  const [bundleForm, setBundleForm] = useState<any>(defaultBundle);

  useEffect(() => {
    if (isAdmin) fetchAllData();
  }, [isAdmin]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, bundRes, subRes, msgRes] = await Promise.all([
        supabase.from('products').select('*').order('id', { ascending: true }),
        supabase.from('bundles').select('*').order('id', { ascending: true }),
        supabase.from('subscribers').select('*').order('created_at', { ascending: false }),
        supabase.from('messages').select('*').order('created_at', { ascending: false })
      ]);

      if (prodRes.data) setProducts(prodRes.data);
      if (bundRes.data) setBundles(bundRes.data);
      if (subRes.data) setSubscribers(subRes.data);
      if (msgRes.data) setMessages(msgRes.data);
    } catch (err) {
      addToast("Failed to load dashboard data", "info");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return { products, bundles, subscribers, messages };
    return {
      products: products.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)),
      bundles: bundles.filter(b => b.title.toLowerCase().includes(q)),
      subscribers: subscribers.filter(s => s.email.toLowerCase().includes(q)),
      messages: messages.filter(m => m.name.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q) || m.message.toLowerCase().includes(q))
    };
  }, [searchQuery, products, bundles, subscribers, messages]);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...productForm };
      delete payload.id;
      delete payload.created_at;

      let res;
      if (productForm.id) {
        res = await supabase.from('products').update(payload).eq('id', productForm.id).select();
      } else {
        res = await supabase.from('products').insert([payload]).select();
      }

      if (res.error) throw res.error;
      addToast(`Product ${productForm.id ? 'updated' : 'added'}!`, "success");
      setShowProductModal(false);
      fetchAllData();
    } catch (err: any) { addToast(`Error: ${err.message}`, "info"); }
  };

  const deleteProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
      addToast("Product deleted", "success");
    } catch (err: any) { addToast(`Error: ${err.message}`, "info"); }
  };

  const handleSaveBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...bundleForm };
      delete payload.id;
      try {
        payload.included_items = JSON.parse(payload.included_items || '[]');
        payload.emoji_list = JSON.parse(payload.emoji_list || '[]');
      } catch {
        addToast("Invalid JSON format in Emoji List.", "info");
        return;
      }

      let res;
      if (bundleForm.id) {
        res = await supabase.from('bundles').update(payload).eq('id', bundleForm.id).select();
      } else {
        res = await supabase.from('bundles').insert([payload]).select();
      }

      if (res.error) throw res.error;
      addToast(`Bundle ${bundleForm.id ? 'updated' : 'added'}!`, "success");
      setShowBundleModal(false);
      fetchAllData();
    } catch (err: any) { addToast(`Error: ${err.message}`, "info"); }
  };

  const deleteBundle = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this bundle?")) return;
    try {
      const { error } = await supabase.from('bundles').delete().eq('id', id);
      if (error) throw error;
      setBundles(bundles.filter(b => b.id !== id));
      addToast("Bundle deleted", "success");
    } catch (err: any) { addToast(`Error: ${err.message}`, "info"); }
  };

  const deleteMessage = async (id: number) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await supabase.from('messages').delete().eq('id', id);
      setMessages(messages.filter(m => m.id !== id));
      addToast("Message deleted", "success");
    } catch (err) { addToast("Failed to delete message", "info"); }
  };

  const deleteSubscriber = async (id: string) => {
    if (!window.confirm("Remove subscriber?")) return;
    try {
      await supabase.from('subscribers').delete().eq('id', id);
      setSubscribers(subscribers.filter(s => s.id !== id));
      addToast("Subscriber removed", "success");
    } catch (err) { addToast("Failed to remove subscriber", "info"); }
  };

  const handleSendReply = async () => {
    if (!replyContent.trim() || !replyState) return;
    setIsSendingReply(true);
    try {
      const { error } = await supabase.functions.invoke('send-reply-email', {
        body: {
          to: replyState.email,
          name: replyState.name,
          replyText: replyContent,
          originalMessage: replyState.message
        }
      });
      
      if (error) throw error;
      addToast("Reply sent successfully!", "success");
      setReplyState(null);
      setReplyContent('');
    } catch (err: any) {
      console.error(err);
      addToast(`Failed to send reply: ${err.message}`, "info");
    } finally {
      setIsSendingReply(false);
    }
  };

  const toggleBundleProduct = (productTitle: string) => {
    let currentItems: string[] = [];
    try { currentItems = JSON.parse(bundleForm.included_items || '[]'); } catch { currentItems = []; }
    
    if (currentItems.includes(productTitle)) {
      currentItems = currentItems.filter(t => t !== productTitle);
    } else {
      currentItems.push(productTitle);
    }
    setBundleForm({ ...bundleForm, included_items: JSON.stringify(currentItems) });
  };

  const isProductInBundle = (productTitle: string) => {
    try {
      const currentItems = JSON.parse(bundleForm.included_items || '[]');
      return currentItems.includes(productTitle);
    } catch {
      return false;
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col items-center justify-center p-4 relative overflow-hidden text-center">
        <ShieldAlert className="w-20 h-20 text-rose-500 mb-6 relative z-10" />
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-text-primary)] mb-4 relative z-10">Restricted Access</h1>
        <button onClick={() => setIsAuthOpen(true)} className="relative z-10 bg-[var(--color-text-primary)] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[var(--color-accent-mint)] transition-colors cursor-pointer shadow-lg shadow-black/10">
          {user ? "Switch Account" : "Admin Login"}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 relative overflow-hidden">
      
      <div className="absolute inset-0 z-0 bg-blueprint-grid opacity-50 pointer-events-none" style={{ maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 100%)' }}></div>

      {/* SIDEBAR */}
      <div className="w-full md:w-72 shrink-0 flex flex-col gap-4 relative z-10">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-[var(--color-bg-secondary)] dark:border-slate-800">
          <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-accent-mint)] to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-[var(--color-text-primary)]">Command Center</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-primary)]/50 mt-2">Live Production Database</p>
        </div>
        
        <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-4 shadow-xl border border-[var(--color-bg-secondary)] dark:border-slate-800 flex-1 flex flex-col gap-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'bundles', icon: Layers, label: 'Bundles' },
            { id: 'subscribers', icon: Users, label: 'Subscribers' },
            { id: 'messages', icon: Mail, label: 'Messages' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setSearchQuery(''); }}
              className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-[var(--color-text-primary)] text-white shadow-lg shadow-black/10 translate-x-1' 
                  : 'text-[var(--color-text-primary)]/60 hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[var(--color-accent-mint)]' : ''}`} /> {tab.label}
            </button>
          ))}
          <button onClick={() => { handleLogout(); navigate('/'); }} className="flex items-center gap-4 w-full px-5 py-4 mt-auto rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer">
            <LogOut className="w-5 h-5" /> Secure Logout
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-[var(--color-bg-secondary)] dark:border-slate-800 p-6 sm:p-10 min-h-[700px] flex flex-col relative z-10">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <h3 className="text-3xl font-serif font-bold text-[var(--color-text-primary)] capitalize flex items-center gap-3">
            {activeTab}
            <span className="text-sm font-sans bg-[var(--color-bg-secondary)] dark:bg-slate-800 px-3 py-1 rounded-full text-[var(--color-accent-purple)]">
              {filteredData[activeTab as keyof typeof filteredData]?.length || 0} Records
            </span>
          </h3>
          
          {activeTab !== 'overview' && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-[var(--color-text-primary)]" />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-2xl text-sm outline-none focus:border-[var(--color-accent-mint)] transition-colors shadow-sm"
                />
              </div>
              {activeTab === 'products' && (
                <button onClick={() => { setProductForm(defaultProduct); setShowProductModal(true); }} className="bg-[var(--color-text-primary)] text-white p-3 rounded-2xl hover:bg-slate-800 transition-all hover:-translate-y-0.5 shadow-lg cursor-pointer">
                  <Plus className="w-5 h-5" />
                </button>
              )}
              {activeTab === 'bundles' && (
                <button onClick={() => { setBundleForm(defaultBundle); setShowBundleModal(true); }} className="bg-[var(--color-text-primary)] text-white p-3 rounded-2xl hover:bg-slate-800 transition-all hover:-translate-y-0.5 shadow-lg cursor-pointer">
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[var(--color-text-primary)]/50">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-[var(--color-accent-mint)]" />
            <p className="font-bold tracking-widest uppercase text-xs">Syncing Database...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="wait">
              
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="overview" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: Package, label: 'Products', count: products.length, bg: 'from-purple-500/10 to-transparent', color: 'text-purple-500' },
                    { icon: Layers, label: 'Bundles', count: bundles.length, bg: 'from-amber-500/10 to-transparent', color: 'text-amber-500' },
                    { icon: Users, label: 'Subscribers', count: subscribers.length, bg: 'from-emerald-500/10 to-transparent', color: 'text-emerald-500' },
                    { icon: Mail, label: 'Messages', count: messages.length, bg: 'from-pink-500/10 to-transparent', color: 'text-pink-500' }
                  ].map((stat, i) => (
                    <div key={i} className={`bg-gradient-to-br ${stat.bg} p-8 rounded-[2rem] border border-[var(--color-bg-secondary)] dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all`}>
                      <stat.icon className={`w-10 h-10 mb-6 ${stat.color} group-hover:scale-110 transition-transform`} />
                      <p className="text-xs font-bold opacity-50 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-5xl font-black text-[var(--color-text-primary)]">{stat.count}</p>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* PRODUCTS TAB */}
              {activeTab === 'products' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="products" className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredData.products.map(p => (
                    <div key={p.id} className={`bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-[var(--color-bg-secondary)] dark:border-slate-800 relative group shadow-sm hover:shadow-xl transition-all ${p.is_hidden ? 'opacity-60 grayscale-[0.2]' : ''}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-[var(--color-bg-primary)] px-3 py-1.5 rounded-full uppercase tracking-wider border border-black/5">{p.category}</span>
                          {p.is_hidden && (
                            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1"><EyeOff className="w-3 h-3"/> Hidden</span>
                          )}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button onClick={() => { setProductForm(p); setShowProductModal(true); }} className="bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white p-2 rounded-xl transition-colors cursor-pointer shadow-sm"><Edit2 className="w-4 h-4"/></button>
                          <button onClick={() => deleteProduct(p.id)} className="bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white p-2 rounded-xl transition-colors cursor-pointer shadow-sm"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      </div>
                      <h4 className="font-serif font-bold text-xl leading-tight mb-4">{p.title}</h4>
                      <div className="flex gap-3 mt-auto">
                        <div className="flex-1 bg-purple-50/50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-100 dark:border-purple-900/30">
                          <p className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 mb-1">Code Price</p>
                          <p className="font-black text-lg text-[var(--color-text-primary)]">₹{p.code_price}</p>
                        </div>
                        <div className="flex-1 bg-cyan-50/50 dark:bg-cyan-900/20 p-3 rounded-xl border border-cyan-100 dark:border-cyan-900/30">
                          <p className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 mb-1">Ready Price</p>
                          <p className="font-black text-lg text-[var(--color-text-primary)]">₹{p.ready_price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* BUNDLES TAB */}
              {activeTab === 'bundles' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="bundles" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredData.bundles.map(b => (
                    <div key={b.id} className={`bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-[var(--color-bg-secondary)] dark:border-slate-800 relative group shadow-sm hover:shadow-xl transition-all ${b.is_hidden ? 'opacity-60 grayscale-[0.2]' : ''}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full uppercase tracking-widest border border-amber-200">Bundle</span>
                          {b.is_hidden && (
                            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1"><EyeOff className="w-3 h-3"/> Hidden</span>
                          )}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button onClick={() => { 
                            setBundleForm({
                              ...b, 
                              included_items: JSON.stringify(b.included_items),
                              emoji_list: JSON.stringify(b.emoji_list, null, 2)
                            }); 
                            setShowBundleModal(true); 
                          }} className="bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white p-2 rounded-xl transition-colors cursor-pointer shadow-sm"><Edit2 className="w-4 h-4"/></button>
                          <button onClick={() => deleteBundle(b.id)} className="bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white p-2 rounded-xl transition-colors cursor-pointer shadow-sm"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      </div>
                      <h4 className="font-serif font-bold text-2xl mb-2">{b.title}</h4>
                      <p className="text-sm opacity-60 line-clamp-2 mb-6 leading-relaxed">{b.description}</p>
                      <div className="flex items-center gap-3">
                        <div className="text-3xl font-black">{b.price}</div>
                        <div className="text-sm line-through opacity-40 font-medium">{b.original_price}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* SUBSCRIBERS TAB */}
              {activeTab === 'subscribers' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="subscribers" className="bg-white dark:bg-slate-900 rounded-[2rem] border border-[var(--color-bg-secondary)] dark:border-slate-800 overflow-hidden shadow-sm">
                  <ul className="divide-y divide-[var(--color-bg-secondary)] dark:divide-slate-800">
                    {filteredData.subscribers.map((sub) => (
                      <li key={sub.id} className="p-5 flex justify-between items-center hover:bg-[var(--color-bg-primary)] dark:hover:bg-slate-950 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500">
                            <Mail className="w-4 h-4" />
                          </div>
                          <span className="font-bold">{sub.email}</span>
                        </div>
                        <button onClick={() => deleteSubscriber(sub.id)} className="opacity-0 group-hover:opacity-100 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 p-2.5 rounded-xl transition-all cursor-pointer">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* MESSAGES TAB */}
              {activeTab === 'messages' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="messages" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredData.messages.map((msg) => (
                    <div key={msg.id} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-[var(--color-bg-secondary)] dark:border-slate-800 relative group flex flex-col shadow-sm hover:shadow-xl transition-all">
                      <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => setReplyState(msg)} className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-xl transition-colors cursor-pointer shadow-sm">
                          <Reply className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteMessage(msg.id)} className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-xl transition-colors cursor-pointer shadow-sm">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg leading-tight">{msg.name}</h4>
                          <a href={`mailto:${msg.email}`} className="text-xs font-bold text-[var(--color-accent-mint)] hover:underline">{msg.email}</a>
                        </div>
                      </div>
                      <p className="text-sm bg-[var(--color-bg-primary)] dark:bg-slate-950 p-5 rounded-2xl border border-[var(--color-bg-secondary)] dark:border-slate-800 flex-1 whitespace-pre-wrap leading-relaxed opacity-80">{msg.message}</p>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 mt-4 ml-1">{new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                  ))}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        )}
      </div>

      {/* --- PRODUCT MODAL --- */}
      <AnimatePresence>
        {showProductModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-[var(--color-bg-secondary)] dark:border-slate-800">
              <div className="p-6 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-[var(--color-bg-primary)]/50 dark:bg-slate-950/50">
                <h2 className="text-2xl font-serif font-bold">{productForm.id ? 'Edit Template' : 'New Template'}</h2>
                <button onClick={() => setShowProductModal(false)} className="p-2 bg-white dark:bg-slate-800 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-colors cursor-pointer shadow-sm"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto custom-scrollbar p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">Category</label><input required type="text" className="w-full p-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl outline-none focus:border-[var(--color-accent-mint)] transition-colors" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} /></div>
                <div><label className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">Title</label><input required type="text" className="w-full p-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl outline-none focus:border-[var(--color-accent-mint)] transition-colors" value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} /></div>
                <div><label className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">Code Price (₹)</label><input required type="number" className="w-full p-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl outline-none focus:border-[var(--color-accent-mint)] transition-colors" value={productForm.code_price} onChange={e => setProductForm({...productForm, code_price: e.target.value})} /></div>
                <div><label className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">Ready Price (₹)</label><input required type="number" className="w-full p-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl outline-none focus:border-[var(--color-accent-mint)] transition-colors" value={productForm.ready_price} onChange={e => setProductForm({...productForm, ready_price: e.target.value})} /></div>
                <div><label className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">Original Price (Optional)</label><input type="number" className="w-full p-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl outline-none focus:border-[var(--color-accent-mint)] transition-colors" value={productForm.original_price || ''} onChange={e => setProductForm({...productForm, original_price: e.target.value})} /></div>
                <div><label className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">Rating</label><input type="text" className="w-full p-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl outline-none focus:border-[var(--color-accent-mint)] transition-colors" value={productForm.rating} onChange={e => setProductForm({...productForm, rating: e.target.value})} /></div>
                <div><label className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">Icon Name</label><input type="text" className="w-full p-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl outline-none focus:border-[var(--color-accent-mint)] transition-colors" value={productForm.icon_name} onChange={e => setProductForm({...productForm, icon_name: e.target.value})} /></div>
                <div><label className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">Gradient Tailwind Classes</label><input type="text" className="w-full p-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl outline-none focus:border-[var(--color-accent-mint)] transition-colors" value={productForm.gradient} onChange={e => setProductForm({...productForm, gradient: e.target.value})} /></div>
                <div className="md:col-span-2"><label className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">Tag (Optional)</label><input type="text" className="w-full p-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl outline-none focus:border-[var(--color-accent-mint)] transition-colors" value={productForm.tag || ''} onChange={e => setProductForm({...productForm, tag: e.target.value})} /></div>
                <div className="md:col-span-2"><label className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">YouTube URL (Optional)</label><input type="text" className="w-full p-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl outline-none focus:border-[var(--color-accent-mint)] transition-colors" value={productForm.youtube_url || ''} onChange={e => setProductForm({...productForm, youtube_url: e.target.value})} /></div>
                <div className="md:col-span-2"><label className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">Live Demo / File URL (Optional)</label><input type="text" className="w-full p-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl outline-none focus:border-[var(--color-accent-mint)] transition-colors" value={productForm.file_url || ''} onChange={e => setProductForm({...productForm, file_url: e.target.value})} /></div>
                
                {/* NEW HIDE TOGGLE */}
                <div className="md:col-span-2 pt-4 border-t border-black/5 dark:border-white/5 flex items-center gap-3">
                  <input type="checkbox" id="hideProduct" className="w-5 h-5 accent-[var(--color-accent-purple)]" checked={productForm.is_hidden || false} onChange={e => setProductForm({...productForm, is_hidden: e.target.checked})} />
                  <label htmlFor="hideProduct" className="text-sm font-bold opacity-80 cursor-pointer">Hide this product from the public store</label>
                </div>

                <div className="md:col-span-2 pt-6"><button type="submit" className="w-full bg-[var(--color-text-primary)] text-white py-4 rounded-xl font-bold cursor-pointer hover:bg-[var(--color-accent-mint)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">Save Template</button></div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- BUNDLE MODAL --- */}
      <AnimatePresence>
        {showBundleModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-[var(--color-bg-secondary)] dark:border-slate-800">
              <div className="p-6 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-[var(--color-bg-primary)]/50 dark:bg-slate-950/50">
                <h2 className="text-2xl font-serif font-bold">{bundleForm.id ? 'Edit Bundle' : 'New Bundle'}</h2>
                <button onClick={() => setShowBundleModal(false)} className="p-2 bg-white dark:bg-slate-800 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-colors cursor-pointer shadow-sm"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleSaveBundle} className="flex-1 overflow-y-auto custom-scrollbar p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2"><label className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">Title</label><input required type="text" className="w-full p-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl outline-none focus:border-[var(--color-accent-mint)] transition-colors" value={bundleForm.title} onChange={e => setBundleForm({...bundleForm, title: e.target.value})} /></div>
                <div className="md:col-span-2"><label className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">Description</label><textarea required rows={3} className="w-full p-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl outline-none focus:border-[var(--color-accent-mint)] transition-colors resize-none" value={bundleForm.description} onChange={e => setBundleForm({...bundleForm, description: e.target.value})} /></div>
                <div><label className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">Price String (e.g. 'Rs. 499')</label><input required type="text" className="w-full p-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl outline-none focus:border-[var(--color-accent-mint)] transition-colors" value={bundleForm.price} onChange={e => setBundleForm({...bundleForm, price: e.target.value})} /></div>
                <div><label className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">Original Price String</label><input type="text" className="w-full p-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl outline-none focus:border-[var(--color-accent-mint)] transition-colors" value={bundleForm.original_price} onChange={e => setBundleForm({...bundleForm, original_price: e.target.value})} /></div>
                <div><label className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">Tag</label><input type="text" className="w-full p-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl outline-none focus:border-[var(--color-accent-mint)] transition-colors" value={bundleForm.tag} onChange={e => setBundleForm({...bundleForm, tag: e.target.value})} /></div>
                <div><label className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">Gradient String</label><input type="text" className="w-full p-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl outline-none focus:border-[var(--color-accent-mint)] transition-colors" value={bundleForm.gradient} onChange={e => setBundleForm({...bundleForm, gradient: e.target.value})} /></div>
                <div><label className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">Emoji List (JSON Array)</label><input type="text" className="w-full p-4 bg-[var(--color-bg-primary)] dark:bg-slate-950 border border-[var(--color-bg-secondary)] dark:border-slate-800 rounded-xl outline-none focus:border-[var(--color-accent-mint)] transition-colors" value={bundleForm.emoji_list} onChange={e => setBundleForm({...bundleForm, emoji_list: e.target.value})} placeholder='["❤️", "🎁"]'/></div>
                
                <div className="md:col-span-2 pt-4">
                  <label className="block text-xs font-bold opacity-60 mb-4 uppercase tracking-wider">Select Included Products</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-[var(--color-bg-primary)] dark:bg-slate-950 p-5 rounded-2xl border border-[var(--color-bg-secondary)] dark:border-slate-800 max-h-64 overflow-y-auto custom-scrollbar">
                    {products.map(p => {
                      const isSelected = isProductInBundle(p.title);
                      return (
                        <div 
                          key={p.id} 
                          onClick={() => toggleBundleProduct(p.title)}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'bg-white dark:bg-slate-900 border-transparent hover:border-[var(--color-bg-secondary)] dark:hover:border-slate-700 opacity-70 hover:opacity-100'}`}
                        >
                          {isSelected ? <CheckSquare className="w-5 h-5 shrink-0" /> : <Square className="w-5 h-5 shrink-0 opacity-40" />}
                          <span className="text-sm font-bold truncate select-none">{p.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* NEW HIDE TOGGLE */}
                <div className="md:col-span-2 pt-4 border-t border-black/5 dark:border-white/5 flex items-center gap-3">
                  <input type="checkbox" id="hideBundle" className="w-5 h-5 accent-[var(--color-accent-purple)]" checked={bundleForm.is_hidden || false} onChange={e => setBundleForm({...bundleForm, is_hidden: e.target.checked})} />
                  <label htmlFor="hideBundle" className="text-sm font-bold opacity-80 cursor-pointer">Hide this bundle from the public store</label>
                </div>

                <div className="md:col-span-2 pt-6"><button type="submit" className="w-full bg-[var(--color-text-primary)] text-white py-4 rounded-xl font-bold cursor-pointer hover:bg-[var(--color-accent-mint)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">Save Bundle</button></div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};