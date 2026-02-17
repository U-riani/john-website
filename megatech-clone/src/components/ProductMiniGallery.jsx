// 📁 frontend/src/components/ProductMiniGallery.jsx
import { useState } from "react";

export default function ProductMiniGallery({ images = [] }) {
  const safeImages = images.filter(Boolean);
  const [active, setActive] = useState(0);

  if (!safeImages.length) return null;

  return (
    <div className="w-full shrink-0">
      {/* MAIN IMAGE */}
      <div className="aspect-square max-h-[60vh] overflow-hidden rounded-md border bg-white">
        <img
          src={safeImages[active]}
          alt=""
          className="h-full w-full object-cover transition-opacity duration-200"
        />
      </div>

      {/* THUMBNAILS */}
      {safeImages.length > 1 && (
        <div className="mt-2 flex gap-1 overflow-x-auto">
          {safeImages.map((img, idx) => (
            <button
              key={img}
              onClick={() => setActive(idx)}
              className={`h-12 w-12 shrink-0 overflow-hidden rounded border ${
                active === idx
                  ? "border-sky-600 ring-1 ring-sky-500"
                  : "border-gray-200"
              }`}
              type="button"
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
