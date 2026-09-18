export type PropertyPurpose = 'sale' | 'rent';
export type PropertyType = 'apartment' | 'villa' | 'townhouse' | 'duplex' | 'chalet' | 'commercial' | 'penthouse';
export type FinishingType = 'ultra_super_lux' | 'super_lux' | 'semi_finished' | 'core_and_shell';

export interface Property {
  id: string;
  title: string;
  purpose: PropertyPurpose;
  type: PropertyType;
  areaId: string;
  areaName: string;
  compound?: string;
  address: string;
  price: number;
  currency: string;
  downPayment?: number;
  installmentYears?: number;
  monthlyInstallment?: number;
  deliveryYear: string;
  finishing: FinishingType;
  sizeSqM: number;
  bedrooms: number;
  bathrooms: number;
  floor?: string;
  images: string[];
  featured: boolean;
  description: string;
  features: string[];
  privateAgentNotes?: string;
  contactPhone?: string;
  contactWhatsApp?: string;
  createdAt: string;
}

export interface AreaServiceCategory {
  category: string;
  items: string[];
}

export interface Area {
  id: string;
  name: string;
  city: string;
  coverImage: string;
  description: string;
  avgPricePerMeter: number;
  priceGrowthAnnual: number;
  demandLevel: 'عالي جداً' | 'عالي' | 'متوسط';
  topCompounds: string[];
  services: AreaServiceCategory[];
  transportation: string[];
  investmentRating: number;
}

export type ClientType = 'buyer' | 'seller' | 'tenant' | 'investor';
export type ClientStatus = 'new' | 'contacted' | 'viewing_scheduled' | 'negotiation' | 'contract_signed' | 'postponed';
export type ClientPriority = 'high' | 'medium' | 'low';

export interface Client {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  clientType: ClientType;
  status: ClientStatus;
  priority: ClientPriority;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  targetAreas: string[];
  targetPropertyType: string[];
  interestedPropertyId?: string;
  interestedPropertyTitle?: string;
  privateNotes: string; // خاص بالوسيط فقط
  commissionAgreed?: string; // مثلاً "2.5% - حوالي 125,000 ج.م"
  nextFollowUpDate?: string;
  lastContactDate?: string;
  createdAt: string;
}

export interface PropertyInquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  clientName: string;
  clientPhone: string;
  message: string;
  date: string;
  read: boolean;
}

export interface PropertyFilters {
  search: string;
  purpose: 'all' | PropertyPurpose;
  type: 'all' | PropertyType;
  areaId: string;
  minPrice: number;
  maxPrice: number;
  minBedrooms: number;
  finishing: 'all' | FinishingType;
  sortBy: 'latest' | 'price_asc' | 'price_desc' | 'size_desc';
}
