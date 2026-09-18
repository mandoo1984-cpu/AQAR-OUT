import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, Area, Client, PropertyInquiry, PropertyFilters } from '../types';
import { INITIAL_PROPERTIES, INITIAL_AREAS, INITIAL_CLIENTS } from '../data/mockData';

interface RealEstateContextType {
  properties: Property[];
  areas: Area[];
  clients: Client[];
  inquiries: PropertyInquiry[];
  isAgentMode: boolean;
  agentPin: string;
  unlockAgentMode: (pin: string) => boolean;
  lockAgentMode: () => void;
  updateAgentPin: (newPin: string) => void;
  // Properties CRUD
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => void;
  updateProperty: (property: Property) => void;
  deleteProperty: (id: string) => void;
  // Clients CRUD (Private to Agent)
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  // Inquiries
  addInquiry: (inquiry: Omit<PropertyInquiry, 'id' | 'date' | 'read'>) => void;
  markInquiryRead: (id: string) => void;
  deleteInquiry: (id: string) => void;
  convertInquiryToClient: (inquiry: PropertyInquiry) => void;
  // Backup & Restore
  exportDataJSON: () => void;
  importDataJSON: (jsonStr: string) => boolean;
  resetToDefaults: () => void;
  // UI & Navigation
  activeTab: 'properties' | 'areas' | 'clients' | 'calculator';
  setActiveTab: (tab: 'properties' | 'areas' | 'clients' | 'calculator') => void;
  selectedProperty: Property | null;
  setSelectedProperty: (prop: Property | null) => void;
  selectedArea: Area | null;
  setSelectedArea: (area: Area | null) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  filters: PropertyFilters;
  setFilters: React.Dispatch<React.SetStateAction<PropertyFilters>>;
  resetFilters: () => void;
  filterByArea: (areaId: string) => void;
}

const DEFAULT_FILTERS: PropertyFilters = {
  search: '',
  purpose: 'all',
  type: 'all',
  areaId: '',
  minPrice: 0,
  maxPrice: 100000000,
  minBedrooms: 0,
  finishing: 'all',
  sortBy: 'latest',
};

const RealEstateContext = createContext<RealEstateContextType | undefined>(undefined);

