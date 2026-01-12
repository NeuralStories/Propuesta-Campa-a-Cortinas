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
