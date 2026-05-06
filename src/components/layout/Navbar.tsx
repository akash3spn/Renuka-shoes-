import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/auth';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useCartStore();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Men', path: '/shop?category=Men' },
    { name: 'Women', path: '/shop?category=Women' },
    { name: 'Kids', path: '/shop?category=Kids' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-sm py-4' : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn("p-2", isScrolled ? "text-neutral-900" : "text-white")}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <Link
            to="/"
            className={cn(
              "text-2xl font-black uppercase tracking-tighter flex-shrink-0 mx-auto md:mx-0",
              isScrolled ? "text-neutral-900" : "text-white"
            )}
          >
            Renuka.
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-medium uppercase tracking-wider hover:text-red-500 transition-colors",
                  isScrolled ? "text-neutral-600" : "text-neutral-300"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <Link to="/shop" className={cn("p-2 hover:opacity-70 transition-opacity", isScrolled ? "text-black" : "text-white")}>
              <Search size={20} />
            </Link>
            {isAdmin && (
              <Link to="/admin" className={cn("hidden md:block p-2 hover:opacity-70 transition-opacity", isScrolled ? "text-black" : "text-white")}>
                <span className="text-xs font-bold bg-red-600 text-white px-2 py-1 rounded">ADMIN</span>
              </Link>
            )}
            <Link to={user ? "/account" : "/login"} className={cn("hidden md:block p-2 hover:opacity-70 transition-opacity", isScrolled ? "text-black" : "text-white")}>
              <User size={20} />
            </Link>
            <Link to="/cart" className={cn("relative p-2 hover:opacity-70 transition-opacity", isScrolled ? "text-black" : "text-white")}>
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out pt-24",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          "md:hidden"
        )}
      >
        <div className="flex flex-col px-6 space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-2xl font-bold uppercase text-neutral-900 border-b border-neutral-100 pb-4"
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="text-2xl font-bold uppercase text-red-600 border-b border-neutral-100 pb-4">
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
