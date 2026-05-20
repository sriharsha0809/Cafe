import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartPanel({ isOpen, onClose }) {
  const { items, total, updateQuantity, removeItem, orderType, setOrderType, itemCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel — full-width on mobile, max-md on larger */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-zinc-950 border-l border-white/5 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-white/5">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Your Cart</h2>
                <p className="text-white/40 text-xs sm:text-sm mt-0.5">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors"
                aria-label="Close cart"
              >
                <X size={17} className="text-white" />
              </button>
            </div>

            {/* Order type toggle */}
            <div className="px-4 sm:px-6 pt-3 sm:pt-4">
              <div className="flex gap-1.5 sm:gap-2 bg-zinc-900 rounded-2xl p-1 sm:p-1.5">
                {['dine-in', 'delivery'].map(type => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`flex-1 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold capitalize transition-all duration-200 ${
                      orderType === type
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                        : 'text-white/45 hover:text-white'
                    }`}
                  >
                    {type === 'dine-in' ? '🪑 Dine-in' : '🚚 Delivery'}
                  </button>
                ))}
              </div>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 space-y-2 sm:space-y-3">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-48 gap-4"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-800 rounded-2xl flex items-center justify-center">
                      <ShoppingCart size={24} className="text-white/25" />
                    </div>
                    <p className="text-white/35 text-sm">Your cart is empty</p>
                  </motion.div>
                ) : (
                  items.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      className="flex items-center gap-3 sm:gap-4 bg-zinc-900 rounded-2xl p-3 sm:p-4"
                    >
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-xl flex-shrink-0"
                        onError={e => { e.target.src = 'https://placehold.co/100/18181b/E63946?text=☕'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-xs sm:text-sm truncate">{item.name}</p>
                        <p className="text-red-400 font-bold text-sm mt-0.5">
                          ₹{(item.price_chosen * item.quantity).toFixed(0)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                          {item.quantity === 1
                            ? <Trash2 size={11} className="text-red-400" />
                            : <Minus size={11} className="text-white" />
                          }
                        </button>
                        <span className="text-white font-bold w-4 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 flex items-center justify-center transition-colors"
                        >
                          <Plus size={11} className="text-red-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-white/5 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between text-white/55 text-sm">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/55">Delivery</span>
                    <span className="text-green-400 font-medium">FREE</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-white font-bold text-base sm:text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3.5 sm:py-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 text-sm sm:text-base"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
