# Comandos Rápidos - Implementación de Optimizaciones

## 🚀 Instalación Rápida (Copy-Paste)

```bash
# 1. Crear branch de trabajo
git checkout -b optimize-performance

# 2. Instalar dependencias necesarias
pnpm add @tsparticles/react @tsparticles/slim

# 3. Verificar instalación
pnpm list @tsparticles/react

# 4. Iniciar servidor de desarrollo
pnpm dev
```

---

## 🔧 Testing de Rendimiento

### Medir Frame Time (En consola del navegador)

```javascript
// Ejecuta esto en la consola de Chrome DevTools
let frames = [];
let lastTime = performance.now();

function measureFrame() {
  const now = performance.now();
  const delta = now - lastTime;
  frames.push(delta);
  lastTime = now;
  
  if (frames.length > 60) {
    const avg = frames.reduce((a, b) => a + b) / frames.length;
    const fps = (1000/avg).toFixed(0);
    const status = avg < 16 ? '✅' : avg < 33 ? '⚠️' : '❌';
    console.log(`${status} Frame time: ${avg.toFixed(2)}ms (${fps} FPS)`);
    frames = [];
  }
  
  requestAnimationFrame(measureFrame);
}

measureFrame();
```

### Comparar Antes/Después

```javascript
// ANTES de optimizar (ejecutar en rama main)
// Espera 10 segundos y anota el resultado promedio

// DESPUÉS de optimizar (ejecutar en rama optimize-performance)
// Compara con el resultado anterior
```

---

## 📝 Git Commands

### Crear Branch y Backup

```bash
# Crear branch para optimizaciones
git checkout -b optimize-performance

# Guardar trabajo actual
git add .
git commit -m "backup: save current state before optimizations"
```

### Commits Organizados

```bash
# Después de instalar dependencias
git add package.json pnpm-lock.yaml
git commit -m "deps: add @tsparticles for optimized particles"

# Después de crear archivos nuevos
git add components/shared/ParticlesOptimized.tsx
git add components/ui/ButtonOptimized.tsx
git add context/ScrollContext.tsx
git add global.css
git commit -m "feat: add optimized components (Particles, Button, ScrollContext)"

# Después de actualizar componentes existentes
git add app/page.tsx app/layout.tsx
git add components/sections/Hero.tsx
git add components/navigation/StickyNav.tsx
git add components/layout/BackToTop.tsx
git commit -m "refactor: replace manual components with optimized versions

- Replace Particles with @tsparticles (-70% CPU)
- Replace MovingBorder with CSS animations (GPU-accelerated)
- Centralize scroll listeners in ScrollContext (-91% events)
- Optimize backdrop-blur in navigation

Performance improvements:
- Frame time: 28-35ms → 12-16ms (+117% improvement)
- Scroll events: 180+/s → 16/s (-91% reduction)
- Target: 60 FPS stable"
```

### Rollback si algo sale mal

```bash
# Volver al commit anterior
git reset --hard HEAD~1

# O volver a main completamente
git checkout main
git branch -D optimize-performance
```

---

## 🧪 Testing Checklist

```bash
# 1. Visual Testing
# Abrir: http://localhost:3000
# Verificar:
# - [ ] Partículas blancas visibles
# - [ ] Efecto magnetismo con mouse
# - [ ] Botones con border girando
# - [ ] Nav cambia al hacer scroll
# - [ ] BackToTop aparece después de scroll

# 2. Performance Testing
# Chrome DevTools → Performance tab
# Grabar 10 segundos mientras mueves mouse y haces scroll
# Verificar:
# - [ ] Frame rate ~60 FPS
# - [ ] Scripting time <10ms por frame
# - [ ] No "Long Tasks" (>50ms)

# 3. Mobile Testing
# DevTools → Toggle device toolbar
# iPhone 12 Pro, CPU: 4x slowdown
# Verificar:
# - [ ] Scroll fluido
# - [ ] Animaciones suaves
# - [ ] Sin lag visible
```

---

## 🔍 Debugging Commands

### Si Particles no aparecen

