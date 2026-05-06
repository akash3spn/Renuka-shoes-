import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { formatPrice, cn } from '../../lib/utils';
import { Package, CreditCard, User, MoreVertical } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status: newStatus });
      fetchOrders();
    } catch (e) {
      console.error(e);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-indigo-100 text-indigo-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-black uppercase tracking-tighter mb-8">Orders</h1>

      <div className="space-y-6">
        {loading ? (
          <div className="p-8 text-center text-neutral-500 bg-white border border-neutral-200 rounded-sm">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 bg-white border border-neutral-200 rounded-sm">No orders yet.</div>
        ) : orders.map(order => (
          <div key={order.id} className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm">
            
            {/* Header */}
            <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                <div>
                  <p className="text-neutral-500 uppercase tracking-wider text-xs font-bold font-bold">Order Placed</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-neutral-500 uppercase tracking-wider text-xs font-bold">Total</p>
                  <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-neutral-500 uppercase tracking-wider text-xs font-bold">Order ID</p>
                  <p className="font-medium font-mono text-xs mt-1">{order.id}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto">
                <select 
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border-0 cursor-pointer appearance-none outline-none",
                    getStatusColor(order.status)
                  )}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 md:p-6 grid md:grid-cols-3 gap-6">
              
              {/* Items */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-bold uppercase tracking-wider text-sm mb-3 text-neutral-500 flex items-center space-x-2">
                  <Package size={16} /> <span>Items</span>
                </h3>
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-neutral-500">Size: {item.size} • Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Customer Info */}
              <div className="space-y-6 md:pl-6 md:border-l border-neutral-200">
                <div>
                   <h3 className="font-bold uppercase tracking-wider text-sm mb-3 text-neutral-500 flex items-center space-x-2">
                    <User size={16} /> <span>Customer</span>
                  </h3>
                  <div className="text-sm space-y-1">
                    <p className="font-bold">{order.customerName}</p>
                    <p>{order.phone}</p>
                    <p className="text-neutral-600 mt-2">{order.address}</p>
                  </div>
                </div>

                <div>
                   <h3 className="font-bold uppercase tracking-wider text-sm mb-3 text-neutral-500 flex items-center space-x-2">
                    <CreditCard size={16} /> <span>Payment</span>
                  </h3>
                   <div className="text-sm">
                      <p className="font-bold">{order.paymentMethod}</p>
                   </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
