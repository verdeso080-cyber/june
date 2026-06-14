import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles } from 'lucide-react';

interface SearchInputProps {
  onSearch: (keyword: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading, disabled }) => {
  const [keyword, setKeyword] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim());
    }
  };

  const suggestions = ["환경 (Environment)", "심리 (Psychology)", "AI", "경제 (Economy)"];

  return (
    <div className="w-full max-w-xl mx-auto transform transition-all duration-500">
      <form onSubmit={handleSubmit} className="relative z-10">
        <div 
          className={`
            relative flex items-center bg-white rounded-2xl transition-all duration-300 overflow-hidden border
            ${isFocused 
              ? 'shadow-2xl ring-4 ring-indigo-500/10 scale-105 border-indigo-500/20' 
              : 'shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 border-slate-100'
            }
          `}
        >
          <div className="pl-6 text-slate-400">
            {isLoading ? <Sparkles className="w-6 h-6 animate-spin text-indigo-500" /> : <Search className="w-6 h-6" />}
          </div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled || isLoading}
            placeholder="Search topic (e.g. Environment)"
            className="w-full py-6 px-4 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 text-lg font-medium"
          />
          <div className="pr-3">
            <button
              type="submit"
              disabled={disabled || isLoading || !keyword.trim()}
              className={`
                p-3 rounded-xl transition-all duration-300 flex items-center justify-center
                ${disabled || isLoading || !keyword.trim() 
                  ? 'bg-slate-100 text-slate-300' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl hover:scale-105'
                }
              `}
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>

      {/* Suggested Chips */}
      {!isLoading && (
        <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fade-in-up">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest pt-2 mr-1">Trending:</span>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onSearch(s.split(' ')[0])}
              className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;