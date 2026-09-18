import React, { useState } from 'react';
import { useRealEstate } from '../context/RealEstateContext';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Building2, 
  MapPin, 
  Calculator, 
  Heart, 
  Lock, 
  Unlock, 
  PlusCircle, 
  Users, 
  Bell, 
  Menu, 
  X, 
  ShieldCheck 
} from 'lucide-react';

interface NavbarProps {
  onOpenPinModal: () => void;
  onOpenAddPropertyModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPinModal, onOpenAddPropertyModal }) => {
  const {
    activeTab,
    setActiveTab,
    favorites,
    isAgentMode,
    lockAgentMode,
    inquiries,
    clients,
  } = useRealEstate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadInquiries = inquiries.filter(i => !i.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Notification Bar for Agent */}
      {isAgentMode && (
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-amber-200 text-xs px-4 py-1.5 flex items-center justify-between border-b border-amber-900/40">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>وضع الوسيط الخاص نشط: بيانات العملاء والملاحظات السرية مفعلة عندك فقط</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                {clients.length} عملاء مسجلين
              </span>
              {unreadInquiries > 0 && (
                <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-[11px] font-bold animate-pulse">
                  {unreadInquiries} استفسار جديد
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div 
            id="brand-logo"
            onClick={() => { setActiveTab('properties'); }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center shadow-md shadow-amber-900/10 group-hover:scale-105 transition-transform duration-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-stone-900">عقاراتي</span>
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">DARAK</span>
              </div>
              <p className="text-[11px] text-stone-700 font-medium">بوابة العقارات والمناطق الفاخرة</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-properties-btn"
              onClick={() => setActiveTab('properties')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'properties'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>العقارات المتاحة</span>
            </button>

            <button
              id="nav-areas-btn"
              onClick={() => setActiveTab('areas')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'areas'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>دليل المناطق والأحياء</span>
            </button>

            <button
              id="nav-calculator-btn"
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>حاسبة الأقساط والتمويل</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Install PWA on Phone Button */}
            <PWAInstallButton />

            {/* Favorites Counter */}
            <button
              id="nav-favorites-btn"
              onClick={() => {
                setActiveTab('properties');
              }}
              title="العقارات المفضلة"
              className="relative p-2.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Agent Mode Controls */}
            {isAgentMode ? (
              <div className="flex items-center gap-2">
                <button
                  id="nav-clients-vault-btn"
                  onClick={() => setActiveTab('clients')}
                  className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
                    activeTab === 'clients'
                      ? 'bg-stone-900 text-white shadow-md'
                      : 'bg-stone-800 text-amber-200 hover:bg-stone-900'
                  }`}
                >
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>بيانات العملاء (خاص بي)</span>
                  {unreadInquiries > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {unreadInquiries}
                    </span>
                  )}
                </button>

                <button
                  id="nav-add-property-btn"
                  onClick={onOpenAddPropertyModal}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-amber-700 hover:bg-amber-800 text-white transition-colors cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>إضافة عقار</span>
                </button>

                <button
                  id="nav-lock-agent-btn"
                  onClick={lockAgentMode}
                  title="قفل لوحة الوسيط وتأمين بيانات العملاء"
                  className="p-2 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="nav-open-agent-btn"
                onClick={onOpenPinModal}
                className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold bg-stone-900 text-amber-100 hover:bg-stone-800 hover:text-white transition-all flex items-center gap-2 border border-stone-700 shadow-xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>دخول الوسيط 🔒 (بيانات العملاء)</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-stone-200 flex flex-col gap-1.5">
            <button
              onClick={() => {
                setActiveTab('properties');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
                activeTab === 'properties' ? 'bg-amber-50 text-amber-800' : 'text-stone-700'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>العقارات المتاحة</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('areas');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
                activeTab === 'areas' ? 'bg-amber-50 text-amber-800' : 'text-stone-700'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>دليل المناطق والأحياء</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('calculator');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
                activeTab === 'calculator' ? 'bg-amber-50 text-amber-800' : 'text-stone-700'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>حاسبة الأقساط والتمويل</span>
            </button>

            {isAgentMode && (
              <>
                <button
                  onClick={() => {
                    setActiveTab('clients');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-right px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-between ${
                    activeTab === 'clients' ? 'bg-stone-900 text-amber-300' : 'bg-stone-800 text-stone-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>سجل العملاء والصفقات (سري لك فقط)</span>
                  </span>
                  {unreadInquiries > 0 && (
                    <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadInquiries} جديد
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    onOpenAddPropertyModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-right px-4 py-2.5 rounded-lg text-sm font-semibold text-amber-700 bg-amber-50 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>إضافة عقار جديد</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
