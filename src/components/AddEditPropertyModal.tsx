import React, { useState, useEffect } from 'react';
import { Property, PropertyType, PropertyPurpose, FinishingType } from '../types';
import { useRealEstate } from '../context/RealEstateContext';
import { PROPERTY_TYPE_LABELS, PURPOSE_LABELS, FINISHING_LABELS } from '../utils/helpers';
import { X, Building, DollarSign, MapPin, Layers, Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface AddEditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyToEdit?: Property | null;
}

export const AddEditPropertyModal: React.FC<AddEditPropertyModalProps> = ({
  isOpen,
  onClose,
  propertyToEdit,
}) => {
  const { addProperty, updateProperty, areas } = useRealEstate();

  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState<PropertyPurpose>('sale');
  const [type, setType] = useState<PropertyType>('apartment');
  const [areaId, setAreaId] = useState('');
  const [compound, setCompound] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState<number>(5000000);
  const [downPayment, setDownPayment] = useState<number>(500000);
  const [installmentYears, setInstallmentYears] = useState<number>(7);
  const [monthlyInstallment, setMonthlyInstallment] = useState<number>(53500);
  const [deliveryYear, setDeliveryYear] = useState('استلام فوري');
  const [finishing, setFinishing] = useState<FinishingType>('ultra_super_lux');
  const [sizeSqM, setSizeSqM] = useState<number>(180);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [floor, setFloor] = useState('الدور الثالث');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([
    'أمن وحراسة 24 ساعة',
    'مصعد حديث',
    'إطلالة على مساحات خضراء',
  ]);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [privateAgentNotes, setPrivateAgentNotes] = useState('');
  const [contactPhone, setContactPhone] = useState('01001234567');
  const [contactWhatsApp, setContactWhatsApp] = useState('201001234567');

  useEffect(() => {
    if (areas.length > 0 && !areaId) {
      setAreaId(areas[0].id);
    }
  }, [areas, areaId]);

  useEffect(() => {
    if (propertyToEdit) {
      setTitle(propertyToEdit.title);
      setPurpose(propertyToEdit.purpose);
      setType(propertyToEdit.type);
      setAreaId(propertyToEdit.areaId);
      setCompound(propertyToEdit.compound || '');
      setAddress(propertyToEdit.address);
      setPrice(propertyToEdit.price);
      setDownPayment(propertyToEdit.downPayment || 0);
      setInstallmentYears(propertyToEdit.installmentYears || 0);
      setMonthlyInstallment(propertyToEdit.monthlyInstallment || 0);
      setDeliveryYear(propertyToEdit.deliveryYear);
      setFinishing(propertyToEdit.finishing);
      setSizeSqM(propertyToEdit.sizeSqM);
      setBedrooms(propertyToEdit.bedrooms);
      setBathrooms(propertyToEdit.bathrooms);
      setFloor(propertyToEdit.floor || '');
      setImages(propertyToEdit.images || []);
      setFeatured(propertyToEdit.featured);
      setDescription(propertyToEdit.description);
      setFeatures(propertyToEdit.features || []);
      setPrivateAgentNotes(propertyToEdit.privateAgentNotes || '');
      setContactPhone(propertyToEdit.contactPhone || '01001234567');
      setContactWhatsApp(propertyToEdit.contactWhatsApp || '201001234567');
    } else {
      setTitle('');
      setPurpose('sale');
      setType('apartment');
      setCompound('');
      setAddress('');
      setPrice(6500000);
      setDownPayment(650000);
      setInstallmentYears(7);
      setMonthlyInstallment(69600);
      setDeliveryYear('استلام فوري');
      setFinishing('ultra_super_lux');
      setSizeSqM(185);
      setBedrooms(3);
      setBathrooms(2);
      setFloor('الدور الثاني');
      setImages(['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']);
      setFeatured(false);
      setDescription('عقار مميز بموقع استراتيجي بالقرب من كافة الخدمات والمراكز التجارية.');
      setFeatures(['أمن وحراسة 24 ساعة', 'مصعد حديث', 'إطلالة لاندسكيب مفتوحة']);
      setPrivateAgentNotes('');
    }
  }, [propertyToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (newFeatureInput.trim()) {
      setFeatures(prev => [...prev, newFeatureInput.trim()]);
      setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    if (images.length > 1) {
      setImages(prev => prev.filter((_, i) => i !== idx));
    } else {
      alert('يجب الإبقاء على صورة واحدة على الأقل للعقار.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !areaId || !price) {
      alert('يرجى ملء الحقول المطلوبة: عنوان العقار، المنطقة، والسعر.');
      return;
    }

    const selectedAreaObj = areas.find(a => a.id === areaId);
    const areaName = selectedAreaObj ? selectedAreaObj.name : 'القاهرة';

    const propData = {
      title: title.trim(),
      purpose,
      type,
      areaId,
      areaName,
      compound: compound.trim() || undefined,
      address: address.trim() || areaName,
      price: Number(price),
      currency: 'ج.م',
      downPayment: downPayment ? Number(downPayment) : undefined,
      installmentYears: installmentYears ? Number(installmentYears) : undefined,
      monthlyInstallment: monthlyInstallment ? Number(monthlyInstallment) : undefined,
      deliveryYear: deliveryYear.trim() || 'استلام فوري',
      finishing,
      sizeSqM: Number(sizeSqM),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      floor: floor.trim() || undefined,
      images,
      featured,
      description: description.trim(),
      features,
      privateAgentNotes: privateAgentNotes.trim() || undefined,
      contactPhone: contactPhone.trim(),
      contactWhatsApp: contactWhatsApp.trim(),
    };

    if (propertyToEdit) {
      updateProperty({
        ...propData,
        id: propertyToEdit.id,
        createdAt: propertyToEdit.createdAt,
      });
    } else {
      addProperty(propData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 p-5 text-white flex items-center justify-between shrink-0 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-100">
                {propertyToEdit ? 'تعديل بيانات العقار' : 'إضافة عقار جديد للعرض'}
              </h2>
              <p className="text-xs text-stone-400">سيتم حفظ العقار وإتاحته للتصفية والعرض الفوري للزوار.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full text-stone-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1 text-xs">
          {/* Row 1: Title */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">عنوان الإعلان العقاري *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="مثال: شقة للبيع بتشطيب فاخر في قلب التجمع الخامس"
              className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-600 focus:outline-none text-xs"
            />
          </div>

          {/* Row 2: Purpose & Type & Area */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">نوع العرض</label>
              <select
                value={purpose}
                onChange={e => setPurpose(e.target.value as PropertyPurpose)}
                className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none"
              >
                {Object.entries(PURPOSE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">نوع العقار</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as PropertyType)}
                className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none"
              >
                {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">المنطقة أو الحي *</label>
              <select
                value={areaId}
                onChange={e => setAreaId(e.target.value)}
                className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none"
              >
                {areas.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Compound & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">اسم الكمبوند أو المشروع (اختياري)</label>
              <input
                type="text"
                value={compound}
                onChange={e => setCompound(e.target.value)}
                placeholder="مثال: كمبوند ميفيدا"
                className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none"
              >
              </input>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">العنوان التفصيلي</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="مثال: شارع التسعين الشمالي، القطعة 14"
                className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Row 4: Pricing */}
          <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200">
            <span className="font-bold text-stone-800 block mb-2">التسعير ونظام السداد:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-stone-600 mb-1">السعر الإجمالي (ج.م) *</label>
                <input
                  type="number"
                  required
                  step="50000"
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full py-1.5 px-3 bg-white border border-stone-300 rounded-xl font-mono text-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-600 mb-1">مقدم الحجز (ج.م)</label>
                <input
                  type="number"
                  step="25000"
                  value={downPayment}
                  onChange={e => setDownPayment(Number(e.target.value))}
                  className="w-full py-1.5 px-3 bg-white border border-stone-300 rounded-xl font-mono text-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-600 mb-1">سنوات التقسيط</label>
                <input
                  type="number"
                  value={installmentYears}
                  onChange={e => setInstallmentYears(Number(e.target.value))}
                  className="w-full py-1.5 px-3 bg-white border border-stone-300 rounded-xl font-mono text-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-600 mb-1">القسط الشهري (ج.م)</label>
                <input
                  type="number"
                  step="1000"
                  value={monthlyInstallment}
                  onChange={e => setMonthlyInstallment(Number(e.target.value))}
                  className="w-full py-1.5 px-3 bg-white border border-stone-300 rounded-xl font-mono text-stone-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Specs (Bedrooms, Bathrooms, Size, Floor, Finishing, Delivery) */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
            <div>
              <label className="block font-bold text-stone-700 mb-1">المساحة (م²)</label>
              <input
                type="number"
                value={sizeSqM}
                onChange={e => setSizeSqM(Number(e.target.value))}
                className="w-full py-1.5 px-2.5 bg-stone-50 border border-stone-300 rounded-xl text-center font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">غرف النوم</label>
              <input
                type="number"
                value={bedrooms}
                onChange={e => setBedrooms(Number(e.target.value))}
                className="w-full py-1.5 px-2.5 bg-stone-50 border border-stone-300 rounded-xl text-center font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">الحمامات</label>
              <input
                type="number"
                value={bathrooms}
                onChange={e => setBathrooms(Number(e.target.value))}
                className="w-full py-1.5 px-2.5 bg-stone-50 border border-stone-300 rounded-xl text-center font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">الدور</label>
              <input
                type="text"
                value={floor}
                onChange={e => setFloor(e.target.value)}
                placeholder="أرضي / ثالث"
                className="w-full py-1.5 px-2.5 bg-stone-50 border border-stone-300 rounded-xl text-center focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">التشطيب</label>
              <select
                value={finishing}
                onChange={e => setFinishing(e.target.value as FinishingType)}
                className="w-full py-1.5 px-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none text-[11px]"
              >
                {Object.entries(FINISHING_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">الاستلام</label>
              <input
                type="text"
                value={deliveryYear}
                onChange={e => setDeliveryYear(e.target.value)}
                placeholder="فوري / 2026"
                className="w-full py-1.5 px-2 bg-stone-50 border border-stone-300 rounded-xl text-center focus:outline-none text-[11px]"
              />
            </div>
          </div>

          {/* Row 6: Description */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">الوصف التفصيلي للعقار</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none text-xs leading-relaxed"
            />
          </div>

          {/* Row 7: Images URLs */}
          <div>
            <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-amber-700" />
              <span>روابط صور العقار (URLs)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                placeholder="أدخل رابط صورة (Unsplash أو رابط مباشر)..."
                className="flex-1 py-1.5 px-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none text-xs"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-3 py-1.5 bg-stone-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                إضافة رابط
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border border-stone-300 group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute inset-0 bg-stone-900/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-rose-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Row 8: Features */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">المميزات والخدمات</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newFeatureInput}
                onChange={e => setNewFeatureInput(e.target.value)}
                placeholder="أضف ميزة (مثلاً: جراج خاص، حمام سباحة، أمن)..."
                className="flex-1 py-1.5 px-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none text-xs"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-1.5 bg-stone-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                إضافة
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {features.map((feat, idx) => (
                <span key={idx} className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5">
                  <span>{feat}</span>
                  <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-stone-400 hover:text-rose-600">
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Row 9: Private Agent Notes */}
          <div className="p-3 bg-stone-900 text-amber-100 rounded-2xl border border-amber-900/60">
            <label className="block font-bold text-amber-300 mb-1 text-[11px]">
              🔒 ملاحظاتك السرية لهذا العقار (تظهر لك فقط عند تفعيل وضع الوسيط):
            </label>
            <textarea
              rows={2}
              value={privateAgentNotes}
              onChange={e => setPrivateAgentNotes(e.target.value)}
              placeholder="مثلاً: المالك مستعد لتخفيض 200 ألف، العمولة 2.5% صافي، أوراق الملكية مودعة بالبنك..."
              className="w-full p-2 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 text-xs focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{propertyToEdit ? 'حفظ تعديلات العقار' : 'نشر العقار في المنصة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
