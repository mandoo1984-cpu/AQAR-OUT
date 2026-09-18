import { Client, PropertyType, PropertyPurpose, FinishingType, ClientStatus, ClientType, ClientPriority } from '../types';

export function formatCurrency(amount: number, currency: string = 'ج.م'): string {
  if (isNaN(amount) || amount === 0) return '0 ' + currency;
  
  if (amount >= 1000000) {
    const millions = amount / 1000000;
    // If exact integer or close
    const formatted = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(2).replace(/\.?0+$/, '');
    return `${formatted} مليون ${currency}`;
  }
  
  return `${new Intl.NumberFormat('ar-EG').format(amount)} ${currency}`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ar-EG').format(num);
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: 'شقة سكنية',
  villa: 'فيلا مستقلة',
  townhouse: 'تاون هاوس',
  duplex: 'دوبلكس',
  chalet: 'شاليه ساحلي',
  commercial: 'تجاري / إداري',
  penthouse: 'بنتهاوس',
};

export const PURPOSE_LABELS: Record<PropertyPurpose, string> = {
  sale: 'للبيع',
  rent: 'للإيجار',
};

export const FINISHING_LABELS: Record<FinishingType, string> = {
  ultra_super_lux: 'الترا سوبر لوكس',
  super_lux: 'سوبر لوكس',
  semi_finished: 'نصف تشطيب (محارة وحلوق)',
  core_and_shell: 'طوب أحمر / بدون تشطيب',
};

export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  buyer: 'مشتري مهتم',
  seller: 'مالك بائع',
  tenant: 'مستأجر',
  investor: 'مستثمر عقاري',
};

export const CLIENT_STATUS_LABELS: Record<ClientStatus, { label: string; color: string; bg: string }> = {
  new: { label: 'عميل جديد', color: 'text-amber-800', bg: 'bg-amber-100 border-amber-300' },
  contacted: { label: 'تم التواصل', color: 'text-blue-800', bg: 'bg-blue-100 border-blue-300' },
  viewing_scheduled: { label: 'موعد معاينة', color: 'text-purple-800', bg: 'bg-purple-100 border-purple-300' },
  negotiation: { label: 'مفاوضات وسعر', color: 'text-orange-800', bg: 'bg-orange-100 border-orange-300' },
  contract_signed: { label: 'تم التعاقد والصفقة', color: 'text-emerald-800', bg: 'bg-emerald-100 border-emerald-300' },
  postponed: { label: 'مؤجل / غير نشط', color: 'text-stone-700', bg: 'bg-stone-200 border-stone-300' },
};

export const CLIENT_PRIORITY_LABELS: Record<ClientPriority, { label: string; dotColor: string }> = {
  high: { label: 'أولوية عاجلة', dotColor: 'bg-rose-500' },
  medium: { label: 'أولوية متوسطة', dotColor: 'bg-amber-500' },
  low: { label: 'أولوية عادية', dotColor: 'bg-emerald-500' },
};

export function exportClientsToCSV(clients: Client[]): void {
  const headers = ['الاسم', 'الهاتف', 'واتساب', 'النوع', 'الحالة', 'الأولوية', 'الميزانية_الدنيا', 'الميزانية_القصوى', 'المناطق_المفضلة', 'العقار_المرتبط', 'العمولة_المتفق_عليها', 'ملاحظات_سرية_للوسيط', 'تاريخ_المتابعة'];
  
  const rows = clients.map(c => [
    `"${c.name.replace(/"/g, '""')}"`,
    `"${c.phone}"`,
    `"${c.whatsapp}"`,
    `"${CLIENT_TYPE_LABELS[c.clientType]}"`,
    `"${CLIENT_STATUS_LABELS[c.status].label}"`,
    `"${CLIENT_PRIORITY_LABELS[c.priority].label}"`,
    c.budgetMin,
    c.budgetMax,
    `"${c.targetAreas.join(', ')}"`,
    `"${(c.interestedPropertyTitle || '').replace(/"/g, '""')}"`,
    `"${(c.commissionAgreed || '').replace(/"/g, '""')}"`,
    `"${(c.privateNotes || '').replace(/"/g, '""')}"`,
    `"${c.nextFollowUpDate || ''}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `سجل_العملاء_السري_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
