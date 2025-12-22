
import React, { useState, useRef } from 'react';
import { useAppStore } from '../store';
import { generateMoodboardPrompts, generateVisualRules } from '../services/geminiService';
import { Loader2, Sparkles, Copy, Upload, Image as ImageIcon, X } from 'lucide-react';

export const Identity: React.FC = () => {
  const { brands, activeBrandId, identities, updateIdentity, addAsset } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [generatedRules, setGeneratedRules] = useState<{dos: string, donts: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeBrand = brands.find(b => b.id === activeBrandId);
  const identity = identities.find(i => i.brand_id === activeBrandId);

  if (!activeBrand || !identity) return <div>Loading...</div>;

  const handleChange = (field: keyof typeof identity, value: string) => {
    updateIdentity({ ...identity, [field]: value });
  };

  const handleGeneratePrompts = async () => {
    if (!identity.image_style) return alert("Please describe an image style first.");
    setLoading(true);
    try {
        const results = await generateMoodboardPrompts(activeBrand, identity.image_style);
        setPrompts(results);
    } catch (e) {
        alert("Failed to generate");
    } finally {
        setLoading(false);
    }
  };

   const handleGenerateRules = async () => {
    setLoading(true);
    try {
        const results = await generateVisualRules(activeBrand);
        setGeneratedRules(results);
    } catch (e) {
        alert("Failed to generate");
    } finally {
        setLoading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
              const result = reader.result as string;
              updateIdentity({ ...identity, logo_primary_url: result });
              
              // Also add to asset library
              addAsset({
                  id: crypto.randomUUID(),
                  brand_id: activeBrand.id,
                  asset_type: 'logo',
                  title: file.name,
                  description: 'Primary Brand Logo',
                  file_url: result,
                  tags: ['logo', 'branding', 'identity']
              });
          };
          reader.readAsDataURL(file);
      }
  };
  
  // Shared classes
  const cardClass = "bg-white/60 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-black/5";
  const inputClass = "w-full border border-black/20 rounded-lg px-3 py-2 text-lg bg-white text-black focus:ring-1 focus:ring-black focus:border-black transition-all placeholder-black/30";
  const textAreaClass = "w-full border border-black/10 rounded-lg p-3 text-sm bg-white text-black focus:ring-1 focus:ring-black focus:border-black transition-all";
  const labelClass = "block text-xs font-bold uppercase tracking-wider mb-2 opacity-50";

  return (
    <div className="p-8 max-w-6xl mx-auto">
       <div className="flex items-center gap-4 mb-8">
           {identity.logo_primary_url && (
               <img src={identity.logo_primary_url} alt="Brand Logo" className="h-16 w-auto max-w-[120px] object-contain" />
           )}
           <div>
               <h1 className="text-4xl font-bold font-serif-brand">Visual Identity Hub</h1>
               <p className="opacity-60 text-lg">The visual soul of {activeBrand.name}.</p>
           </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Left Column: Core Visuals (8 cols) */}
         <div className="lg:col-span-7 space-y-8">
           
           {/* Logo Section */}
            <div className={cardClass}>
                <h2 className="text-xl font-bold mb-6 font-serif-brand">Brand Marks</h2>
                
                <div className="flex items-start gap-8">
                    <div className="w-40 h-40 bg-white border-2 border-dashed border-black/10 rounded-lg flex flex-col items-center justify-center relative group hover:border-black/30 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        {identity.logo_primary_url ? (
                            <img src={identity.logo_primary_url} alt="Logo" className="w-full h-full object-contain p-4" />
                        ) : (
                            <>
                                <Upload className="opacity-30 mb-2" />
                                <span className="text-xs font-medium opacity-50">Upload Logo</span>
                            </>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleLogoUpload} 
                        />
                    </div>
                    
                    <div className="flex-1">
                         <label className="block text-sm font-medium mb-2 opacity-80">Logo Usage Rules</label>
                         <textarea 
                            value={identity.logo_rules || ''} 
                            onChange={(e) => handleChange('logo_rules', e.target.value)} 
                            className={`${textAreaClass} h-32`}
                            placeholder="Clearance, allowed backgrounds, restrictions..." 
                        />
                    </div>
                </div>
            </div>

           {/* Colors */}
           <div className={cardClass}>
             <h2 className="text-xl font-bold mb-6 font-serif-brand">Color Palette</h2>
             
             <div className="grid grid-cols-3 gap-6 mb-6">
               {[
                   { label: 'Primary', key: 'color_primary_hex' },
                   { label: 'Secondary', key: 'color_secondary_hex' },
                   { label: 'Accent', key: 'color_accent_hex' }
               ].map((item) => (
                 <div key={item.key} className="group">
                   <label className={labelClass}>{item.label}</label>
                   <div className="flex flex-col gap-2">
                     <div className="relative w-full aspect-video rounded-lg shadow-inner overflow-hidden border border-black/10">
                        <input 
                            type="color" 
                            value={(identity as any)[item.key]} 
                            onChange={(e) => handleChange(item.key as any, e.target.value)} 
                            className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0" 
                        />
                     </div>
                     <div className="flex items-center border border-black/10 rounded px-2 py-1 bg-white">
                        <span className="text-black/30 text-xs select-none">#</span>
                        <input 
                            type="text" 
                            value={(identity as any)[item.key].replace('#','')} 
                            onChange={(e) => handleChange(item.key as any, `#${e.target.value}`)} 
                            className="w-full text-sm bg-white border-none focus:ring-0 p-0 text-black font-mono uppercase" 
                        />
                     </div>
                   </div>
                 </div>
               ))}
             </div>
             <div>
                 <label className="block text-sm font-medium mb-2 opacity-80">Full Palette Description</label>
                 <textarea 
                    value={identity.color_palette_description || ''} 
                    onChange={(e) => handleChange('color_palette_description', e.target.value)} 
                    className={`${textAreaClass} h-24`}
                    placeholder="List all specific color names and usages (e.g. Soul Sand, Forest Breath)..." 
                 />
             </div>
           </div>

           {/* Typography & Style */}
           <div className={cardClass}>
             <h2 className="text-xl font-bold mb-6 font-serif-brand">Typography & Style</h2>
             <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <label className={labelClass}>Heading Font</label>
                    <input 
                        type="text" 
                        value={identity.font_heading} 
                        onChange={(e) => handleChange('font_heading', e.target.value)} 
                        className={`${inputClass} font-serif-brand`}
                        placeholder="Serif Name" 
                    />
                </div>
                <div>
                    <label className={labelClass}>Body Font</label>
                    <input 
                        type="text" 
                        value={identity.font_body} 
                        onChange={(e) => handleChange('font_body', e.target.value)} 
                        className={inputClass} 
                        placeholder="Sans Serif Name" 
                    />
                </div>
             </div>
             <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium mb-1 opacity-80">Typography Rules</label>
                    <textarea 
                        value={identity.typography_rules || ''} 
                        onChange={(e) => handleChange('typography_rules', e.target.value)} 
                        className={`${textAreaClass} h-24`} 
                    />
                 </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 opacity-80">Image Style</label>
                    <textarea 
                        value={identity.image_style} 
                        onChange={(e) => handleChange('image_style', e.target.value)} 
                        className={`${textAreaClass} h-24`} 
                    />
                </div>
             </div>
           </div>

         </div>

         {/* Right Column: AI Tools (4 cols) */}
         <div className="lg:col-span-5 space-y-6">
            
            {/* Moodboard Generator */}
            <div className="bg-black text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4 relative z-10">
                    <Sparkles className="text-yellow-200" size={24} />
                    <h2 className="text-xl font-bold font-serif-brand">Moodboard AI</h2>
                </div>
                <p className="text-white/70 text-sm mb-6 leading-relaxed relative z-10">
                    Generate high-fidelity prompts for Midjourney or DALL-E based on your brand's unique visual soul.
                </p>
                <button 
                    onClick={handleGeneratePrompts}
                    disabled={loading}
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-lg font-medium transition-all mb-6 relative z-10"
                >
                    {loading ? "Dreaming..." : "Generate Prompts"}
                </button>

                {prompts.length > 0 && (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar relative z-10">
                        {prompts.map((p, idx) => (
                            <div key={idx} className="bg-white/5 p-4 rounded border border-white/10 text-xs text-white/80 relative group hover:bg-white/10 transition-colors">
                                {p}
                                <button 
                                    onClick={() => navigator.clipboard.writeText(p)}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-white hover:text-yellow-200 transition-opacity"
                                >
                                    <Copy size={14}/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {/* Decoration */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            {/* Rules Generator */}
             <div className={cardClass}>
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold font-serif-brand">Visual Do's & Don'ts</h2>
                    <button onClick={handleGenerateRules} className="text-xs font-medium opacity-70 hover:opacity-100 flex items-center gap-1">
                        <Sparkles size={12}/> Generate
                    </button>
                 </div>
                 
                 {generatedRules ? (
                     <div className="grid grid-cols-1 gap-3">
                         <div className="bg-emerald-500/5 p-4 rounded border border-emerald-500/20">
                             <h3 className="font-bold text-emerald-700 text-xs mb-2 uppercase tracking-wider">Do This</h3>
                             <p className="text-xs opacity-80 whitespace-pre-line leading-relaxed">{generatedRules.dos}</p>
                         </div>
                         <div className="bg-rose-500/5 p-4 rounded border border-rose-500/20">
                             <h3 className="font-bold text-rose-700 text-xs mb-2 uppercase tracking-wider">Never This</h3>
                             <p className="text-xs opacity-80 whitespace-pre-line leading-relaxed">{generatedRules.donts}</p>
                         </div>
                     </div>
                 ) : (
                     <textarea 
                        value={identity.do_nots} 
                        onChange={(e) => handleChange('do_nots', e.target.value)} 
                        className={`${textAreaClass} h-40`}
                        placeholder="Enter manual rules here..."
                     />
                 )}
             </div>
         </div>

       </div>
    </div>
  );
};
