import React, { useEffect, useState } from 'react';
import { Ruler, AlertCircle, Plus, Minus, Trash2 } from 'lucide-react';
import { CurtainType, Measurement, Material } from '../types';
import { calcularCortina } from '../admin/utils/calculations';

interface Step3Props {
  measurements: Measurement[];
  setMeasurements: React.Dispatch<React.SetStateAction<Measurement[]>>;
  selectedType: CurtainType | null;
  selectedMaterials: Material[];
  totalPrice: number;
  hidePrice: boolean;
  maxHeight: number;
  minUnits: number;
  totalUnits: number;
  isCustomCombination: boolean;
}

export const Step3: React.FC<Step3Props> = ({
  measurements,
  setMeasurements,
  selectedType,
  selectedMaterials,
  totalPrice,
  hidePrice,
  maxHeight,
  minUnits,
  totalUnits,
  isCustomCombination
}) => {
  const [inputsByMaterial, setInputsByMaterial] = useState<Record<string, { width: string; height: string; heightError: boolean }>>({});

  useEffect(() => {
    setInputsByMaterial((prev) => {
      const next: Record<string, { width: string; height: string; heightError: boolean }> = {};
      selectedMaterials.forEach((material) => {
        next[material.id] = prev[material.id] || { width: '', height: '', heightError: false };
      });
      return next;
    });
  }, [selectedMaterials]);
  const normalizeNumber = (value: string) => value.replace(',', '.');

  const buildCurtainType = (material: Material): CurtainType => ({
    id: material.id,
    label: material.nombre || material.codigo,
    description: material.codigo || '',
    pricePerM2: 0,
    isCustom: material.tipo === 'personalizado',
    material
  });

  const handleAdd = (material: Material) => {
    const input = inputsByMaterial[material.id];
    const w = parseFloat(normalizeNumber(input?.width || ''));
    const h = parseFloat(normalizeNumber(input?.height || ''));

    if (!w || !h) return;
    if (h > maxHeight) {
      setInputsByMaterial((prev) => ({
        ...prev,
        [material.id]: { ...prev[material.id], heightError: true }
      }));
      return;
    }

    setInputsByMaterial((prev) => ({
      ...prev,
      [material.id]: { ...prev[material.id], heightError: false }
    }));

    const huecoMetros = w / 100;
    const anchoFijoM = 2.7;
    const precioTelaLineal = material.precio_tela_m || (material.precio_tela_m2 ? material.precio_tela_m2 * anchoFijoM : 0);
    const precioConfeccionLineal = material.precio_confeccion_m || (material.precio_confeccion_m2 ? material.precio_confeccion_m2 * anchoFijoM : 0);

    const price = isCustomCombination
      ? 0
      : calcularCortina({
          cantidad: 1,
          hueco: huecoMetros,
          frunce: material.frunce_default || 0,
          precioTela: precioTelaLineal,
          precioConfeccion: precioConfeccionLineal,
          rielBarra: material.coste_riel || 0,
          instalacion: material.coste_instalacion || 0,
          margenPct: material.margen_default || 0,
          transportePct: material.transporte_pct_default || 0,
          portesUnidad: material.transporte_fijo || 0
        }).pvpUnidad;

    const type = buildCurtainType(material);
    setMeasurements([...measurements, {
      id: Date.now(),
      width: w,
      height: h,
      price: price,
      type,
      quantity: 1
    }]);

    setInputsByMaterial((prev) => ({
      ...prev,
      [material.id]: { width: '', height: '', heightError: false }
    }));
  };

  const removeMeasurement = (id: number) => {
    setMeasurements(measurements.filter(m => m.id !== id));
  };

  const updateQuantity = (id: number, change: number) => {
    setMeasurements(measurements.map(m => {
      if (m.id === id) {
        const newQty = Math.max(1, m.quantity + change);
        return { ...m, quantity: newQty };
      }
      return m;
    }));
  };

  const inputClass = "w-full p-3 pl-10 text-base border border-gray-200 rounded-lg outline-none bg-white text-gray-900 placeholder-gray-400 focus:border-orange-500 transition-colors duration-200";

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">
        ¿Que medidas necesitas?
      </h2>

      <div className="explicacion-medidas bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-600">
        <h4 className="font-bold text-gray-800 mb-1">¿Por que son importantes las medidas correctas?</h4>
        <p>
          Tomar las medidas correctamente garantiza que tu cortina se ajuste perfectamente
          a tu ventana, evitando espacios y asegurando un acabado profesional.
        </p>
        <a 
          href="https://www.youtube.com/watch?v=VIDEO_MEDIDAS" 
          target="_blank" 
          rel="noopener noreferrer"
          className="link-video inline-flex items-center mt-2 text-orange-600 font-medium"
        >
          Ver video tutorial: Como tomar medidas correctamente
        </a>
      </div>

      {selectedType && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-600 mb-2">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          Tipo: <strong>{selectedType.label}</strong>
        </div>
      )}

      {selectedMaterials.length === 0 && (
        <div className="text-sm text-gray-500">
          Selecciona un articulo en el paso anterior para continuar.
        </div>
      )}

      {selectedMaterials.map((material) => {
        const input = inputsByMaterial[material.id] || { width: '', height: '', heightError: false };
        const itemsForMaterial = measurements.filter((m) => m.type?.material?.id === material.id);
        return (
          <div key={material.id} className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Tipo: {material.tipo}</p>
                <p className="text-sm font-bold text-gray-800">Modelo: {material.nombre}</p>
                <p className="text-xs text-gray-500">{material.codigo}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hueco / Ancho (cm)</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={input.width}
                    onChange={(e) => setInputsByMaterial((prev) => ({
                      ...prev,
                      [material.id]: { ...prev[material.id], width: normalizeNumber(e.target.value) }
                    }))}
                    className={inputClass}
                    style={{ appearance: 'textfield', WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                    placeholder="Ej. 150"
                  />
                  <Ruler className="absolute left-3 top-3.5 text-gray-400" size={18} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alto (cm)</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={input.height}
                    onChange={(e) => {
                      setInputsByMaterial((prev) => ({
                        ...prev,
                        [material.id]: { ...prev[material.id], height: normalizeNumber(e.target.value), heightError: false }
                      }));
                    }}
                    className={`w-full p-3 pl-10 text-base border rounded-lg outline-none transition-colors text-gray-900 placeholder-gray-400 ${
                      input.heightError 
                        ? 'border-red-300 focus:border-red-500 bg-red-50' 
                        : 'border-gray-200 focus:border-orange-500 bg-white'
                    }`}
                    style={{ appearance: 'textfield', WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                    placeholder="Ej. 250"
                  />
                  <Ruler className="absolute left-3 top-3.5 text-gray-400" size={18} />
                </div>
                {input.heightError && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 flex gap-2 items-start animate-fadeIn">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">¡Atencion!</p>
                      <p>El alto no puede superar los {maxHeight}cm. <a href="#" className="underline font-medium">Contactanos aqui</a> para medidas especiales.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => handleAdd(material)}
              disabled={!input.width || !input.height}
              className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transform"
            >
              <Plus size={20} /> Anadir
            </button>

            {itemsForMaterial.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Medidas</h4>
                {itemsForMaterial.map((m, idx) => (
                  <div key={m.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{m.width}cm x {m.height}cm</p>
                        <p className="text-xs text-gray-500">{m.type?.label}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(m.id, -1)}
                          className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-bold text-gray-700 min-w-[30px] text-center">{m.quantity}</span>
                        <button
                          onClick={() => updateQuantity(m.id, 1)}
                          className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-800">
                          {hidePrice ? 'Consultar' : `${(m.price * m.quantity).toFixed(2)}€`}
                        </span>
                        <button onClick={() => removeMeasurement(m.id)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {measurements.length > 0 && totalUnits < minUnits && (
        <div className="error-medidas p-3 bg-orange-50 border border-orange-100 rounded-lg text-xs text-orange-700">
          Faltan unidades minimas. Por favor, completa todas las medidas requeridas.
        </div>
      )}


    </div>
  );
};
