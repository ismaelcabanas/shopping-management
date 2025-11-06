# US-002: Navegar entre secciones de la aplicación

**Épica**: Gestión de Inventario Personal
**Estado**: 🟢 Completado
**Prioridad**: Alta
**Sprint**: Sprint 1

---

## Historia de Usuario

**Como** usuario de la aplicación
**Quiero** poder navegar fácilmente entre las diferentes secciones
**Para** acceder rápidamente a las funcionalidades que necesito

---

## Criterios de Aceptación

- [x] Existe una barra de navegación visible en todas las páginas
- [x] Los enlaces de navegación destacan la sección actual (active state)
- [x] Puedo navegar a: Home, Dashboard, Catálogo de Productos, Añadir Producto
- [x] La navegación funciona sin recargar la página (SPA behavior)
- [x] Los enlaces son accesibles por teclado (Tab navigation)

---

## Detalles Técnicos

### Componentes

- **Componente**: `Navigation.tsx` (`src/presentation/shared/components/Navigation.tsx`)
- **Router**: React Router v6
- **Rutas implementadas**:
  - `/` - HomePage
  - `/dashboard` - DashboardPage
  - `/catalog` - ProductCatalogPage
  - `/add-product` - AddProductPage

### Testing

- ✅ **11 tests** de navegación implementados
  - Renderizado de enlaces
  - Navegación entre páginas
  - Active state correcto
  - Accesibilidad por teclado
  - MemoryRouter para tests aislados

### Tecnologías

- React Router v6 (`<NavLink>`, `<Route>`)
- Tailwind CSS para estilos y active states
- Testing: Vitest + React Testing Library

---

## Flujo de Usuario

1. Usuario ve barra de navegación en cualquier página
2. Usuario identifica la sección actual (link destacado)
3. Usuario hace clic en un enlace
4. La aplicación navega sin recargar (SPA)
5. El nuevo enlace se marca como activo
6. El contenido de la página cambia

---

## Implementación

### Estructura del componente Navigation

```typescript
<nav>
  <NavLink to="/">Home</NavLink>
  <NavLink to="/dashboard">Dashboard</NavLink>
  <NavLink to="/catalog">Catálogo</NavLink>
  <NavLink to="/add-product">Añadir Producto</NavLink>
</nav>
```

### Active State

- Utiliza `className` callback de `NavLink`
- Aplica estilos diferentes cuando `isActive === true`

---

## Consideraciones de Accesibilidad

- ✅ Navegación por teclado (Tab)
- ✅ Enlaces semánticos (`<NavLink>`)
- ✅ Feedback visual del estado activo
- ✅ Contraste de colores adecuado

---

## Definition of Done

- [x] Código implementado
- [x] Tests de router pasando (11 tests)
- [x] Tests E2E verificados
- [x] Code review completado
- [x] Documentación actualizada
- [x] Accesibilidad verificada
- [x] Desplegado y verificado