
import React, { useRef } from 'react';
import { useAppStore } from '../store';
import { Eye, Trash2, Plus, Wallet, MapPin, Briefcase, Target } from 'lucide-react';
import { AvatarProfile } from '../types';

export const CustomerAvatar: React.FC = () => {
  const { activeBrandId, brands, identities, updateIdentity, addAsset } = useAppStore();
  const avatarImageRef = useRef<HTMLInputElement>(null);

  const activeBrand = brands.find(b => b.id === activeBrandId);
  const identity = identities.find(i => i.brand_id === activeBrandId);

  if (!activeBrand || !identity) return <div>Loading...</div>;

  const handleAvatarChange = (field: keyof AvatarProfile, value: any) => {
      const currentAvatar = identity.avatar_profile || {};
      updateIdentity({
          ...identity,
          avatar_profile: { ...currentAvatar, [field]: value }
      });
  };

  const handleAvatarImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
              const result = reader.result as string;
              const currentImages = identity.avatar_profile?.avatar_images || [];
              const newImages = [...currentImages, result];
              
              handleAvatarChange('avatar_images', newImages);
              
              addAsset({
                  id: crypto.randomUUID(),
                  brand_id: activeBrand.id,
                  asset_type: 'image',
                  title: file.name,
                  description: 'Avatar Persona Image',
                  file_url: result,
                  tags: ['avatar', 'persona']
              });
          };
          reader.readAsDataURL(file);
      }
  };

  const removeAvatarImage = (index: number) => {
      const currentImages = identity.avatar_profile?.avatar_images || [];
      const newImages = currentImages.filter((_, i) => i !== index);
      handleAvatarChange('avatar_images', newImages);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto pb-40">
        <div className="flex items-center gap-6 mb-10 pb-8 border-b border-black/5">
           {identity.logo_primary_url && (
               <img src={identity.logo_primary_url} alt="Brand Logo" className="h-16 w-auto max-w-[120px] object-contain" />
           )}
           <div>
               <h1 className="text-4xl font-bold font-serif-brand">Customer Avatar</h1>
               <p className="opacity-60 text-lg">Define the ideal guest for {activeBrand.name}.</p>
           </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
           
           {/* Left Column: Visual Persona */}
           <div className="lg:col-span-4 space-y-6">
               <div className="bg-white p-6 rounded-xl border border-black/10 shadow-sm">
                   <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Eye size={18} /> The Persona</h2>
                   
                   <div className="grid grid-cols-2 gap-2 mb-4">
                       {(identity.avatar_profile?.avatar_images || []).map((img, i) => (
                           <div key={i} className="aspect-square relative group rounded-lg overflow-hidden">
                               <img src={img} className="w-full h-full object-cover" />
                               <button 
                                    onClick={() => removeAvatarImage(i)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                               >
                                   <Trash2 size={12} />
                               </button>
                           </div>
                       ))}
                       <div 
                            onClick={() => avatarImageRef.current?.click()}
                            className="aspect-square bg-gray-50 border-2 border-dashed border-black/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                       >
                           <Plus size={24} className="opacity-30" />
                           <span className="text-[10px] font-bold opacity-50 mt-1">Add Image</span>
                       </div>
                       <input type="file" ref={avatarImageRef} className="hidden" accept="image/*" onChange={handleAvatarImageUpload} />
                   </div>
                   
                   <div className="space-y-3">
                       <div>
                           <label className="text-xs font-bold uppercase tracking-wider opacity-50 mb-1 block">Occupation / Role</label>
                           <input 
                                className="w-full border border-black/10 rounded px-3 py-2 text-sm"
                                placeholder="e.g. Digital Nomad, Executive"
                                value={identity.avatar_profile?.occupation || ''}
                                onChange={(e) => handleAvatarChange('occupation', e.target.value)}
                           />
                       </div>
                       <div>
                           <label className="text-xs font-bold uppercase tracking-wider opacity-50 mb-1 block">Key Interests (Meta Tags)</label>
                           <textarea 
                                className="w-full border border-black/10 rounded px-3 py-2 text-sm h-24 resize-none"
                                placeholder="e.g. Luxury Travel, Wellness, Yoga, Sustainable Fashion..."
                                value={identity.avatar_profile?.key_interests || ''}
                                onChange={(e) => handleAvatarChange('key_interests', e.target.value)}
                           />
                       </div>
                   </div>
               </div>
           </div>

           {/* Right Column: Data Profile */}
           <div className="lg:col-span-8 space-y-6">
               
               {/* Financials & Demographics */}
               <div className="bg-white p-8 rounded-xl border border-black/10 shadow-sm">
                   <h2 className="text-xl font-bold mb-6 font-serif-brand flex items-center gap-2"><Target size={20} /> Target Market Profile</h2>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {/* Financials */}
                       <div className="space-y-4">
                           <h3 className="text-sm font-bold border-b border-black/5 pb-2 mb-4 flex items-center gap-2 text-green-700">
                               <Wallet size={16} /> Financial Power
                           </h3>
                           <div>
                               <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-50">Net Worth Range</label>
                               <input 
                                    className="w-full border border-black/10 rounded px-3 py-2 text-sm font-mono"
                                    placeholder="e.g. $1M - $5M"
                                    value={identity.avatar_profile?.net_worth || ''}
                                    onChange={(e) => handleAvatarChange('net_worth', e.target.value)}
                               />
                           </div>
                           <div>
                               <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-50">Spending Power</label>
                               <input 
                                    className="w-full border border-black/10 rounded px-3 py-2 text-sm"
                                    placeholder="e.g. High Disposable Income, Price Insensitive"
                                    value={identity.avatar_profile?.spending_power || ''}
                                    onChange={(e) => handleAvatarChange('spending_power', e.target.value)}
                               />
                           </div>
                       </div>

                       {/* Demographics */}
                       <div className="space-y-4">
                           <h3 className="text-sm font-bold border-b border-black/5 pb-2 mb-4 flex items-center gap-2 text-blue-700">
                               <MapPin size={16} /> Demographics
                           </h3>
                           <div className="grid grid-cols-2 gap-4">
                               <div>
                                   <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-50">Age Range</label>
                                   <input 
                                        className="w-full border border-black/10 rounded px-3 py-2 text-sm"
                                        placeholder="e.g. 25-40"
                                        value={identity.avatar_profile?.age_range || ''}
                                        onChange={(e) => handleAvatarChange('age_range', e.target.value)}
                                   />
                               </div>
                               <div>
                                   <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-50">Gender</label>
                                   <input 
                                        className="w-full border border-black/10 rounded px-3 py-2 text-sm"
                                        placeholder="e.g. Female / All"
                                        value={identity.avatar_profile?.gender || ''}
                                        onChange={(e) => handleAvatarChange('gender', e.target.value)}
                                   />
                               </div>
                           </div>
                           <div>
                               <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-50">Primary Region / Location</label>
                               <input 
                                    className="w-full border border-black/10 rounded px-3 py-2 text-sm"
                                    placeholder="e.g. USA (West Coast), Australia, Expat in Bali"
                                    value={identity.avatar_profile?.location || ''}
                                    onChange={(e) => handleAvatarChange('location', e.target.value)}
                               />
                           </div>
                       </div>
                   </div>
               </div>

               {/* Psychographics */}
               <div className="bg-white p-8 rounded-xl border border-black/10 shadow-sm">
                   <h2 className="text-xl font-bold mb-6 font-serif-brand flex items-center gap-2"><Briefcase size={20} /> Deep Dive</h2>
                   
                   <div className="space-y-6">
                       <div>
                           <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-50">Core Values & Desires</label>
                           <p className="text-xs opacity-40 mb-2">What drives their decision making? What do they care about most?</p>
                           <textarea 
                                className="w-full border border-black/10 rounded-lg p-4 text-sm h-32 resize-none"
                                placeholder="e.g. Values sustainability, seeks authentic experiences, prioritizes health over wealth..."
                                value={identity.avatar_profile?.goals || ''}
                                onChange={(e) => handleAvatarChange('goals', e.target.value)}
                           />
                       </div>
                       
                       <div>
                           <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-50">Pain Points & Frustrations</label>
                           <textarea 
                                className="w-full border border-black/10 rounded-lg p-4 text-sm h-24 resize-none"
                                placeholder="e.g. Tired of impersonal hotels, overwhelmed by city life, needs deep rest..."
                                value={identity.avatar_profile?.pain_points || ''}
                                onChange={(e) => handleAvatarChange('pain_points', e.target.value)}
                           />
                       </div>
                   </div>
               </div>

           </div>
       </div>
    </div>
  );
};
