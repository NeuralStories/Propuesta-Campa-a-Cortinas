import { supabase } from './supabaseClient';
import { Material } from '../types';

export const getMaterials = async () => {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Material[];
};

export const createMaterial = async (material: Material) => {
  const { data, error } = await supabase
    .from('materials')
    .insert([material])
    .select();

  if (error) throw error;
  return data?.[0] as Material;
};

export const updateMaterial = async (id: string, material: Partial<Material>) => {
  const { data, error } = await supabase
    .from('materials')
    .update(material)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data?.[0] as Material;
};

export const toggleMaterialStatus = async (id: string, activo: boolean) => {
  const { error } = await supabase
    .from('materials')
    .update({ activo })
    .eq('id', id);

  if (error) throw error;
};
