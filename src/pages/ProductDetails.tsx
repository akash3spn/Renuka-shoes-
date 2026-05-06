import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useCartStore } from '../store/cartStore';
import { formatPrice, cn } from '../lib/utils';
import { ArrowLeft, Check } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as any;
          setProduct(data);
          if (data.imageUrls?.length > 0) setActiveImage(data.imageUrls[0]);
          if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        } else {
          navigate('/404');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrls[0],
      size: selectedSize,
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product || !selectedSize) return;
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="w-4 h-4 bg-red-600 rounded-full"></div>
          <div className="w-4 h-4 bg-red-600 rounded-full animation-delay-200"></div>
          <div className="w-4 h-4 bg-red-600 rounded-full animation-delay-400"></div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-neutral-500 hover:text-neutral-900 mb-8 transition-colors uppercase tracking-wider text-sm font-bold"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Images */}
        <div>
          <div className="bg-neutral-100 aspect-square rounded-sm overflow-hidden mb-4">
            {activeImage ? (
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
            )}
          </div>
          {product.imageUrls?.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.imageUrls.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    "aspect-square rounded-sm overflow-hidden border-2 transition-all",
                    activeImage === img ? "border-black" : "border-transparent"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-red-600 font-bold uppercase tracking-wider text-sm mb-2">{product.brand}</p>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-none">{product.name}</h1>
          <p className="text-2xl font-bold mb-8">{formatPrice(product.price)}</p>
          
          <div className="prose text-neutral-600 mb-10 max-w-none">
            <p>{product.description}</p>
          </div>

          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold uppercase tracking-wider text-sm">Select Size</h3>
              <a href="#" className="text-sm font-medium text-neutral-500 underline">Size Guide</a>
            </div>
            {product.sizes?.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "py-3 font-bold border transition-all rounded-sm",
                      selectedSize === size 
                        ? "border-black bg-black text-white" 
                        : "border-neutral-200 text-neutral-800 hover:border-neutral-400"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 italic">No sizes specified.</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto border-t border-neutral-100 pt-8">
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={cn(
                "flex-1 py-4 font-bold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center space-x-2",
                added ? "bg-green-600 text-white" : "border-2 border-black text-black hover:bg-black hover:text-white"
              )}
            >
              {added ? (
                <>
                  <Check size={20} />
                  <span>Added</span>
                </>
              ) : (
                <span>Add to Cart</span>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-red-600 text-white py-4 font-bold uppercase tracking-wider rounded-sm hover:bg-red-700 transition-colors"
            >
              Buy Now
            </button>
          </div>
          
          <div className="mt-8 space-y-4 text-sm font-medium text-neutral-500 border-t border-neutral-100 pt-8">
            <p>✓ Free shipping inside Gopalganj</p>
            <p>✓ Cash on Delivery available</p>
            <p>✓ 100% Authentic Products</p>
          </div>
        </div>
      </div>
    </div>
  );
}
