import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ItemCard({ item, index = 0 }) {
  const { addToCart } = useCart();
  const [selectedPrice, setSelectedPrice] = useState(item.price);
  const [adding, setAdding] = useState(false);

  const hasVariants = item.price_alt !== null;

  const handleAdd = async () => {
    setAdding(true);
    await addToCart(item, selectedPrice);
    setTimeout(() => setAdding(false), 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="group flex flex-col bg-zinc-900 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={item.image_url}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://placehold.co/400x300/18181b/E63946?text=chaiOpod'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Veg badge */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
          <span className={`text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
            item.type === 'veg'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {item.type === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
          </span>
        </div>

        {/* Featured */}
        {item.is_featured === 1 && (
          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3">
            <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-amber-500/90 text-black flex items-center gap-1">
              <Star size={9} fill="currentColor" /> Best
            </span>
          </div>
        )}

        {/* Category */}
        <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3">
          <span className="text-[10px] sm:text-xs text-white/70 bg-black/50 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg">
            {item.category_icon} {item.category_name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2 sm:gap-3">
        <div>
          <h3 className="font-semibold text-white text-sm sm:text-base leading-tight group-hover:text-red-400 transition-colors line-clamp-1">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-white/45 text-xs mt-1 line-clamp-2 leading-relaxed hidden sm:block">
              {item.description}
            </p>
          )}
        </div>

        {/* Variants */}
        {hasVariants && (
          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={() => setSelectedPrice(item.price)}
              className={`flex-1 text-[10px] sm:text-xs py-1 sm:py-1.5 px-1.5 sm:px-2 rounded-lg border transition-all duration-200 ${
                selectedPrice === item.price
                  ? 'border-red-500 bg-red-500/10 text-red-400'
                  : 'border-white/10 text-white/45 hover:border-white/25'
              }`}
            >
              {item.price_label || 'Regular'} ₹{item.price}
            </button>
            <button
              onClick={() => setSelectedPrice(item.price_alt)}
              className={`flex-1 text-[10px] sm:text-xs py-1 sm:py-1.5 px-1.5 sm:px-2 rounded-lg border transition-all duration-200 ${
                selectedPrice === item.price_alt
                  ? 'border-red-500 bg-red-500/10 text-red-400'
                  : 'border-white/10 text-white/45 hover:border-white/25'
              }`}
            >
              {item.price_alt_label || 'Large'} ₹{item.price_alt}
            </button>
          </div>
        )}

        {/* Price + Add */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <span className="text-xl sm:text-2xl font-bold text-white">₹{selectedPrice}</span>
          <button
            onClick={handleAdd}
            disabled={adding}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
              adding
                ? 'bg-green-600/25 text-green-400 border border-green-500/30'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 active:scale-95'
            }`}
          >
            {adding ? (
              <><span>✓</span> Added</>
            ) : (
              <><Plus size={13} /> Add</>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
