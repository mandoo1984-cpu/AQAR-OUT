import React, { useState } from 'react';
import { Property } from '../types';
import { useRealEstate } from '../context/RealEstateContext';
import { 
  formatCurrency, 
  PROPERTY_TYPE_LABELS, 
  PURPOSE_LABELS, 
  FINISHING_LABELS 
} from '../utils/helpers';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Layers, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  Send, 
  Calculator, 
  Heart, 
  ShieldAlert, 
  Lock, 
  Share2, 
  Calendar,
  Sparkles,
  Printer
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onEdit?: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ property, onClose, onEdit }) => {
  const { 
    favorites, 
    toggleFavorite, 
    isAgentMode, 
    addInquiry, 
    clients, 
    deleteProperty,
    setActiveTab
  } = useRealEstate();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('أرغب في تحديد موعد للمعاينة ومعرفة خطة السداد بالتفصيل.');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Installment Calculator internal state for this property
  const [customDownPaymentPercent, setCustomDownPaymentPercent] = useState<number>(15);
  const [customYears, setCustomYears] = useState<number>(7);

  if (!property) return null;

  const isFav = favorites.includes(property.id);

  // Calculations
  const calculatedDownPayment = (property.price * customDownPaymentPercent) / 100;
  const remainingAmount = property.price - calculatedDownPayment;
  const totalMonths = customYears * 12;
  const calculatedMonthly = totalMonths > 0 ? Math.round(remainingAmount / totalMonths) : 0;

  // Find clients interested in this property from agent database
  const interestedClients = isAgentMode 
    ? clients.filter(c => c.interestedPropertyId === property.id || (c.targetAreas && c.targetAreas.includes(property.areaName)))
    : [];

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) return;

    addInquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      clientName: inquiryName.trim(),
      clientPhone: inquiryPhone.trim(),
      message: inquiryMsg.trim(),
    });

    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setInquiryName('');
      setInquiryPhone('');
    }, 4000);
  };

  const handleWhatsApp = () => {
    const phone = property.contactWhatsApp || '201001234567';
    const text = encodeURIComponent(`مرحباً، أود الاستفسار عن العقار: ${property.title}\nالسعر: ${formatCurrency(property.price)}\nالمنطقة: ${property.areaName}`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `عقار مميز في ${property.areaName} بسعر ${formatCurrency(property.price)}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ رابط العقار بنجاح!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[94vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-white/95 backdrop-blur-md flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
              property.purpose === 'sale' ? 'bg-amber-600 text-white' : 'bg-teal-700 text-white'
            }`}>
              {PURPOSE_LABELS[property.purpose]}
            </span>
            <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-lg text-xs font-semibold">
              {PROPERTY_TYPE_LABELS[property.type]}
            </span>
            <span className="text-xs text-stone-500 font-mono hidden sm:inline">
              كود: #{property.id.slice(-6)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(property.id)}
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="إضافة للمفضلة"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
              title="مشاركة العقار"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors hidden sm:block"
              title="طباعة بطاقة العقار"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {/* Agent Confidential Banner if Agent Mode */}
          {isAgentMode && (
            <div className="p-4 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-amber-100 rounded-2xl border border-amber-800/50 shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 mt-0.5">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                      <span>ملاحظات الوسيط السرية (خاصة بك أنت فقط ولا يراها الزوار)</span>
                    </h4>
                    <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                      {property.privateAgentNotes || 'لا توجد ملاحظات سرية إضافية مسجلة لهذا العقار.'}
                    </p>
                    {interestedClients.length > 0 && (
                      <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] text-amber-300 font-semibold">عملاء في سجلك مهتمون بهذا النوع:</span>
                        {interestedClients.map(c => (
                          <span 
                            key={c.id} 
                            onClick={() => {
                              onClose();
                              setActiveTab('clients');
                            }}
                            className="bg-white/10 hover:bg-white/20 text-white text-[11px] px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                          >
                            {c.name} ({c.phone})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {onEdit && (
                  <button
                    onClick={() => {
                      onClose();
                      onEdit(property);
                    }}
                    className="shrink-0 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    تعديل بيانات العقار
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Gallery Section */}
          <div>
            <div className="relative aspect-16/9 sm:aspect-21/9 rounded-2xl overflow-hidden bg-stone-900 shadow-inner">
              <img
                src={property.images[activeImageIdx] || property.images[0]}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-stone-950/75 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-xl">
                صورة {activeImageIdx + 1} من {property.images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {property.images.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIdx === idx ? 'border-amber-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title and Pricing Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2 text-stone-500 text-xs mb-1.5">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-stone-700">{property.areaName}</span>
                {property.compound && (
                  <>
                    <span>•</span>
                    <span className="text-amber-800 font-medium">{property.compound}</span>
                  </>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
                {property.title}
              </h1>
              <p className="text-xs text-stone-500 mt-1">{property.address}</p>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 text-left md:text-right shrink-0">
              <span className="text-xs text-stone-500 block font-medium">السعر المطلوب</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-950 font-mono">
                {formatCurrency(property.price, property.currency)}
              </div>
              <span className="text-[11px] text-stone-500">
                متوسط سعر المتر: <strong className="font-mono text-stone-700">{formatCurrency(Math.round(property.price / property.sizeSqM))} / م²</strong>
              </span>
            </div>
          </div>

          {/* Main Specs Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-stone-500 block font-medium">المساحة الإجمالية</span>
                <span className="text-sm font-bold text-stone-900">{property.sizeSqM} متر مربع</span>
              </div>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-stone-500 block font-medium">غرف النوم</span>
                <span className="text-sm font-bold text-stone-900">{property.bedrooms} غرف</span>
              </div>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-stone-500 block font-medium">الحمامات</span>
                <span className="text-sm font-bold text-stone-900">{property.bathrooms} حمامات</span>
              </div>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-stone-500 block font-medium">الدور والاستلام</span>
                <span className="text-sm font-bold text-stone-900">{property.floor || property.deliveryYear}</span>
              </div>
            </div>
          </div>

          {/* Description & Detailed Features */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Detailed Description */}
              <div>
                <h3 className="text-base font-bold text-stone-900 mb-2.5 flex items-center gap-2">
                  <span>وصف العقار والمواصفات</span>
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line bg-stone-50/70 p-4 rounded-2xl border border-stone-200/70">
                  {property.description}
                </p>
              </div>

              {/* Finishing and Specifications Table */}
              <div>
                <h3 className="text-base font-bold text-stone-900 mb-2.5">المواصفات الفنية والتشطيب</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">نوع التشطيب</span>
                    <strong className="text-stone-900">{FINISHING_LABELS[property.finishing]}</strong>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">موعد الاستلام</span>
                    <strong className="text-stone-900">{property.deliveryYear}</strong>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">نوع العرض</span>
                    <strong className="text-stone-900">{PURPOSE_LABELS[property.purpose]}</strong>
                  </div>
                  {property.downPayment && (
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                      <span className="text-stone-500 block">مقدم الحجز</span>
                      <strong className="text-amber-900 font-mono">{formatCurrency(property.downPayment)}</strong>
                    </div>
                  )}
                  {property.installmentYears && (
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                      <span className="text-stone-500 block">سنوات التقسيط</span>
                      <strong className="text-stone-900">{property.installmentYears} سنوات</strong>
                    </div>
                  )}
                  {property.monthlyInstallment && (
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                      <span className="text-stone-500 block">القسط الشهري التقريبي</span>
                      <strong className="text-amber-900 font-mono">{formatCurrency(property.monthlyInstallment)}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Features & Amenities Checklist */}
              {property.features && property.features.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-stone-900 mb-2.5">المميزات والخدمات الملحقة</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {property.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl text-xs font-medium text-stone-800 border border-stone-200/60">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Installments Calculator for this Property */}
              {property.purpose === 'sale' && (
                <div className="p-5 bg-gradient-to-br from-amber-50/80 to-stone-50 rounded-2xl border border-amber-200/80">
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="w-5 h-5 text-amber-700" />
                    <h3 className="text-base font-bold text-stone-900">حاسبة خطة السداد والأقساط لهذا العقار</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-4">
                    <div>
                      <div className="flex justify-between font-medium mb-1 text-stone-700">
                        <span>نسبة المقدم:</span>
                        <strong className="text-amber-800 font-mono">{customDownPaymentPercent}% ({formatCurrency(calculatedDownPayment)})</strong>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        step="5"
                        value={customDownPaymentPercent}
                        onChange={e => setCustomDownPaymentPercent(Number(e.target.value))}
                        className="w-full accent-amber-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-medium mb-1 text-stone-700">
                        <span>فترة السداد:</span>
                        <strong className="text-amber-800 font-mono">{customYears} سنوات ({totalMonths} شهر)</strong>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={customYears}
                        onChange={e => setCustomYears(Number(e.target.value))}
                        className="w-full accent-amber-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-amber-200 text-center">
                    <div>
                      <span className="text-[11px] text-stone-500 block">المقدم المطلوب</span>
                      <strong className="text-sm sm:text-base font-extrabold text-amber-900 font-mono">
                        {formatCurrency(calculatedDownPayment)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block">القسط الشهري المتوقع</span>
                      <strong className="text-sm sm:text-base font-extrabold text-amber-900 font-mono">
                        {formatCurrency(calculatedMonthly)} / شهرياً
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar: Inquiry & Direct Contact Form */}
            <div className="space-y-4">
              {/* Direct Booking / Inquiry Box */}
              <div className="bg-stone-900 text-white p-5 rounded-3xl shadow-lg border border-stone-800">
                <h3 className="text-base font-bold text-amber-200 mb-1">طلب معاينة أو تفاصيل إضافية</h3>
                <p className="text-xs text-stone-400 mb-4 leading-relaxed">
                  سجل بياناتك وسيتم التواصل معك مباشرة لتنسيق المعاينة أو إرسال كراسة الشروط.
                </p>

                {inquirySubmitted ? (
                  <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-center text-emerald-200 text-xs">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="font-bold text-sm">تم استلام طلبك بنجاح!</p>
                    <p className="mt-1 text-stone-300">تم حفظ الطلب وإرساله إلى مستشار العقارات وسيتواصل معك خلال ساعات.</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-stone-300 mb-1">الاسم الكريم</label>
                      <input
                        type="text"
                        required
                        value={inquiryName}
                        onChange={e => setInquiryName(e.target.value)}
                        placeholder="مثال: م. أحمد محمود"
                        className="w-full py-2 px-3 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-300 mb-1">رقم الهاتف / الواتساب</label>
                      <input
                        type="tel"
                        required
                        value={inquiryPhone}
                        onChange={e => setInquiryPhone(e.target.value)}
                        placeholder="010XXXXXXXX"
                        dir="ltr"
                        className="w-full py-2 px-3 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 text-right focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-300 mb-1">رسالتك أو الموعد المفضل</label>
                      <textarea
                        rows={2}
                        value={inquiryMsg}
                        onChange={e => setInquiryMsg(e.target.value)}
                        className="w-full py-2 px-3 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>إرسال طلب المعاينة والاستفسار</span>
                    </button>
                  </form>
                )}

                {/* Instant WhatsApp & Call Buttons */}
                <div className="mt-4 pt-4 border-t border-stone-800 space-y-2">
                  <span className="text-[11px] text-stone-400 block text-center">أو تواصل فورياً عبر:</span>
                  <button
                    onClick={handleWhatsApp}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>محادثة واتساب مباشرة</span>
                  </button>

                  <a
                    href={`tel:${property.contactPhone || '01001234567'}`}
                    className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>اتصال هاتفي: {property.contactPhone || '01001234567'}</span>
                  </a>
                </div>
              </div>

              {/* Safety & Integrity Guarantee Badge */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs text-stone-600 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-stone-900 block font-bold">معاينة آمنة وتوثيق قانوني</strong>
                  جميع العقارات المعروضة مراجعة أوراقها وتراخيصها، والمعاينة مجانية برفقة مستشار العقارات.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
