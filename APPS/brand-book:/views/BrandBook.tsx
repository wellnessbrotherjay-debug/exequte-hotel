
import React, { useState, useRef } from 'react';
import { useAppStore } from '../store';
import { Printer, ArrowLeft, Image as ImageIcon, Upload, X } from 'lucide-react';
import { BrandAsset } from '../types';

export const BrandBook: React.FC = () => {
  const { activeBrandId, brands, identities, strategySections, assets, addAsset, updateIdentity } = useAppStore();
  const activeBrand = brands.find(b => b.id === activeBrandId);
  const identity = identities.find(i => i.brand_id === activeBrandId);
  
  // Asset Picker State
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickingTarget, setPickingTarget] = useState<string | null>(null); // e.g., 'cover', 'about', 'moodboard_0'
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!activeBrand || !identity) return <div>Loading Brand Book...</div>;

  const getStrategy = (type: string) => strategySections.find(s => s.brand_id === activeBrandId && s.section_type === type)?.content || "Not defined.";

  // --- IMAGE HANDLING LOGIC ---

  const handleImageClick = (target: string) => {
      setPickingTarget(target);
      setIsPickerOpen(true);
  };

  const handleAssetSelect = (assetUrl: string) => {
      if (!pickingTarget) return;
      
      const newConfig = { ...identity.brand_book_config };
      
      if (pickingTarget.startsWith('moodboard_')) {
          const index = parseInt(pickingTarget.split('_')[1]);
          const images = [...(newConfig.moodboard_images || [])];
          // Ensure array is large enough
          while(images.length <= index) images.push('');
          images[index] = assetUrl;
          newConfig.moodboard_images = images;
      } else {
          (newConfig as any)[pickingTarget + '_image_url'] = assetUrl;
      }

      updateIdentity({
          ...identity,
          brand_book_config: newConfig
      });
      setIsPickerOpen(false);
      setPickingTarget(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
              const url = reader.result as string;
              // Add to library
               addAsset({
                 id: crypto.randomUUID(),
                 brand_id: activeBrand.id,
                 asset_type: 'image',
                 title: file.name,
                 description: 'Brand Book Asset',
                 file_url: url,
                 tags: ['brandbook']
             });
             // Select immediately
             handleAssetSelect(url);
          };
          reader.readAsDataURL(file);
      }
  };

  // --- SUBCOMPONENTS ---

  const PageContainer = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
      <div className={`bg-white text-black aspect-[1/1.414] shadow-2xl mx-auto mb-12 p-16 relative overflow-hidden print:shadow-none print:mb-0 print:h-screen print:w-screen page-break ${className}`} style={{ maxWidth: '1000px' }}>
          {children}
      </div>
  );
  
  const ImageSlot = ({ target, className = "", placeholderText = "Click to Add Image" }: { target: string, className?: string, placeholderText?: string }) => {
      let currentUrl = "";
      if (target.startsWith('moodboard_')) {
          const idx = parseInt(target.split('_')[1]);
          currentUrl = identity.brand_book_config?.moodboard_images?.[idx] || "";
      } else {
          currentUrl = (identity.brand_book_config as any)?.[target + '_image_url'] || "";
      }

      return (
          <div 
            onClick={() => handleImageClick(target)}
            className={`bg-black/5 cursor-pointer hover:bg-black/10 transition-colors flex flex-col items-center justify-center relative overflow-hidden group ${className}`}
          >
              {currentUrl ? (
                  <img src={currentUrl} className="w-full h-full object-cover" alt="Brand Asset" />
              ) : (
                  <div className="text-center opacity-40 group-hover:opacity-70 transition-opacity p-4">
                      <ImageIcon className="mx-auto mb-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">{placeholderText}</span>
                  </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">Change Image</span>
              </div>
          </div>
      );
  }

  const handlePrint = () => {
      window.print();
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-100 print:bg-white print:p-0">
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center no-print">
        <h1 className="text-2xl font-bold font-serif-brand">Brand Book Publisher</h1>
        <button 
            onClick={handlePrint}
            className="bg-black text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 font-medium hover:opacity-80 transition-all"
        >
            <Printer size={18} /> Print / Save as PDF
        </button>
      </div>

      {/* PAGE 1: COVER */}
      <PageContainer className="flex flex-col justify-between bg-[#F4EDE5]">
          <div className="flex justify-between items-start z-10 relative">
             {identity.logo_primary_url && (
                 <img src={identity.logo_primary_url} className="h-32 w-auto object-contain" alt="Logo" />
             )}
             <div className="text-right">
                 <p className="text-sm font-bold tracking-widest uppercase opacity-40">Brand Guidelines</p>
                 <p className="text-sm font-medium opacity-60">Vol. 1.0</p>
             </div>
          </div>
          
          {/* Cover Image Background (Optional) */}
          <div className="absolute inset-0 top-0 bottom-0 left-0 right-0 z-0 opacity-10 pointer-events-none">
               <ImageSlot target="cover" className="w-full h-full" placeholderText="Add Cover Texture" />
          </div>
          
          <div className="flex-1 flex items-center justify-center z-10 relative">
             <div className="text-center">
                 <h1 className="text-[8rem] leading-none font-serif-brand tracking-tighter mb-6 opacity-90">{activeBrand.name.split(' ')[0]}</h1>
                 {activeBrand.name.split(' ')[1] && (
                    <h1 className="text-[8rem] leading-none font-serif-brand tracking-tighter opacity-90 italic">{activeBrand.name.split(' ')[1]}</h1>
                 )}
             </div>
          </div>

          <div className="flex justify-between items-end border-t border-black/10 pt-8 z-10 relative">
              <div className="max-w-md">
                  <p className="font-serif-brand text-3xl italic leading-tight mb-4">{activeBrand.tagline}</p>
                  <p className="text-sm opacity-60 uppercase tracking-widest font-medium">{activeBrand.niche}</p>
              </div>
              <div className="text-right">
                  <p className="text-sm opacity-50">Prepared For</p>
                  <p className="font-bold text-lg">{activeBrand.name}</p>
              </div>
          </div>
      </PageContainer>

      {/* PAGE 2: ABOUT (SPLIT LAYOUT) */}
      <PageContainer>
          <div className="grid grid-cols-12 gap-0 h-full absolute inset-0">
              {/* Left Image Side */}
              <div className="col-span-5 h-full relative">
                 <ImageSlot target="about" className="w-full h-full" placeholderText="Add Brand Visual" />
              </div>
              
              {/* Right Content Side */}
              <div className="col-span-7 flex flex-col justify-center p-16 bg-white">
                   {/* Logo Header */}
                   <div className="absolute top-12 right-12">
                       {identity.logo_primary_url && <img src={identity.logo_primary_url} className="h-8 opacity-80" alt="Logo" />}
                   </div>

                  <h2 className="text-6xl font-serif-brand mb-8">The Essence</h2>
                  <div className="space-y-6 text-lg leading-relaxed opacity-80">
                      <p>{getStrategy('Purpose')}</p>
                      <p className="font-serif-brand text-3xl italic py-4 border-l-4 border-black pl-6">{getStrategy('Brand Promise')}</p>
                      <p>{getStrategy('Brand Story')}</p>
                  </div>
                  
                  <div className="mt-12 grid grid-cols-2 gap-8">
                      <div>
                          <h3 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-40">Mission</h3>
                          <p className="text-sm opacity-80 leading-relaxed">{getStrategy('Mission')}</p>
                      </div>
                      <div>
                          <h3 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-40">Vision</h3>
                          <p className="text-sm opacity-80 leading-relaxed">{getStrategy('Vision')}</p>
                      </div>
                  </div>
              </div>
          </div>
      </PageContainer>

      {/* PAGE 3: LOGO GUIDELINES */}
      <PageContainer className="bg-[#F9F9F9]">
           <div className="flex items-center justify-between mb-16">
               <h2 className="text-5xl font-serif-brand">Logo Anatomy</h2>
               <span className="text-9xl font-serif-brand opacity-5">03</span>
           </div>

           <div className="grid grid-cols-2 gap-16 mb-16">
               <div className="aspect-square bg-white flex items-center justify-center border border-black/5 relative shadow-sm p-12">
                   {identity.logo_primary_url ? (
                        <img src={identity.logo_primary_url} className="w-full object-contain" alt="Primary Logo" />
                   ) : (
                       <span className="text-2xl font-serif-brand italic">Primary Logo Placeholder</span>
                   )}
                   {/* Clear space markers */}
                   <div className="absolute top-8 bottom-8 left-8 right-8 border border-dashed border-black/20 pointer-events-none"></div>
                   <span className="absolute top-4 right-4 text-[10px] opacity-40 font-mono">x</span>
               </div>
               <div className="flex flex-col justify-center space-y-8">
                   <div>
                       <h3 className="text-lg font-bold mb-2">Primary Mark</h3>
                       <p className="opacity-60 leading-relaxed text-sm">
                           This is the main expression of the brand. It should be used in most applications where space allows. 
                           Ensure sufficient clear space (indicated by dashed lines) is always maintained.
                       </p>
                   </div>
                   <div>
                       <h3 className="text-lg font-bold mb-2">Minimum Size</h3>
                       <div className="flex gap-8 items-end">
                           <div>
                               <div className="w-24 h-8 border border-black/10 bg-white mb-2 flex items-center justify-center text-[10px]">Logo</div>
                               <span className="text-xs opacity-40">Digital: 80px</span>
                           </div>
                           <div>
                               <div className="w-12 h-4 border border-black/10 bg-white mb-2 flex items-center justify-center text-[6px]">Logo</div>
                               <span className="text-xs opacity-40">Print: 25mm</span>
                           </div>
                       </div>
                   </div>
               </div>
           </div>

           <div className="bg-black text-white p-12 mt-auto rounded-sm">
               <div className="grid grid-cols-2 gap-12 items-center">
                   <div>
                        <h3 className="text-2xl font-serif-brand mb-2">Monochrome Usage</h3>
                        <p className="opacity-60 text-sm">For high contrast or single-color printing.</p>
                   </div>
                   <div className="flex justify-end">
                        {identity.logo_primary_url && (
                             <img src={identity.logo_primary_url} className="h-20 brightness-0 invert" alt="White Logo" />
                        )}
                   </div>
               </div>
           </div>
      </PageContainer>

      {/* PAGE 4: MOODBOARD */}
      <PageContainer>
          <div className="flex items-center justify-between mb-12">
               <div>
                   <h2 className="text-5xl font-serif-brand">Visual Universe</h2>
                   <p className="mt-4 max-w-md opacity-60">{identity.image_style}</p>
               </div>
               <span className="text-9xl font-serif-brand opacity-5">04</span>
           </div>

           <div className="grid grid-cols-3 grid-rows-2 gap-4 h-[600px]">
               {/* A Masonry-like grid using CSS Grid */}
               <div className="col-span-1 row-span-2">
                    <ImageSlot target="moodboard_0" className="w-full h-full" />
               </div>
               <div className="col-span-1 row-span-1">
                    <ImageSlot target="moodboard_1" className="w-full h-full" />
               </div>
               <div className="col-span-1 row-span-1">
                   <ImageSlot target="moodboard_2" className="w-full h-full" />
               </div>
               <div className="col-span-2 row-span-1">
                   <ImageSlot target="moodboard_3" className="w-full h-full" />
               </div>
           </div>
      </PageContainer>

      {/* PAGE 5: COLOR PALETTE */}
      <PageContainer>
          <div className="flex items-center justify-between mb-20">
               <h2 className="text-5xl font-serif-brand">Color System</h2>
               <span className="text-9xl font-serif-brand opacity-5">05</span>
           </div>

           <div className="grid grid-cols-12 gap-0 h-96 mb-12 shadow-sm">
               <div className="col-span-6 h-full flex items-end p-8" style={{ backgroundColor: identity.color_primary_hex }}>
                   <div>
                       <p className="text-xs uppercase tracking-widest opacity-50 mb-1 mix-blend-difference text-white">Primary</p>
                       <p className="font-mono text-lg mix-blend-difference text-white">{identity.color_primary_hex}</p>
                   </div>
               </div>
               <div className="col-span-3 h-full flex items-end p-8" style={{ backgroundColor: identity.color_secondary_hex }}>
                   <div>
                       <p className="text-xs uppercase tracking-widest opacity-50 mb-1 mix-blend-difference text-white">Secondary</p>
                       <p className="font-mono text-lg mix-blend-difference text-white">{identity.color_secondary_hex}</p>
                   </div>
               </div>
               <div className="col-span-3 h-full flex items-end p-8" style={{ backgroundColor: identity.color_accent_hex }}>
                   <div>
                       <p className="text-xs uppercase tracking-widest opacity-50 mb-1 mix-blend-difference text-white">Accent</p>
                       <p className="font-mono text-lg mix-blend-difference text-white">{identity.color_accent_hex}</p>
                   </div>
               </div>
           </div>

           <div className="grid grid-cols-2 gap-12">
               <div>
                   <h3 className="font-bold mb-4">Palette Description</h3>
                   <p className="opacity-60 leading-relaxed">{identity.color_palette_description || "A carefully curated selection of tones."}</p>
               </div>
               <div>
                    <h3 className="font-bold mb-4">Usage Ratios</h3>
                    <div className="w-full h-4 flex rounded-full overflow-hidden">
                        <div className="h-full bg-black/80" style={{ width: '60%' }}></div>
                        <div className="h-full bg-black/40" style={{ width: '30%' }}></div>
                        <div className="h-full bg-black/10" style={{ width: '10%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs mt-2 opacity-50">
                        <span>60% Primary</span>
                        <span>30% Secondary</span>
                        <span>10% Accent</span>
                    </div>
               </div>
           </div>
      </PageContainer>

       {/* PAGE 6: TYPOGRAPHY */}
      <PageContainer className="bg-[#F4EDE5]/30">
           <div className="flex items-center justify-between mb-20">
               <h2 className="text-5xl font-serif-brand">Typography</h2>
               <span className="text-9xl font-serif-brand opacity-5">06</span>
           </div>

           <div className="grid grid-cols-2 gap-20">
               <div>
                   <p className="text-xs font-bold uppercase tracking-widest mb-4 opacity-40">Display / Headings</p>
                   <h3 className="text-6xl mb-4" style={{ fontFamily: activeBrandId === 'eleguria-1' ? 'Cormorant Garamond' : 'inherit' }}>{identity.font_heading}</h3>
                   <p className="text-8xl opacity-10 mb-8 leading-none overflow-hidden h-24 font-serif-brand">Aa Bb Cc</p>
                   <p className="text-sm opacity-60 leading-relaxed">
                       Use for main titles, brand statements, and luxury moments. 
                       Keep letter-spacing tight for headlines, loose for captions.
                   </p>
               </div>

               <div>
                   <p className="text-xs font-bold uppercase tracking-widest mb-4 opacity-40">Body Copy</p>
                   <h3 className="text-4xl mb-4 font-sans" style={{ fontFamily: activeBrandId === 'eleguria-1' ? 'Inter' : 'sans-serif' }}>{identity.font_body}</h3>
                    <div className="space-y-2 opacity-60 text-sm font-sans mb-8">
                        <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                        <p>abcdefghijklmnopqrstuvwxyz</p>
                        <p>1234567890 !@#$%^&*()</p>
                    </div>
                   <p className="text-sm opacity-60 leading-relaxed font-sans">
                       Use for all paragraphs, UI elements, and long-form reading. 
                       Ensures legibility and modern clarity against the soft organic display font.
                   </p>
               </div>
           </div>

           <div className="mt-20 pt-12 border-t border-black/10">
               <h3 className="font-bold mb-6">Type Hierarchy</h3>
               <div className="space-y-6">
                   <div>
                       <span className="text-xs opacity-40 uppercase block mb-1">H1 Headline</span>
                       <span className="text-4xl font-serif-brand">The Soul of the Sanctuary</span>
                   </div>
                    <div>
                       <span className="text-xs opacity-40 uppercase block mb-1">H2 Subhead</span>
                       <span className="text-2xl font-serif-brand opacity-80">A return to yourself</span>
                   </div>
                    <div className="max-w-md">
                       <span className="text-xs opacity-40 uppercase block mb-1">Body Text</span>
                       <span className="text-sm opacity-60 font-sans">Eleguria exists to give the human spirit a place to return home. We do not transform you; we create the space where you remember yourself.</span>
                   </div>
               </div>
           </div>
      </PageContainer>

      {/* ASSET PICKER MODAL */}
      {isPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm no-print">
              <div className="bg-white w-[600px] max-h-[80vh] rounded-xl shadow-2xl flex flex-col">
                  <div className="p-4 border-b flex justify-between items-center">
                      <h3 className="font-bold">Select an Asset</h3>
                      <button onClick={() => setIsPickerOpen(false)} className="p-2 hover:bg-black/5 rounded-full">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="p-4 flex-1 overflow-y-auto">
                      {/* Upload New */}
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-black/10 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-black/30 hover:bg-black/5 transition-colors mb-6"
                      >
                          <Upload className="mb-2 opacity-40" />
                          <span className="text-sm font-medium opacity-60">Upload New Image</span>
                          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                      </div>

                      {/* Library */}
                      <h4 className="text-xs font-bold uppercase tracking-wider opacity-40 mb-3">From Library</h4>
                      <div className="grid grid-cols-3 gap-3">
                          {assets.filter(a => a.asset_type === 'image').map(asset => (
                              <div 
                                key={asset.id} 
                                onClick={() => handleAssetSelect(asset.file_url)}
                                className="aspect-square bg-black/5 rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-black transition-all"
                              >
                                  <img src={asset.file_url} className="w-full h-full object-cover" alt={asset.title} />
                              </div>
                          ))}
                          {assets.filter(a => a.asset_type === 'image').length === 0 && (
                              <div className="col-span-3 text-center py-8 opacity-40 text-sm">No images found in library.</div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
