import React, { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { Navigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminOverview from './AdminOverview';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminSettings from './AdminSettings';
import { Package, ShoppingCart, LayoutDashboard, Settings, Sliders, Bell, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [notifications, setNotifications] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    if (!isAdmin) return;
    
    // Listen for new orders
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(1));
    let initialLoad = true;

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (initialLoad) {
        initialLoad = false;
        return;
      }
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const order = change.doc.data();
          const message = `New Order! ${order.customerName} just placed an order for ${order.totalAmount} BDT.`;
          setNotifications(prev => [...prev, message]);
          
          // clear notification after 5 seconds
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n !== message));
          }, 5000);
        }
      });
    });

    return () => unsubscribe();
  }, [isAdmin]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  if (loading) return <div className="p-24 text-center">Loading Admin...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Settings', path: '/admin/settings', icon: Sliders },
  ];

  return (
    <div className="flex min-h-[calc(100vh-80px)] min-h-[calc(100dvh-80px)] mt-20 bg-neutral-100 flex-col md:flex-row">
      {/* Notifications Toast */}
      {notifications.length > 0 && (
         <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2">
            {notifications.map((msg, i) => (
                <div key={i} className="bg-neutral-900 border-l-4 border-red-600 text-white p-4 rounded-sm shadow-xl flex items-center space-x-3 max-w-sm w-full animate-in slide-in-from-bottom-5">
                   <Bell size={20} className="text-red-500" />
                   <p className="text-sm font-medium">{msg}</p>
                </div>
            ))}
         </div>
      )}

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 border-b border-neutral-200 sticky top-20 z-30">
        <h2 className="text-sm font-black uppercase tracking-wider text-red-600 flex items-center space-x-2">
          <Settings size={18} />
          <span>Admin Panel</span>
        </h2>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 -mr-2 text-neutral-600 hover:text-black focus:outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-neutral-200 flex-shrink-0 transition-all duration-300 z-20 flex flex-col",
        "md:w-64 md:block absolute md:static top-[145px] md:top-auto bottom-0 w-full overflow-y-auto min-h-[calc(100dvh-145px)] md:min-h-0",
        mobileMenuOpen ? "block left-0" : "hidden md:block"
      )}>
        <div className="flex-1">
          <div className="p-6 border-b border-neutral-200 hidden md:block">
            <h2 className="text-sm font-black uppercase tracking-wider text-red-600 flex items-center space-x-2">
              <Settings size={18} />
              <span>Admin Panel</span>
            </h2>
          </div>
          <nav className="p-4 space-y-2">
            {navItems.map(item => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-sm font-medium transition-colors text-sm",
                  (location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin/'))
                    ? "bg-neutral-900 text-white" 
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                )}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-neutral-200">
          <button 
            onClick={() => {
              import('firebase/auth').then(({ signOut }) => signOut(auth));
            }}
            className="flex w-full items-center space-x-3 px-4 py-3 rounded-sm font-medium transition-colors text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-neutral-100 w-full max-w-full">
        <div className="p-4 md:p-8 w-full max-w-full overflow-x-hidden">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
