import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronRight, MapPin, Clock, Phone } from 'lucide-react';
import { categoriesApi, itemsApi } from '../services/api';
import ItemCard from '../components/ItemCard';

/* ── Scroll-reveal wrapper ── */
function Reveal({ children, delay = 0, y = 36, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Animated counter (RAF-throttled, no setState every frame) ── */
function Counter({ value, suffix = '' }) {
  const ref     = useRef(null);
  const inView  = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  const numVal  = parseFloat(value);
  const isNum   = !isNaN(numVal);
  const spring  = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => { if (inView && isNum) spring.set(numVal); }, [inView, numVal, isNum, spring]);
  useEffect(() => {
    if (!isNum) return;
    let raf;
    const unsub = spring.on('change', v => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setDisplay(Math.round(v * 10) / 10));
    });
    return () => { unsub(); cancelAnimationFrame(raf); };
  }, [spring, isNum]);

  return <span ref={ref}>{isNum ? display : value}{suffix}</span>;
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured,   setFeatured]   = useState([]);

  /* ── Video ── */
  const videoRef = useRef(null);

  const heroRef     = useRef(null);
  const featuredRef = useRef(null);
  const featuredInView = useInView(featuredRef, { once: true, margin: '-80px' });

  /* Parallax — only on hero section */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const videoScale   = useTransform(scrollYProgress, [0, 1],    [1, 1.1]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const textY        = useTransform(scrollYProgress, [0, 1],    ['0%', '-28%']);
  const textOpacity  = useTransform(scrollYProgress, [0, 0.5],  [1, 0]);
  const arrowOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  /* ─────────────────────────────────────────────────────────────────────────
   *  Video control
   *
   *  Phase 1 – Mount:  autoplay immediately (muted, so browser allows it)
   *  Phase 2 – Scroll down (scrollY > 0):  play
   *  Phase 3 – Scroll back to very top (scrollY === 0, but ONLY after the
   *             user has scrolled at least once):  pause + rewind to frame 0
   * ───────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Phase 1 — autoplay on mount
    vid.play().catch(() => {/* browser blocked, scroll will trigger */});

    // Closure flag — becomes true on the first scroll event ever
    let hasScrolled = false;

    const handleScroll = () => {
      if (window.scrollY > 0) {
        // ── User scrolled down ──────────────────────────────────────────────
        hasScrolled = true;
        if (vid.paused) vid.play().catch(() => {});

      } else if (hasScrolled) {
        // ── User scrolled BACK to the very top (after having scrolled) ─────
        if (!vid.paused) {
          vid.pause();
          vid.currentTime = 0;  // rewind to first frame
        }
      }
      // If scrollY === 0 but has never scrolled → do nothing (let autoplay run)
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    categoriesApi.getAll().then(r => setCategories(r.data.data));
    itemsApi.getFeatured().then(r => setFeatured(r.data.data));
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0D]">

      {/* ═══════════ HERO ═══════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen min-h-[100svh] flex items-center justify-center overflow-hidden"
      >

        {/* ── VIDEO — always visible, fills entire hero ── */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: videoScale, opacity: videoOpacity, willChange: 'transform, opacity' }}
        >
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/images/chai_hero.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* ── Single consolidated overlay (4 gradients → 1) ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(to bottom, rgba(13,13,13,0.6) 0%, transparent 30%, transparent 60%, rgba(13,13,13,0.92) 100%),
              radial-gradient(ellipse 85% 75% at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)
            `,
          }}
        />



        {/* ── HERO TEXT ── */}
        <motion.div
          className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto w-full"
          style={{ y: textY, opacity: textOpacity, willChange: 'transform, opacity' }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full px-4 py-2 sm:px-5 sm:py-2.5">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse block shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span className="text-white text-xs sm:text-sm font-bold tracking-wide drop-shadow-lg">
                India's First &amp; Patented O-Shaped Cafe
              </span>
            </div>
          </motion.div>

          {/* Main heading */}
          <div className="overflow-hidden pb-6 -mb-3 sm:-mb-2">
            <motion.h1
              initial={{ y: '105%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.85, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black leading-none tracking-tight"
              style={{ fontSize: 'clamp(3.5rem, 15vw, 10.5rem)' }}
            >
              <span 
                className="text-white"
                style={{ textShadow: '1px 1px 0 #999, 2px 2px 0 #888, 3px 3px 0 #777, 4px 4px 0 #666, 5px 5px 0 #555, 6px 6px 15px rgba(0,0,0,0.8)' }}
              >
                chai
              </span>
              <span 
                className="text-[#E63946]"
                style={{ textShadow: '1px 1px 0 #b52b36, 2px 2px 0 #9e252f, 3px 3px 0 #871e27, 4px 4px 0 #701920, 5px 5px 0 #591319, 6px 6px 15px rgba(0,0,0,0.8)' }}
              >
                O
              </span>
              <span 
                className="text-white"
                style={{ textShadow: '1px 1px 0 #999, 2px 2px 0 #888, 3px 3px 0 #777, 4px 4px 0 #666, 5px 5px 0 #555, 6px 6px 15px rgba(0,0,0,0.8)' }}
              >
                pod
              </span>
            </motion.h1>
          </div>

          {/* Tagline */}
          <div className="overflow-hidden mb-8 sm:mb-10">
            <motion.p
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.75, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-white/65 font-light text-xs sm:text-sm md:text-base"
              style={{ letterSpacing: '0.25em', textTransform: 'uppercase' }}
            >
              Every Sip, A Story
            </motion.p>
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link
              to="/menu"
              className="group flex items-center gap-2 sm:gap-3 bg-red-600 hover:bg-red-500 text-white font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-2xl shadow-red-600/40 transition-colors duration-200 text-sm md:text-base w-full sm:w-auto justify-center"
            >
              Explore Menu
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <a
              href="#categories"
              onClick={e => {
                e.preventDefault();
                document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/18 border border-white/20 text-white font-medium px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl transition-colors duration-200 text-sm md:text-base w-full sm:w-auto"
            >
              Our Menu
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: arrowOpacity }}
          className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10 pointer-events-none"
        >
          <span className="text-white/35 text-[10px] uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={18} className="text-white/35" />
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #0D0D0D, transparent)' }}
        />
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <section className="py-8 sm:py-10 bg-[#0D0D0D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/5">
              {[
                { val: '50', suffix: '+', label: 'Menu Items' },
                { val: '9',  suffix: '',  label: 'Categories' },
                { val: '100',suffix: '%', label: 'Pure Veg'   },
                { val: '4.8',suffix: '★', label: 'Rating'     },
              ].map(s => (
                <div
                  key={s.label}
                  className="bg-zinc-900 flex flex-col items-center justify-center py-6 sm:py-8 px-3 sm:px-4 gap-1"
                >
                  <span className="font-display text-3xl sm:text-4xl font-black text-white">
                    <Counter value={s.val} suffix={s.suffix} />
                  </span>
                  <span className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest text-center">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ CATEGORIES ═══════════ */}
      <section id="categories" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-10 sm:mb-14">
          <p className="text-red-500 text-xs font-bold uppercase tracking-[0.3em] mb-3">What We Serve</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Our Categories
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          <motion.div
            className="contents"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {categories.map(cat => (
              <motion.div
                key={cat.id}
                variants={{
                  hidden:  { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
                }}
              >
                <Link
                  to={`/menu?category=${cat.id}`}
                  className="group flex flex-col items-center bg-zinc-900 hover:bg-zinc-800 border border-white/5 hover:border-red-500/30 rounded-2xl p-4 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-xl hover:shadow-red-600/10"
                >
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-125">
                    {cat.icon}
                  </div>
                  <p className="text-white/70 group-hover:text-white text-xs sm:text-sm font-medium leading-tight transition-colors">
                    {cat.name}
                  </p>
                </Link>
              </motion.div>
            ))}

            <motion.div
              variants={{
                hidden:  { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <Link
                to="/menu"
                className="group flex flex-col items-center bg-zinc-900 hover:bg-red-600/10 border border-dashed border-white/10 hover:border-red-500/50 rounded-2xl p-4 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2"
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-125">🍴</div>
                <p className="text-red-400/60 group-hover:text-red-400 text-xs sm:text-sm font-medium transition-colors">View All</p>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ QUOTE DIVIDER ═══════════ */}
      <div className="relative py-16 sm:py-20 overflow-hidden bg-zinc-950">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-36 sm:h-40 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #E63946 0%, transparent 70%)' }}
        />
        <Reveal className="relative text-center px-4 sm:px-6 z-10">
          <p className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight max-w-2xl mx-auto">
            "Crafted with love,<br />
            <span className="text-red-400">served with warmth"</span>
          </p>
        </Reveal>
      </div>

      {/* ═══════════ FEATURED ═══════════ */}
      <section ref={featuredRef} className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 sm:mb-14">
            <Reveal>
              <p className="text-red-500 text-xs font-bold uppercase tracking-[0.3em] mb-3">Must Try</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white">Featured Items</h2>
            </Reveal>
            <Reveal delay={0.12}>
              <Link
                to="/menu"
                className="hidden sm:flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors group"
              >
                View all
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>
          </div>

          {featuredInView && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {featured.map((item, i) => (
                <ItemCard key={item.id} item={item} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ INFO ═══════════ */}
      <section className="py-14 sm:py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: <MapPin size={20} />, title: 'Find Us',    text: 'Your nearest chaiOpod cafe'    },
              { icon: <Clock  size={20} />, title: 'Open Daily', text: '7:00 AM – 10:00 PM'           },
              { icon: <Phone  size={20} />, title: 'Order Now',  text: 'Delivery & Dine-in available' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-400 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm sm:text-base">{item.title}</h3>
                    <p className="text-white/50 text-xs sm:text-sm mt-1">{item.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">☕</span>
            <span className="font-display font-bold text-white">
              chai<span className="text-red-500">O</span>pod
            </span>
          </div>
          <p className="text-white/25 text-xs sm:text-sm">
            © 2026 chaiOpod. India's First &amp; Patented O-Shaped Cafe.
          </p>
        </div>
      </footer>
    </div>
  );
}
