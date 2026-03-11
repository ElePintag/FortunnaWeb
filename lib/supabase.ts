import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Slide {
  id: string;
  titulo: string;
  subtitulo: string | null;
  imagen_url: string;
  link_opcional: string | null;
  orden: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Terreno {
  id: string;
  nombre: string;
  slug: string;
  ubicacion: string;
  precio: number;
  superficie_m2: number;
  estado: 'disponible' | 'vendido';
  descripcion: string | null;
  imagenes: string[];
  destacado: boolean;
  fecha_publicacion: string;
  revisado: boolean;
  revisado_por: string | null;
  comentario_revision: string | null;
  contactado: boolean;
  contactado_por: string | null;
  detalle_contacto: string | null;
  created_at: string;
  updated_at: string;
}

export interface Nosotros {
  id: string;
  tipo: 'vision' | 'mision' | 'valores' | 'resena_historica';
  titulo: string;
  contenido: string;
  imagenes: string[];
  orden: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrabajeConNosotros {
  id: string;
  nombre_completo: string;
  email: string;
  telefono: string;
  area_interes: string;
  mensaje: string | null;
  estado: 'nuevo' | 'revisado' | 'contactado';
  created_at: string;
}

export interface CompraVentaPropiedad {
  id: string;
  nombre_completo: string;
  email: string;
  telefono: string;
  tipo_interes: 'compra' | 'venta';
  mensaje: string | null;
  estado: 'nuevo' | 'revisado' | 'contactado';
  created_at: string;
}

export interface Configuracion {
  id: string;
  clave: string;
  valor: string | null;
  tipo: 'texto' | 'imagen' | 'numero' | 'boolean';
  descripcion: string | null;
  updated_at: string;
}

export interface SystemLog {
  id: string;
  tipo: 'error' | 'info' | 'warning' | 'success' | 'user_action';
  modulo: string;
  mensaje: string;
  detalles: any | null;
  usuario_email: string | null;
  created_at: string;
}

export async function getSlides() {
  const { data, error } = await supabase
    .from('slides')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true });

  if (error) throw error;
  return data as Slide[];
}

export async function getTerrenos(filters?: {
  estado?: string;
  ubicacion?: string;
  precioMin?: number;
  precioMax?: number;
}) {
  let query = supabase.from('terrenos').select('*');

  if (filters?.estado) {
    query = query.eq('estado', filters.estado);
  }

  if (filters?.ubicacion) {
    query = query.ilike('ubicacion', `%${filters.ubicacion}%`);
  }

  if (filters?.precioMin) {
    query = query.gte('precio', filters.precioMin);
  }

  if (filters?.precioMax) {
    query = query.lte('precio', filters.precioMax);
  }

  query = query.order('fecha_publicacion', { ascending: false });

  const { data, error } = await query;

  if (error) throw error;
  return data as Terreno[];
}

export async function getTerrenosFeatured() {
  const { data, error } = await supabase
    .from('terrenos')
    .select('*')
    .eq('destacado', true)
    .eq('estado', 'disponible')
    .order('fecha_publicacion', { ascending: false })
    .limit(3);

  if (error) throw error;
  return data as Terreno[];
}

export async function getTerrenoBySlug(slug: string) {
  const { data, error } = await supabase
    .from('terrenos')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data as Terreno | null;
}

// CRUD operations for Slides
export async function getAllSlides() {
  const { data, error } = await supabase
    .from('slides')
    .select('*')
    .order('orden', { ascending: true });

  if (error) throw error;
  return data as Slide[];
}

export async function createSlide(slide: Omit<Slide, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('slides')
    .insert([slide])
    .select()
    .single();

  if (error) {
    console.error('Error en createSlide:', error);
    throw new Error(`Error al crear slide: ${error.message || 'Error desconocido'}`);
  }
  return data as Slide;
}

