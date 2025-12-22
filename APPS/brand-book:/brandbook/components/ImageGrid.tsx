import React from 'react';

export const ImageGrid: React.FC<{ images: { url: string; label?: string }[] }> = ({ images }) => (
  <div className="grid grid-cols-3 gap-3">
    {images.map((img, idx) => (
      <div key={idx} className="relative overflow-hidden rounded-lg border border-black/5 bg-black/5">
        <img src={img.url} alt={img.label || `mood-${idx}`} className="w-full h-28 object-cover" />
        {img.label && (
          <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-2 py-1 rounded-full">{img.label}</span>
        )}
      </div>
    ))}
  </div>
);
