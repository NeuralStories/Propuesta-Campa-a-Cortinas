import React, { useEffect, useState } from 'react';
import { Material } from '../types';
import { createMaterial, getMaterials, toggleMaterialStatus, updateMaterial } from '../utils/db';
import { calcularCortina } from '../utils/calculations';

const initialMaterial: Material = {
  id: '',
  tipo: 'cortina',
  nombre: '',
  codigo: '',
  precio_tela_m: 0,
  precio_confeccion_m: 0,
  precio_tela_m2: 0,
  precio_confeccion_m2: 0,
  frunce_default: 2.0,
  alto_fijo: 2.8,
  margen_default: 30,
  transporte_pct_default: 5,
  coste_riel: 0,
  coste_instalacion: 0,
  transporte_fijo: 0,
  activo: true,
  componentes: [],
  cantidad_default: 1,
  hueco_default: 1,
  descripcion: '',
  color: ''
};

export const MaterialsManager: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [editing, setEditing] = useState<Material | null>(null);
  const [form, setForm] = useState<any>({ ...initialMaterial });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMaterials();
      setMaterials(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error cargando materiales.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const normalizeMaterial = (raw: any): Material => {
    const parseNumber = (value: any) => {
      if (value === null || value === undefined || value === '') return 0;
      const normalized = String(value).replace(',', '.');
      const parsed = parseFloat(normalized);
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    return {
      ...raw,
      descripcion: raw.descripcion || '',
      color: raw.color || '',
      precio_tela_m: parseNumber(raw.precio_tela_m),
      precio_confeccion_m: parseNumber(raw.precio_confeccion_m),
      precio_tela_m2: parseNumber(raw.precio_tela_m2),
      precio_confeccion_m2: parseNumber(raw.precio_confeccion_m2),
      frunce_default: parseNumber(raw.frunce_default),
      alto_fijo: parseNumber(raw.alto_fijo),
      margen_default: parseNumber(raw.margen_default),
      transporte_pct_default: parseNumber(raw.transporte_pct_default),
      coste_riel: parseNumber(raw.coste_riel),
      coste_instalacion: parseNumber(raw.coste_instalacion),
      transporte_fijo: parseNumber(raw.transporte_fijo),
      cantidad_default: parseNumber(raw.cantidad_default),
      hueco_default: parseNumber(raw.hueco_default),
      componentes: raw.componentes || []
    };
  };

  const handleSave = async () => {
    setErrorMsg(null);
    try {
      const normalized = normalizeMaterial(form);
      if (editing?.id) {
        await updateMaterial(editing.id, normalized);
      } else {
        const payload = { ...normalized };
        delete (payload as any).id;
        await createMaterial(payload as Material);
      }
      setEditing(null);
      setForm({ ...initialMaterial });
      await load();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error guardando material.');
    }
  };

  const format2 = (value: number) => Number.isFinite(value) ? value.toFixed(2) : '0.00';

  const previewCalc = (() => {
    const normalized = normalizeMaterial(form);
    const cantidad = normalized.cantidad_default || 0;
    const hueco = normalized.hueco_default || 0;
    if (!cantidad || !hueco) return null;
    return calcularCortina({
      cantidad,
      hueco,
      frunce: normalized.frunce_default || 0,
      precioTela: normalized.precio_tela_m || 0,
      precioConfeccion: normalized.precio_confeccion_m || 0,
      rielBarra: normalized.coste_riel || 0,
      instalacion: normalized.coste_instalacion || 0,
      margenPct: normalized.margen_default || 0,
      transportePct: normalized.transporte_pct_default || 0,
      portesUnidad: normalized.transporte_fijo || 0
    });
  })();

  const handleEdit = (material: Material) => {
    setEditing(material);
    setForm(material);
  };

  const handleToggle = async (material: Material) => {
    await toggleMaterialStatus(material.id, !material.activo);
    await load();
  };

  const renderFieldsByType = () => {
    if (form.tipo === 'visillo' || form.tipo === 'cortina') {
      return (
        <>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Alto fijo (m)</label>
            <input
              type="text"
              inputMode="decimal"
              className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
              value={form.alto_fijo ?? ''}
              onChange={(e) => setForm({ ...form, alto_fijo: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Precio tela (m)</label>
            <input
              type="text"
              inputMode="decimal"
              className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
              value={form.precio_tela_m ?? ''}
              onChange={(e) => setForm({ ...form, precio_tela_m: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Precio confeccion (m)</label>
            <input
              type="text"
              inputMode="decimal"
              className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
              value={form.precio_confeccion_m ?? ''}
              onChange={(e) => setForm({ ...form, precio_confeccion_m: e.target.value })}
            />
          </div>
        </>
      );
    }

    if (form.tipo === 'oscurante' || form.tipo === 'opacante') {
      return (
        <>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Precio tela (m2)</label>
            <input
              type="text"
              inputMode="decimal"
              className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
              value={form.precio_tela_m2 ?? ''}
              onChange={(e) => setForm({ ...form, precio_tela_m2: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Precio confeccion (m2)</label>
            <input
              type="text"
              inputMode="decimal"
              className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
              value={form.precio_confeccion_m2 ?? ''}
              onChange={(e) => setForm({ ...form, precio_confeccion_m2: e.target.value })}
            />
          </div>
        </>
      );
    }

    if (form.tipo === 'combinado') {
      const disponibles = materials.filter(
        (m) => m.tipo !== 'combinado' && m.tipo !== 'personalizado'
      );

      return (
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Componentes del combinado</label>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            {disponibles.map((material) => {
              const checked = form.componentes?.includes(material.id) || false;
              return (
                <label key={material.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const next = new Set(form.componentes || []);
                      if (e.target.checked) {
                        next.add(material.id);
                      } else {
                        next.delete(material.id);
                      }
                      setForm({ ...form, componentes: Array.from(next) });
                    }}
                  />
                  <span>{material.nombre} ({material.tipo})</span>
                </label>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Selecciona los materiales que componen esta combinacion.
          </p>
        </div>
      );
    }

    return null;
  };

  const parseNumber = (value: string) => {
    const normalized = value.replace(',', '.');
    const parsed = parseFloat(normalized);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{editing ? 'Editar material' : 'Nuevo material'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Tipo</label>
            <select
              className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value as Material['tipo'] })}
            >
              <option value="cortina">Cortina</option>
              <option value="visillo">Visillo</option>
              <option value="oscurante">Oscurante</option>
              <option value="opacante">Opacante</option>
              <option value="combinado">Combinado</option>
              <option value="personalizado">Personalizado</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Nombre</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Descripcion (corta)</label>
            <textarea
              rows={2}
              className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
              value={form.descripcion ?? ''}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Color</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
              value={form.color ?? ''}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Codigo</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
              value={form.codigo}
              onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            />
          </div>
          {renderFieldsByType()}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Cantidad (default)</label>
            <input
              type="text"
              inputMode="decimal"
              className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
              value={form.cantidad_default ?? ''}
              onChange={(e) => setForm({ ...form, cantidad_default: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Hueco (m, default)</label>
            <input
              type="text"
              inputMode="decimal"
              className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
              value={form.hueco_default ?? ''}
              onChange={(e) => setForm({ ...form, hueco_default: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Riel / barra (unidad)</label>
            <input
              type="text"
              inputMode="decimal"
              className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
              value={form.coste_riel ?? ''}
              onChange={(e) => setForm({ ...form, coste_riel: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Instalacion (unidad)</label>
            <input
              type="text"
              inputMode="decimal"
              className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
              value={form.coste_instalacion ?? ''}
              onChange={(e) => setForm({ ...form, coste_instalacion: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Portes proveedor (unidad)</label>
            <input
              type="text"
              inputMode="decimal"
              className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
              value={form.transporte_fijo ?? ''}
              onChange={(e) => setForm({ ...form, transporte_fijo: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Frunce por defecto</label>
            <select
              className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
              value={form.frunce_default}
              onChange={(e) => setForm({ ...form, frunce_default: parseFloat(e.target.value) })}
            >
              <option value="1.5">1.5</option>
              <option value="1.8">1.8</option>
              <option value="2">2.0</option>
              <option value="2.5">2.5</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Margen %</label>
            <input
              type="text"
              inputMode="decimal"
              className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
              value={form.margen_default ?? ''}
              onChange={(e) => setForm({ ...form, margen_default: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Transporte %</label>
            <input
              type="text"
              inputMode="decimal"
              className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
              value={form.transporte_pct_default ?? ''}
              onChange={(e) => setForm({ ...form, transporte_pct_default: e.target.value })}
            />
          </div>
        </div>
        {errorMsg && (
          <div className="mt-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">
            {errorMsg}
          </div>
        )}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium"
          >
            {editing ? 'Actualizar' : 'Guardar'} material
          </button>
          {editing && (
            <button
              onClick={() => {
                setEditing(null);
                setForm({ ...initialMaterial });
              }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Calculo (preview)</h3>
        {!previewCalc ? (
          <p className="text-sm text-gray-500">Introduce cantidad y hueco para ver el calculo.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>ARTICULO: {form.nombre || form.codigo || '-'}</div>
            <div>CANTIDAD: {format2(previewCalc.pvpTotal / (previewCalc.pvpUnidad || 1))}</div>
            <div>HUECO: {format2(normalizeMaterial(form).hueco_default || 0)}</div>
            <div>FRUNCE: {format2(normalizeMaterial(form).frunce_default || 0)}</div>
            <div>TELA QUE SE NECESITA: {format2(previewCalc.telaNecesaria)}</div>
            <div>PRECIO TELA: {format2(normalizeMaterial(form).precio_tela_m || 0)}</div>
            <div>TOTAL PRECIO TEJIDO: {format2(previewCalc.totalTejido)}</div>
            <div>PRECIO CONFECCION: {format2(normalizeMaterial(form).precio_confeccion_m || 0)}</div>
            <div>CONFECCION: {format2(previewCalc.confeccion)}</div>
            <div>RIEL/BARRA: {format2(normalizeMaterial(form).coste_riel || 0)}</div>
            <div>INSTALACION: {format2(normalizeMaterial(form).coste_instalacion || 0)}</div>
            <div>COSTE UNIDAD: {format2(previewCalc.costeUnidad)}</div>
            <div>MARGEN %: {format2(normalizeMaterial(form).margen_default || 0)}</div>
            <div>PRECIO CON MARGEN: {format2(previewCalc.precioMargenUnidad)}</div>
            <div>TRANSPORTE %: {format2(normalizeMaterial(form).transporte_pct_default || 0)}</div>
            <div>DINERO DE TRANSPORTE: {format2(previewCalc.dineroTransporteTotal)}</div>
            <div>PORTES PROVEEDOR: {format2(normalizeMaterial(form).transporte_fijo || 0)}</div>
            <div>PORTES TOTALES: {format2(previewCalc.portesTotales)}</div>
            <div>PVP/UNIDAD: {format2(previewCalc.pvpUnidad)}</div>
            <div>BENEFICIO: {format2(previewCalc.beneficioTotal)}</div>
            <div>PVP/TOTAL: {format2(previewCalc.pvpTotal)}</div>
          </div>
        )}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Materiales</h3>
        {loading ? (
          <div className="text-sm text-gray-500">Cargando...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Codigo</th>
                <th className="py-2">Nombre</th>
                <th className="py-2">Tipo</th>
                <th className="py-2">Descripcion</th>
                <th className="py-2">Margen</th>
                <th className="py-2">Estado</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.id} className="border-t border-gray-100">
                  <td className="py-2">{material.codigo}</td>
                  <td className="py-2">{material.nombre}</td>
                  <td className="py-2">{material.tipo}</td>
                  <td className="py-2">{material.descripcion || '-'}</td>
                  <td className="py-2">{material.margen_default}%</td>
                  <td className="py-2">{material.activo ? 'Activo' : 'Inactivo'}</td>
                  <td className="py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(material)}
                      className="px-2 py-1 text-xs bg-gray-900 text-white rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggle(material)}
                      className="px-2 py-1 text-xs bg-gray-100 border border-gray-200 rounded"
                    >
                      {material.activo ? 'Pausar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
