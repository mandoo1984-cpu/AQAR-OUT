import React, { useState } from 'react';
import { useRealEstate } from '../context/RealEstateContext';
import { ShieldCheck, Lock, KeyRound, AlertCircle, X } from 'lucide-react';

interface PINModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PINModal: React.FC<PINModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { unlockAgentMode, agentPin } = useRealEstate();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockAgentMode(pin)) {
      setError(false);
      setPin('');
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  const handleQuickDigit = (digit: string) => {
    if (pin.length < 8) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-7 h-7 text-amber-400" />
          </div>

          <h2 className="text-xl font-bold mb-1 text-amber-100">خزينة بيانات العملاء السرية</h2>
          <p className="text-xs text-stone-300 max-w-xs mx-auto leading-relaxed">
            قسم خاص بالوسيط والمسؤول العقاري فقط، لحماية أرقام وهويات وملاحظات عملائك عن زوار الموقع.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-xs font-bold text-stone-700 mb-2 text-center">
                أدخل رمز المرور السري (PIN)
              </label>

              {/* Pin Display Dots */}
              <div className="flex justify-center items-center gap-3 mb-4">
                {[0, 1, 2, 3].map(idx => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full transition-all ${
                      pin.length > idx
                        ? 'bg-amber-600 scale-110 shadow-xs'
                        : 'bg-stone-200 border border-stone-300'
                    }`}
                  />
                ))}
              </div>

              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={e => {
                    setPin(e.target.value);
                    setError(false);
                  }}
                  maxLength={8}
                  placeholder="••••"
                  autoFocus
                  className="w-full text-center tracking-widest text-2xl font-mono py-2.5 px-4 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
                />
                <KeyRound className="absolute right-3 top-3.5 w-5 h-5 text-stone-400 pointer-events-none" />
              </div>

              {error && (
                <div className="mt-2.5 p-2 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs font-semibold animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>رمز المرور غير صحيح! حاول مرة أخرى.</span>
                </div>
              )}
            </div>

            {/* Numeric Keypad for fast tap */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleQuickDigit(num)}
                  className="py-2.5 text-lg font-bold text-stone-800 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 rounded-xl transition-all cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPin('')}
                className="py-2.5 text-xs font-bold text-stone-500 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all"
              >
                مسح
              </button>
              <button
                type="button"
                onClick={() => handleQuickDigit('0')}
                className="py-2.5 text-lg font-bold text-stone-800 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 rounded-xl transition-all"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-2.5 text-xs font-bold text-stone-500 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all"
              >
                ← حذف
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={pin.length === 0}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>فتح لوحة بيانات العملاء الخاصة</span>
            </button>
          </form>

          {/* Default PIN reminder */}
          <div className="mt-4 pt-3 border-t border-stone-100 text-center">
            <span className="text-[11px] text-stone-500">
              الرمز الافتراضي للتجربة: <strong className="font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">1234</strong> (يمكنك تغييره من الإعدادات الداخلية)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
