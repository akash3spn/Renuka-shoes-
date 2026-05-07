import React, { useEffect, useState } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { formatPrice } from '../../lib/utils';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [savingStatus, setSavingStatus] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Men',
    brand: '',
    imageUrl: '',
    sizes: '40,41,42,43,44',
    isFeatured: false,
  });

  const fetchProducts = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, 'products'));
    setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingStatus('Preparing...');
      let finalImageUrl = formData.imageUrl;

      if (imageFile) {
        setSavingStatus('Uploading Image...');
        const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      if (!finalImageUrl) {
        alert("Please select a product image.");
        setSavingStatus('');
        return;
      }

      setSavingStatus('Saving Product...');
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        brand: formData.brand,
        imageUrls: [finalImageUrl],
        sizes: formData.sizes.split(',').map(s => s.trim()),
        isFeatured: formData.isFeatured,
        createdAt: editingId ? products.find(p => p.id === editingId)?.createdAt : Date.now(),
        updatedAt: Date.now()
      };

      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), payload);
      } else {
        await addDoc(collection(db, 'products'), payload);
      }
      
      setIsModalOpen(false);
      setEditingId(null);
      setImageFile(null);
      setSavingStatus('');
      setFormData({ name: '', price: '', description: '', category: 'Men', brand: '', imageUrl: '', sizes: '40,41,42,43,44', isFeatured: false });
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert('Error saving product: ' + (error as any).message);
      setSavingStatus('');
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setImageFile(null);
    setSavingStatus('');
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description || '',
      category: product.category,
      brand: product.brand || '',
      imageUrl: product.imageUrls[0] || '',
      sizes: product.sizes.join(', ') || '',
      isFeatured: product.isFeatured || false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      alert('Error: Product ID is missing.');
      return;
    }
    
    if (deletingId) return; // Prevent double-click

    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setDeletingId(id);
      try {
        await deleteDoc(doc(db, 'products', id));
        // Real-time update UI without fully reloading from server, but we can also just fetch
        setProducts(prev => prev.filter(p => p.id !== id));
        alert('Product deleted successfully');
      } catch (error: any) {
        console.error(error);
        if (error.code === 'permission-denied') {
          alert('Error: You do not have permission to delete products (Admin only).');
        } else {
          alert('Error: Failed to delete product.');
        }
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tighter">Products</h1>
        <button 
          onClick={() => { setEditingId(null); setIsModalOpen(true); }}
          className="bg-black text-white px-4 py-2 rounded-sm flex items-center space-x-2 text-sm font-bold uppercase hover:bg-neutral-800 transition-colors"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-xs font-bold">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-neutral-500">Loading...</td></tr>
            ) : products.map(product => (
              <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4 flex items-center space-x-4">
                  <div className="w-10 h-10 bg-neutral-100 rounded overflow-hidden">
                    {product.imageUrls?.[0] && <img src={product.imageUrls[0]} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">{product.name}</p>
                    <p className="text-xs text-neutral-500">{product.brand}</p>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{formatPrice(product.price)}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => handleEdit(product)} className="text-neutral-500 hover:text-black">
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)} 
                    disabled={deletingId === product.id}
                    className={`hover:text-red-700 ${deletingId === product.id ? 'text-neutral-400 cursor-not-allowed' : 'text-red-500'}`}
                  >
                    {deletingId === product.id ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-black uppercase tracking-tighter mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold border-neutral-300 uppercase mb-1">Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border p-2 rounded-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Price</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full border p-2 rounded-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border p-2 rounded-sm">
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Brand</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full border p-2 rounded-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Sizes (comma separated)</label>
                  <input type="text" name="sizes" value={formData.sizes} onChange={handleInputChange} className="w-full border p-2 rounded-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Product Image</label>
                <div className="flex items-center space-x-4">
                  {(imageFile || formData.imageUrl) && (
                    <div className="w-16 h-16 border rounded-sm bg-neutral-100 overflow-hidden shrink-0">
                      <img src={imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                      }
                    }} 
                    className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-bold file:uppercase file:tracking-wider file:bg-black file:text-white hover:file:bg-neutral-800 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border p-2 rounded-sm" rows={3}></textarea>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" name="isFeatured" id="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="w-4 h-4 rounded text-red-600 focus:ring-red-500" />
                <label htmlFor="isFeatured" className="text-sm font-bold uppercase">Featured Product (Show on Homepage)</label>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold uppercase tracking-wider bg-neutral-200 hover:bg-neutral-300 transition-colors rounded-sm text-sm">Cancel</button>
                <button type="submit" disabled={!!savingStatus} className="flex-1 py-3 font-bold uppercase tracking-wider bg-black text-white hover:bg-red-600 transition-colors rounded-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {savingStatus || 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
