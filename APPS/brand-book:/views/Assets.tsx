
import React, { useRef } from 'react';
import { useAppStore } from '../store';
import { Upload, FileType, Image, FileText, Video, MoreHorizontal } from 'lucide-react';
import { BrandAsset } from '../types';

export const Assets: React.FC = () => {
  const { assets, addAsset, activeBrandId, brands, identities } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const activeBrand = brands.find(b => b.id === activeBrandId);
  const activeAssets = assets.filter(a => a.brand_id === activeBrandId);
  const currentIdentity = identities.find(i => i.brand_id === activeBrandId);

  const displayAssets = activeAssets.length > 0 ? activeAssets : [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && activeBrandId) {
          const file = e.target.files[0];
          const reader = new FileReader();
          
          reader.onloadend = () => {
             let assetType: BrandAsset['asset_type'] = 'other';
             if (file.type.includes('image')) assetType = 'image';
             else if (file.type.includes('video')) assetType = 'video';
             else if (file.type.includes('pdf')) assetType = 'pdf';

             addAsset({
                 id: crypto.randomUUID(),
                 brand_id: activeBrandId,
                 asset_type: assetType,
                 title: file.name,
                 description: 'Uploaded via Library',
                 file_url: reader.result as string,
                 tags: ['upload']
             });
          };
          
          reader.readAsDataURL(file);
      }
  };

  return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold font-serif-brand">Asset Library</h1>
                <p className="opacity-60 mt-1">Manage files for {activeBrand?.name}</p>
            </div>
             <div className="flex items-center gap-4">
                 {currentIdentity?.logo_primary_url && (
                    <img src={currentIdentity.logo_primary_url} alt="Logo" className="h-10 w-auto opacity-80" />
                 )}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileUpload} 
                />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-black text-white hover:opacity-90 px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg transition-all"
                >
                    <Upload size={18} /> Upload Asset
                </button>
            </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-black/5 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-black/5 border-b border-black/5 font-medium uppercase tracking-wider text-xs opacity-80">
                    <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Tags</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                    {displayAssets.map((asset) => (
                        <tr key={asset.id} className="hover:bg-black/5 transition-colors group">
                            <td className="px-6 py-4 flex items-center gap-4 font-medium">
                                <div className="w-10 h-10 bg-black/5 opacity-60 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-black/5">
                                    {asset.asset_type === 'image' && asset.file_url ? (
                                        <img src={asset.file_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            {asset.asset_type === 'image' && <Image size={20} />}
                                            {asset.asset_type === 'pdf' && <FileText size={20} />}
                                            {asset.asset_type === 'video' && <Video size={20} />}
                                            {(asset.asset_type === 'other' || !asset.asset_type) && <FileType size={20} />}
                                        </>
                                    )}
                                </div>
                                <div>
                                    <div className="font-semibold">{asset.title}</div>
                                    <div className="text-xs opacity-50 font-normal">{asset.description}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 capitalize">
                                <span className="bg-black/5 px-2 py-1 rounded text-xs font-medium border border-black/5 opacity-80">
                                    {asset.asset_type}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-1">
                                    {asset.tags?.map(t => (
                                        <span key={t} className="text-xs opacity-50">#{t}</span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="opacity-40 hover:opacity-100 p-2">
                                    <MoreHorizontal size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {displayAssets.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-20 text-center opacity-40 bg-black/5">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                                        <Upload size={32} className="opacity-50" />
                                    </div>
                                    <p>No assets uploaded yet.</p>
                                    <button onClick={() => fileInputRef.current?.click()} className="font-medium hover:underline opacity-100">
                                        Upload your first file
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
  );
}
