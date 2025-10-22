# Plan de Implementación Mobile-First para Shopping Manager

**Fecha:** 2025-10-20
**Objetivo:** Convertir la webapp en una aplicación mobile-first con capacidades PWA

---

## 🔴 FASE 1: PWA Básica (ALTA PRIORIDAD) ✅ **COMPLETADA**

### 1.1 Instalar dependencias PWA ✅
- [x] Instalar `vite-plugin-pwa`
  ```bash
  npm install -D vite-plugin-pwa
  ```
- [x] Verificar instalación correcta

### 1.2 Configurar Vite Plugin PWA ✅
- [x] Abrir `vite.config.ts`
- [x] Importar el plugin PWA
- [x] Añadir configuración básica del plugin:
  - registerType: 'autoUpdate'
  - includeAssets: favicon, robots, icons
- [x] Guardar y verificar que el proyecto compila

### 1.3 Crear Web App Manifest ✅
- [x] Crear archivo `public/manifest.json` (configurado inline en vite.config.ts)
- [x] Configurar metadata básica:
  - `name`: "Shopping Manager"
  - `short_name`: "Shopping"
  - `description`: "Gestión inteligente de inventario y compras"
  - `theme_color`: #10b981 (verde)
  - `background_color`: #ffffff
- [x] Configurar `display`: "standalone"
- [x] Configurar `start_url`: "/"
- [x] Configurar `scope`: "/"

### 1.4 Generar iconos PWA ✅
- [x] Crear icono base de 512x512 px (puede ser simple al principio)
- [x] Guardar en `public/icon-512x512.png`
- [x] Crear versión 192x192 px
- [x] Guardar en `public/icon-192x192.png`
- [x] Crear favicon.png
- [x] Guardar en `public/favicon.png`

### 1.5 Configurar iconos en manifest ✅
- [x] Configurar en `vite.config.ts` (manifest inline)
- [x] Añadir array de `icons`:
  - Icon 192x192 (type: image/png, purpose: any)
  - Icon 512x512 (type: image/png, purpose: any)
  - Icon 512x512 (purpose: maskable) - para Android
- [x] Guardar cambios

### 1.6 Actualizar meta tags en HTML ✅
- [x] Abrir `index.html`
- [x] Añadir `<meta name="theme-color" content="#10b981">`
- [x] Añadir `<link rel="manifest" href="/manifest.json">` (auto-inyectado por Vite)
- [x] Añadir `<link rel="icon" href="/favicon.png">`
- [x] Actualizar `<title>` a "Shopping Manager"
- [x] Guardar cambios

### 1.7 Añadir meta tags para iOS ✅
- [x] Abrir `index.html`
- [x] Añadir `<meta name="apple-mobile-web-app-capable" content="yes">`
- [x] Añadir `<meta name="apple-mobile-web-app-status-bar-style" content="default">`
- [x] Añadir `<meta name="apple-mobile-web-app-title" content="Shopping">`
- [x] Añadir `<link rel="apple-touch-icon" href="/icon-192x192.png">`
- [x] Guardar cambios

### 1.8 Probar PWA local ✅
- [x] Ejecutar `npm run build`
- [x] Ejecutar `npm run preview`
- [x] Abrir Chrome DevTools > Application > Manifest
- [x] Verificar que el manifest se carga correctamente
- [x] Verificar que los iconos aparecen
- [x] Probar instalación en Chrome (botón "Install")

### 1.9 Configurar Service Worker básico ✅
- [x] En `vite.config.ts`, configurar `workbox`:
  - `globPatterns`: archivos a cachear (configurado automáticamente)
  - `runtimeCaching`: estrategias de caché
- [x] Configurar caché para assets estáticos (CSS, JS, fonts)
- [x] Guardar y hacer build
- [x] Verificar en DevTools > Application > Service Workers

**Fecha de completación:** 2025-10-22
**Build exitoso:** 797ms, 8 archivos en precache (238 KB)

---

## 🟡 FASE 2: Offline-First Strategy (MEDIA-ALTA PRIORIDAD)

### 2.1 Configurar IndexedDB para almacenamiento local
- [ ] Instalar librería para IndexedDB (ej: `idb`, `dexie`)
  ```bash
  npm install idb
  ```
- [ ] Crear archivo `src/infrastructure/storage/IndexedDBClient.ts`
- [ ] Definir esquema de base de datos:
  - Store: `inventory`
  - Store: `pendingPurchases`
  - Store: `products`

