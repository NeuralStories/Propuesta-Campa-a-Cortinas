import React from 'react';

export const FormulasManager: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Formulas</h2>
      <div className="text-sm text-gray-600 space-y-3">
        <div>
          <p className="font-medium text-gray-800 mb-1">Cortina</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Tela necesaria = hueco × frunce</li>
            <li>Tejido = tela necesaria × precio tela</li>
            <li>Confeccion = tela necesaria × precio confeccion</li>
            <li>Coste unidad = tejido + confeccion + riel/barra + instalacion</li>
            <li>Precio con margen = coste unidad × (margen/100) + coste unidad</li>
            <li>PVP unidad = precio margen × (transporte/100) + precio margen + portes unidad</li>
            <li>Portes totales = cantidad × portes unidad</li>
            <li>PVP total = cantidad × PVP unidad</li>
            <li>Beneficio = (precio margen - coste unidad) × cantidad</li>
            <li>Dinero transporte = (PVP unidad - precio margen) × cantidad</li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-gray-800 mb-1">Tapiceria</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Tejido = tela por unidad × precio tela</li>
            <li>Coste unidad = tejido + confeccion + relleno + armazon + lacado + instalacion</li>
            <li>Precio con margen = coste unidad × (margen/100) + coste unidad</li>
            <li>PVP unidad = precio margen × (transporte/100) + precio margen + portes unidad</li>
            <li>Portes totales = cantidad × portes unidad</li>
            <li>PVP total = cantidad × PVP unidad</li>
            <li>Beneficio = (precio margen - coste unidad) × cantidad</li>
            <li>Dinero transporte = (PVP unidad - precio margen) × cantidad</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
