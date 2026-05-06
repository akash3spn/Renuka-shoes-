import React, { useEffect, useState } from 'react';
import { collection, getDocs, limit, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/utils';
import { ArrowRight, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [heroSettings, setHeroSettings] = useState({
    heroTitle: 'Step Into Greatness.',
    heroSubtitle: 'The premium destination for exclusive footwear in Gopalganj. Discover our latest collection of premium sneakers, running shoes, and lifestyle footwear.',
    heroImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=2000'
  });

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const q = query(collection(db, 'products'), where('isFeatured', '==', true), limit(8));
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // If no featured products, fallback to regular products
        if (products.length === 0) {
           const fbQ = query(collection(db, 'products'), limit(8));
           const fbSnapshot = await getDocs(fbQ);
           setFeaturedProducts(fbSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
           setFeaturedProducts(products);
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    async function fetchSettings() {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'homepage'));
        if (docSnap.exists()) {
          setHeroSettings(docSnap.data() as any);
        }
      } catch (e) {}
    }
    
    fetchFeatured();
    fetchSettings();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-neutral-950 text-white">
        {/* Placeholder background texture or image */}
        <div className="absolute inset-0 z-0 opacity-40">
           <img src={heroSettings.heroImage} alt="Hero background" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-tight whitespace-pre-wrap"
          >
            {heroSettings.heroTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-10 whitespace-pre-wrap"
          >
            {heroSettings.heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/shop" className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-sm font-bold uppercase tracking-wider transition-colors">
              <span>Shop Collection</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">New Arrivals</h2>
            <p className="text-neutral-500 mt-2 text-sm uppercase tracking-wider">The latest drops</p>
          </div>
          <Link to="/shop" className="text-red-600 font-bold hover:text-red-700 flex items-center space-x-1 group">
            <span>View All</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.length > 0 ? featuredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group cursor-pointer">
              <div className="relative bg-neutral-100 mb-4 aspect-square overflow-hidden rounded-sm">
                {product.imageUrls?.[0] ? (
                  <img 
                    src={product.imageUrls[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
                )}
                {product.isFeatured && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">Featured</span>
                )}
              </div>
              <div>
                <p className="text-neutral-500 text-sm mb-1">{product.category}</p>
                <h3 className="font-bold text-neutral-900 group-hover:text-red-600 transition-colors line-clamp-1">{product.name}</h3>
                <p className="mt-1 font-bold text-lg">{formatPrice(product.price)}</p>
              </div>
            </Link>
          )) : (
            <div className="col-span-full py-12 text-center text-neutral-500">
              No products found yet. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-neutral-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-tight">Authentic.<br/>Premium.<br/>Gopalganj.</h2>
              <p className="text-neutral-600 mb-6 leading-relaxed">
                Since our opening, Renuka Shoes has been the premier destination for footwear in Gopalganj, Bangladesh. We believe that a great journey begins with the right pair of shoes. That's why we carefully curate our collection to bring you only the best brands and latest styles.
              </p>
              <Link to="/about" className="text-black font-bold border-b-2 border-black pb-1 hover:text-red-600 hover:border-red-600 transition-colors uppercase tracking-wider text-sm">
                Read Our Story
              </Link>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=1000" alt="Store Interior" className="w-full h-[500px] object-cover rounded-sm shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4">Customer Love</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">Don't just take our word for it. Here is what our customers have to say about their experience with Renuka Shoes.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Rahim Ali", text: "Amazing collection! Best place to buy authentic shoes in Gopalganj. Staff is very friendly.", rating: 5 },
            { name: "Sadia Islam", text: "Ordered online and got delivery within 2 days via RedX. The shoes are perfect and the sizing was exactly as described.", rating: 5 },
            { name: "Tanvir Hossain", text: "Quality is top notch. I love the new Nike arrivals. Definitely buying again.", rating: 4 },
          ].map((review, i) => (
            <div key={i} className="bg-white p-8 rounded-sm shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-neutral-100">
              <div className="flex text-amber-400 mb-4">
                {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-neutral-600 italic mb-6">"{review.text}"</p>
              <p className="font-bold">{review.name}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
