import React, { useState } from 'react';
import { useRealEstate } from '../context/RealEstateContext';
import { PropertyCard } from './PropertyCard';
import { Property, PropertyType, PropertyPurpose } from '../types';
import { 
  PROPERTY_TYPE_LABELS, 
  PURPOSE_LABELS, 
  FINISHING_LABELS 
} from '../utils/helpers';
import { 
  Search, 
  Filter, 
  X, 
  Building2, 
  SlidersHorizontal, 
  PlusCircle, 
  CheckCircle2, 
  Heart,
  Sparkles
} from 'lucide-react';

interface PropertyExplorerViewProps {
  onOpenAddProperty: () => void;
  onEditProperty: (property: Property) => void;
}

export const PropertyExplorerView: React.FC<PropertyExplorerViewProps> = ({
  onOpenAddProperty,
  onEditProperty,
}) => {
  const {
    properties,
    areas,
    filters,
    setFilters,
    resetFilters,
    setSelectedProperty,
    favorites,
    isAgentMode,
  } = useRealEstate();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Filter logic
  const filteredProperties = properties.filter(prop => {
    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const matchTitle = prop.title.toLowerCase().includes(q);
      const matchArea = prop.areaName.toLowerCase().includes(q);
      const matchCompound = prop.compound?.toLowerCase().includes(q) || false;
      const matchDesc = prop.description.toLowerCase().includes(q);
      if (!matchTitle && !matchArea && !matchCompound && !matchDesc) return false;
    }

    // Purpose
    if (filters.purpose !== 'all' && prop.purpose !== filters.purpose) return false;

    // Type
    if (filters.type !== 'all' && prop.type !== filters.type) return false;

    // Area
    if (filters.areaId && prop.areaId !== filters.areaId) return false;

    // Price
    if (filters.minPrice > 0 && prop.price < filters.minPrice) return false;
    if (filters.maxPrice < 100000000 && prop.price > filters.maxPrice) return false;

    // Finishing
    if (filters.finishing !== 'all' && prop.finishing !== filters.finishing) return false;

    // Favorites only
    if (showOnlyFavorites && !favorites.includes(prop.id)) return false;

    return true;
  });

  // Sorting
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (filters.sortBy === 'price_asc') return a.price - b.price;
    if (filters.sortBy === 'price_desc') return b.price - a.price;
    if (filters.sortBy === 'size_desc') return b.sizeSqM - a.sizeSqM;
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });

  const activeFiltersCount = [
    filters.search ? 1 : 0,
    filters.purpose !== 'all' ? 1 : 0,
    filters.type !== 'all' ? 1 : 0,
    filters.areaId ? 1 : 0,
    filters.finishing !== 'all' ? 1 : 0,
    showOnlyFavorites ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const selectedAreaObj = areas.find(a => a.id === filters.areaId);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Hero / Search Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white p-6 sm:p-8 shadow-xl border border-stone-800">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/80 via-stone-900/90 to-stone-900" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>محفظة عقارية حصرية بأفضل المواقع الاستثمارية</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2 leading-tight">
            استكشف أرقى العقارات والكمبوندات السكنية
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
            تصفح تفاصيل الفلل، الشقق، التاون هاوس، والشاليهات في أرقى المدن والمناطق بمخططات سداد مرنة واستلام فوري.
          </p>
        </div>

        {/* Quick Search Bar inside Hero */}
        <div className="relative z-10 mt-6 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-2xl border border-stone-200 text-stone-900 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={filters.search}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="ابحث بالاسم، اسم الكمبوند، أو الكلمات المفتاحية..."
              className="w-full py-2.5 px-4 pr-10 bg-stone-100 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
            <Search className="absolute right-3.5 top-3 w-4 h-4 text-stone-400 pointer-events-none" />
          </div>

          {/* Area Selector */}
          <select
            value={filters.areaId}
            onChange={e => setFilters(prev => ({ ...prev, areaId: e.target.value }))}
            className="py-2.5 px-3 bg-stone-100 rounded-xl text-xs text-stone-800 font-semibold focus:outline-none"
          >
            <option value="">جميع المناطق والأحياء</option>
            {areas.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>

          {/* Purpose buttons */}
          <div className="flex rounded-xl bg-stone-100 p-1 shrink-0">
            <button
              onClick={() => setFilters(prev => ({ ...prev, purpose: 'all' }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filters.purpose === 'all' ? 'bg-amber-700 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, purpose: 'sale' }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filters.purpose === 'sale' ? 'bg-amber-700 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              للبيع
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, purpose: 'rent' }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filters.purpose === 'rent' ? 'bg-amber-700 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              للإيجار
            </button>
          </div>

          {/* Filter button */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              showAdvancedFilters || activeFiltersCount > 0
                ? 'bg-amber-700 text-white'
                : 'bg-stone-200 text-stone-800 hover:bg-stone-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>تصفية متقدمة</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-amber-800 text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-700" />
              <span>خيارات التصفية الدقيقة للعقارات</span>
            </h3>

            <button
              onClick={resetFilters}
              className="text-xs text-amber-800 hover:text-amber-900 font-semibold cursor-pointer"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
            {/* Property Type */}
            <div>
              <label className="block font-bold text-stone-700 mb-1.5">نوع العقار</label>
              <select
                value={filters.type}
                onChange={e => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none"
              >
                <option value="all">كافة الأنواع (شقق، فلل، شاليهات...)</option>
                {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            {/* Finishing */}
            <div>
              <label className="block font-bold text-stone-700 mb-1.5">مستوى التشطيب</label>
              <select
                value={filters.finishing}
                onChange={e => setFilters(prev => ({ ...prev, finishing: e.target.value as any }))}
                className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none"
              >
                <option value="all">كافة مستويات التشطيب</option>
                {Object.entries(FINISHING_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div>
              <label className="block font-bold text-stone-700 mb-1.5">ترتيب العرض حسب</label>
              <select
                value={filters.sortBy}
                onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none"
              >
                <option value="latest">الأحدث إضافة</option>
                <option value="price_asc">السعر: من الأقل للأعلى</option>
                <option value="price_desc">السعر: من الأعلى للأقل</option>
                <option value="size_desc">المساحة: الأكبر أولاً</option>
              </select>
            </div>

            {/* Favorites Only Toggle */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`w-full py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  showOnlyFavorites
                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                    : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>العقارات المفضلة فقط ({favorites.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Row & Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-stone-800">
            العقارات المتاحة: <strong className="text-amber-800 font-mono font-black">{sortedProperties.length}</strong> من أصل {properties.length}
          </span>

          {selectedAreaObj && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-semibold">
              <span>المنطقة: {selectedAreaObj.name}</span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, areaId: '' }))}
                className="hover:text-amber-950 font-bold"
              >
                &times;
              </button>
            </span>
          )}

          {filters.purpose !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-semibold">
              <span>{PURPOSE_LABELS[filters.purpose]}</span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, purpose: 'all' }))}
                className="hover:text-amber-950 font-bold"
              >
                &times;
              </button>
            </span>
          )}

          {filters.type !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-semibold">
              <span>{PROPERTY_TYPE_LABELS[filters.type]}</span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, type: 'all' }))}
                className="hover:text-amber-950 font-bold"
              >
                &times;
              </button>
            </span>
          )}

          {showOnlyFavorites && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-semibold">
              <span>المفضلة فقط</span>
              <button onClick={() => setShowOnlyFavorites(false)} className="font-bold">&times;</button>
            </span>
          )}
        </div>

        {/* Agent quick add button */}
        {isAgentMode && (
          <button
            onClick={onOpenAddProperty}
            className="py-2 px-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة عقار جديد</span>
          </button>
        )}
      </div>

      {/* Property Cards Grid */}
      {sortedProperties.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-xs">
          <Building2 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-bold text-stone-800 text-base mb-1">لا توجد عقارات مطابقة لمعايير البحث الحالية</h3>
          <p className="text-xs text-stone-500 mb-4">
            جرّب تغيير كلمات البحث أو مسح تصفية المنطقة والنوع لعرض المزيد من العقارات.
          </p>
          <button
            onClick={resetFilters}
            className="py-2 px-4 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            عرض كافة العقارات المتاحة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={setSelectedProperty}
              onEdit={isAgentMode ? onEditProperty : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};
