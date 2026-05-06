import React, { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { Navigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminOverview from './AdminOverview';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminSettings from './AdminSettings';
import { Package, ShoppingCart, LayoutDashboard, Settings, Sliders, Bell } from 'lucide-react';
import { cn } from '../../lib/utils';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [notifications, setNotifications] = useState<string[]>([]);
  
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
    <div className="flex min-h-[calc(100vh-80px)] mt-20 bg-neutral-100">
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

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 hidden md:block flex-shrink-0 min-h-[calc(100vh-80px)]">
        <div className="p-6 border-b border-neutral-200">
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
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
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
