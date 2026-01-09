import { CurtainType } from './types';

export const MINIMUM_UNITS = 10;
export const MAX_HEIGHT = 270;
export const HIDE_PRICE_THRESHOLD = 100;

export const CURTAIN_TYPES: CurtainType[] = [
  { id: 'cortina', label: 'Cortina', pricePerM2: 25, description: 'Cortina confeccionada con ancho fijo de 270 cm.' },
  { id: 'visillo', label: 'Visillo', pricePerM2: 25, description: 'Tejido ligero que deja pasar la luz pero otorga privacidad.' },
  { id: 'oscurante', label: 'Oscurante', pricePerM2: 35, description: 'Bloquea gran parte de la luz, ideal para dormitorios.' },
  { id: 'opacante', label: 'Opacante', pricePerM2: 45, description: 'Bloqueo total de luz (Blackout). Maxima oscuridad.' },
  { id: 'visillos+oscurante', label: 'Visillo + Oscurante', pricePerM2: 35, description: 'Combinacion de visillo con tejido oscurante.' },
  { id: 'visillos+opacante', label: 'Visillo + Opacante', pricePerM2: 45, description: 'Combinacion de visillo con tejido opacante.' },
  { id: 'personalizado', label: 'Personalizado', pricePerM2: 0, description: 'Combinacion personalizada sin calculo automatico.', isCustom: true },
];
