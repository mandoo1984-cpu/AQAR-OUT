import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Apple, CheckCircle2, X, Share2, PlusSquare, ExternalLink } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already running standalone inside installed app, don't show install button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer border border-amber-500/40"
        title="تثبيت التطبيق على هاتفك المحمول"
      >
        <Smartphone className="w-3.5 h-3.5 animate-pulse" />
        <span>تثبيت كتطبيق موبايل</span>
      </button>

      {/* Guide Modal for iPhone, Android, and Desktop */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 text-stone-900 relative my-auto max-h-[92vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black shadow-md">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900">
                  تشغيل وتثبيت «عقاراتي» كتطبيق هاتف
                </h3>
                <p className="text-xs text-stone-500">
                  ليكون معك دائماً بأيقونة على الشاشة الرئيسية بدون متجر تطبيقات.
                </p>
              </div>
            </div>

            {/* Direct install action if supported by browser */}
            {isInstallable && (
              <div className="mb-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                <p className="text-xs text-amber-900 font-bold mb-2">
                  متصفحك يدعم التثبيت المباشر بنقرة واحدة!
                </p>
                <button
                  onClick={async () => {
                    await install();
                    setShowModal(false);
                  }}
                  className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>تثبيت فوري الآن</span>
                </button>
              </div>
            )}

            {/* Step-by-step instructions */}
            <div className="space-y-4 text-xs">
              {/* Android Instructions */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-2 font-bold text-stone-900 mb-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>لهواتف الأندرويد (Google Chrome):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-stone-600 text-[11px] leading-relaxed">
                  <li>افتح الرابط في متصفح <strong>Chrome</strong> على هاتفك.</li>
                  <li>اضغط على أيقونة القائمة (<strong>الثلاث نقاط ⋮</strong>) أعلى اليمين.</li>
                  <li>اختر <strong>«تثبيت التطبيق»</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.</li>
                  <li>سيظهر التطبيق بأيقونة «عقاراتي» على شاشة هاتفك مثل أي تطبيق مثبت.</li>
                </ol>
              </div>

              {/* iPhone iOS Instructions */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-2 font-bold text-stone-900 mb-1.5">
                  <Apple className="w-4 h-4 text-stone-800" />
                  <span>لهواتف الآيفون والآيباد (Apple Safari):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-stone-600 text-[11px] leading-relaxed">
                  <li>افتح الرابط في متصفح <strong>Safari</strong>.</li>
                  <li>اضغط على زر <strong>المشاركة (Share <Share2 className="inline w-3 h-3 text-sky-600" />)</strong> أسفل الشاشة.</li>
                  <li>مرر لأسفل واضغط على <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen <PlusSquare className="inline w-3 h-3 text-amber-700" />)</strong>.</li>
                  <li>اضغط <strong>إضافة (Add)</strong>، وسيتم وضعه كتطبيق مستقل.</li>
                </ol>
              </div>

              {/* Why this is safe for your client data */}
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>ميزة الأمان والخصوصية:</strong> عندما تثبته على هاتفك، يتم تخزين بيانات عملائك وأرقامهم وملاحظاتك السرية داخل مساحة هاتفك فقط، ومحمية برمز PIN الخاص بك!
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-200">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 bg-stone-900 text-stone-200 hover:bg-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                حسناً، فهمت
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
