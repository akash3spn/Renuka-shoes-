import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, MapPin, Phone, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link to="/" className="text-3xl font-black uppercase tracking-tighter block">
              Renuka.
            </Link>
            <p className="text-neutral-400 text-sm max-w-xs leading-relaxed">
              Premium quality shoes for every walk of life. Located in the heart of Gopalganj, bringing you the world's best footwear.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-6 text-sm">Shop</h4>
            <ul className="space-y-4 text-neutral-400 text-sm">
              <li><Link to="/shop?category=Men" className="hover:text-white transition-colors">Men's Shoes</Link></li>
              <li><Link to="/shop?category=Women" className="hover:text-white transition-colors">Women's Shoes</Link></li>
              <li><Link to="/shop?category=Kids" className="hover:text-white transition-colors">Kids' Collection</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider mb-6 text-sm">Customer Service</h4>
            <ul className="space-y-4 text-neutral-400 text-sm">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors text-red-500 hover:text-red-400">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider mb-6 text-sm">Get in Touch</h4>
            <ul className="space-y-4 text-neutral-400 text-sm">
              <li className="flex items-center space-x-3">
                <MapPin size={16} className="text-red-500" />
                <span>Gopalganj, Bangladesh</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-red-500" />
                <span>+880 1750-694979</span>
              </li>
            </ul>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-red-600 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-red-600 transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Renuka Shoes. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
