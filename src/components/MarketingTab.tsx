import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Plus, Image, ArrowRight, X, Megaphone } from 'lucide-react';
import { PlatformAd } from '../types';

const IMAGE_PRESETS = [
  { name: 'Specialty Espresso', url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80' },
  { name: 'Gourmet Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80' },
  { name: 'Artisan Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80' },
  { name: 'Premium Steak', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80' },
  { name: 'Sweet Desserts', url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=80' },
];

export const MarketingTab = ({ tenantId }: { tenantId: string }) => {
  const { ads, addAd } = useApp();
  const tenantAds = ads.filter(a => a.tenantId === tenantId);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState(IMAGE_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isCustomImage, setIsCustomImage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subtitle) return;

    const finalImageUrl = isCustomImage ? (customImageUrl || IMAGE_PRESETS[0].url) : imageUrl;

    addAd({
      tenantId,
      title,
      subtitle,
      imageUrl: finalImageUrl,
      status: 'pending',
    });

    // Reset form
    setTitle('');
    setSubtitle('');
    setImageUrl(IMAGE_PRESETS[0].url);
    setCustomImageUrl('');
    setIsCustomImage(false);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Advertisement Platform</h2>
          <p className="text-xs text-slate-500 mt-0.5">Promote your custom menu and offers across the Dinex ecosystem.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)} 
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
          >
            <Plus className="h-4 w-4" /> Create Ad Campaign
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 animate-in fade-in slide-in-from-top-4 duration-250">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-amber-500" />
              New Promotion Campaign
            </h3>
            <button 
              type="button" 
              onClick={() => setShowForm(false)} 
              className="text-slate-400 hover:text-slate-600 p-1 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Campaign Title</label>
                <input 
                  required 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                   
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subtitle / Short Offer Details</label>
                <textarea 
                  required 
                  rows={3}
                  value={subtitle} 
                  onChange={e => setSubtitle(e.target.value)} 
                   
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Campaign Cover Image</label>
                
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setIsCustomImage(false)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${!isCustomImage ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                  >
                    Preset Library
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCustomImage(true)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${isCustomImage ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                  >
                    Custom URL
                  </button>
                </div>

                {!isCustomImage ? (
                  <div className="grid grid-cols-5 gap-2">
                    {IMAGE_PRESETS.map((preset, index) => {
                      const isSelected = imageUrl === preset.url;
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setImageUrl(preset.url)}
                          className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${isSelected ? 'border-amber-500 scale-95 shadow-sm' : 'border-transparent hover:scale-98 opacity-75 hover:opacity-100'}`}
                          title={preset.name}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input 
                    type="url" 
                    value={customImageUrl} 
                    onChange={e => setCustomImageUrl(e.target.value)} 
                     
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold" 
                  />
                )}
              </div>

              {/* Live Preview Card */}
              <div className="border border-slate-100 bg-slate-50/50 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Live Preview Outline</span>
                <div className="flex gap-3 bg-white p-2 rounded-lg border border-slate-200/60 shadow-xs max-w-sm">
                  <img 
                    src={isCustomImage ? (customImageUrl || IMAGE_PRESETS[0].url) : imageUrl} 
                    alt="Preview" 
                    className="h-12 w-20 rounded-md object-cover shrink-0 border border-slate-100" 
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{title || 'Your Title Here'}</h4>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{subtitle || 'Short offer description text...'}</p>
                    <span className="text-[8px] bg-amber-50 text-amber-700 border border-amber-100 rounded px-1.5 py-0.2 mt-1 inline-block font-bold">Awaiting Admin Approval</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
            <span className="text-amber-500 text-sm mt-0.5">ℹ</span>
            <p className="leading-relaxed">
              <strong>Super Admin Approval Workflow:</strong> Dinex is a secure platform. Newly created ad campaigns start as <strong>Pending</strong>. You can switch your active role to <strong>Super Admin</strong> in the top-right role switcher to instantly approve and manage this campaign platform-wide!
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setShowForm(false)} 
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1"
            >
              Submit Campaign <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {tenantAds.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Sparkles className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Active Campaigns</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Promote your business across the Dinex platform. Ads require admin approval.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenantAds.map(ad => (
            <div key={ad.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
              <div className="h-32 bg-slate-100 relative">
                {ad.imageUrl ? (
                  <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400"><Sparkles className="h-8 w-8" /></div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase
                    ${ad.status === 'approved' || ad.active ? 'bg-green-100 text-green-700' :
                      ad.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}
                  >
                    {ad.status === 'approved' || ad.active ? 'Active' : 'Pending'}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-900 truncate">{ad.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ad.subtitle}</p>
                <div className="mt-4 pt-3 border-t border-slate-150 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                  <span>Targeted Ad</span>
                  <span className={ad.active ? "text-green-600" : "text-amber-600"}>{ad.active ? "Live on Menus" : "Awaiting Admin"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

