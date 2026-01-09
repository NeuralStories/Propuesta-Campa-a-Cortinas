import React, { useState, useEffect } from 'react';
import { CurtainType, Material } from '../types';

interface Step2Props {
  materials: Material[];
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedType: CurtainType | null;
  setSelectedType: React.Dispatch<React.SetStateAction<CurtainType | null>>;
  combinedComponents: Material[];
  setCombinedComponents: React.Dispatch<React.SetStateAction<Material[]>>;
}

export const Step2: React.FC<Step2Props> = ({
  materials = [],
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  combinedComponents,
  setCombinedComponents
}) => {
  const typeOptions = [
    { id: 'cortina', label: 'Cortinas' },
    { id: 'visillo', label: 'Visillos' },
    { id: 'oscurante', label: 'Oscurante' },
    { id: 'opacante', label: 'Opacante' },
    { id: 'combinado', label: 'Combinado' },
    { id: 'personalizado', label: 'Personalizado' }
  ];
  const typeLabels: Record<string, string> = {
    cortina: 'Cortinas',
    visillo: 'Visillos',
    oscurante: 'Oscurante',
    opacante: 'Opacante',
    combinado: 'Combinado',
    personalizado: 'Personalizado'
  };
  const availableByType = (tipo: string) => materials.filter((m) => m.tipo === tipo);

  const [descripcionPersonalizada, setDescripcionPersonalizada] = useState<string>(
    selectedType?.customDescription || ''
  );
  const [selectedComponentType, setSelectedComponentType] = useState<string>('');
  const [selectedComponentId, setSelectedComponentId] = useState<string>('');

  useEffect(() => {
    if (selectedType?.material?.tipo) {
      setSelectedCategory(selectedType.material.tipo);
    }
    if (selectedType?.isCustom && selectedType.id === 'personalizado') {
      setSelectedCategory('personalizado');
    }
    if (selectedType?.customDescription) {
      setDescripcionPersonalizada(selectedType.customDescription);
    }
  }, [selectedType]);

  const buildCurtainType = (material: Material): CurtainType => ({
    id: material.id,
    label: material.nombre || material.codigo,
    description: material.codigo || '',
    pricePerM2: 0,
    isCustom: material.tipo === 'personalizado',
    material
  });

  const handleSelectMaterial = (material: Material) => {
    setSelectedType(buildCurtainType(material));
  };

  const handleDescripcion = (value: string) => {
    setDescripcionPersonalizada(value);
    if (selectedCategory === 'personalizado') {
      setSelectedType({
        id: 'personalizado',
        label: 'Personalizado',
        description: '',
        pricePerM2: 0,
        isCustom: true,
        customDescription: value
      });
    }
  };

  const handleAddComponent = (direct?: Material) => {
    const material = direct || materials.find((m) => m.id === selectedComponentId);
    if (!material) return;
    if (combinedComponents.find((m) => m.id === material.id)) {
      setSelectedComponentId('');
      return;
    }
    setCombinedComponents([...combinedComponents, material]);
    setSelectedComponentId('');
    setSelectedComponentType('');
  };

  const handleRemoveComponent = (id: string) => {
    setCombinedComponents(combinedComponents.filter((m) => m.id !== id));
  };

  return (
    <div className="flex flex-col h-full animate-fadeIn">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
        Selecciona el tipo de cortina
      </h2>
      <p className="text-sm md:text-base text-gray-600 mb-6">
        Elige la opcion que mejor se adapte a tu espacio.
      </p>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3 order-2 md:order-2">
          {typeOptions.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setSelectedCategory(type.id);
                setSelectedType(null);
                setCombinedComponents([]);
              }}
              className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all text-left active:scale-[0.98] ${
                selectedCategory === type.id
                  ? 'border-orange-500 bg-orange-50 shadow-sm' 
                  : 'border-gray-200 hover:border-orange-200 bg-white'
              }`}
            >
              <span className="font-medium text-gray-800">{type.label}</span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedType?.id === type.id ? 'border-orange-500' : 'border-gray-300'
              }`}>
                {selectedCategory === type.id && (
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                )}
              </div>
            </button>
          ))}

          {selectedCategory === 'personalizado' && (
            <div className="input-personalizado mt-3">
              <textarea
                placeholder="Describe tu combinacion personalizada..."
                rows={3}
                value={descripcionPersonalizada}
                onChange={(e) => handleDescripcion(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
              <small className="nota-personalizado block mt-2 text-xs text-gray-500">
                Nota: Las combinaciones personalizadas no calculan precio automaticamente.
              </small>
            </div>
          )}
        </div>

        <div className="order-1 md:order-1 bg-white rounded-xl overflow-hidden border border-gray-100 flex flex-col shadow-sm mb-4 md:mb-0 h-fit">
          <div className="h-40 bg-gray-50 relative overflow-hidden border-b border-gray-100">
            <img
              src="/image/curtain-pleats.png"
              alt="Cortina"
              className="w-full h-full object-cover"
            />
            {selectedType && (
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-600 shadow-sm border border-gray-200">
                {selectedType.label}
              </div>
            )}
          </div>
          <div className="p-4 md:p-6 bg-orange-50/50 flex-1">
            <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2">
              Tipo de Confeccion
            </h3>
            {selectedType ? (
              <div className="animate-fadeIn">
                <p className="font-medium text-gray-800 mb-2">{selectedType.label}</p>
                <div className="pt-4 border-t border-orange-200">
                  <p className="text-sm font-bold text-gray-800">
                    Revisa las medidas en el siguiente paso
                  </p>
                </div>
              </div>
            ) : selectedCategory === 'combinado' ? (
              <div className="text-gray-600 text-sm">
                {combinedComponents.length === 0 ? (
                  <p>Selecciona articulos para combinar.</p>
                ) : (
                  <div className="space-y-2">
                    {combinedComponents.map((item) => (
                      <div key={item.id}>
                        <div className="font-medium text-gray-800">{item.nombre}</div>
                        <div className="text-xs text-gray-500">{item.descripcion || item.codigo}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : selectedCategory ? (
              <p className="text-gray-600 text-sm">
                Seleccionaste: <strong>{typeLabels[selectedCategory]}</strong>
              </p>
            ) : (
              <p className="text-gray-500 text-sm italic">
                Selecciona una opcion para ver los detalles.
              </p>
            )}

            {materials.length === 0 && (
              <p className="text-sm text-red-600">
                No se pueden cargar materiales. Revisa permisos de lectura en Supabase.
              </p>
            )}

            {selectedCategory && selectedCategory !== 'combinado' && selectedCategory !== 'personalizado' && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase">Opciones disponibles</p>
                {availableByType(selectedCategory).length === 0 ? (
                  <p className="text-sm text-gray-500">No hay materiales disponibles para este tipo.</p>
                ) : (
                  availableByType(selectedCategory).map((material) => (
                    <button
                      key={material.id}
                      onClick={() => handleSelectMaterial(material)}
                      className={`w-full p-3 rounded-lg border text-left text-sm ${
                        selectedType?.material?.id === material.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-200 bg-white'
                      }`}
                    >
                      <div className="font-medium text-gray-800">{material.nombre}</div>
                      <div className="text-xs text-gray-500">{material.codigo}</div>
                      {material.descripcion && (
                        <div className="text-xs text-gray-500 mt-1">{material.descripcion}</div>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}

            {selectedCategory === 'personalizado' && (
              <div className="input-personalizado mt-4">
                <textarea
                  placeholder="Describe tu combinacion personalizada..."
                  rows={3}
                  value={descripcionPersonalizada}
                  onChange={(e) => handleDescripcion(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
                <small className="nota-personalizado block mt-2 text-xs text-gray-500">
                  Nota: Las combinaciones personalizadas no calculan precio automaticamente.
                </small>
              </div>
            )}

            {selectedCategory === 'combinado' && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase">Combinar articulos</p>
                <div className="grid grid-cols-2 gap-2">
                  {['cortina', 'visillo', 'oscurante', 'opacante'].map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => {
                        setSelectedComponentType(tipo);
                        setSelectedComponentId('');
                      }}
                      className={`p-2 rounded-lg border text-xs uppercase ${
                        selectedComponentType === tipo
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {typeLabels[tipo]}
                    </button>
                  ))}
                </div>
                {selectedComponentType && (
                  <div className="mt-2 space-y-2">
                    {availableByType(selectedComponentType).map((material) => (
                      <div key={material.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                        <div>
                          <div className="font-medium text-gray-800">{material.nombre}</div>
                          <div className="text-xs text-gray-500">{material.codigo}</div>
                        </div>
                        <button
                          onClick={() => handleAddComponent(material)}
                          className="px-2 py-1 text-xs bg-gray-900 text-white rounded"
                        >
                          +
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {combinedComponents.length > 0 && (
                  <div className="space-y-2">
                    {combinedComponents.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm border border-gray-200 rounded-lg p-2">
                        <span>{item.nombre} ({item.tipo})</span>
                        <button
                          onClick={() => handleRemoveComponent(item.id)}
                          className="text-xs text-red-600"
                        >
                          Quitar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
