import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { formatPrice } from '../lib/utils';
import { ShieldCheck, Truck } from 'lucide-react';

enum OperationType { CREATE = 'create' }

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    paymentMethod: 'COD',
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customerId: auth.currentUser?.uid || 'anonymous',
        customerName: formData.customerName,
        phone: formData.phone,
        address: formData.address,
        paymentMethod: formData.paymentMethod,
        items: items.map(i => ({
          productId: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          size: i.size
        })),
        totalAmount: getTotal(),
        status: 'Pending',
        createdAt: Date.now(), // Request time
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      clearCart();
      alert('Order placed successfully!');
      navigate('/');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
      alert('Failed to place order. Technical error logged.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
      <div className="grid lg:grid-cols-2 gap-16">
        
        {/* Form */}
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 border-b border-neutral-200 pb-4">Checkout</h1>
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">Full Name</label>
              <input 
                required
                type="text" 
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full border border-neutral-300 p-3 rounded-sm focus:outline-none focus:border-black"
                placeholder="Rahim Ali"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">Phone Number</label>
              <input 
                required
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border border-neutral-300 p-3 rounded-sm focus:outline-none focus:border-black"
                placeholder="+880 17XX XXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">Delivery Address</label>
              <textarea 
                required
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-neutral-300 p-3 rounded-sm focus:outline-none focus:border-black"
                placeholder="House, Road, Area, Gopalganj"
              />
            </div>
            
            <div className="pt-6 border-t border-neutral-200">
              <h2 className="text-lg font-black uppercase tracking-tighter mb-4">Payment Method</h2>
              <div className="space-y-3">
                {['COD', 'bKash', 'Nagad'].map((method) => (
                  <label key={method} className="flex items-center space-x-3 cursor-pointer p-4 border border-neutral-200 rounded-sm hover:border-black transition-colors">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-red-600 focus:ring-red-500"
                    />
                    <span className="font-bold">{method === 'COD' ? 'Cash on Delivery' : method}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-red-600 text-white py-4 font-bold uppercase tracking-wider rounded-sm hover:bg-red-700 transition-colors mt-8 disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Place Order • ${formatPrice(getTotal())}`}
            </button>
          </form>
        </div>

        {/* Order Summary Summary */}
        <div className="bg-neutral-50 p-8 rounded-sm h-fit sticky top-32 lg:mt-8">
          <h2 className="text-xl font-black uppercase tracking-tighter mb-6 border-b border-neutral-200 pb-4">In your cart</h2>
          <div className="space-y-4 mb-6">
             {items.map((item) => (
               <div key={`${item.id}-${item.size}`} className="flex justify-between items-center text-sm">
                 <div className="flex items-center space-x-4">
                   <div className="w-12 h-12 bg-white rounded-sm overflow-hidden shadow-sm">
                     <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                   </div>
                   <div>
                     <p className="font-bold line-clamp-1">{item.name}</p>
                     <p className="text-neutral-500">Size: {item.size} • Qty: {item.quantity}</p>
                   </div>
                 </div>
                 <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
               </div>
             ))}
          </div>

          <div className="border-t border-neutral-200 pt-6 space-y-4 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-neutral-500">Subtotal</span>
              <span className="font-bold">{formatPrice(getTotal())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Shipping</span>
              <span className="font-green-600 font-bold">Free</span>
            </div>
          </div>
          
          <div className="flex justify-between items-end mb-8 pt-4 border-t border-neutral-800">
            <span className="font-bold uppercase tracking-wider">Total</span>
            <span className="text-2xl font-black text-red-600">{formatPrice(getTotal())}</span>
          </div>

          <div className="flex items-center space-x-3 text-sm text-neutral-500 justify-center">
            <ShieldCheck size={16} />
            <span>Secure Checkout</span>
            <span className="text-neutral-300">|</span>
            <Truck size={16} />
            <span>Fast Delivery</span>
          </div>
        </div>

      </div>
    </div>
  );
}
