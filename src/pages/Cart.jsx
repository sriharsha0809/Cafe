import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const { items, total, updateQuantity, removeItem, orderType, setOrderType, itemCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center gap-5 text-center px-4 pt-20">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-24 h-24 sm:w-28 sm:h-28 bg-zinc-900 rounded-3xl flex items-center justify-center border border-white/5"
        >
          <ShoppingCart size={36} className="text-white/20" />
        </motion.div>
        <h2 className="text-white text-xl sm:text-2xl font-bold">Your cart is empty</h2>
        <p className="text-white/40 text-sm max-w-xs">Add some delicious items from our menu to get started!</p>
        <Link to="/menu" className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-red-600/25 text-sm">
          Browse Menu <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-14 sm:pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 sm:mb-10">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-4 sm:mb-6 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Menu
          </Link>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-white">
            Your Cart
            <span className="text-white/30 text-lg sm:text-2xl font-normal ml-2">
              ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Items column */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">

            {/* Order type */}
            <div className="flex gap-2 bg-zinc-900 rounded-2xl p-1.5 border border-white/5">
              {['dine-in', 'delivery'].map(type => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`flex-1 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold capitalize transition-all duration-200 ${
                    orderType === type
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {type === 'dine-in' ? '🪑 Dine-in' : '🚚 Delivery'}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16, height: 0 }}
                  className="bg-zinc-900 border border-white/5 rounded-2xl p-3 sm:p-4 flex gap-3 sm:gap-4"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl flex-shrink-0"
                    onError={e => { e.target.src = 'https://placehold.co/80/18181b/E63946?text=☕'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-white font-semibold text-sm sm:text-base truncate">{item.name}</h3>
                        <p className="text-white/35 text-xs mt-0.5 truncate">{item.category_name}</p>
                        <p className="text-white/45 text-xs sm:text-sm mt-1">₹{item.price_chosen} each</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 sm:p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                      <div className="flex items-center gap-2 bg-zinc-800 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                          {item.quantity === 1
                            ? <Trash2 size={11} className="text-red-400" />
                            : <Minus size={11} className="text-white" />
                          }
                        </button>
                        <span className="text-white font-bold w-5 sm:w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/30 flex items-center justify-center transition-colors"
                        >
                          <Plus size={11} className="text-red-400" />
                        </button>
                      </div>
                      <span className="text-white font-bold text-base sm:text-lg">
                        ₹{(item.price_chosen * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary — sticky on desktop, stacked below on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-1"
          >
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 sm:p-6 lg:sticky lg:top-24 space-y-4 sm:space-y-5">
              <h2 className="text-white font-bold text-base sm:text-lg">Order Summary</h2>

              <div className="space-y-2 text-sm">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-white/55">
                    <span className="truncate flex-1 pr-3 text-xs sm:text-sm">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="flex-shrink-0 text-xs sm:text-sm">
                      ₹{(item.price_chosen * item.quantity).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-3 sm:pt-4 space-y-2">
                <div className="flex justify-between text-white/55 text-xs sm:text-sm">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-white/55">Delivery</span>
                    <span className="text-green-400 font-medium">FREE</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-base sm:text-xl pt-2 border-t border-white/5">
                  <span>Total</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 sm:py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-600/25 text-sm sm:text-base"
              >
                Checkout <ArrowRight size={15} />
              </button>

              <Link
                to="/menu"
                className="block text-center text-white/35 hover:text-white text-xs sm:text-sm transition-colors"
              >
                + Add more items
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
