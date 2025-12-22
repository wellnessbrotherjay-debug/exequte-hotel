
import React, { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { Download, Instagram, Facebook, Linkedin, Image as ImageIcon, Monitor } from 'lucide-react';

export const SocialKit: React.FC = () => {
  const { activeBrandId, brands, identities } = useAppStore();
  const activeBrand = brands.find(b => b.id === activeBrandId);
  const identity = identities.find(i => i.brand_id === activeBrandId);
  
  // Canvas Refs
  const storyRef = useRef<HTMLCanvasElement>(null);
  const postRef = useRef<HTMLCanvasElement>(null);
  const profileRef = useRef<HTMLCanvasElement>(null);
  const coverRef = useRef<HTMLCanvasElement>(null);

  // State to trigger re-renders or confirm downloads
  const [generated, setGenerated] = useState(false);

  const drawCanvas = (
      canvas: HTMLCanvasElement | null, 
      width: number, 
      height: number, 
      type: 'story' | 'post' | 'profile' | 'cover'
  ) => {
      if (!canvas || !identity || !activeBrand) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Background
      ctx.fillStyle = identity.color_primary_hex;
      ctx.fillRect(0, 0, width, height);

      // 2. Decorative Elements (Simple)
      // Top accent bar
      ctx.fillStyle = identity.color_secondary_hex;
      if (type === 'story') ctx.fillRect(0, 0, width, 20);
      
      // Bottom accent circle
      ctx.beginPath();
      ctx.fillStyle = identity.color_accent_hex + '40'; // 25% opacity
      ctx.arc(width, height, width * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // 3. Text / Brand Name
      ctx.fillStyle = '#000000'; // Assuming dark text for now, ideally calculated contrast
      ctx.textAlign = 'center';
      
      // Font logic
      const serif = 'Cormorant Garamond, serif';
      const sans = 'Inter, sans-serif';

      // 4. Logo Handling
      const logoImg = new Image();
      logoImg.src = identity.logo_primary_url || '';
      
      // Check if logo exists, otherwise draw text
      if (identity.logo_primary_url) {
         logoImg.onload = () => {
             const logoSize = type === 'story' ? width * 0.5 : width * 0.4;
             const x = (width - logoSize) / 2;
             const y = (height - logoSize) / 2;
             ctx.drawImage(logoImg, x, y, logoSize, logoSize * (logoImg.height / logoImg.width));
             
             // Tagline
             if (activeBrand.tagline && type !== 'profile') {
                 ctx.font = `italic 24px ${serif}`;
                 ctx.fillText(activeBrand.tagline, width / 2, height - 80);
             }
         };
         // Trigger load if already cached (sometimes needed)
         if (logoImg.complete) logoImg.onload?.(new Event('load'));
      } else {
          // Text fallback
          ctx.font = `bold ${width * 0.1}px ${serif}`;
          ctx.fillText(activeBrand.name, width / 2, height / 2);
      }
      
      if (!identity.logo_primary_url) {
           // Tagline fallback
             if (activeBrand.tagline && type !== 'profile') {
                 ctx.font = `italic 24px ${serif}`;
                 ctx.fillText(activeBrand.tagline, width / 2, height - 80);
             }
      }
  };

  useEffect(() => {
      // Draw all canvases when mounted or identity changes
      if (activeBrandId) {
          drawCanvas(storyRef.current, 1080, 1920, 'story');
          drawCanvas(postRef.current, 1080, 1080, 'post');
          drawCanvas(profileRef.current, 400, 400, 'profile');
          drawCanvas(coverRef.current, 1500, 500, 'cover');
          setGenerated(true);
      }
  }, [activeBrandId, identity]);

  const download = (ref: React.RefObject<HTMLCanvasElement>, name: string) => {
      if (ref.current) {
          const link = document.createElement('a');
          link.download = `${activeBrand?.name.replace(/\s+/g, '-').toLowerCase()}-${name}.png`;
          link.href = ref.current.toDataURL();
          link.click();
      }
  };

  if (!activeBrand || !identity) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif-brand">Social Asset Kit</h1>
        <p className="opacity-60">Auto-generated assets ready for your channels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Instagram Story */}
          <div className="bg-white/50 border border-black/5 rounded-xl p-6 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4 opacity-70">
                  <Instagram size={18} />
                  <span className="text-sm font-bold uppercase tracking-wide">IG Story</span>
              </div>
              {/* Preview Scaled Down */}
              <div className="relative shadow-lg rounded overflow-hidden mb-6" style={{ width: '180px', height: '320px' }}>
                   <canvas ref={storyRef} width={1080} height={1920} className="w-full h-full object-cover" />
              </div>
              <button onClick={() => download(storyRef, 'story')} className="bg-black text-white px-4 py-2 rounded text-sm flex items-center gap-2 hover:opacity-80">
                  <Download size={14} /> Download PNG
              </button>
          </div>

          {/* Square Post */}
           <div className="bg-white/50 border border-black/5 rounded-xl p-6 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4 opacity-70">
                  <Instagram size={18} />
                  <span className="text-sm font-bold uppercase tracking-wide">Square Post</span>
              </div>
              <div className="relative shadow-lg rounded overflow-hidden mb-6" style={{ width: '250px', height: '250px' }}>
                   <canvas ref={postRef} width={1080} height={1080} className="w-full h-full object-cover" />
              </div>
              <button onClick={() => download(postRef, 'post')} className="bg-black text-white px-4 py-2 rounded text-sm flex items-center gap-2 hover:opacity-80">
                  <Download size={14} /> Download PNG
              </button>
          </div>

          {/* Profile Picture */}
           <div className="bg-white/50 border border-black/5 rounded-xl p-6 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4 opacity-70">
                  <ImageIcon size={18} />
                  <span className="text-sm font-bold uppercase tracking-wide">Profile Pic</span>
              </div>
              <div className="relative shadow-lg rounded-full overflow-hidden mb-6" style={{ width: '200px', height: '200px' }}>
                   <canvas ref={profileRef} width={400} height={400} className="w-full h-full object-cover" />
              </div>
              <button onClick={() => download(profileRef, 'profile')} className="bg-black text-white px-4 py-2 rounded text-sm flex items-center gap-2 hover:opacity-80">
                  <Download size={14} /> Download PNG
              </button>
          </div>

          {/* Cover Image */}
          <div className="bg-white/50 border border-black/5 rounded-xl p-6 flex flex-col items-center col-span-full md:col-span-2 lg:col-span-3">
              <div className="flex items-center gap-2 mb-4 opacity-70">
                  <Monitor size={18} />
                  <span className="text-sm font-bold uppercase tracking-wide">Banner / Cover</span>
              </div>
               <div className="relative shadow-lg rounded overflow-hidden mb-6 w-full max-w-2xl aspect-[3/1]">
                   <canvas ref={coverRef} width={1500} height={500} className="w-full h-full object-cover" />
              </div>
              <button onClick={() => download(coverRef, 'banner')} className="bg-black text-white px-4 py-2 rounded text-sm flex items-center gap-2 hover:opacity-80">
                  <Download size={14} /> Download PNG
              </button>
          </div>

      </div>
    </div>
  );
};
