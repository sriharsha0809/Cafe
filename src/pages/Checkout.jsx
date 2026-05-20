import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Smartphone, Banknote, CheckCircle, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../services/api';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: <Smartphone size={20} />, desc: 'PhonePe, GPay, Paytm' },
  { id: 'card', label: 'Card', icon: <CreditCard size={20} />, desc: 'Debit or Credit Card' },
  { id: 'cash', label: 'Cash', icon: <Banknote size={20} />, desc: 'Pay at counter / delivery' },
];

export default function Checkout() {
  const { items, total, cartId, orderType, setOrderType, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  if (items.length === 0 && !confirmed) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] pt-24 flex flex-col items-center justify-center gap-4 text-center px-4">
        <ShoppingBag size={48} className="text-white/20" />
        <h2 className="text-white text-2xl font-bold">Nothing to checkout</h2>
        <Link to="/menu" className="btn-primary">Browse Menu</Link>
      </div>
    );
  }

  const handleOrder = async () => {
    if (!form.name.trim()) return toast.error('Please enter your name');
    if (!form.phone.trim() || form.phone.length < 10) return toast.error('Please enter a valid phone number');
    if (orderType === 'delivery' && !form.address.trim()) return toast.error('Please enter delivery address');

    setLoading(true);
    try {
      const orderItems = items.map(it => ({
        item_id: it.item_id,
        name: it.name,
        quantity: it.quantity,
        price: it.price_chosen,
      }));

      const res = await ordersApi.create({
        cart_id: cartId,
        user_id: 'guest',
        order_type: orderType,
        payment_method: paymentMethod,
        customer_name: form.name,
        customer_phone: form.phone,
        address: form.address,
        items: orderItems,
      });

      await clearCart();
      setConfirmed(res.data.data);
    } catch (err) {
      toast.error('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Confirmation Screen ───
  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] pt-20 sm:pt-24 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 0.1 }}
          className="text-center max-w-sm sm:max-w-md w-full"
        >
          {/* Success icon */}
          <div className="w-28 h-28 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={56} className="text-green-400" />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">Order Confirmed!</h1>
          <p className="text-white/50 text-lg mb-2">Thank you, <span className="text-white font-semibold">{form.name}</span>!</p>

          <div className="card p-6 mt-8 space-y-4 text-left">
            <div className="flex justify-between items-start">
              <span className="text-white/50 text-sm">Order ID</span>
              <span className="text-white text-sm font-mono font-semibold">{confirmed.order_id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Total Paid</span>
              <span className="text-white font-bold text-xl">₹{confirmed.total_amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Order Type</span>
              <span className="text-white text-sm capitalize">{orderType === 'dine-in' ? '🪑 Dine-in' : '🚚 Delivery'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Payment</span>
              <span className="text-white text-sm uppercase">{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Status</span>
              <span className="text-green-400 text-sm font-semibold">✓ Confirmed</span>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Link to="/" className="flex-1 btn-ghost text-center text-sm">
              Back to Home
            </Link>
            <Link to="/menu" className="flex-1 btn-primary text-center text-sm">
              Order More
            </Link>
          </div>

          <p className="text-white/30 text-sm mt-6">
            {orderType === 'dine-in'
              ? '☕ Your order is being prepared. Please be seated!'
              : '🚚 Your order will be delivered soon!'}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-14 sm:pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 sm:mb-10">
          <Link to="/cart" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-4 sm:mb-6 transition-colors">
            <ArrowLeft size={15} /> Back to Cart
          </Link>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-white">Checkout</h1>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Left — Form */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Order Type */}
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 sm:p-6">
              <h2 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Order Type</h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {['dine-in', 'delivery'].map(type => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${orderType === type ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-zinc-800 text-white/50 hover:text-white border border-white/5'}`}
                  >
                    {type === 'dine-in' ? '🪑 Dine-in' : '🚚 Delivery'}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
              <h2 className="text-white font-semibold text-sm sm:text-base">Your Details</h2>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Full Name *</label>
                <input
                  className="input"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Phone Number *</label>
                <input
                  className="input"
                  placeholder="10-digit mobile number"
                  type="tel"
                  maxLength={10}
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))}
                />
              </div>
              {orderType === 'delivery' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Delivery Address *</label>
                  <textarea
                    className="input resize-none"
                    rows={3}
                    placeholder="Full delivery address"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  />
                </motion.div>
              )}
            </div>

            {/* Payment */}
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
              <h2 className="text-white font-semibold text-sm sm:text-base">Payment Method</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map(pm => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${paymentMethod === pm.id ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 bg-zinc-800/50 hover:border-white/10'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === pm.id ? 'bg-red-600/20 text-red-400' : 'bg-zinc-700 text-white/40'}`}>
                      {pm.icon}
                    </div>
                    <div className="text-left">
                      <p className={`font-semibold text-sm ${paymentMethod === pm.id ? 'text-white' : 'text-white/60'}`}>{pm.label}</p>
                      <p className="text-white/30 text-xs">{pm.desc}</p>
                    </div>
                    <div className={`ml-auto w-5 h-5 rounded-full border-2 transition-all ${paymentMethod === pm.id ? 'border-red-500 bg-red-500' : 'border-white/20'}`}>
                      {paymentMethod === pm.id && <div className="w-full h-full rounded-full bg-white scale-50" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 sm:p-6 lg:sticky lg:top-24 space-y-4 sm:space-y-5">
              <h2 className="text-white font-bold text-base sm:text-lg">Order Summary</h2>

              <div className="space-y-3 max-h-48 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm text-white/60">
                    <span className="truncate pr-4 flex-1">{item.name} × {item.quantity}</span>
                    <span className="flex-shrink-0">₹{(item.price_chosen * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-4 space-y-2">
                <div className="flex justify-between text-white/60 text-sm">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Delivery</span>
                    <span className="text-green-400 font-medium">FREE</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-xl pt-2 border-t border-white/5">
                  <span>Total</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
              </div>

              <button
                onClick={handleOrder}
                disabled={loading}
                className={`w-full bg-red-600 hover:bg-red-500 text-white font-semibold flex items-center justify-center gap-2 py-3 sm:py-4 rounded-xl transition-colors shadow-lg shadow-red-600/25 text-sm sm:text-base ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Place Order — ₹{total.toFixed(0)}</>
                )}
              </button>

              <p className="text-white/25 text-xs text-center">
                By placing this order, you agree to our terms of service
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
