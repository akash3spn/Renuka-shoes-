import React from 'react';
import { useCartStore } from '../store/cartStore';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../lib/utils';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Your Cart is Empty</h1>
        <p className="text-neutral-500 mb-8 max-w-md">Looks like you haven't added any premium kicks to your cart yet.</p>
        <Link to="/shop" className="bg-red-600 text-white px-8 py-4 font-bold uppercase tracking-wider rounded-sm hover:bg-red-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-12">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}`} className="flex flex-col sm:flex-row gap-6 border-b border-neutral-200 pb-8 last:border-0 last:pb-0">
              <div className="w-full sm:w-32 bg-neutral-100 aspect-square rounded-sm overflow-hidden flex-shrink-0">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                    <p className="text-neutral-500 text-sm">Size: {item.size}</p>
                  </div>
                  <p className="font-bold">{formatPrice(item.price)}</p>
                </div>
                
                <div className="mt-auto flex justify-between items-center pt-4">
                  <div className="flex items-center border border-neutral-300 rounded-sm">
                    <button 
                      onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1 text-neutral-500 hover:text-black transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 font-bold text-sm w-12 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="px-3 py-1 text-neutral-500 hover:text-black transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id, item.size)}
                    className="text-neutral-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-neutral-200 pt-8 lg:pt-0 lg:pl-12">
          <div className="bg-neutral-50 p-6 rounded-sm">
            <h2 className="text-xl font-black uppercase tracking-tighter mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm mb-6 border-b border-neutral-200 pb-6">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-bold">{formatPrice(getTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span className="font-bold">Calculated at checkout</span>
              </div>
            </div>
            <div className="flex justify-between items-end mb-8">
              <span className="font-bold uppercase tracking-wider text-sm">Total</span>
              <span className="text-2xl font-bold">{formatPrice(getTotal())}</span>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center space-x-2 bg-black text-white px-6 py-4 font-bold uppercase tracking-wider rounded-sm hover:bg-red-600 transition-colors"
            >
              <span>Secure Checkout</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
