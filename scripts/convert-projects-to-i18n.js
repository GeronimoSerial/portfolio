/**
 * Script para convertir projects.json a estructura bilingüe
 * 
 * Uso:
 *   node scripts/convert-projects-to-i18n.js
 * 
 * Este script:
 * 1. Lee data/projects.json
 * 2. Crea backup en data/projects.backup.json
 * 3. Convierte title y description a objetos { en: "...", es: "..." }
 * 4. Guarda el resultado en data/projects.json
 * 
 * ⚠️ IMPORTANTE: Después de ejecutar, debes traducir manualmente
 * las descripciones en español dentro de projects.json
 */

const fs = require('fs');
const path = require('path');

// Rutas
const dataDir = path.join(__dirname, '../data');
const projectsPath = path.join(dataDir, 'projects.json');
const backupPath = path.join(dataDir, 'projects.backup.json');

// Verificar que existe projects.json
if (!fs.existsSync(projectsPath)) {
  console.error('❌ Error: No se encontró data/projects.json');
  process.exit(1);
}

// Leer proyectos actuales
const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'));

console.log(`📦 Procesando ${projects.length} proyectos...\n`);

// Convertir a estructura i18n
const i18nProjects = projects.map((project, index) => {
  console.log(`  ${index + 1}. ${project.title}`);
  
  return {
    // Campos que NO necesitan traducción
    repository: project.repository,
    url: project.url,
    date: project.date,
    published: project.published,
    slug: project.slug,
    
    // Campos traducibles (inicialmente en inglés)
    title: {
      en: project.title,
      es: project.title // Placeholder - la mayoría son nombres propios
    },
    description: {
      en: project.description,
      es: project.description // ⚠️ TRADUCIR MANUALMENTE DESPUÉS
    }
  };
});

// Crear backup del original
console.log('\n💾 Creando backup...');
fs.writeFileSync(backupPath, JSON.stringify(projects, null, 2));
console.log('✅ Backup guardado en: data/projects.backup.json');

// Guardar versión i18n
console.log('\n📝 Guardando versión i18n...');
fs.writeFileSync(projectsPath, JSON.stringify(i18nProjects, null, 2));
console.log('✅ Archivo actualizado: data/projects.json');

// Instrucciones finales
console.log('\n' + '='.repeat(60));
console.log('🎉 ¡Conversión completada!');
console.log('='.repeat(60));
console.log('\n📋 PRÓXIMOS PASOS:\n');
console.log('1. Abrir data/projects.json');
console.log('2. Buscar todos los campos "es": "..."');
console.log('3. Traducir las descripciones al español');
console.log('4. Los títulos suelen ser nombres propios (dejar igual)\n');
console.log('💡 TIP: Usa ChatGPT o DeepL para traducir rápido:\n');
console.log('   "Traduce al español: [descripción en inglés]"\n');
console.log('⚠️  Si algo sale mal, restaura desde:');
console.log('   data/projects.backup.json\n');
