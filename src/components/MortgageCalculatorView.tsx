import React, { useState } from 'react';
import { useRealEstate } from '../context/RealEstateContext';
import { formatCurrency } from '../utils/helpers';
import { Calculator, DollarSign, Calendar, Percent, ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';

export const MortgageCalculatorView: React.FC = () => {
  const { properties, setSelectedProperty, setActiveTab } = useRealEstate();

  const [totalPrice, setTotalPrice] = useState<number>(8000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [years, setYears] = useState<number>(7);
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(8); // interest or admin fees

  // Calculations
  const downPaymentAmount = (totalPrice * downPaymentPercent) / 100;
  const loanAmount = totalPrice - downPaymentAmount;
  const totalMonths = years * 12;

  // Monthly interest calculation
  const monthlyRate = (annualInterestRate / 100) / 12;
  let monthlyPayment = 0;
  let totalPayable = totalPrice;
  let totalInterest = 0;

  if (monthlyRate > 0 && totalMonths > 0) {
    monthlyPayment = (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    totalPayable = downPaymentAmount + (monthlyPayment * totalMonths);
    totalInterest = totalPayable - totalPrice;
  } else if (totalMonths > 0) {
    monthlyPayment = loanAmount / totalMonths;
  }

  // Find properties in matching price range
  const matchingProperties = properties.filter(
    p => p.price >= totalPrice * 0.8 && p.price <= totalPrice * 1.2
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-stone-900 text-white rounded-3xl p-6 shadow-xl border border-amber-800/40">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-amber-100">
            حاسبة التمويل والأقساط العقارية الذكية
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
          احسب قيمة المقدم المطلوب، القسط الشهري، ومدة التقسيط بدقة لتحديد الخطة المالية الأنسب لميزانيتك وميزانية عملائك.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
          {/* Total Price */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-700" />
                <span>سعر العقار الإجمالي</span>
              </label>
              <span className="text-lg font-black text-amber-900 font-mono">
                {formatCurrency(totalPrice)}
              </span>
            </div>
            <input
              type="range"
              min="1000000"
              max="50000000"
              step="250000"
              value={totalPrice}
              onChange={e => setTotalPrice(Number(e.target.value))}
              className="w-full accent-amber-700 cursor-pointer h-2 bg-stone-100 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-mono">
              <span>1 مليون ج.م</span>
              <span>25 مليون ج.م</span>
              <span>50 مليون ج.م</span>
            </div>
          </div>

          {/* Down Payment */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-bold text-stone-900 text-sm">
                نسبة المقدم المطلوب ({downPaymentPercent}%)
              </label>
              <span className="text-sm font-bold text-stone-700 font-mono">
                {formatCurrency(downPaymentAmount)}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={downPaymentPercent}
              onChange={e => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-amber-700 cursor-pointer h-2 bg-stone-100 rounded-lg"
            />
            <div className="flex gap-2 mt-2">
              {[10, 15, 20, 25, 30].map(pct => (
                <button
                  key={pct}
                  onClick={() => setDownPaymentPercent(pct)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    downPaymentPercent === pct
                      ? 'bg-amber-700 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Installment Years */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>مدة التقسيط والسداد</span>
              </label>
              <span className="text-sm font-bold text-stone-700 font-mono">
                {years} سنوات ({totalMonths} شهر)
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={years}
              onChange={e => setYears(Number(e.target.value))}
              className="w-full accent-amber-700 cursor-pointer h-2 bg-stone-100 rounded-lg"
            />
            <div className="flex gap-2 mt-2">
              {[3, 5, 7, 8, 10].map(yr => (
                <button
                  key={yr}
                  onClick={() => setYears(yr)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    years === yr
                      ? 'bg-amber-700 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {yr} سنوات
                </button>
              ))}
            </div>
          </div>

          {/* Interest / Annual Return Rate */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-amber-700" />
                <span>معدل الفائدة السنوية أو المصاريف الإدارية</span>
              </label>
              <span className="text-sm font-bold text-stone-700 font-mono">
                {annualInterestRate}% (0% للتقسيط المباشر مع المطور)
              </span>
            </div>
            <div className="flex gap-2">
              {[0, 5, 8, 12, 16].map(rate => (
                <button
                  key={rate}
                  onClick={() => setAnnualInterestRate(rate)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    annualInterestRate === rate
                      ? 'bg-amber-700 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {rate === 0 ? 'بدون فوائد (مطور)' : `${rate}%`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Summary Box */}
        <div className="space-y-4">
          <div className="bg-stone-900 text-white rounded-3xl p-6 shadow-xl border border-stone-800 flex flex-col justify-between">
            <div>
              <span className="text-xs text-amber-400 font-bold block mb-1">ملخص خطة السداد المقدرة</span>
              <h3 className="text-xl font-black text-white mb-4">القسط الشهري المتوقع</h3>

              {/* Monthly payment hero */}
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10 text-center mb-4">
                <span className="text-[11px] text-stone-300 block mb-1">القسط الشهري</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                  {formatCurrency(Math.round(monthlyPayment))}
                </div>
                <span className="text-[10px] text-stone-400">شهرياً لمدة {years} سنوات</span>
              </div>

              {/* Financial Breakdown Table */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/10">
                  <span className="text-stone-400">سعر العقار الأساسي:</span>
                  <span className="font-mono font-bold">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/10">
                  <span className="text-stone-400">المقدم ({downPaymentPercent}%):</span>
                  <span className="font-mono font-bold text-amber-300">{formatCurrency(downPaymentAmount)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/10">
                  <span className="text-stone-400">المبلغ المتبقي للتقسيط:</span>
                  <span className="font-mono font-bold">{formatCurrency(loanAmount)}</span>
                </div>
                {totalInterest > 0 && (
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-stone-400">إجمالي الفوائد / المصاريف:</span>
                    <span className="font-mono font-bold text-rose-300">{formatCurrency(Math.round(totalInterest))}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 font-bold text-sm">
                  <span className="text-stone-200">إجمالي المدفوعات:</span>
                  <span className="font-mono text-amber-200">{formatCurrency(Math.round(totalPayable))}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800">
              <button
                onClick={() => setActiveTab('properties')}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>استعراض العقارات المتاحة لهذا السعر</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Properties in this price range */}
      {matchingProperties.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-700" />
              <span>عقارات مقترحة في حدود هذه الميزانية ({matchingProperties.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingProperties.slice(0, 3).map(prop => (
              <div
                key={prop.id}
                onClick={() => setSelectedProperty(prop)}
                className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-shadow cursor-pointer flex gap-3 items-center"
              >
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="truncate">
                  <span className="text-[11px] text-amber-700 font-semibold block">{prop.areaName}</span>
                  <h4 className="font-bold text-stone-900 text-xs truncate">{prop.title}</h4>
                  <span className="text-sm font-black text-stone-900 font-mono block mt-1">
                    {formatCurrency(prop.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
