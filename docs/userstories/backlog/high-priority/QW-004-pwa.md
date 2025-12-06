# QW-004: PWA (Progressive Web App)

**Épica**: Quick Wins
**Estado**: 🔴 Pendiente
**Story Points**: 3 SP (~2-3h)
**Prioridad**: ⭐⭐⭐⭐

---

## Historia de Usuario

**Como** usuario móvil
**Quiero** instalar la app en mi dispositivo
**Para** acceder rápidamente sin abrir el navegador

---

## Criterios de Aceptación

### 1. Instalable
- [ ] Manifest.json configurado
- [ ] Icono de app
- [ ] Splash screen
- [ ] Prompt de instalación

### 2. Funciona offline (básico)
- [ ] Service Worker registrado
- [ ] Cache de assets estáticos
- [ ] Fallback offline para navegación

### 3. Experiencia nativa
- [ ] Fullscreen mode
- [ ] Theme color personalizado
- [ ] Nombre de app visible

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

- [ ] App instalable en móvil/desktop
- [ ] Service Worker funcional
- [ ] Tests de instalación
- [ ] Lighthouse PWA score > 90
