import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link, useSearchParams } from 'react-router-dom';
import { formatPrice, cn } from '../lib/utils';
import { Filter, X } from 'lucide-react';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawCategoryFilter = searchParams.get('category');
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    category: rawCategoryFilter || 'All',
    brand: 'All',
  });

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let q = query(collection(db, 'products'));
        // We'll fetch all and filter client side for simplicity in this demo,
        // or apply firestore filters.
        const snapshot = await getDocs(q);
        const fetchedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fetchedProducts);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Use Effect to sync URL category to state if URL changes
  useEffect(() => {
    if (rawCategoryFilter) {
      setFilters(prev => ({ ...prev, category: rawCategoryFilter }));
    }
  }, [rawCategoryFilter]);

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (key === 'category' && value !== 'All') {
      setSearchParams({ category: value });
    } else if (key === 'category' && value === 'All') {
      setSearchParams({});
    }
  };

  const filteredProducts = products.filter(p => {
    if (filters.category !== 'All' && p.category !== filters.category) return false;
    if (filters.brand !== 'All' && p.brand !== filters.brand) return false;
    return true;
  });

  const categories = ['All', 'Men', 'Women', 'Kids'];
  const brands = ['All', 'Nike', 'Adidas', 'Puma', 'Reebok'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
      <div className="flex justify-between items-end mb-8 pt-6 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Shop</h1>
          <p className="text-neutral-500 mt-2 text-sm">Showing {filteredProducts.length} results</p>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center space-x-2 border border-neutral-300 px-4 py-2 rounded-sm"
        >
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className={cn(
          "lg:w-64 flex-shrink-0 transition-all",
          showFilters ? "block" : "hidden lg:block"
        )}>
          <div className="space-y-8 sticky top-32">
            
            <div className="flex justify-between lg:hidden">
              <h3 className="font-bold uppercase tracking-wider">Filters</h3>
              <button onClick={() => setShowFilters(false)}><X size={20} /></button>
            </div>

            <div>
              <h3 className="font-bold uppercase tracking-wider mb-4 border-b border-neutral-200 pb-2">Category</h3>
              <ul className="space-y-3 font-medium text-neutral-600">
                {categories.map(c => (
                  <li key={c}>
                    <button 
                      onClick={() => updateFilter('category', c)}
                      className={cn(
                        "hover:text-red-600 transition-colors",
                         filters.category === c ? "text-red-600 font-bold" : ""
                      )}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold uppercase tracking-wider mb-4 border-b border-neutral-200 pb-2">Brand</h3>
              <ul className="space-y-3 font-medium text-neutral-600">
                {brands.map(b => (
                  <li key={b}>
                    <button 
                      onClick={() => updateFilter('brand', b)}
                      className={cn(
                        "hover:text-red-600 transition-colors",
                         filters.brand === b ? "text-red-600 font-bold" : ""
                      )}
                    >
                      {b}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-neutral-200 rounded-sm aspect-square mb-4"></div>
                  <div className="h-4 bg-neutral-200 w-1/3 mb-2"></div>
                  <div className="h-6 bg-neutral-200 w-3/4 mb-2"></div>
                  <div className="h-5 bg-neutral-200 w-1/4"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
              {filteredProducts.map((product) => (
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
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 group-hover:text-red-600 transition-colors line-clamp-1">{product.name}</h3>
                    <p className="mt-1 font-bold text-lg">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border-2 border-dashed border-neutral-200 rounded-sm">
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-neutral-500 mb-6">Try adjusting your filters to see more results.</p>
              <button 
                onClick={() => setFilters({ category: 'All', brand: 'All' })}
                className="bg-neutral-900 text-white px-6 py-3 font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