export const RealEstateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Properties state with localStorage
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('darak_properties');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PROPERTIES;
  });

  // Areas state
  const [areas, setAreas] = useState<Area[]>(() => {
    const saved = localStorage.getItem('darak_areas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_AREAS;
  });

  // Clients state - strictly for Agent
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('darak_private_clients');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CLIENTS;
  });

  // Inquiries state
  const [inquiries, setInquiries] = useState<PropertyInquiry[]>(() => {
    const saved = localStorage.getItem('darak_inquiries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'inq-1',
        propertyId: 'prop-1',
        propertyTitle: 'فيلا مستقلة فاخرة بحمام سباحة خاص وحديقة شاسعة - ميفيدا',
        clientName: 'أشرف الجندي',
        clientPhone: '01099887766',
        message: 'مهتم بمعاينة الفيلا يوم الجمعة القادم، وهل متاح تسهيلات في السداد؟',
        date: '2026-09-18 10:30',
        read: false,
      },
    ];
  });

  // Agent Mode PIN and Lock state
  const [agentPin, setAgentPin] = useState<string>(() => {
    return localStorage.getItem('darak_agent_pin') || '1234';
  });

  const [isAgentMode, setIsAgentMode] = useState<boolean>(() => {
    return sessionStorage.getItem('darak_agent_logged') === 'true';
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'properties' | 'areas' | 'clients' | 'calculator'>('properties');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('darak_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [filters, setFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('darak_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('darak_areas', JSON.stringify(areas));
  }, [areas]);

  useEffect(() => {
    localStorage.setItem('darak_private_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('darak_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('darak_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('darak_agent_pin', agentPin);
  }, [agentPin]);

  const unlockAgentMode = (enteredPin: string): boolean => {
    if (enteredPin.trim() === agentPin.trim()) {
      setIsAgentMode(true);
      sessionStorage.setItem('darak_agent_logged', 'true');
      return true;
    }
    return false;
  };

  const lockAgentMode = () => {
    setIsAgentMode(false);
    sessionStorage.removeItem('darak_agent_logged');
    if (activeTab === 'clients') {
      setActiveTab('properties');
    }
  };

  const updateAgentPin = (newPin: string) => {
    if (newPin.trim().length >= 4) {
      setAgentPin(newPin.trim());
    }
  };

  const addProperty = (propData: Omit<Property, 'id' | 'createdAt'>) => {
    const newProp: Property = {
      ...propData,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setProperties(prev => [newProp, ...prev]);
  };

  const updateProperty = (updated: Property) => {
    setProperties(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    if (selectedProperty?.id === updated.id) {
      setSelectedProperty(updated);
    }
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    if (selectedProperty?.id === id) {
      setSelectedProperty(null);
    }
  };

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setClients(prev => [newClient, ...prev]);
  };

  const updateClient = (updated: Client) => {
    setClients(prev => prev.map(c => (c.id === updated.id ? updated : c)));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const addInquiry = (inqData: Omit<PropertyInquiry, 'id' | 'date' | 'read'>) => {
    const newInquiry: PropertyInquiry = {
      ...inqData,
      id: `inq-${Date.now()}`,
      date: new Date().toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }),
      read: false,
    };
    setInquiries(prev => [newInquiry, ...prev]);

    // Also automatically log into Clients as a new lead if not exists
    const existingClient = clients.find(c => c.phone === inqData.clientPhone);
    if (!existingClient) {
      const autoClient: Client = {
        id: `client-lead-${Date.now()}`,
        name: inqData.clientName,
        phone: inqData.clientPhone,
        whatsapp: inqData.clientPhone.replace(/^0/, '20'),
        clientType: 'buyer',
        status: 'new',
        priority: 'high',
        budgetMin: 0,
        budgetMax: 0,
        currency: 'ج.م',
        targetAreas: [],
        targetPropertyType: [],
        interestedPropertyId: inqData.propertyId,
        interestedPropertyTitle: inqData.propertyTitle,
        privateNotes: `طلب استفسار تلقائي من الموقع:\n"${inqData.message}"`,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setClients(prev => [autoClient, ...prev]);
    }
  };

  const markInquiryRead = (id: string) => {
    setInquiries(prev => prev.map(i => (i.id === id ? { ...i, read: true } : i)));
  };

  const deleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(i => i.id !== id));
  };

  const convertInquiryToClient = (inq: PropertyInquiry) => {
    markInquiryRead(inq.id);
    setActiveTab('clients');
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => (prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const filterByArea = (areaId: string) => {
    setFilters(prev => ({
      ...prev,
      areaId: prev.areaId === areaId ? '' : areaId,
    }));
    setActiveTab('properties');
  };

  const exportDataJSON = () => {
    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      clients,
      properties,
      inquiries,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `نسخة_احتياطية_عقاراتي_والعملاء_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.clients && Array.isArray(data.clients)) {
        setClients(data.clients);
      }
      if (data.properties && Array.isArray(data.properties)) {
        setProperties(data.properties);
      }
      if (data.inquiries && Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('هل أنت متأكد من استعادة البيانات الافتراضية؟')) {
      setProperties(INITIAL_PROPERTIES);
      setAreas(INITIAL_AREAS);
      setClients(INITIAL_CLIENTS);
      setInquiries([]);
      localStorage.clear();
      sessionStorage.clear();
      setIsAgentMode(false);
    }
  };

  return (
    <RealEstateContext.Provider
      value={{
        properties,
        areas,
        clients,
        inquiries,
        isAgentMode,
        agentPin,
        unlockAgentMode,
        lockAgentMode,
        updateAgentPin,
        addProperty,
        updateProperty,
        deleteProperty,
        addClient,
        updateClient,
        deleteClient,
        addInquiry,
        markInquiryRead,
        deleteInquiry,
        convertInquiryToClient,
        exportDataJSON,
        importDataJSON,
        resetToDefaults,
        activeTab,
        setActiveTab,
        selectedProperty,
        setSelectedProperty,
        selectedArea,
        setSelectedArea,
        favorites,
        toggleFavorite,
        filters,
        setFilters,
        resetFilters,
        filterByArea,
      }}
    >
      {children}
    </RealEstateContext.Provider>
  );
};

export const useRealEstate = () => {
  const context = useContext(RealEstateContext);
  if (!context) {
    throw new Error('useRealEstate must be used within RealEstateProvider');
  }
  return context;
};
