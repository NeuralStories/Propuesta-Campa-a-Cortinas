export interface CortinaInput {
  cantidad: number; // D
  hueco: number; // E
  frunce: number; // F
  precioTela: number; // H
  precioConfeccion: number; // J
  rielBarra: number; // L
  instalacion: number; // M
  margenPct: number; // O
  transportePct: number; // Q
  portesUnidad: number; // S
}

export interface TapiceriaInput {
  cantidad: number; // D
  telaPorUnidad: number; // E
  precioTela: number; // F
  confeccion: number; // H
  relleno: number; // I
  armazon: number; // J
  lacado: number; // K
  instalacion: number; // L
  margenPct: number; // N
  transportePct: number; // P
  portesUnidad: number; // R
}

const round2 = (value: number) => Math.round(value * 100) / 100;

export const calcularCortina = (input: CortinaInput) => {
  const {
    cantidad,
    hueco,
    frunce,
    precioTela,
    precioConfeccion,
    rielBarra,
    instalacion,
    margenPct,
    transportePct,
    portesUnidad
  } = input;

  const telaNecesaria = hueco * frunce; // G
  const totalTejido = telaNecesaria * precioTela; // I
  const confeccion = telaNecesaria * precioConfeccion; // K
  const costeUnidad = totalTejido + confeccion + rielBarra + instalacion; // N
  const precioMargenUnidad = costeUnidad * (margenPct / 100) + costeUnidad; // P
  const pvpUnidad = precioMargenUnidad * (transportePct / 100) + precioMargenUnidad + portesUnidad; // U
  const portesTotales = cantidad * portesUnidad; // T
  const pvpTotal = cantidad * pvpUnidad; // W
  const beneficioTotal = (precioMargenUnidad - costeUnidad) * cantidad; // V
  const dineroTransporteTotal = (pvpUnidad - precioMargenUnidad) * cantidad; // R

  return {
    telaNecesaria: round2(telaNecesaria),
    totalTejido: round2(totalTejido),
    confeccion: round2(confeccion),
    costeUnidad: round2(costeUnidad),
    precioMargenUnidad: round2(precioMargenUnidad),
    pvpUnidad: round2(pvpUnidad),
    portesTotales: round2(portesTotales),
    pvpTotal: round2(pvpTotal),
    beneficioTotal: round2(beneficioTotal),
    dineroTransporteTotal: round2(dineroTransporteTotal)
  };
};

export const calcularTapiceria = (input: TapiceriaInput) => {
  const {
    cantidad,
    telaPorUnidad,
    precioTela,
    confeccion,
    relleno,
    armazon,
    lacado,
    instalacion,
    margenPct,
    transportePct,
    portesUnidad
  } = input;

  const tejido = telaPorUnidad * precioTela; // G
  const costeUnidad = tejido + confeccion + relleno + armazon + lacado + instalacion; // M
  const precioMargenUnidad = costeUnidad * (margenPct / 100) + costeUnidad; // O
  const pvpUnidad = precioMargenUnidad * (transportePct / 100) + precioMargenUnidad + portesUnidad; // T
  const portesTotales = cantidad * portesUnidad; // S
  const pvpTotal = cantidad * pvpUnidad; // V
  const beneficioTotal = (precioMargenUnidad - costeUnidad) * cantidad; // U
  const dineroTransporteTotal = (pvpUnidad - precioMargenUnidad) * cantidad; // Q

  return {
    tejido: round2(tejido),
    costeUnidad: round2(costeUnidad),
    precioMargenUnidad: round2(precioMargenUnidad),
    pvpUnidad: round2(pvpUnidad),
    portesTotales: round2(portesTotales),
    pvpTotal: round2(pvpTotal),
    beneficioTotal: round2(beneficioTotal),
    dineroTransporteTotal: round2(dineroTransporteTotal)
  };
};
