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
  ingresado_por?: string;
  revisado_por?: string;
  contactado_por?: string;
  fecha_revision?: string;
  fecha_contacto?: string;
  accion_tomada?: string;
  notas_revision?: string;
  notas_contacto?: string;
}

export interface ActivityLog {
  id: string;
  solicitud_id: string;
  user_id: string | null;
  accion: string;
  descripcion: string | null;
  metadata: any;
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

  if (error) throw error;
  return data as Slide;
}

export async function updateSlide(id: string, slide: Partial<Omit<Slide, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('slides')
    .update({ ...slide, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
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

  if (error) throw error;
  return data as Terreno;
}

export async function updateTerreno(id: string, terreno: Partial<Omit<Terreno, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('terrenos')
    .update({ ...terreno, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
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

  if (error) throw error;
  return data as Nosotros;
}

export async function updateNosotros(id: string, nosotros: Partial<Omit<Nosotros, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('nosotros')
    .update({ ...nosotros, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
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
  const updateData: any = { ...solicitud };

  // Si se está cambiando el estado, actualizar los campos de usuario y fecha correspondientes
  if (solicitud.estado) {
    const { data: { user } } = await supabase.auth.getUser();

    if (solicitud.estado === 'revisado') {
      updateData.revisado_por = user?.id;
      updateData.fecha_revision = new Date().toISOString();
    } else if (solicitud.estado === 'contactado') {
      updateData.contactado_por = user?.id;
      updateData.fecha_contacto = new Date().toISOString();
    }
  }

  const { data, error } = await supabase
    .from('compra_venta_propiedades')
    .update(updateData)
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

export async function getActivityLogs(solicitudId: string) {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('solicitud_id', solicitudId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ActivityLog[];
}

export async function createActivityLog(log: Omit<ActivityLog, 'id' | 'created_at'>) {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('activity_logs')
    .insert([{ ...log, user_id: user?.id }])
    .select()
    .single();

  if (error) throw error;
  return data as ActivityLog;
}

export async function getUserEmail(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('users')
    .select('email')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error getting user email:', error);
    return null;
  }

  return data?.email || null;
}
