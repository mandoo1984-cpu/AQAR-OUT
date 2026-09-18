import React from 'react';
import { useRealEstate } from '../context/RealEstateContext';
import { AreaCard } from './AreaCard';
import { Area } from '../types';
import { formatCurrency } from '../utils/helpers';
import { MapPin, TrendingUp, Compass, Award, ShieldCheck } from 'lucide-react';

interface AreasExplorerViewProps {
  onSelectArea: (area: Area) => void;
}

export const AreasExplorerView: React.FC<AreasExplorerViewProps> = ({ onSelectArea }) => {
  const { areas } = useRealEstate();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white p-6 sm:p-8 shadow-xl border border-stone-800">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/80" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-400/30">
            <Compass className="w-3.5 h-3.5" />
            <span>دليل المناطق والأحياء الاستثمارية والسكنية الأكثر طلباً</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2 leading-tight">
            دليل استكشاف المناطق وتطور أسعار المتر
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
            تعرف على تفاصيل أرقى المناطق السكنية والاستثمارية، متوسط أسعار المتر، نسب النمو السنوية، والخدمات وشبكات النقل المتاحة لكل منطقة.
          </p>
        </div>
      </div>

      {/* Areas Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-700" />
            <span>أبرز المناطق والأحياء المتاحة ({areas.length})</span>
          </h2>
          <span className="text-xs text-stone-500">محدثة وفقاً لآخر مؤشرات السوق</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map(area => (
            <AreaCard
              key={area.id}
              area={area}
              onSelect={onSelectArea}
            />
          ))}
        </div>
      </div>

      {/* Market Comparison Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
        <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-700" />
          <span>مقارنة مؤشرات الاستثمار العقاري بين المناطق</span>
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          مقارنة سريعة لمتوسط سعر المتر ونسب النمو السنوي ومستوى الطلب.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-700 font-bold">
                <th className="py-3 px-4 rounded-r-xl">المنطقة والمدينة</th>
                <th className="py-3 px-4">متوسط سعر المتر</th>
                <th className="py-3 px-4">معدل النمو السنوي</th>
                <th className="py-3 px-4">مستوى الطلب</th>
                <th className="py-3 px-4">التقييم الاستثماري</th>
                <th className="py-3 px-4 rounded-l-xl text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {areas.map(area => (
                <tr key={area.id} className="hover:bg-amber-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-stone-900">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{area.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-900">
                    {formatCurrency(area.avgPricePerMeter)}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                    +{area.priceGrowthAnnual}%
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                      {area.demandLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-amber-600">
                    ★ {area.investmentRating} / 5
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onSelectArea(area)}
                      className="text-amber-800 hover:text-amber-950 font-bold text-[11px] underline cursor-pointer"
                    >
                      عرض التفاصيل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
