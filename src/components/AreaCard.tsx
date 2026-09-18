import React from 'react';
import { Area } from '../types';
import { useRealEstate } from '../context/RealEstateContext';
import { formatCurrency } from '../utils/helpers';
import { MapPin, TrendingUp, Star, ArrowLeft, Building, Sparkles } from 'lucide-react';

interface AreaCardProps {
  area: Area;
  onSelect: (area: Area) => void;
}

export const AreaCard: React.FC<AreaCardProps> = ({ area, onSelect }) => {
  const { properties, filterByArea } = useRealEstate();
  
  // Count properties in this area
  const areaPropertiesCount = properties.filter(p => p.areaId === area.id || p.areaName.includes(area.name)).length;

  return (
    <div 
      id={`area-card-${area.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
    >
      {/* Cover Image */}
      <div className="relative aspect-16/9 overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onSelect(area)}>
        <img
          src={area.coverImage}
          alt={area.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <span className="bg-amber-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{area.priceGrowthAnnual}% نمو سنوي</span>
          </span>
        </div>

        <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-amber-400 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{area.investmentRating} / 5</span>
        </div>

        {/* Bottom Overlay Info */}
        <div className="absolute bottom-3 right-3 left-3 text-white">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-0.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{area.city}</span>
          </div>
          <h3 className="font-extrabold text-lg sm:text-xl text-white leading-tight">
            {area.name}
          </h3>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {area.description}
          </p>

          {/* Pricing & Demand Stats */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs mb-3">
            <div>
              <span className="text-[11px] text-stone-500 block">متوسط سعر المتر</span>
              <strong className="text-sm font-bold text-amber-900 font-mono">
                {formatCurrency(area.avgPricePerMeter)}
              </strong>
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block">مستوى الطلب</span>
              <span className="inline-block font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                {area.demandLevel}
              </span>
            </div>
          </div>

          {/* Top Compounds Chips */}
          <div className="mb-4">
            <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">أبرز الكمبوندات والمشاريع:</span>
            <div className="flex flex-wrap gap-1.5">
              {area.topCompounds.slice(0, 3).map((comp, idx) => (
                <span key={idx} className="bg-stone-100 text-stone-700 text-[11px] font-medium px-2 py-0.5 rounded-md">
                  {comp}
                </span>
              ))}
              {area.topCompounds.length > 3 && (
                <span className="text-[11px] text-stone-400 self-center">
                  +{area.topCompounds.length - 3} أخرى
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
          <button
            onClick={() => onSelect(area)}
            className="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>تفاصيل المنطقة والخدمات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => filterByArea(area.id)}
            title={`تصفية العقارات في ${area.name}`}
            className="py-2 px-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
          >
            <Building className="w-3.5 h-3.5" />
            <span>عقاراتها ({areaPropertiesCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
