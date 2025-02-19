
export interface DentalPracticeTable {
  id?: string;
  created_at?: string;
  last_updated?: string;
  email: string;
  phone: string;
  website: string;
  services: string[];
  practice_name: string;
}

export type DentalPracticeCreate = Omit<DentalPracticeTable, 'id' | 'created_at' | 'last_updated'>;
export type DentalPracticeUpdate = Partial<DentalPracticeCreate>;

export interface GeneratedAd {
  headlines: string[];
  descriptions: string[];
  url: string;
}

export const STEPS = ["Practice Info", "Services", "Keywords", "Preview"];

export const SERVICES = [
  {
    name: "General Dentistry",
    description: "Comprehensive dental care for the whole family",
  },
  {
    name: "Preventive Care",
    description: "Regular checkups and cleanings to maintain oral health",
  },
  {
    name: "Cosmetic Dentistry",
    description: "Transform your smile with aesthetic dental procedures",
  },
  {
    name: "Restorative Dentistry",
    description: "Repair and restore damaged or missing teeth",
  },
  {
    name: "Dental Implants",
    description: "Permanent solution for missing teeth",
  },
  {
    name: "Orthodontics",
    description: "Straighten teeth and correct bite issues",
  },
  {
    name: "Pediatric Dentistry",
    description: "Specialized dental care for children",
  },
  {
    name: "Gum Care",
    description: "Treatment for periodontal disease and gum health",
  },
  {
    name: "Oral Surgery",
    description: "Surgical procedures for complex dental issues",
  },
  {
    name: "Emergency Dentistry",
    description: "Immediate care for dental emergencies",
  },
  {
    name: "Specialty Services",
    description: "Advanced dental procedures and treatments",
  },
] as const;