export async function updateSlide(id: string, slide: Partial<Omit<Slide, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('slides')
    .update({ ...slide, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error en updateSlide:', error);
    throw new Error(`Error al actualizar slide: ${error.message || 'Error desconocido'}`);
  }
  return data as Slide;
}

export async function deleteSlide(id: string) {
  const { error } = await supabase
    .from('slides')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// CRUD operations for Terrenos
export async function getAllTerrenos() {
  const { data, error } = await supabase
    .from('terrenos')
    .select('*')
    .order('fecha_publicacion', { ascending: false });

  if (error) throw error;
  return data as Terreno[];
}

export async function createTerreno(terreno: Omit<Terreno, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('terrenos')
    .insert([terreno])
    .select()
    .single();

  if (error) {
    console.error('Error en createTerreno:', error);
    throw new Error(`Error al crear terreno: ${error.message || 'Error desconocido'}`);
  }
  return data as Terreno;
}

export async function updateTerreno(id: string, terreno: Partial<Omit<Terreno, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('terrenos')
    .update({ ...terreno, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error en updateTerreno:', error);
    throw new Error(`Error al actualizar terreno: ${error.message || 'Error desconocido'}`);
  }
  return data as Terreno;
}

export async function deleteTerreno(id: string) {
  const { error } = await supabase
    .from('terrenos')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// CRUD operations for Nosotros
export async function getNosotros() {
  const { data, error } = await supabase
    .from('nosotros')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true });

  if (error) throw error;
  return data as Nosotros[];
}

export async function getAllNosotros() {
  const { data, error } = await supabase
    .from('nosotros')
    .select('*')
    .order('orden', { ascending: true });

  if (error) throw error;
  return data as Nosotros[];
}

export async function createNosotros(nosotros: Omit<Nosotros, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('nosotros')
    .insert([nosotros])
    .select()
    .single();

  if (error) {
    console.error('Error en createNosotros:', error);
    throw new Error(`Error al crear sección: ${error.message || 'Error desconocido'}`);
  }
  return data as Nosotros;
}

export async function updateNosotros(id: string, nosotros: Partial<Omit<Nosotros, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('nosotros')
    .update({ ...nosotros, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error en updateNosotros:', error);
    throw new Error(`Error al actualizar sección: ${error.message || 'Error desconocido'}`);
  }
  return data as Nosotros;
}

export async function deleteNosotros(id: string) {
  const { error } = await supabase
    .from('nosotros')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// CRUD operations for TrabajeConNosotros
export async function getAllTrabajeConNosotros() {
  const { data, error } = await supabase
    .from('trabaje_con_nosotros')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as TrabajeConNosotros[];
}

export async function createTrabajeConNosotros(aplicacion: Omit<TrabajeConNosotros, 'id' | 'created_at' | 'estado'>) {
  const { data, error } = await supabase
    .from('trabaje_con_nosotros')
    .insert([{ ...aplicacion, estado: 'nuevo' }])
    .select()
    .single();

  if (error) throw error;
  return data as TrabajeConNosotros;
}

export async function updateTrabajeConNosotros(id: string, aplicacion: Partial<Omit<TrabajeConNosotros, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('trabaje_con_nosotros')
    .update(aplicacion)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as TrabajeConNosotros;
}

export async function deleteTrabajeConNosotros(id: string) {
  const { error } = await supabase
    .from('trabaje_con_nosotros')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// CRUD operations for Configuracion
export async function getConfiguracion() {
  const { data, error } = await supabase
    .from('configuracion')
    .select('*');

  if (error) throw error;
  return data as Configuracion[];
}

export async function getConfiguracionByClave(clave: string) {
  const { data, error } = await supabase
    .from('configuracion')
    .select('*')
    .eq('clave', clave)
    .maybeSingle();

  if (error) throw error;
  return data as Configuracion | null;
}

export async function updateConfiguracion(clave: string, valor: string) {
  const { data, error } = await supabase
    .from('configuracion')
    .update({ valor, updated_at: new Date().toISOString() })
    .eq('clave', clave)
    .select()
    .single();

  if (error) throw error;
  return data as Configuracion;
}

// CRUD operations for CompraVentaPropiedades
export async function getAllCompraVentaPropiedades() {
  const { data, error } = await supabase
    .from('compra_venta_propiedades')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as CompraVentaPropiedad[];
}

export async function createCompraVentaPropiedad(solicitud: Omit<CompraVentaPropiedad, 'id' | 'created_at' | 'estado'>) {
  const { data, error } = await supabase
    .from('compra_venta_propiedades')
    .insert([{ ...solicitud, estado: 'nuevo' }])
    .select()
    .single();

  if (error) throw error;
  return data as CompraVentaPropiedad;
}

export async function updateCompraVentaPropiedad(id: string, solicitud: Partial<Omit<CompraVentaPropiedad, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('compra_venta_propiedades')
    .update(solicitud)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as CompraVentaPropiedad;
}

export async function deleteCompraVentaPropiedad(id: string) {
  const { error } = await supabase
    .from('compra_venta_propiedades')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getAllLogs(filters?: {
  tipo?: string;
  modulo?: string;
  limit?: number;
}) {
  let query = supabase
    .from('system_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.tipo) {
    query = query.eq('tipo', filters.tipo);
  }

  if (filters?.modulo) {
    query = query.eq('modulo', filters.modulo);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as SystemLog[];
}

export async function createLog(log: Omit<SystemLog, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('system_logs')
    .insert([log])
    .select()
    .single();

  if (error) throw error;
  return data as SystemLog;
}

export async function deleteLog(id: string) {
  const { error } = await supabase
    .from('system_logs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
