import React from 'react';
import { Property } from '../types';
import { useRealEstate } from '../context/RealEstateContext';
import { formatCurrency, PROPERTY_TYPE_LABELS, PURPOSE_LABELS } from '../utils/helpers';
import { 
  Bed, 
  Bath, 
  Maximize2, 
  MapPin, 
  Heart, 
  PhoneCall, 
  MessageSquare, 
  Eye, 
  Sparkles, 
  Calendar,
  Lock
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onEdit?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect, onEdit }) => {
  const { favorites, toggleFavorite, isAgentMode } = useRealEstate();
  const isFav = favorites.includes(property.id);

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = property.contactWhatsApp || '201001234567';
    const text = encodeURIComponent(`مرحباً، أستفسر بخصوص العقار: ${property.title} - السعر: ${formatCurrency(property.price)} (${property.areaName})`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div 
      id={`property-card-${property.id}`}
      onClick={() => onSelect(property)}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
    >
      {/* Property Cover Image Container */}
      <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 flex-wrap">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs ${
            property.purpose === 'sale' 
              ? 'bg-amber-600 text-white' 
              : 'bg-teal-700 text-white'
          }`}>
            {PURPOSE_LABELS[property.purpose]}
          </span>
          <span className="bg-stone-900/80 backdrop-blur-md text-stone-100 px-2.5 py-1 rounded-lg text-xs font-semibold">
            {PROPERTY_TYPE_LABELS[property.type]}
          </span>
          {property.featured && (
            <span className="bg-amber-400 text-stone-950 px-2 py-0.5 rounded-lg text-[11px] font-extrabold flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 fill-stone-950" />
              <span>مميز</span>
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          title={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/85 backdrop-blur-md text-stone-700 hover:text-rose-600 flex items-center justify-center transition-colors shadow-xs z-10"
        >
          <Heart className={`w-4.5 h-4.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Bottom Image Overlay: Area & Compound */}
        <div className="absolute bottom-3 right-3 left-3 text-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-medium truncate">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{property.compound || property.areaName}</span>
          </div>
          <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-mono shrink-0">
            {property.deliveryYear}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors mb-2">
            {property.title}
          </h3>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-stone-50 rounded-xl text-stone-600 text-xs font-medium mb-3">
            <div className="flex items-center gap-1.5 justify-center">
              <Bed className="w-4 h-4 text-amber-700" />
              <span>{property.bedrooms} غرف</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center border-x border-stone-200">
              <Bath className="w-4 h-4 text-amber-700" />
              <span>{property.bathrooms} حمام</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center">
              <Maximize2 className="w-4 h-4 text-amber-700" />
              <span>{property.sizeSqM} م²</span>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mb-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-stone-500 font-medium">السعر الإجمالي:</span>
              <span className="text-lg font-extrabold text-amber-900 font-mono">
                {formatCurrency(property.price, property.currency)}
              </span>
            </div>

            {/* Installment details if available */}
            {property.downPayment && property.monthlyInstallment && (
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-stone-600 bg-amber-50/60 px-2 py-1 rounded-lg border border-amber-100">
                <span>مقدم: <strong className="font-mono text-stone-800">{formatCurrency(property.downPayment)}</strong></span>
                <span className="border-r border-amber-200 pr-2">قسط: <strong className="font-mono text-stone-800">{formatCurrency(property.monthlyInstallment)}/ش</strong></span>
              </div>
            )}
          </div>

          {/* Agent Private Notes Tag if Agent Mode is active */}
          {isAgentMode && property.privateAgentNotes && (
            <div className="mb-3 p-2 bg-stone-900 text-amber-200 rounded-lg text-xs flex items-start gap-1.5 border border-amber-900/40">
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div className="truncate">
                <span className="font-bold text-amber-300">ملاحظة سرية لك: </span>
                <span className="text-stone-300">{property.privateAgentNotes}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
          <button
            onClick={() => onSelect(property)}
            className="flex-1 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>عرض التفاصيل الكاملة</span>
          </button>

          <button
            onClick={handleWhatsApp}
            title="تواصل واتساب بخصوص هذا العقار"
            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-colors shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {isAgentMode && onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(property);
              }}
              title="تعديل العقار (وضع الوسيط)"
              className="px-2.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-colors shrink-0"
            >
              تعديل
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
