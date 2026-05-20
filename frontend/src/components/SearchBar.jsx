import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search items...' }) {
  return (
    <div className="relative group">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-red-400 transition-colors duration-200"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-900 border border-white/10 group-focus-within:border-red-500/50 text-white placeholder-white/30 rounded-2xl pl-12 pr-12 py-4 focus:outline-none transition-all duration-200 text-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
