import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Coffee } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  /* Prevent body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { path: '/',      label: 'Home' },
    { path: '/menu',  label: 'Menu' },
    { path: '/cart',  label: 'Cart' },
  ];

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/40 backdrop-blur-2xl backdrop-saturate-150'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:shadow-red-600/50 transition-shadow">
                <Coffee size={15} className="text-white" />
              </div>
              <span className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                chai<span className="text-red-500">O</span>pod
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.filter(l => l.path !== '/cart').map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive(link.path) ? 'text-white' : 'text-white/55 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Cart + Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/cart" className="relative group">
                <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-200 ${
                  itemCount > 0
                    ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/30'
                    : 'bg-white/10 hover:bg-white/15'
                }`}>
                  <ShoppingCart size={15} className="text-white" />
                  <span className="text-white text-sm font-semibold hidden sm:block">Cart</span>
                  {itemCount > 0 && (
                    <span className="text-white text-xs font-bold bg-white/20 rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* Hamburger — mobile only */}
              <button
                className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen
                  ? <X size={17} className="text-white" />
                  : <Menu size={17} className="text-white" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/5 overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-red-600/20 text-red-400'
                        : 'text-white/65 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
