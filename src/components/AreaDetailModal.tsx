import React from 'react';
import { Area } from '../types';
import { useRealEstate } from '../context/RealEstateContext';
import { formatCurrency } from '../utils/helpers';
import { 
  X, 
  MapPin, 
  TrendingUp, 
  Star, 
  Building2, 
  Car, 
  GraduationCap, 
  ShoppingBag, 
  HeartPulse, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';

interface AreaDetailModalProps {
  area: Area | null;
  onClose: () => void;
}

export const AreaDetailModal: React.FC<AreaDetailModalProps> = ({ area, onClose }) => {
  const { properties, filterByArea, setActiveTab } = useRealEstate();

  if (!area) return null;

  const areaProperties = properties.filter(p => p.areaId === area.id || p.areaName.includes(area.name));

  const handleShowProperties = () => {
    filterByArea(area.id);
    onClose();
    setActiveTab('properties');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Cover Header */}
        <div className="relative aspect-16/7 sm:aspect-21/8 w-full bg-stone-900 shrink-0">
          <img
            src={area.coverImage}
            alt={area.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-stone-950/70 text-white hover:bg-stone-900 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Title */}
          <div className="absolute bottom-4 right-4 left-4 text-white">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
              <MapPin className="w-4 h-4" />
              <span>{area.city}</span>
              <span>•</span>
              <span className="flex items-center gap-1 bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded text-[11px]">
                <Star className="w-3 h-3 fill-amber-300" />
                <span>تقييم استثماري: {area.investmentRating} / 5</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white">{area.name}</h1>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-center">
              <span className="text-[11px] text-stone-500 block font-medium">متوسط سعر المتر</span>
              <strong className="text-base font-extrabold text-amber-900 font-mono">
                {formatCurrency(area.avgPricePerMeter)}
              </strong>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-center">
              <span className="text-[11px] text-stone-500 block font-medium">معدل النمو السنوي</span>
              <strong className="text-base font-extrabold text-emerald-700 font-mono flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>+{area.priceGrowthAnnual}%</span>
              </strong>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-center">
              <span className="text-[11px] text-stone-500 block font-medium">مستوى الطلب</span>
              <span className="inline-block mt-0.5 font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full text-xs">
                {area.demandLevel}
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-center">
              <span className="text-[11px] text-stone-500 block font-medium">العقارات المتاحة لدينا</span>
              <strong className="text-base font-extrabold text-stone-900">
                {areaProperties.length} عقار
              </strong>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-2">نبذة استثمارية وسكنية عن المنطقة</h3>
            <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200/70">
              {area.description}
            </p>
          </div>

          {/* Top Compounds */}
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-700" />
              <span>أهم الكمبوندات والمشاريع السكنية والتجارية</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {area.topCompounds.map((comp, idx) => (
                <div key={idx} className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 flex items-center gap-2 text-xs font-bold text-amber-950">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{comp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Services & Facilities */}
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-3">الخدمات والمرافق المتوفرة بالمنطقة</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {area.services.map((srv, idx) => (
                <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="flex items-center gap-2 mb-2.5 font-bold text-xs text-stone-900">
                    {idx === 0 && <GraduationCap className="w-4 h-4 text-amber-700" />}
                    {idx === 1 && <ShoppingBag className="w-4 h-4 text-amber-700" />}
                    {idx === 2 && <HeartPulse className="w-4 h-4 text-amber-700" />}
                    <span>{srv.category}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {srv.items.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Transportation and Major Axes */}
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-700" />
              <span>شبكة الطرق والمحاور ووسائل المواصلات</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {area.transportation.map((road, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-stone-100 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800">
                  {road}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between shrink-0">
          <span className="text-xs text-stone-600 font-medium">
            يوجد لدينا <strong className="text-amber-800 font-bold">{areaProperties.length} عقارات</strong> متاحة في هذه المنطقة حالياً
          </span>

          <button
            onClick={handleShowProperties}
            className="py-2.5 px-5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>استعراض جميع عقارات {area.name}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