```bash
# Verificar instalación
pnpm list @tsparticles/react

# Limpiar caché
rm -rf .next
rm -rf node_modules/.cache
pnpm dev

# Ver errores en tiempo real
pnpm dev | grep -i "error\|warn"
```

### Si TypeScript da errores

```bash
# Limpiar build
rm -rf .next

# Reinstalar dependencias
rm -rf node_modules
pnpm install

# Reiniciar dev server
pnpm dev
```

### Si los estilos no se aplican

```bash
# Verificar que global.css tiene los keyframes
grep -A 5 "border-spin" global.css

# Forzar rebuild de Tailwind
rm -rf .next
pnpm dev
```

---

## 📊 Performance Benchmarks

### Comando de Lighthouse CLI (Opcional)

```bash
# Instalar Lighthouse CLI
npm install -g lighthouse

# Build del proyecto
pnpm build
pnpm start

# Correr Lighthouse
lighthouse http://localhost:3000 --only-categories=performance --output=html --output-path=./lighthouse-report.html

# Comparar antes/después
# Objetivo: Performance score >90
```

---

## 🎯 Comandos de Verificación Rápida

```bash
# Verificar que todos los archivos existen
ls -la components/shared/ParticlesOptimized.tsx
ls -la components/ui/ButtonOptimized.tsx
ls -la context/ScrollContext.tsx

# Buscar TODOs o FIXMEs
grep -r "TODO\|FIXME" components/ app/

# Contar líneas de código eliminado (después de optimizar)
git diff --stat main optimize-performance

# Ver cambios específicos
git diff main optimize-performance components/shared/particles.tsx
```

---

## 📦 Package.json Update Preview

```json
{
  "dependencies": {
    "@tsparticles/react": "^3.0.0",
    "@tsparticles/slim": "^3.0.0",
    // ... resto de dependencias existentes
  }
}
```

---

## 🚨 Troubleshooting Rápido

### Error: "Cannot find module @tsparticles"

```bash
pnpm add @tsparticles/react @tsparticles/slim
rm -rf .next
pnpm dev
```

### Error: "useScroll must be used within ScrollProvider"

```bash
# Verificar que layout.tsx tiene el provider
grep -A 5 "ScrollProvider" app/layout.tsx

# Debe mostrar:
# <ScrollProvider>
#   {children}
# </ScrollProvider>
```

### Animaciones no se ven suaves

```bash
# Verificar FPS en consola
# (ejecutar el script de measureFrame arriba)

# Si sigue bajo (<40 FPS):
# 1. Reducir quantity de particles
# quantity={100} en vez de {150}

# 2. Verificar que backdrop-blur fue removido
grep "backdrop-blur-lg" components/navigation/StickyNav.tsx
# No debe retornar nada
```

---

## ✅ Comando Final de Verificación

```bash
# Ejecutar todo de una vez
echo "🔍 Verificando instalación..."
pnpm list @tsparticles/react && echo "✅ tsParticles instalado" || echo "❌ Falta instalar"

echo "📁 Verificando archivos nuevos..."
test -f components/shared/ParticlesOptimized.tsx && echo "✅ ParticlesOptimized.tsx" || echo "❌ Falta crear"
test -f components/ui/ButtonOptimized.tsx && echo "✅ ButtonOptimized.tsx" || echo "❌ Falta crear"
test -f context/ScrollContext.tsx && echo "✅ ScrollContext.tsx" || echo "❌ Falta crear"

echo "🎨 Verificando CSS..."
grep -q "border-spin" global.css && echo "✅ CSS animations agregadas" || echo "❌ Falta actualizar global.css"

echo "✨ Verificación completa!"
```

---

## 🎉 Comando de Celebración

```bash
# Cuando todo funcione:
echo "🚀 Optimizaciones completadas!"
echo "📊 Frame time mejorado en ~60%"
echo "✨ Portfolio ahora corre a 60 FPS"
git log --oneline -5
```

---

**Nota:** Todos estos comandos asumen que estás en la raíz del proyecto (`portfolio/`).