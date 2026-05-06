import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function AdminSettings() {
  const [formData, setFormData] = useState({
    heroTitle: 'Step Into Greatness.',
    heroSubtitle: 'The premium destination for exclusive footwear in Gopalganj. Discover our latest collection of premium sneakers, running shoes, and lifestyle footwear.',
    heroImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=2000'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'homepage'));
        if (docSnap.exists()) {
          setFormData(docSnap.data() as any);
        }
      } catch (e) {
        console.error('Failed to load settings', e);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'homepage'), formData);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-black uppercase tracking-tighter mb-8">Homepage Settings</h1>

      <div className="bg-white border border-neutral-200 rounded-sm p-8 shadow-sm">
        <h2 className="text-lg font-bold uppercase tracking-wider mb-6 border-b border-neutral-100 pb-4">Hero Banner</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Hero Title</label>
            <input 
              type="text" 
              name="heroTitle" 
              value={formData.heroTitle} 
              onChange={handleChange} 
              className="w-full border p-3 rounded-sm focus:border-black focus:outline-none" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Hero Subtitle</label>
            <textarea 
              name="heroSubtitle" 
              value={formData.heroSubtitle} 
              onChange={handleChange} 
              className="w-full border p-3 rounded-sm focus:border-black focus:outline-none" 
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Hero Background Image URL</label>
            <input 
              type="url" 
              name="heroImage" 
              value={formData.heroImage} 
              onChange={handleChange} 
              className="w-full border p-3 rounded-sm focus:border-black focus:outline-none" 
              required
            />
            {formData.heroImage && (
               <div className="mt-4 w-full h-48 rounded-sm overflow-hidden border border-neutral-200">
                  <img src={formData.heroImage} alt="Preview" className="w-full h-full object-cover" />
               </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="bg-black text-white px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}
