import React from 'react';
import { Building2, ShieldCheck, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';

interface FooterProps {
  onOpenPinModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPinModal }) => {
  const { setActiveTab, isAgentMode } = useRealEstate();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">عقاراتي | DARAK</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-md">
              منصة عقارية متكاملة لعرض وتفصيل أفخم العقارات والكمبوندات السكنية والتجارية، مع نظام إدارة خاص وسري لحفظ بيانات العملاء وطلباتهم للوسيط العقاري فقط.
            </p>
            <div className="flex items-center gap-2 text-stone-400 text-[11px] pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>خصوصية تامة: بيانات العملاء والملاحظات السرية مشفرة محلياً ولا يتم مشاركتها</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-amber-200 text-sm mb-3">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('properties')} className="hover:text-white transition-colors cursor-pointer">
                  تصفح العقارات المتاحة
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('areas')} className="hover:text-white transition-colors cursor-pointer">
                  دليل المناطق والأحياء
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('calculator')} className="hover:text-white transition-colors cursor-pointer">
                  حاسبة الأقساط والتمويل
                </button>
              </li>
              {!isAgentMode && (
                <li>
                  <button onClick={onOpenPinModal} className="hover:text-amber-400 font-semibold transition-colors cursor-pointer flex items-center gap-1">
                    <span>دخول الوسيط 🔒 (سجل العملاء)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-2">
            <h4 className="font-bold text-amber-200 text-sm mb-3">تواصل مع المستشار العقاري</h4>
            <p className="text-stone-400 text-xs">
              للمعاينة المباشرة أو طلب عروض استثمارية خاصة:
            </p>
            <div className="space-y-1.5 pt-1 text-stone-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span dir="ltr">0100 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>advisor@darak-realestate.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>القاهرة الجديدة والشيخ زايد</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-stone-500 text-[11px] gap-2">
          <span>© {new Date().getFullYear()} عقاراتي - جميع الحقوق محفوظة للمستشار والوسيط العقاري.</span>
          <span className="flex items-center gap-1">
            <span>نظام بيانات العملاء الآمن والخاص</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
