import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LandingPageConfig, LandingPageFeature, LandingPageBusinessType, PlanPricing, LandingPageFaq, LandingPageTestimonial, LandingPageScreenshot } from '../types';
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon, Loader2 } from 'lucide-react';
import { getFirebaseStorage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

type Tab = 'hero' | 'features' | 'business_types' | 'pricing' | 'faq' | 'screenshots' | 'testimonials' | 'contact' | 'footer' | 'seo';

export default function LandingPageCMS() {
  const { landingPageConfig, updateLandingPageConfig, showToast } = useApp();
  const [config, setConfig] = useState<LandingPageConfig>(landingPageConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('hero');

  React.useEffect(() => {
    setConfig(landingPageConfig);
  }, [landingPageConfig]);

  const handleChange = (field: keyof LandingPageConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof LandingPageConfig | { array: keyof LandingPageConfig, index: number, prop: string }) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const storage = getFirebaseStorage();
    if (!storage) {
      showToast('Firebase storage is not initialized.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const fileRef = ref(storage, `landing_page/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      
      if (typeof field === 'string') {
        handleChange(field, url);
      } else {
        const arr = [...(config[field.array] as any[])];
        arr[field.index][field.prop] = url;
        handleChange(field.array, arr);
      }
      showToast('File uploaded successfully.');
    } catch (error: any) {
      console.error("Upload error", error);
      showToast('Failed to upload file.', 'error');
    }
    setIsUploading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateLandingPageConfig(config);
      showToast('Landing page settings saved successfully.');
    } catch (err) {
      showToast('Failed to save settings.', 'error');
    }
    setIsSaving(false);
  };

  const tabs: { id: Tab, label: string }[] = [
    { id: 'hero', label: 'Hero' },
    { id: 'features', label: 'Features' },
    { id: 'business_types', label: 'Business Types' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'faq', label: 'FAQ' },
    { id: 'screenshots', label: 'Screenshots' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' },
    { id: 'footer', label: 'Footer' },
    { id: 'seo', label: 'SEO & Analytics' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Landing Page Content Manager</h2>
            <p className="text-sm text-slate-500 mt-1">Configure all content and modules for the platform website.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors font-bold shadow-sm"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-100 pb-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === t.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* HERO */}
          {activeTab === 'hero' && (
            <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
                  <input type="text" value={config.heroTitle} onChange={e => handleChange('heroTitle', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                  <textarea value={config.heroSubtitle} onChange={e => handleChange('heroSubtitle', e.target.value)} rows={2} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Primary CTA Text</label>
                  <input type="text" value={config.heroCtaText} onChange={e => handleChange('heroCtaText', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Primary CTA Link</label>
                  <input type="text" value={config.heroCtaLink} onChange={e => handleChange('heroCtaLink', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Secondary CTA Text</label>
                  <input type="text" value={config.heroSecondaryCtaText || ''} onChange={e => handleChange('heroSecondaryCtaText', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Secondary CTA Link</label>
                  <input type="text" value={config.heroSecondaryCtaLink || ''} onChange={e => handleChange('heroSecondaryCtaLink', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Background Type</label>
                  <select value={config.heroBackgroundType} onChange={e => handleChange('heroBackgroundType', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
                    <option value="color">Solid Color / Gradient</option>
                    <option value="image">Image URL</option>
                    <option value="video">Video URL (YouTube/MP4)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Overlay Opacity (0-100)</label>
                  <input type="number" min="0" max="100" value={config.heroOverlayOpacity || 70} onChange={e => handleChange('heroOverlayOpacity', parseInt(e.target.value))} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Background Media URL</label>
                  <div className="flex gap-2">
                    <input type="text" value={config.heroBackgroundUrl} onChange={e => handleChange('heroBackgroundUrl', e.target.value)} placeholder="https://..." className="flex-1 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                    <div className="relative flex-shrink-0">
                      <input type="file" accept="image/*,video/mp4" onChange={e => handleFileUpload(e, 'heroBackgroundUrl')} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                      <button type="button" disabled={isUploading} className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-md border border-slate-300 transition-colors disabled:opacity-50 h-[38px] text-sm font-medium">
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* FEATURES */}
          {activeTab === 'features' && (
            <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input type="checkbox" checked={config.featuresEnabled} onChange={e => handleChange('featuresEnabled', e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 h-4 w-4" />
                  Enable Features Section
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Section Title</label>
                  <input type="text" value={config.featuresTitle} onChange={e => handleChange('featuresTitle', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Section Subtitle</label>
                  <input type="text" value={config.featuresSubtitle} onChange={e => handleChange('featuresSubtitle', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800">Features List</h4>
                  <button onClick={() => {
                    const nf = [...config.features, { id: `f_${Date.now()}`, title: 'New Feature', description: '', icon: 'Star', order: config.features.length, enabled: true }];
                    handleChange('features', nf);
                  }} className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold shadow-sm hover:bg-slate-50"><Plus className="w-3.5 h-3.5"/> Add Feature</button>
                </div>
                <div className="grid gap-3">
                  {config.features.map((f, i) => (
                    <div key={f.id} className="bg-white p-3 rounded-xl border border-slate-200 flex gap-4 items-start">
                      <div className="pt-2 text-slate-400 cursor-move"><GripVertical className="w-4 h-4"/></div>
                      <div className="flex-1 grid gap-2 md:grid-cols-2">
                        <input type="text" value={f.title} onChange={e => { const n = [...config.features]; n[i].title = e.target.value; handleChange('features', n); }} className="text-sm font-bold border-slate-200 rounded-md" placeholder="Title" />
                        <input type="text" value={f.icon} onChange={e => { const n = [...config.features]; n[i].icon = e.target.value; handleChange('features', n); }} className="text-sm border-slate-200 rounded-md" placeholder="Icon name (e.g. QrCode)" />
                        <textarea value={f.description} onChange={e => { const n = [...config.features]; n[i].description = e.target.value; handleChange('features', n); }} className="text-sm border-slate-200 rounded-md md:col-span-2" placeholder="Description" rows={2} />
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <label className="text-xs flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={f.enabled} onChange={e => { const n = [...config.features]; n[i].enabled = e.target.checked; handleChange('features', n); }}/> Enabled</label>
                        <button onClick={() => { const n = config.features.filter((_, idx) => idx !== i); handleChange('features', n); }} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* BUSINESS TYPES */}
          {activeTab === 'business_types' && (
            <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input type="checkbox" checked={config.businessTypesEnabled} onChange={e => handleChange('businessTypesEnabled', e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 h-4 w-4" />
                  Enable Business Types Section
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Section Title</label>
                  <input type="text" value={config.businessTypesTitle} onChange={e => handleChange('businessTypesTitle', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Section Subtitle</label>
                  <input type="text" value={config.businessTypesSubtitle} onChange={e => handleChange('businessTypesSubtitle', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800">Business Types List</h4>
                  <button onClick={() => {
                    const nb = [...config.businessTypes, { id: `b_${Date.now()}`, type: 'New Type', description: '', icon: '', order: config.businessTypes.length, enabled: true }];
                    handleChange('businessTypes', nb);
                  }} className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold shadow-sm hover:bg-slate-50"><Plus className="w-3.5 h-3.5"/> Add Type</button>
                </div>
                <div className="grid gap-3">
                  {config.businessTypes.map((b, i) => (
                    <div key={b.id} className="bg-white p-3 rounded-xl border border-slate-200 flex gap-4 items-center">
                      <div className="text-slate-400 cursor-move"><GripVertical className="w-4 h-4"/></div>
                      <div className="flex-1 flex gap-2">
                        <input type="text" value={b.type} onChange={e => { const n = [...config.businessTypes]; n[i].type = e.target.value; handleChange('businessTypes', n); }} className="flex-1 text-sm font-bold border-slate-200 rounded-md" placeholder="Business Type" />
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-xs flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={b.enabled} onChange={e => { const n = [...config.businessTypes]; n[i].enabled = e.target.checked; handleChange('businessTypes', n); }}/> Enabled</label>
                        <button onClick={() => { const n = config.businessTypes.filter((_, idx) => idx !== i); handleChange('businessTypes', n); }} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* PRICING */}
          {activeTab === 'pricing' && (
            <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input type="checkbox" checked={config.pricingEnabled} onChange={e => handleChange('pricingEnabled', e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 h-4 w-4" />
                  Enable Pricing Section
                </label>
                <button onClick={() => {
                  const np = [...(config.pricingPlans || []), { id: `p_${Date.now()}` as any, name: 'New Plan', monthlyPrice: 0, yearlyPrice: 0, priceETB: 0, priceUSD: 0, yearlyDiscount: 0, description: '', features: [], enabled: true, isRecommended: false }];
                  handleChange('pricingPlans', np);
                }} className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold shadow-sm hover:bg-slate-50"><Plus className="w-3.5 h-3.5"/> Add Plan</button>
              </div>
              
              <div className="grid gap-6 lg:grid-cols-2">
                {config.pricingPlans?.map((p, i) => (
                  <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm relative">
                    {p.isRecommended && <div className="absolute -top-3 -right-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">Recommended</div>}
                    <div className="flex justify-between items-start gap-2">
                      <input type="text" value={p.name} onChange={e => { const n = [...config.pricingPlans]; n[i].name = e.target.value; handleChange('pricingPlans', n); }} className="text-lg font-bold border-slate-200 rounded-md w-full" placeholder="Plan Name" />
                    </div>
                    <textarea value={p.description} onChange={e => { const n = [...config.pricingPlans]; n[i].description = e.target.value; handleChange('pricingPlans', n); }} className="text-sm border-slate-200 rounded-md w-full" placeholder="Description" rows={2} />
                    
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Monthly $</label>
                        <input type="number" value={p.monthlyPrice} onChange={e => { const n = [...config.pricingPlans]; n[i].monthlyPrice = Number(e.target.value); handleChange('pricingPlans', n); }} className="w-full text-sm border-slate-200 rounded-md" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Yearly $</label>
                        <input type="number" value={p.yearlyPrice} onChange={e => { const n = [...config.pricingPlans]; n[i].yearlyPrice = Number(e.target.value); handleChange('pricingPlans', n); }} className="w-full text-sm border-slate-200 rounded-md" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Monthly ETB</label>
                        <input type="number" value={p.priceETB} onChange={e => { const n = [...config.pricingPlans]; n[i].priceETB = Number(e.target.value); handleChange('pricingPlans', n); }} className="w-full text-sm border-slate-200 rounded-md" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Yearly Discount %</label>
                        <input type="number" value={p.yearlyDiscount} onChange={e => { const n = [...config.pricingPlans]; n[i].yearlyDiscount = Number(e.target.value); handleChange('pricingPlans', n); }} className="w-full text-sm border-slate-200 rounded-md" />
                      </div>
                    </div>

                    <div>
                       <label className="text-xs font-bold text-slate-700 mb-1 block">Features (comma separated)</label>
                       <textarea value={p.features.join(', ')} onChange={e => { const n = [...config.pricingPlans]; n[i].features = e.target.value.split(',').map(s=>s.trim()).filter(Boolean); handleChange('pricingPlans', n); }} className="w-full text-sm border-slate-200 rounded-md" rows={3} placeholder="Feature 1, Feature 2..." />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex gap-4">
                        <label className="text-xs flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={p.enabled} onChange={e => { const n = [...config.pricingPlans]; n[i].enabled = e.target.checked; handleChange('pricingPlans', n); }}/> Enabled</label>
                        <label className="text-xs flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={p.isRecommended} onChange={e => { const n = [...config.pricingPlans]; n[i].isRecommended = e.target.checked; handleChange('pricingPlans', n); }}/> Recommended</label>
                      </div>
                      <button onClick={() => { const n = config.pricingPlans.filter((_, idx) => idx !== i); handleChange('pricingPlans', n); }} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          {activeTab === 'faq' && (
            <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input type="checkbox" checked={config.faqEnabled} onChange={e => handleChange('faqEnabled', e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 h-4 w-4" />
                  Enable FAQ Section
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Section Title</label>
                  <input type="text" value={config.faqTitle} onChange={e => handleChange('faqTitle', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Section Subtitle</label>
                  <input type="text" value={config.faqSubtitle} onChange={e => handleChange('faqSubtitle', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800">FAQ List</h4>
                  <button onClick={() => {
                    const n = [...config.faqs, { id: `q_${Date.now()}`, question: 'New Question', answer: '', order: config.faqs.length, enabled: true }];
                    handleChange('faqs', n);
                  }} className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold shadow-sm hover:bg-slate-50"><Plus className="w-3.5 h-3.5"/> Add FAQ</button>
                </div>
                <div className="grid gap-3">
                  {config.faqs.map((q, i) => (
                    <div key={q.id} className="bg-white p-3 rounded-xl border border-slate-200 flex gap-4 items-start">
                      <div className="pt-2 text-slate-400 cursor-move"><GripVertical className="w-4 h-4"/></div>
                      <div className="flex-1 space-y-2">
                        <input type="text" value={q.question} onChange={e => { const n = [...config.faqs]; n[i].question = e.target.value; handleChange('faqs', n); }} className="w-full text-sm font-bold border-slate-200 rounded-md" placeholder="Question" />
                        <textarea value={q.answer} onChange={e => { const n = [...config.faqs]; n[i].answer = e.target.value; handleChange('faqs', n); }} className="w-full text-sm border-slate-200 rounded-md" placeholder="Answer" rows={3} />
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <label className="text-xs flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={q.enabled} onChange={e => { const n = [...config.faqs]; n[i].enabled = e.target.checked; handleChange('faqs', n); }}/> Enabled</label>
                        <button onClick={() => { const n = config.faqs.filter((_, idx) => idx !== i); handleChange('faqs', n); }} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* SCREENSHOTS */}
          {activeTab === 'screenshots' && (
             <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                 <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input type="checkbox" checked={config.screenshotsEnabled} onChange={e => handleChange('screenshotsEnabled', e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 h-4 w-4" />
                    Enable Screenshots
                 </label>
                 <button onClick={() => {
                    const n = [...config.screenshots, { id: `s_${Date.now()}`, title: 'New Screenshot', description: '', imageUrl: '', order: config.screenshots.length, enabled: true }];
                    handleChange('screenshots', n);
                 }} className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold shadow-sm hover:bg-slate-50"><Plus className="w-3.5 h-3.5"/> Add Screenshot</button>
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-200">
                {config.screenshots.map((s, idx) => (
                  <div key={s.id} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-3">
                     <div className="flex justify-between items-start">
                       <input type="text" value={s.title} onChange={e => { const n = [...config.screenshots]; n[idx].title = e.target.value; handleChange('screenshots', n); }} className="font-bold text-slate-900 border-slate-200 rounded-md text-sm w-1/2" placeholder="Title" />
                       <div className="flex items-center gap-3">
                         <label className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer"><input type="checkbox" checked={s.enabled} onChange={e => { const n = [...config.screenshots]; n[idx].enabled = e.target.checked; handleChange('screenshots', n); }} /> Enabled</label>
                         <button onClick={() => { const n = config.screenshots.filter((_, i) => i !== idx); handleChange('screenshots', n); }} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                       </div>
                     </div>
                     <textarea value={s.description} onChange={e => { const n = [...config.screenshots]; n[idx].description = e.target.value; handleChange('screenshots', n); }} className="w-full text-sm border-slate-200 rounded-md" placeholder="Description" rows={2} />
                     <div className="flex gap-2">
                       <input type="text" value={s.imageUrl} onChange={e => { const n = [...config.screenshots]; n[idx].imageUrl = e.target.value; handleChange('screenshots', n); }} className="flex-1 text-sm border-slate-200 rounded-md bg-slate-50" placeholder="Image URL" readOnly />
                       <div className="relative">
                         <input type="file" accept="image/*" onChange={e => handleFileUpload(e, { array: 'screenshots', index: idx, prop: 'imageUrl' })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                         <button type="button" className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-md text-slate-700 text-sm flex items-center gap-1 font-semibold h-[38px]">
                           <ImageIcon className="w-4 h-4" /> Upload
                         </button>
                       </div>
                     </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TESTIMONIALS */}
          {activeTab === 'testimonials' && (
             <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                 <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input type="checkbox" checked={config.testimonialsEnabled} onChange={e => handleChange('testimonialsEnabled', e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 h-4 w-4" />
                    Enable Testimonials
                 </label>
                 <button onClick={() => {
                    const n = [...config.testimonials, { id: `t_${Date.now()}`, author: 'Name', role: 'Role', content: '', avatarUrl: '', order: config.testimonials.length, enabled: true }];
                    handleChange('testimonials', n);
                 }} className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold shadow-sm hover:bg-slate-50"><Plus className="w-3.5 h-3.5"/> Add Testimonial</button>
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-200">
                {config.testimonials.map((t, idx) => (
                  <div key={t.id} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-3">
                     <div className="flex justify-between items-start">
                       <div className="flex gap-2 w-2/3">
                         <input type="text" value={t.author} onChange={e => { const n = [...config.testimonials]; n[idx].author = e.target.value; handleChange('testimonials', n); }} className="font-bold text-slate-900 border-slate-200 rounded-md text-sm w-1/2" placeholder="Author Name" />
                         <input type="text" value={t.role} onChange={e => { const n = [...config.testimonials]; n[idx].role = e.target.value; handleChange('testimonials', n); }} className="text-slate-600 border-slate-200 rounded-md text-sm w-1/2" placeholder="Role / Business" />
                       </div>
                       <div className="flex items-center gap-3">
                         <label className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer"><input type="checkbox" checked={t.enabled} onChange={e => { const n = [...config.testimonials]; n[idx].enabled = e.target.checked; handleChange('testimonials', n); }} /> Enabled</label>
                         <button onClick={() => { const n = config.testimonials.filter((_, i) => i !== idx); handleChange('testimonials', n); }} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                       </div>
                     </div>
                     <textarea value={t.content} onChange={e => { const n = [...config.testimonials]; n[idx].content = e.target.value; handleChange('testimonials', n); }} className="w-full text-sm border-slate-200 rounded-md" placeholder="Testimonial text..." rows={3} />
                     <div className="flex gap-2">
                       <input type="text" value={t.avatarUrl} onChange={e => { const n = [...config.testimonials]; n[idx].avatarUrl = e.target.value; handleChange('testimonials', n); }} className="flex-1 text-sm border-slate-200 rounded-md bg-slate-50" placeholder="Avatar URL" readOnly />
                       <div className="relative">
                         <input type="file" accept="image/*" onChange={e => handleFileUpload(e, { array: 'testimonials', index: idx, prop: 'avatarUrl' })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                         <button type="button" className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-md text-slate-700 text-sm flex items-center gap-1 font-semibold h-[38px]">
                           <ImageIcon className="w-4 h-4" /> Upload Avatar
                         </button>
                       </div>
                     </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CONTACT & FOOTER */}
          {(activeTab === 'contact' || activeTab === 'footer') && (
            <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900">{activeTab === 'contact' ? 'Contact Information' : 'Footer Details'}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {activeTab === 'contact' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input type="email" value={config.contactEmail} onChange={e => handleChange('contactEmail', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                      <input type="text" value={config.contactPhone} onChange={e => handleChange('contactPhone', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                      <input type="text" value={config.contactAddress} onChange={e => handleChange('contactAddress', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                    </div>
                  </>
                )}
                {activeTab === 'footer' && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Copyright Text</label>
                      <input type="text" value={config.footerCopyright} onChange={e => handleChange('footerCopyright', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Privacy Policy URL</label>
                      <input type="text" value={config.footerPrivacyUrl} onChange={e => handleChange('footerPrivacyUrl', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Terms of Service URL</label>
                      <input type="text" value={config.footerTermsUrl} onChange={e => handleChange('footerTermsUrl', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                    </div>
                  </>
                )}
              </div>
            </section>
          )}

          {/* SEO & Analytics */}
          {activeTab === 'seo' && (
            <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900">SEO & Analytics</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Page Title</label>
                  <input type="text" value={config.seoTitle || ''} onChange={e => handleChange('seoTitle', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" placeholder="Dinex - Restaurant OS" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Meta Keywords</label>
                  <input type="text" value={config.seoKeywords || ''} onChange={e => handleChange('seoKeywords', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" placeholder="restaurant, POS, software, QR menu" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                  <textarea value={config.seoDescription || ''} onChange={e => handleChange('seoDescription', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" rows={2} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Google Analytics / Measurement ID</label>
                  <input type="text" value={config.analyticsId || ''} onChange={e => handleChange('analyticsId', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" placeholder="G-XXXXXXXXXX" />
                </div>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
