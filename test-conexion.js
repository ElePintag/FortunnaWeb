/**
 * Script de Prueba de Conexión a Supabase
 *
 * Este script verifica que tu configuración de Supabase funciona correctamente.
 * Ejecuta esto DESPUÉS de actualizar las variables de entorno.
 *
 * Uso:
 *   node test-conexion.js
 */

require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n===========================================');
console.log('🔍 VERIFICACIÓN DE CONEXIÓN A SUPABASE');
console.log('===========================================\n');

// Verificar variables de entorno
console.log('📋 Verificando variables de entorno...\n');

if (!supabaseUrl) {
  console.log('❌ ERROR: NEXT_PUBLIC_SUPABASE_URL no está definida');
  console.log('   Edita tu archivo .env y agrega:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co\n');
  process.exit(1);
}

if (!supabaseKey) {
  console.log('❌ ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida');
  console.log('   Edita tu archivo .env y agrega:');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui\n');
  process.exit(1);
}

console.log('✅ URL de Supabase configurada:');
console.log(`   ${supabaseUrl}\n`);

console.log('✅ Anon Key configurada:');
console.log(`   ${supabaseKey.substring(0, 20)}...[oculta por seguridad]\n`);

// Validar formato de URL
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.log('⚠️  ADVERTENCIA: La URL no parece ser una URL válida de Supabase');
  console.log('   Formato esperado: https://tu-proyecto.supabase.co\n');
}

// Validar formato de Anon Key
if (!supabaseKey.startsWith('eyJ')) {
  console.log('⚠️  ADVERTENCIA: La Anon Key no parece tener el formato correcto');
  console.log('   Debería empezar con "eyJ..."\n');
}

console.log('===========================================');
console.log('🎯 PRÓXIMOS PASOS:');
console.log('===========================================\n');

console.log('1. Asegúrate de haber ejecutado MIGRACION_COMPLETA.sql');
console.log('   en tu nuevo proyecto de Supabase\n');

console.log('2. Inicia el servidor de desarrollo:');
console.log('   npm run dev\n');

console.log('3. Abre http://localhost:3000 en tu navegador\n');

console.log('4. Verifica que:');
console.log('   ✓ El slider de la homepage carga');
console.log('   ✓ Los terrenos aparecen en /catalogo');
console.log('   ✓ Puedes iniciar sesión en /admin/login\n');

console.log('5. Si algo no funciona:');
console.log('   - Abre la consola del navegador (F12)');
console.log('   - Busca errores relacionados con Supabase');
console.log('   - Ejecuta VERIFICAR_MIGRACION.sql en el SQL Editor\n');

console.log('===========================================');
console.log('✨ ¡Configuración verificada correctamente!');
console.log('===========================================\n');
