// frontend/src/components/ProductMiniGallery.jsx
import { useState } from "react";

export default function ProductMiniGallery({ images = [] }) {
  const safeImages = images.filter(Boolean);
  const [active, setActive] = useState(0);

  if (!safeImages.length) return null;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
      
      {/* Main Image */}
      <div className="aspect-square overflow-hidden rounded-2xl bg-gray-50">
        <img
          src={safeImages[active]}
          alt=""
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto">
          {safeImages.map((img, idx) => (
            <button
              key={img}
              onClick={() => setActive(idx)}
              type="button"
              className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border transition ${
                active === idx
                  ? "border-black ring-2 ring-black/30"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <img
                src={img}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}