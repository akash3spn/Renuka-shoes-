import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { formatPrice } from '../../lib/utils';
import { Package, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalSales: 0,
  });
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const productsSnap = await getDocs(collection(db, 'products'));
        const ordersSnap = await getDocs(collection(db, 'orders'));
        
        let pending = 0;
        let revenue = 0;
        
        const last7Days = Array.from({length: 7}, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return { date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), sales: 0, fullDate: d.toDateString() };
        }).reverse();

        ordersSnap.forEach(doc => {
          const order = doc.data();
          if (order.status === 'Pending') pending++;
          
          // Only count shipped/delivered for total sales, or we count all? Let's count all non-cancelled.
          if (order.status !== 'Cancelled') {
            revenue += order.totalAmount || 0;
            
            const orderDate = new Date(order.createdAt).toDateString();
            const dayStat = last7Days.find(d => d.fullDate === orderDate);
            if (dayStat) {
              dayStat.sales += order.totalAmount || 0;
            }
          }
        });

        setStats({
          totalProducts: productsSnap.size,
          totalOrders: ordersSnap.size,
          pendingOrders: pending,
          totalSales: revenue,
        });

        setSalesData(last7Days);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const statCards = [
    { title: 'Total Revenue', value: formatPrice(stats.totalSales), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Pending Orders', value: stats.pendingOrders.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Total Products', value: stats.totalProducts.toString(), icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black uppercase tracking-tighter mb-8">Dashboard Overview</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-sm border border-neutral-200 shadow-sm flex items-center space-x-4">
            <div className={`p-4 rounded-full ${card.bg} ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-bold uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-black">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-sm border border-neutral-200 shadow-sm mb-8">
        <h2 className="text-lg font-black uppercase tracking-wider mb-6">Sales Last 7 Days</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} tickFormatter={(val) => `৳${val/1000}k`} />
              <Tooltip 
                cursor={{fill: '#F5F5F5'}}
                contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [formatPrice(value), 'Sales']}
              />
              <Bar dataKey="sales" fill="#000000" radius={[4, 4, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
