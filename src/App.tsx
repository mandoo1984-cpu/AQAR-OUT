import React, { useState } from 'react';
import { RealEstateProvider, useRealEstate } from './context/RealEstateContext';
import { Navbar } from './components/Navbar';
import { PropertyExplorerView } from './components/PropertyExplorerView';
import { AreasExplorerView } from './components/AreasExplorerView';
import { PrivateClientDashboard } from './components/PrivateClientDashboard';
import { MortgageCalculatorView } from './components/MortgageCalculatorView';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { AreaDetailModal } from './components/AreaDetailModal';
import { PINModal } from './components/PINModal';
import { AddEditPropertyModal } from './components/AddEditPropertyModal';
import { Footer } from './components/Footer';
import { Property } from './types';
import { Lock, ShieldAlert } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedProperty,
    setSelectedProperty,
    selectedArea,
    setSelectedArea,
    isAgentMode,
  } = useRealEstate();

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);

  const handleOpenAddProperty = () => {
    setPropertyToEdit(null);
    setIsAddPropertyModalOpen(true);
  };

  const handleEditProperty = (prop: Property) => {
    setPropertyToEdit(prop);
    setIsAddPropertyModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-['Cairo',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        onOpenPinModal={() => setIsPinModalOpen(true)}
        onOpenAddPropertyModal={handleOpenAddProperty}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        {/* Tab 1: Properties Explorer */}
        {activeTab === 'properties' && (
          <PropertyExplorerView
            onOpenAddProperty={handleOpenAddProperty}
            onEditProperty={handleEditProperty}
          />
        )}

        {/* Tab 2: Areas & Districts Explorer */}
        {activeTab === 'areas' && (
          <AreasExplorerView
            onSelectArea={area => setSelectedArea(area)}
          />
        )}

        {/* Tab 3: Private Clients Dashboard (Strictly for Agent: "وبيانات العملاء تكون عندي بس") */}
        {activeTab === 'clients' && (
          isAgentMode ? (
            <PrivateClientDashboard />
          ) : (
            <div className="p-12 max-w-md mx-auto text-center bg-white rounded-3xl border border-stone-200 shadow-xl my-12 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-stone-900 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-md">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-stone-900 mb-2">سجل بيانات العملاء محمي ومقفل</h2>
              <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                بيانات العملاء والأرقام والملاحظات المالية سرية وتخصك أنت فقط. أدخل رمز المرور السري (PIN) للوصول.
              </p>
              <button
                onClick={() => setIsPinModalOpen(true)}
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-amber-200 font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>إدخال رمز المرور (PIN) لفتح السجل</span>
              </button>
            </div>
          )
        )}

        {/* Tab 4: Mortgage & Loan Calculator */}
        {activeTab === 'calculator' && (
          <MortgageCalculatorView />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenPinModal={() => setIsPinModalOpen(true)} />

      {/* Modals */}
      {/* 1. Property Full Details Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onEdit={handleEditProperty}
      />

      {/* 2. Area Details Modal */}
      <AreaDetailModal
        area={selectedArea}
        onClose={() => setSelectedArea(null)}
      />

      {/* 3. Security PIN Modal */}
      <PINModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => setActiveTab('clients')}
      />

      {/* 4. Add / Edit Property Modal */}
      <AddEditPropertyModal
        isOpen={isAddPropertyModalOpen}
        onClose={() => setIsAddPropertyModalOpen(false)}
        propertyToEdit={propertyToEdit}
      />
    </div>
  );
};

export default function App() {
  return (
    <RealEstateProvider>
      <MainContent />
    </RealEstateProvider>
  );
}
