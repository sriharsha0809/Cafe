import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartPanel from './components/CartPanel';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { ShoppingCart } from 'lucide-react';
import { useCart } from './context/CartContext';

function FloatingCartButton() {
  const [open, setOpen] = useState(false);
  const { itemCount, total } = useCart();

  if (itemCount === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white rounded-2xl px-4 sm:px-6 py-3 sm:py-4 font-semibold shadow-2xl shadow-red-600/40 flex items-center gap-2 sm:gap-3 transition-colors duration-200 border border-red-500/40 whitespace-nowrap"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        aria-label={`Cart — ${itemCount} items`}
      >
        <ShoppingCart size={16} className="flex-shrink-0" />
        <span className="text-sm sm:text-base">{itemCount} item{itemCount > 1 ? 's' : ''}</span>
        <span className="w-px h-3.5 bg-white/30" />
        <span className="text-sm sm:text-base font-bold">₹{total.toFixed(0)}</span>
      </button>
      <CartPanel isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen bg-[#0D0D0D]">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
          <FloatingCartButton />
          <Toaster position="top-right" />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
