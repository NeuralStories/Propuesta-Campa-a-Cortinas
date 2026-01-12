export interface CurtainType {
  id: string;
  label: string;
  pricePerM2: number;
  description: string;
  customDescription?: string;
  isCustom?: boolean;
  material?: Material;
}

export interface Material {
  id: string;
  tipo: 'cortina' | 'visillo' | 'oscurante' | 'opacante' | 'combinado' | 'personalizado';
  nombre: string;
  codigo: string;
  precio_tela_m?: number;
  precio_confeccion_m?: number;
  precio_tela_m2?: number;
  precio_confeccion_m2?: number;
  frunce_default: number;
  alto_fijo?: number;
  margen_default: number;
  transporte_pct_default: number;
  coste_riel?: number;
  coste_instalacion?: number;
  transporte_fijo?: number;
  activo: boolean;
  componentes?: string[];
  cantidad_default?: number;
  hueco_default?: number;
  descripcion?: string;
  color?: string;
}

export interface Measurement {
  id: number;
  width: number;
  height: number;
  price: number;
  type: CurtainType | null;
  quantity: number;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  razonSocial: string; // Nuevo campo obligatorio
  cif: string;        // Nuevo campo obligatorio
  direccion: string;
  region: string;
  goal: 'info' | 'simulation';
}

export interface OrderData {
  customer_info: FormData;
  measurements: Measurement[];
  selected_type: CurtainType;
  total_price: number;
  total_units: number;
  selection?: any;
  pricing?: any;
  metadata?: any;
}