### 2.2 Crear wrapper de almacenamiento
- [ ] Crear `src/infrastructure/storage/LocalStorageRepository.ts`
- [ ] Implementar método `saveInventory()`
- [ ] Implementar método `getInventory()`
- [ ] Implementar método `savePendingPurchase()`
- [ ] Implementar método `getPendingPurchases()`

### 2.3 Implementar estrategia de caché en Service Worker
- [ ] Configurar estrategia "Cache First" para inventario
- [ ] Configurar estrategia "Network First" para sincronización
- [ ] Configurar estrategia "Cache Only" para assets críticos
- [ ] Añadir fallback offline para API calls

### 2.4 Crear indicador de conexión
- [ ] Crear componente `ConnectionStatus.tsx`
- [ ] Detectar estado online/offline con `navigator.onLine`
- [ ] Mostrar badge visual cuando esté offline
- [ ] Añadir event listeners para cambios de conexión

### 2.5 Implementar queue de operaciones pendientes
- [ ] Crear `src/infrastructure/sync/SyncQueue.ts`
- [ ] Método `addToQueue()` para operaciones offline
- [ ] Método `processQueue()` cuando vuelva conexión
- [ ] Persistir queue en IndexedDB

### 2.6 Sincronización automática al volver online
- [ ] Escuchar evento `online` en window
- [ ] Procesar queue automáticamente
- [ ] Mostrar notificación al usuario (ej: "Sincronizando...")
- [ ] Manejar errores de sincronización

### 2.7 Probar flujo offline
- [ ] Chrome DevTools > Network > Offline
- [ ] Intentar añadir un producto
- [ ] Verificar que se guarda en local
- [ ] Volver online
- [ ] Verificar sincronización automática

---

## 🟠 FASE 3: Optimizaciones Mobile (MEDIA PRIORIDAD)

### 3.1 Optimizar Tailwind para mobile
- [ ] Abrir `tailwind.config.js`
- [ ] Revisar que breakpoints sean mobile-first
- [ ] Añadir utilities personalizadas si necesario:
  - Touch-friendly tap targets (min 44x44px)
  - Safe areas para notch en iOS
- [ ] Configurar `theme.extend.spacing` para mobile

### 3.2 Añadir touch gestures
- [ ] Instalar librería de gestures (opcional: `react-swipeable`)
- [ ] Implementar swipe-to-delete en listas
- [ ] Implementar pull-to-refresh en inventario
- [ ] Añadir feedback visual en touch events

### 3.3 Optimizar formularios para mobile
- [ ] Revisar inputs: usar tipos correctos (number, date, tel)
- [ ] Añadir `inputmode` apropiado en cada campo
- [ ] Configurar `autocomplete` para autocompletar
- [ ] Aumentar tamaño de tap targets (botones mínimo 44px)
- [ ] Prevenir zoom en inputs (font-size >= 16px)

### 3.4 Mejorar navegación mobile
- [ ] Crear bottom navigation bar (si aplica)
- [ ] Hacer header sticky con sombra al hacer scroll
- [ ] Añadir botón flotante (FAB) para acción principal
- [ ] Implementar back button behavior

### 3.5 Añadir loading states mobile-friendly
- [ ] Crear skeleton loaders para listas
- [ ] Añadir spinners apropiados
- [ ] Implementar optimistic UI updates
- [ ] Mostrar feedback inmediato en acciones

### 3.6 Optimizar rendimiento
- [ ] Implementar lazy loading de rutas:
  ```tsx
  const InventoryPage = lazy(() => import('./pages/Inventory'))
  ```
- [ ] Añadir `Suspense` boundaries
- [ ] Code splitting por funcionalidad
- [ ] Medir performance con Lighthouse

### 3.7 Testing en dispositivos reales
- [ ] Probar en iPhone (Safari)
- [ ] Probar en Android (Chrome)
- [ ] Verificar gestures funcionan
- [ ] Verificar rendimiento (no lag al scrollear)
- [ ] Verificar safe areas en notch/punch hole

---

## 🟢 FASE 4: Capacidades Nativas (BAJA PRIORIDAD - Para Fase 2 del feature)

### 4.1 Configurar acceso a cámara
- [ ] Añadir permisos en manifest:
  ```json
  "permissions": ["camera"]
  ```
- [ ] Crear hook `useCamera.ts`
- [ ] Implementar `getUserMedia()` para acceso a cámara
- [ ] Manejar errores de permisos

