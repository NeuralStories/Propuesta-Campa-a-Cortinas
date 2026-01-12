import React from 'react';
import { Check, Building2, FileText } from 'lucide-react';
import { FormData } from '../types';
import { validateCIF, validateEmail, validatePhone } from '../utils/validation';

interface Step1Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export const Step1: React.FC<Step1Props> = ({ formData, setFormData }) => {
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const inputBaseClass = "w-full p-2 md:p-2.5 text-sm border rounded-lg outline-none transition-colors duration-200 placeholder-gray-400";
  const inputDefaultClass = "bg-white border-gray-200 text-gray-900 focus:border-orange-500 focus:bg-white";
  const inputErrorClass = "bg-orange-50 border-orange-200 text-gray-900 focus:border-orange-500";
  const isCifValid = formData.cif ? validateCIF(formData.cif.toUpperCase()) : false;
  const isEmailValid = formData.email ? validateEmail(formData.email) : false;
  const isPhoneValid = formData.phone ? validatePhone(formData.phone) : false;
  const isRegionValid = formData.region ? true : false;

  return (
    <div className="space-y-3 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-gray-800 leading-tight">
          Asistente de renovación
        </h2>
        <p className="text-sm text-gray-600">
          Déjanos tus datos profesionales (Todos obligatorios).
        </p>
      </div>

      {/* Seccion Datos Facturación - SIEMPRE EN LINEA (2 cols) */}
      <div>
          <h3 className="text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-2">
             <Building2 size={14} /> Datos de Facturación
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Razón Social *</label>
              <input
                type="text"
                value={formData.razonSocial}
                onChange={(e) => handleChange('razonSocial', e.target.value)}
                className={`${inputBaseClass} ${!formData.razonSocial ? inputErrorClass : inputDefaultClass}`}
                placeholder="Empresa S.L."
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">CIF / NIF *</label>
              <input
                type="text"
                value={formData.cif}
                onChange={(e) => handleChange('cif', e.target.value.toUpperCase().replace(/\s|-/g, ''))}
                className={`${inputBaseClass} ${(!formData.cif || !isCifValid) ? inputErrorClass : inputDefaultClass}`}
                placeholder="B12345678"
              />
            </div>
          </div>
      </div>

      {/* Seccion Datos Contacto */}
      <div>
        <h3 className="text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-2">
           <FileText size={14} /> Datos de Contacto
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Nombre *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className={`${inputBaseClass} ${!formData.firstName ? inputErrorClass : inputDefaultClass}`}
              placeholder="Nombre"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Apellidos *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className={`${inputBaseClass} ${!formData.lastName ? inputErrorClass : inputDefaultClass}`}
              placeholder="Apellidos"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`${inputBaseClass} ${(!formData.email || !isEmailValid) ? inputErrorClass : inputDefaultClass}`}
              placeholder="email@empresa.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Teléfono *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`${inputBaseClass} ${(!formData.phone || !isPhoneValid) ? inputErrorClass : inputDefaultClass}`}
              placeholder="600 000 000"
            />
          </div>
        </div>
      </div>


      <div>
        <h3 className="text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-2">
           <Building2 size={14} /> Datos de Entrega
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Direccion *</label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              className={`${inputBaseClass} ${!formData.direccion ? inputErrorClass : inputDefaultClass}`}
              placeholder="Calle, numero, ciudad"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Zona *</label>
            <select
              value={formData.region}
              onChange={(e) => handleChange('region', e.target.value)}
              className={`${inputBaseClass} ${!isRegionValid ? inputErrorClass : inputDefaultClass}`}
            >
              <option value="">Selecciona una zona</option>
              <option value="Illes Balears">Illes Balears</option>
              <option value="Peninsula">Peninsula</option>
              <option value="Islas Canarias">Islas Canarias</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-1">
        <label className="text-xs font-medium text-gray-700 mb-2 block">¿Qué deseas hacer?</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'info', label: 'Más información' },
            { id: 'simulation', label: 'Mis Medidas' }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => handleChange('goal', option.id as any)}
              className={`p-2.5 rounded-xl border-2 flex items-center justify-between transition-all active:scale-[0.98] ${
                formData.goal === option.id 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-orange-200 bg-white'
              }`}
            >
              <span className="font-medium text-gray-800 text-left text-xs">
                {option.label}
              </span>
              {formData.goal === option.id && (
                <Check className="text-orange-500 shrink-0 ml-1" size={14} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

