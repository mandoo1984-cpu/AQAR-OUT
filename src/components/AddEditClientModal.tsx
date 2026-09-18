import React, { useState, useEffect } from 'react';
import { Client, ClientType, ClientStatus, ClientPriority } from '../types';
import { useRealEstate } from '../context/RealEstateContext';
import { 
  CLIENT_TYPE_LABELS, 
  CLIENT_STATUS_LABELS, 
  CLIENT_PRIORITY_LABELS,
  PROPERTY_TYPE_LABELS 
} from '../utils/helpers';
import { X, User, Phone, Mail, DollarSign, MapPin, Building, Lock, Calendar, Save } from 'lucide-react';

interface AddEditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientToEdit?: Client | null;
}

export const AddEditClientModal: React.FC<AddEditClientModalProps> = ({ isOpen, onClose, clientToEdit }) => {
  const { addClient, updateClient, properties, areas } = useRealEstate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [clientType, setClientType] = useState<ClientType>('buyer');
  const [status, setStatus] = useState<ClientStatus>('new');
  const [priority, setPriority] = useState<ClientPriority>('medium');
  const [budgetMin, setBudgetMin] = useState<number>(5000000);
  const [budgetMax, setBudgetMax] = useState<number>(10000000);
  const [targetAreas, setTargetAreas] = useState<string[]>([]);
  const [targetPropertyType, setTargetPropertyType] = useState<string[]>([]);
  const [interestedPropertyId, setInterestedPropertyId] = useState<string>('');
  const [privateNotes, setPrivateNotes] = useState('');
  const [commissionAgreed, setCommissionAgreed] = useState('2.5% من إجمالي الصفقة');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name);
      setPhone(clientToEdit.phone);
      setWhatsapp(clientToEdit.whatsapp || clientToEdit.phone);
      setEmail(clientToEdit.email || '');
      setClientType(clientToEdit.clientType);
      setStatus(clientToEdit.status);
      setPriority(clientToEdit.priority);
      setBudgetMin(clientToEdit.budgetMin);
      setBudgetMax(clientToEdit.budgetMax);
      setTargetAreas(clientToEdit.targetAreas || []);
      setTargetPropertyType(clientToEdit.targetPropertyType || []);
      setInterestedPropertyId(clientToEdit.interestedPropertyId || '');
      setPrivateNotes(clientToEdit.privateNotes || '');
      setCommissionAgreed(clientToEdit.commissionAgreed || '');
      setNextFollowUpDate(clientToEdit.nextFollowUpDate || '');
    } else {
      // Default reset
      setName('');
      setPhone('');
      setWhatsapp('');
      setEmail('');
      setClientType('buyer');
      setStatus('new');
      setPriority('medium');
      setBudgetMin(5000000);
      setBudgetMax(10000000);
      setTargetAreas([areas[0]?.name || 'التجمع الخامس والقاهرة الجديدة']);
      setTargetPropertyType(['apartment']);
      setInterestedPropertyId('');
      setPrivateNotes('');
      setCommissionAgreed('2.5%');
      setNextFollowUpDate('');
    }
  }, [clientToEdit, isOpen, areas]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('يرجى كتابة اسم العميل ورقم الهاتف.');
      return;
    }

    const linkedProp = properties.find(p => p.id === interestedPropertyId);

    const clientData = {
      name: name.trim(),
      phone: phone.trim(),
      whatsapp: (whatsapp.trim() || phone.trim()).replace(/^0/, '20'),
      email: email.trim(),
      clientType,
      status,
      priority,
      budgetMin: Number(budgetMin) || 0,
      budgetMax: Number(budgetMax) || 0,
      currency: 'ج.م',
      targetAreas,
      targetPropertyType,
      interestedPropertyId: interestedPropertyId || undefined,
      interestedPropertyTitle: linkedProp ? linkedProp.title : undefined,
      privateNotes: privateNotes.trim(),
      commissionAgreed: commissionAgreed.trim(),
      nextFollowUpDate: nextFollowUpDate || undefined,
      lastContactDate: new Date().toISOString().slice(0, 10),
    };

    if (clientToEdit) {
      updateClient({
        ...clientData,
        id: clientToEdit.id,
        createdAt: clientToEdit.createdAt,
      });
    } else {
      addClient(clientData);
    }

    onClose();
  };

  const handleToggleArea = (areaName: string) => {
    setTargetAreas(prev =>
      prev.includes(areaName) ? prev.filter(a => a !== areaName) : [...prev, areaName]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-100">
                {clientToEdit ? 'تعديل بيانات العميل السريّة' : 'تسجيل عميل جديد في سجلك الخاص'}
              </h2>
              <p className="text-xs text-stone-300">
                هذه البيانات سرية وخاصة بك فقط ولا يمكن لزوار الموقع الوصول إليها مطلقاً.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1 text-xs">
          {/* Row 1: Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">اسم العميل بالكامل *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="مثال: م. وائل الشريف"
                  className="w-full py-2 px-3 pr-8 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-600 focus:outline-none"
                />
                <User className="absolute right-2.5 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">رقم الهاتف للتواصل *</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  dir="ltr"
                  className="w-full py-2 px-3 pr-8 bg-stone-50 border border-stone-300 rounded-xl text-right focus:ring-1 focus:ring-amber-600 focus:outline-none"
                />
                <Phone className="absolute right-2.5 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 2: WhatsApp & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">رقم الواتساب (إذا كان مختلفاً)</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                placeholder="201XXXXXXXXX"
                dir="ltr"
                className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl text-right focus:ring-1 focus:ring-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">البريد الإلكتروني (اختياري)</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="client@example.com"
                  dir="ltr"
                  className="w-full py-2 px-3 pr-8 bg-stone-50 border border-stone-300 rounded-xl text-right focus:ring-1 focus:ring-amber-600 focus:outline-none"
                />
                <Mail className="absolute right-2.5 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 3: Client Type, Status, Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">نوع العميل</label>
              <select
                value={clientType}
                onChange={e => setClientType(e.target.value as ClientType)}
                className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-600 focus:outline-none"
              >
                {Object.entries(CLIENT_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">حالة العميل / المرحلة</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ClientStatus)}
                className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-600 focus:outline-none"
              >
                {Object.entries(CLIENT_STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">درجة الأولوية والاهتمام</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as ClientPriority)}
                className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-600 focus:outline-none"
              >
                {Object.entries(CLIENT_PRIORITY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Budget Range */}
          <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200">
            <span className="font-bold text-stone-800 block mb-2 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-700" />
              <span>ميزانية العميل (القدرة المالية المتاحة)</span>
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-stone-600 mb-1">الحد الأدنى (ج.م)</label>
                <input
                  type="number"
                  step="100000"
                  value={budgetMin}
                  onChange={e => setBudgetMin(Number(e.target.value))}
                  className="w-full py-1.5 px-3 bg-white border border-stone-300 rounded-xl font-mono text-stone-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-600 mb-1">الحد الأقصى (ج.م)</label>
                <input
                  type="number"
                  step="100000"
                  value={budgetMax}
                  onChange={e => setBudgetMax(Number(e.target.value))}
                  className="w-full py-1.5 px-3 bg-white border border-stone-300 rounded-xl font-mono text-stone-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Target Areas Checkboxes */}
          <div>
            <label className="block font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-700" />
              <span>المناطق المفضلة للعميل</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {areas.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => handleToggleArea(a.name)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    targetAreas.includes(a.name)
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </div>

          {/* Row 6: Linked Property */}
          <div>
            <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-amber-700" />
              <span>ربط بعقار معين من المعروضات (اختياري)</span>
            </label>
            <select
              value={interestedPropertyId}
              onChange={e => setInterestedPropertyId(e.target.value)}
              className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-600 focus:outline-none"
            >
              <option value="">-- بدون ربط مباشر بعقار محدد --</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.areaName})
                </option>
              ))}
            </select>
          </div>

          {/* Row 7: CONFIDENTIAL NOTES FOR AGENT ONLY */}
          <div className="p-4 bg-stone-900 text-amber-100 rounded-2xl border border-amber-900/60 shadow-inner">
            <div className="flex items-center gap-2 mb-2 font-bold text-amber-300">
              <Lock className="w-4 h-4" />
              <span>ملاحظات الوسيط السرية (خاصة بك فقط، سر الصفقة)</span>
            </div>
            <textarea
              rows={3}
              value={privateNotes}
              onChange={e => setPrivateNotes(e.target.value)}
              placeholder="سجل هنا أدق التفاصيل السرية: مثلاً (العميل يدفع كاش، الميزانية الحقيقية غير المعلنة 15 مليون، يفضل المعاينة في عطلة نهاية الأسبوع، نسبة العمولة المتفق عليها...)"
              className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400 text-xs leading-relaxed"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-[11px] text-amber-200/80 mb-1">العمولة المتفق عليها</label>
                <input
                  type="text"
                  value={commissionAgreed}
                  onChange={e => setCommissionAgreed(e.target.value)}
                  placeholder="مثال: 2.5% صافي (حوالي 250,000 ج.م)"
                  className="w-full py-1.5 px-3 bg-stone-800 border border-stone-700 rounded-xl text-amber-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-amber-200/80 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>تاريخ المتابعة أو المعاينة القادمة</span>
                </label>
                <input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={e => setNextFollowUpDate(e.target.value)}
                  className="w-full py-1.5 px-3 bg-stone-800 border border-stone-700 rounded-xl text-amber-200 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{clientToEdit ? 'حفظ التعديلات في السجل السري' : 'إضافة العميل إلى سجلك السري'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