### 4.2 Crear componente de captura de foto
- [ ] Crear `CameraCapture.tsx`
- [ ] Implementar preview de cámara
- [ ] Botón para tomar foto
- [ ] Preview de foto capturada
- [ ] Botón para retomar foto

### 4.3 Optimizar imágenes capturadas
- [ ] Comprimir imagen antes de subir
- [ ] Redimensionar a tamaño máximo (ej: 1920px)
- [ ] Convertir a formato optimizado (WebP si soportado)
- [ ] Mostrar progreso de subida

### 4.4 Fallback para cámara
- [ ] Input file con `accept="image/*"`
- [ ] Atributo `capture="environment"` para cámara trasera
- [ ] Permitir seleccionar de galería
- [ ] Mostrar preview antes de procesar

---

## 🔵 FASE 5: Features Avanzadas (FUTURO)

### 5.1 Push Notifications
- [ ] Configurar Firebase Cloud Messaging (o similar)
- [ ] Solicitar permisos de notificaciones
- [ ] Enviar notificación cuando stock bajo
- [ ] Notificar cuando sincronización completa

### 5.2 Background Sync
- [ ] Implementar Background Sync API
- [ ] Registrar sync tag al añadir a queue
- [ ] Procesar queue en background
- [ ] Notificar resultado al usuario

### 5.3 Share API
- [ ] Implementar Web Share API
- [ ] Compartir lista de compras
- [ ] Compartir estadísticas
- [ ] Compartir con otras apps del sistema

### 5.4 Shortcuts en Home Screen
- [ ] Configurar `shortcuts` en manifest.json
- [ ] Añadir "Añadir compra rápida"
- [ ] Añadir "Ver inventario"
- [ ] Añadir "Lista de compras"

### 5.5 Splash Screens iOS
- [ ] Generar splash screens para diferentes tamaños
- [ ] Añadir `<link rel="apple-touch-startup-image">`
- [ ] Configurar para diferentes dispositivos:
  - iPhone SE
  - iPhone 14/15
  - iPhone 14 Pro Max
  - iPad

### 5.6 App Badging
- [ ] Implementar Badging API
- [ ] Mostrar número de items con stock bajo
- [ ] Actualizar badge cuando cambie inventario

---

## 📊 Checklist de Validación Mobile-First

### Al finalizar cada fase, verificar:

#### Funcionalidad
- [ ] ✅ App funciona offline completamente
- [ ] ✅ Se puede instalar en home screen
- [ ] ✅ Sincronización automática funciona
- [ ] ✅ Todos los gestures funcionan suavemente

#### Performance
- [ ] ✅ Lighthouse Score > 90 en mobile
- [ ] ✅ First Contentful Paint < 2s
- [ ] ✅ Time to Interactive < 3.5s
- [ ] ✅ No hay scroll lag

#### UX Mobile
- [ ] ✅ Todos los botones son fáciles de tocar (>44px)
- [ ] ✅ Texto legible sin zoom (>16px)
- [ ] ✅ Formularios no causan zoom involuntario
- [ ] ✅ Navegación intuitiva con una mano

#### Compatibilidad
- [ ] ✅ Funciona en Safari iOS
- [ ] ✅ Funciona en Chrome Android
- [ ] ✅ Safe areas respetadas en todos los dispositivos
- [ ] ✅ Orientación portrait y landscape

#### Offline
- [ ] ✅ Inventario accesible offline
- [ ] ✅ Puede añadir compras offline
- [ ] ✅ Queue se procesa al volver online
- [ ] ✅ Indicador claro de estado de conexión

---

## 🎯 Priorización Recomendada

**Semana 1:**
- Fase 1 completa (1.1 - 1.9): PWA Básica
- Items 2.1 - 2.4 de Fase 2: Inicio Offline Strategy

**Semana 2:**
- Items 2.5 - 2.7 de Fase 2: Completar Offline Strategy
- Items 3.1 - 3.3 de Fase 3: Optimizaciones básicas mobile

**Semana 3:**
- Items 3.4 - 3.7 de Fase 3: Completar optimizaciones mobile
- Testing exhaustivo en dispositivos reales

**Después de MVP (Fase 2 del producto):**
- Fase 4: Capacidades de cámara
- Fase 5: Features avanzadas según necesidad

---

## 📝 Notas

- Cada checkbox puede completarse de forma independiente
- Commits pequeños después de cada tarea completada
- Probar en dispositivo real cada 3-4 tareas completadas
- Documentar cualquier issue específico de iOS/Android
- Priorizar siempre la funcionalidad core sobre features avanzadas

---

**Última actualización:** 2025-10-20