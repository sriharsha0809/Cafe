import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { categoriesApi, itemsApi } from '../services/api';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    categoriesApi.getAll().then(r => setCategories(r.data.data));
    itemsApi.getAll().then(r => {
      setItems(r.data.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchCat = activeCategory === 'all' || item.category_id === parseInt(activeCategory);
      const matchSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category_name?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, activeCategory, search]);

  const grouped = useMemo(() => {
    if (activeCategory !== 'all' || search) return null;
    const groups = {};
    for (const item of items) {
      const key = `${item.category_id}:${item.category_name}`;
      if (!groups[key]) groups[key] = { name: item.category_name, icon: item.category_icon, items: [] };
      groups[key].items.push(item);
    }
    return Object.values(groups);
  }, [items, activeCategory, search]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: catId });
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-14 sm:pt-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-zinc-950 to-transparent pt-8 sm:pt-12 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 sm:mb-10"
          >
            <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2">Full Menu</p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              What's in the Pod?
            </h1>
            <p className="text-white/40 mt-2 sm:mt-3 max-w-xl mx-auto text-xs sm:text-sm">
              From soul-warming teas to indulgent premium shakes — handcrafted for you.
            </p>
          </motion.div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by name or category..."
            />
          </div>

          {/* Category Tabs — hide-scrollbar keeps it clean on mobile */}
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 hide-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${activeCategory === 'all' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-900 text-white/50 hover:text-white border border-white/5'}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(String(cat.id))}
                className={`flex-shrink-0 flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${activeCategory === String(cat.id) ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-900 text-white/50 hover:text-white border border-white/5'}`}
              >
                <span>{cat.icon}</span>
                <span className="whitespace-nowrap">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
                <div className="skeleton aspect-[4/3]" />
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="skeleton h-3 sm:h-4 rounded w-3/4" />
                  <div className="skeleton h-2 sm:h-3 rounded w-full" />
                  <div className="skeleton h-8 sm:h-10 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Search / filtered result */}
            {(search || activeCategory !== 'all') && (
              <div className="mb-6">
                <p className="text-white/40 text-sm">
                  {filtered.length} item{filtered.length !== 1 ? 's' : ''} found
                  {search && <> for "<span className="text-white">{search}</span>"</>}
                </p>
              </div>
            )}

            {/* Grouped view */}
            {grouped && !search ? (
              <div className="space-y-10 sm:space-y-14">
                {grouped.map(group => (
                  <div key={group.name}>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <span className="text-2xl sm:text-3xl">{group.icon}</span>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-white">{group.name}</h2>
                      <div className="flex-1 h-px bg-white/5 ml-2" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                      {group.items.map((item, i) => (
                        <ItemCard key={item.id} item={item} index={i} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCategory}-${search}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
                >
                  {filtered.length > 0 ? (
                    filtered.map((item, i) => (
                      <ItemCard key={item.id} item={item} index={i} />
                    ))
                  ) : (
                    <div className="col-span-full py-24 text-center">
                      <p className="text-6xl mb-4">🔍</p>
                      <p className="text-white/50 text-lg">No items found</p>
                      <p className="text-white/30 text-sm mt-2">Try a different search or category</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </>
        )}
      </div>
    </div>
  );
}
