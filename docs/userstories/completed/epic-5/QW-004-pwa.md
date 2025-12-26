# QW-004: PWA (Progressive Web App)

**Épica**: Quick Wins
**Estado**: ✅ Completada (Sprint 12)
**Story Points**: 3 SP (~2-3h)
**Prioridad**: ⭐⭐⭐⭐
**Fecha de Completado**: 2025-12-26

---

## Historia de Usuario

**Como** usuario móvil
**Quiero** instalar la app en mi dispositivo
**Para** acceder rápidamente sin abrir el navegador

---

## Criterios de Aceptación

### 1. Instalable
- [x] Manifest.json configurado
- [x] Icono de app
- [x] Splash screen
- [x] Prompt de instalación

### 2. Funciona offline (básico)
- [x] Service Worker registrado
- [x] Cache de assets estáticos
- [x] Fallback offline para navegación

### 3. Experiencia nativa
- [x] Fullscreen mode
- [x] Theme color personalizado
- [x] Nombre de app visible

---

## Impacto

🚀 Transforma la web app en una experiencia móvil completa
- Acceso rápido desde home screen
- Mejor UX en móvil
- Base para futuras features (notificaciones push)

---

## Detalles Técnicos

### Configuración
- Vite PWA plugin
- `manifest.json` con metadatos
- Service Worker para caching
- Iconos en múltiples tamaños

### Consideraciones
- Cache strategy: Network first para datos, cache first para assets
- Notificaciones push fuera de scope (puede agregarse después)

---

## Definition of Done

- [x] App instalable en móvil/desktop
- [x] Service Worker funcional
- [x] Tests de instalación
- [x] Lighthouse PWA score > 90

---

## Notas de Implementación

**Sprint 12 - Completado**

### Commits Relacionados:
- `feat(pwa): implement PWA service worker registration and caching`
- `docs(pwa): add comprehensive mobile installation guide`
- `chore(openspec): archive pwa-installable-app change`

### OpenSpec:
- Change archived: `pwa-installable-app` → `2025-12-26-pwa-installable-app`

### Documentación:
- Guía de instalación móvil creada en `/docs/user-guides/mobile-installation.md`
- Service Worker configurado con Vite PWA plugin
- Manifest configurado con iconos en múltiples tamaños
