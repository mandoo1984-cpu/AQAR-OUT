import React, { useState } from 'react';
import { Client, ClientType, ClientStatus } from '../types';
import { useRealEstate } from '../context/RealEstateContext';
import { 
  formatCurrency, 
  exportClientsToCSV, 
  CLIENT_TYPE_LABELS, 
  CLIENT_STATUS_LABELS, 
  CLIENT_PRIORITY_LABELS 
} from '../utils/helpers';
import { 
  ShieldCheck, 
  Lock, 
  UserPlus, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Phone, 
  MessageSquare, 
  Mail, 
  Edit3, 
  Trash2, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Building, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  KeyRound, 
  FileSpreadsheet, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { AddEditClientModal } from './AddEditClientModal';

export const PrivateClientDashboard: React.FC = () => {
  const {
    clients,
    deleteClient,
    inquiries,
    markInquiryRead,
    deleteInquiry,
    convertInquiryToClient,
    lockAgentMode,
    agentPin,
    updateAgentPin,
    exportDataJSON,
    importDataJSON,
    setSelectedProperty,
    properties,
  } = useRealEstate();

  // Internal CRM tabs
  const [crmTab, setCrmTab] = useState<'clients' | 'inquiries' | 'agenda' | 'security'>('clients');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | ClientType>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | ClientStatus>('all');

  // Modal state
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  // PIN change state
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  // Import JSON file input ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      (client.privateNotes && client.privateNotes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.targetAreas && client.targetAreas.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesType = filterType === 'all' || client.clientType === filterType;
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // KPI Calculations
  const totalClients = clients.length;
  const highPriorityClients = clients.filter(c => c.priority === 'high').length;
  const activeNegotiations = clients.filter(c => c.status === 'negotiation' || c.status === 'viewing_scheduled').length;
  const unreadInquiries = inquiries.filter(i => !i.read).length;

  const handleOpenAdd = () => {
    setClientToEdit(null);
    setIsAddClientModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setClientToEdit(client);
    setIsAddClientModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`هل أنت متأكد من حذف العميل "${name}" من سجلك السري نهائياً؟`)) {
      deleteClient(id);
    }
  };

  const handleWhatsAppChat = (client: Client) => {
    const text = encodeURIComponent(`أهلاً بك يا فندم أستاذ ${client.name}، مع حضرتك المستشار العقاري بخصوص طلباتك العقارية ومتابعة العروض المناسبة.`);
    window.open(`https://wa.me/${client.whatsapp || client.phone}?text=${text}`, '_blank');
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.trim().length >= 4) {
      updateAgentPin(newPinInput.trim());
      setPinChangeSuccess(true);
      setNewPinInput('');
      setTimeout(() => setPinChangeSuccess(false), 3000);
    } else {
      alert('يجب أن يتكون رمز المرور من 4 خانات على الأقل.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importDataJSON(content);
        if (ok) {
          alert('تم استيراد نسخة البيانات بنجاح واستعادة سجل العملاء والعقارات!');
        } else {
          alert('ملف البيانات غير صالح. يرجى التأكد من استيراد ملف JSON سليم تم تصديره من هذا النظام.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Privacy Guarantee Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white rounded-3xl p-6 shadow-xl border border-amber-800/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 -translate-x-12 -translate-y-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-amber-100">
                  لوحة إدارة بيانات العملاء الخاصة (CRM السري)
                </h1>
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-400/30">
                  خاصة بك فقط
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
                هذا القسم محمي برمز PIN ومحفوظ محلياً على جهازك؛ زوار موقع العقارات لا يملكون أي وصول لأسماء عملائك، أرقام هواتفهم، ميزانياتهم، أو ملاحظاتك السرية.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleOpenAdd}
              className="py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة عميل جديد</span>
            </button>

            <button
              onClick={() => exportClientsToCSV(clients)}
              className="py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-stone-700 cursor-pointer"
              title="تصدير كملف Excel / CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>تصدير Excel</span>
            </button>

            <button
              onClick={lockAgentMode}
              className="py-2.5 px-3 bg-rose-900/60 hover:bg-rose-900 text-rose-200 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-rose-800/60 cursor-pointer"
              title="قفل فوري وتأمين"
            >
              <Lock className="w-4 h-4" />
              <span>قفل وتأمين</span>
            </button>
          </div>
        </div>

        {/* Mini KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-stone-800/80">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-stone-400 block font-medium">إجمالي العملاء المسجلين</span>
            <strong className="text-xl sm:text-2xl font-black text-amber-200 font-mono">
              {totalClients} عميل
            </strong>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-stone-400 block font-medium">صفقات قيد التفاوض والمعاينة</span>
            <strong className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
              {activeNegotiations} صفقة
            </strong>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-stone-400 block font-medium">عملاء ذوو أولوية عاجلة</span>
            <strong className="text-xl sm:text-2xl font-black text-rose-400 font-mono">
              {highPriorityClients} عميل
            </strong>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-stone-400 block font-medium">طلبات واستفسارات الموقع</span>
            <div className="flex items-center gap-2">
              <strong className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                {inquiries.length}
              </strong>
              {unreadInquiries > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {unreadInquiries} جديد
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Internal CRM Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setCrmTab('clients')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            crmTab === 'clients'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <span>سجل العملاء ({clients.length})</span>
        </button>

        <button
          onClick={() => setCrmTab('inquiries')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            crmTab === 'inquiries'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <span>استفسارات الموقع الواردة</span>
          {unreadInquiries > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {unreadInquiries}
            </span>
          )}
        </button>

        <button
          onClick={() => setCrmTab('agenda')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            crmTab === 'agenda'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>جدول المتابعات والمعاينات</span>
        </button>

        <button
          onClick={() => setCrmTab('security')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            crmTab === 'security'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>الأمان والنسخ الاحتياطي</span>
        </button>
      </div>

      {/* TAB 1: ALL CLIENTS DIRECTORY */}
      {crmTab === 'clients' && (
        <div className="space-y-4">
          {/* Search & Filter Controls */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، رقم الهاتف، المنطقة، أو محتوى الملاحظات السرية..."
                className="w-full py-2.5 px-4 pr-10 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-600"
              />
              <Search className="absolute right-3.5 top-3 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>

            {/* Filter by Client Type */}
            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value as any)}
                className="py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 font-semibold focus:outline-none"
              >
                <option value="all">كافة أنواع العملاء</option>
                {Object.entries(CLIENT_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>

              {/* Filter by Status */}
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
                className="py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 font-semibold focus:outline-none"
              >
                <option value="all">كافة المراحل والحالات</option>
                {Object.entries(CLIENT_STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clients Grid */}
          {filteredClients.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
              <UserPlus className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-bold text-stone-700 mb-1">لم يتم العثور على أي عميل مطابق</h3>
              <p className="text-xs text-stone-500 mb-4">
                {searchQuery ? 'جرّب تعديل كلمات البحث أو تصفية الحالة.' : 'ابدأ بإضافة عميل جديد الآن.'}
              </p>
              <button
                onClick={handleOpenAdd}
                className="py-2 px-4 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>إضافة أول عميل</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredClients.map(client => {
                const statusMeta = CLIENT_STATUS_LABELS[client.status];
                const priorityMeta = CLIENT_PRIORITY_LABELS[client.priority];

                return (
                  <div
                    key={client.id}
                    className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-black text-sm shrink-0">
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-extrabold text-stone-900 text-base">
                                {client.name}
                              </h3>
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-stone-500">
                                <span className={`w-2 h-2 rounded-full ${priorityMeta.dotColor}`} />
                                <span>{priorityMeta.label}</span>
                              </span>
                            </div>

                            <span className="text-xs font-semibold text-stone-500">
                              {CLIENT_TYPE_LABELS[client.clientType]}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${statusMeta.bg} ${statusMeta.color}`}>
                          {statusMeta.label}
                        </span>
                      </div>

                      {/* Contact & Phone Bar */}
                      <div className="flex items-center gap-3 py-2 px-3 bg-stone-50 rounded-xl text-xs text-stone-700 mb-3 flex-wrap">
                        <a
                          href={`tel:${client.phone}`}
                          className="flex items-center gap-1.5 hover:text-amber-800 font-mono font-bold"
                        >
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <span dir="ltr">{client.phone}</span>
                        </a>

                        {client.email && (
                          <span className="flex items-center gap-1 text-stone-500 font-mono text-[11px]">
                            <Mail className="w-3.5 h-3.5 text-stone-400" />
                            <span>{client.email}</span>
                          </span>
                        )}

                        <button
                          onClick={() => handleWhatsAppChat(client)}
                          className="mr-auto px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-600" />
                          <span>واتساب مباشر</span>
                        </button>
                      </div>

                      {/* Budget & Targeted Areas */}
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
                          <span className="text-[11px] text-stone-500 block">الميزانية المقدرة</span>
                          <strong className="text-stone-900 font-mono font-bold">
                            {client.budgetMax > 0 ? `${formatCurrency(client.budgetMin)} - ${formatCurrency(client.budgetMax)}` : 'غير محددة بدقة'}
                          </strong>
                        </div>

                        <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
                          <span className="text-[11px] text-stone-500 block">المناطق المطلوبة</span>
                          <span className="text-stone-800 font-medium truncate block">
                            {client.targetAreas && client.targetAreas.length > 0 ? client.targetAreas.join('، ') : 'مفتوحة'}
                          </span>
                        </div>
                      </div>

                      {/* Linked Property if any */}
                      {client.interestedPropertyTitle && (
                        <div className="mb-3 p-2 bg-amber-50/80 rounded-xl border border-amber-200/70 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-1.5 truncate">
                            <Building className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span className="text-stone-600 text-[11px]">العقار المرتبط:</span>
                            <span className="font-bold text-amber-950 truncate">{client.interestedPropertyTitle}</span>
                          </div>

                          {client.interestedPropertyId && (
                            <button
                              onClick={() => {
                                const prop = properties.find(p => p.id === client.interestedPropertyId);
                                if (prop) setSelectedProperty(prop);
                              }}
                              className="text-[11px] text-amber-800 underline font-semibold shrink-0 cursor-pointer"
                            >
                              معاينة العقار
                            </button>
                          )}
                        </div>
                      )}

                      {/* CONFIDENTIAL PRIVATE NOTES BOX */}
                      <div className="p-3 bg-stone-900 text-amber-100 rounded-xl border border-amber-900/50 text-xs mb-3 shadow-inner">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-amber-300 flex items-center gap-1 text-[11px]">
                            <Lock className="w-3.5 h-3.5" />
                            <span>ملاحظة سرية للوسيط (خاصة بك أنت فقط):</span>
                          </span>

                          {client.commissionAgreed && (
                            <span className="bg-amber-400/20 text-amber-200 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                              العمولة: {client.commissionAgreed}
                            </span>
                          )}
                        </div>

                        <p className="text-stone-300 leading-relaxed text-xs">
                          {client.privateNotes || 'لا توجد ملاحظات سرية إضافية.'}
                        </p>

                        {client.nextFollowUpDate && (
                          <div className="mt-2 pt-1.5 border-t border-stone-800 flex items-center gap-1 text-[11px] text-amber-300">
                            <Calendar className="w-3 h-3 text-amber-400" />
                            <span>موعد المتابعة أو المعاينة القادمة: <strong className="font-mono">{client.nextFollowUpDate}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[10px] text-stone-600">
                        مسجل بتاريخ: {client.createdAt}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(client)}
                          className="p-1.5 text-stone-500 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="تعديل بيانات العميل"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id, client.name)}
                          className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="حذف من السجل"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INCOMING INQUIRIES FROM WEBSITE */}
      {crmTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong className="block font-bold mb-1">صندوق الاستفسارات الواردة:</strong>
            عندما يقوم أي زائر بملء نموذج &quot;طلب معاينة أو استفسار&quot; من صفحة أي عقار، يصل طلبه مباشرة هنا في هذا الصندوق السري الخاص بك، ويتم تسجيله كعميل محتمل فوراً.
          </div>

          {inquiries.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-stone-700">لا توجد استفسارات معلقة حالياً</h3>
              <p className="text-xs text-stone-500">تم الرد على جميع الاستفسارات والطلبات بنجاح.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map(inq => (
                <div
                  key={inq.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    inq.read
                      ? 'bg-white border-stone-200 text-stone-700'
                      : 'bg-amber-50/50 border-amber-300 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-stone-900 text-sm">{inq.clientName}</span>
                      <a
                        href={`tel:${inq.clientPhone}`}
                        className="font-mono text-xs font-bold text-amber-800 hover:underline"
                        dir="ltr"
                      >
                        {inq.clientPhone}
                      </a>
                      {!inq.read && (
                        <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          جديد
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-stone-600 font-mono">{inq.date}</span>
                  </div>

                  <div className="text-xs text-stone-600 mb-2">
                    <span className="font-semibold text-stone-700">بخصوص العقار: </span>
                    <span className="text-amber-900 font-bold">{inq.propertyTitle}</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 mb-3">
                    &quot;{inq.message}&quot;
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`https://wa.me/${inq.clientPhone.replace(/^0/, '20')}?text=${encodeURIComponent(`أهلاً بك يا فندم بخصوص طلب المعاينة لعقار: ${inq.propertyTitle}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>رد واتساب فوري</span>
                    </a>

                    {!inq.read && (
                      <button
                        onClick={() => markInquiryRead(inq.id)}
                        className="py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        تحديد كمقروء
                      </button>
                    )}

                    <button
                      onClick={() => deleteInquiry(inq.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg mr-auto transition-colors cursor-pointer"
                      title="حذف الاستفسار"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AGENDA & UPCOMING VIEWINGS */}
      {crmTab === 'agenda' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
            <h3 className="font-bold text-stone-900 text-base mb-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-700" />
              <span>مواعيد المعاينات والمتابعات القادمة</span>
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              مواعيد مرتبطة بعملاء مسجلين في سجلك لتنظيم تحركاتك وجولات المعاينة الميدانية.
            </p>

            <div className="space-y-3">
              {clients.filter(c => c.nextFollowUpDate).length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl text-stone-500 text-xs">
                  لا توجد مواعيد متابعة مسجلة بتواريخ محددة حتى الآن. يمكنك تحديد تاريخ في بطاقة أي عميل.
                </div>
              ) : (
                clients
                  .filter(c => c.nextFollowUpDate)
                  .sort((a, b) => (a.nextFollowUpDate || '').localeCompare(b.nextFollowUpDate || ''))
                  .map(c => (
                    <div
                      key={c.id}
                      className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-amber-600 text-white rounded-xl text-center shrink-0 min-w-16">
                          <span className="text-[10px] block text-amber-100 font-semibold">تاريخ</span>
                          <strong className="text-xs font-mono font-bold block">{c.nextFollowUpDate}</strong>
                        </div>
                        <div>
                          <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                            <span>{c.name}</span>
                            <span className="text-xs text-stone-500">({CLIENT_TYPE_LABELS[c.clientType]})</span>
                          </h4>
                          <p className="text-xs text-stone-600 mt-0.5">
                            {c.privateNotes || 'متابعة بخصوص العروض المتاحة.'}
                          </p>
                          {c.interestedPropertyTitle && (
                            <span className="text-[11px] text-amber-800 font-semibold block mt-1">
                              العقار: {c.interestedPropertyTitle}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${c.phone}`}
                          className="p-2 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-bold transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleWhatsAppChat(c)}
                          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>تأكيد الموعد</span>
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & BACKUP */}
      {crmTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Change PIN Box */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="w-5 h-5 text-amber-700" />
              <h3 className="font-bold text-stone-900 text-base">تغيير رمز المرور السري (PIN)</h3>
            </div>
            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              رمز المرور الحالي هو <strong className="font-mono text-amber-800 font-bold">{agentPin}</strong>. يمكنك تغييره لمنع أي شخص غيرك من فتح بيانات العملاء.
            </p>

            <form onSubmit={handleSavePin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">الرمز الجديد (4 أرقام على الأقل)</label>
                <input
                  type="password"
                  value={newPinInput}
                  onChange={e => setNewPinInput(e.target.value)}
                  placeholder="••••"
                  maxLength={8}
                  className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-mono text-center tracking-widest text-lg focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>

              {pinChangeSuccess && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>تم حفظ رمز المرور الجديد بنجاح!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={newPinInput.length < 4}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
              >
                تحديث رمز المرور
              </button>
            </form>
          </div>

          {/* Backup & Offline Export Box */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Download className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-stone-900 text-base">حفظ وتصدير بيانات العملاء خارجياً</h3>
              </div>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                لكي تضمن أن بيانات العملاء تكون عندك وحدك بشكل دائم، يمكنك تحميل نسخة احتياطية مشفرة بملف JSON أو شيت Excel والاحتفاظ بها على جهازك الشخصي واستعادتها في أي وقت.
              </p>

              <div className="space-y-2.5">
                <button
                  onClick={() => exportClientsToCSV(clients)}
                  className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>تصدير سجل العملاء إلى ملف Excel / CSV</span>
                </button>

                <button
                  onClick={exportDataJSON}
                  className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-stone-600" />
                  <span>تنزيل نسخة احتياطية كاملة (JSON Backup)</span>
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-200">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-dashed border-stone-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-stone-500" />
                <span>استعادة بيانات من نسخة احتياطية سابقة (JSON)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Client Modal */}
      <AddEditClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        clientToEdit={clientToEdit}
      />
    </div>
  );
};
