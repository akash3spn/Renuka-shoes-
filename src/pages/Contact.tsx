import React from 'react';
import { MapPin, Phone, Mail, Facebook } from 'lucide-react';
import { TikTok } from '../components/icons/TikTok';

export default function Contact() {
  return (
    <div className="min-h-[calc(100dvh-80px)] bg-neutral-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Contact Us</h1>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Have a question about our products, an order, or just want to say hi? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          <div className="bg-white p-8 rounded-sm shadow-sm border border-neutral-200">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 text-black">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="text-red-600 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-1">Our Store</h3>
                  <p className="text-neutral-600">Gopalganj, Bangladesh</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone className="text-red-600 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-1">Call Us</h3>
                  <p className="text-neutral-600">+880 1750-694979</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail className="text-red-600 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-1">Email</h3>
                  <p className="text-neutral-600">contact@renukashoes.com</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="font-black uppercase tracking-wider mb-4 text-black border-b border-neutral-100 pb-2">Follow Us</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/share/17WGUF6ZNG/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-red-600 transition-all duration-300 transform hover:scale-110 text-white shadow-md"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook size={24} />
                </a>
                <a 
                  href="https://www.tiktok.com/@renukashoesgopalgonj" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-red-600 transition-all duration-300 transform hover:scale-110 text-white shadow-md relative"
                  aria-label="Follow us on TikTok"
                >
                  <TikTok size={24} />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-sm shadow-sm border border-neutral-200">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 text-black">Send a Message</h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }}>
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-neutral-700 mb-1 tracking-wide uppercase">Name</label>
                <input type="text" id="name" className="w-full border border-neutral-300 rounded-sm p-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-neutral-700 mb-1 tracking-wide uppercase">Email</label>
                <input type="email" id="email" className="w-full border border-neutral-300 rounded-sm p-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors" required />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-neutral-700 mb-1 tracking-wide uppercase">Message</label>
                <textarea id="message" rows={5} className="w-full border border-neutral-300 rounded-sm p-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors" required></textarea>
              </div>
              <button type="submit" className="w-full bg-black hover:bg-red-600 text-white font-bold tracking-wider py-4 rounded-sm transition-colors duration-300 uppercase">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
