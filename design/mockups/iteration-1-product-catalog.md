# Mockup Iteración 1: Catálogo de Productos (Gestión Manual)

**Fecha:** 2025-10-22
**Iteración:** 1
**Objetivo:** Permitir añadir productos manualmente al catálogo y visualizar la lista de productos con su inventario actual

---

## Wireframe: Página "Mi Despensa" (Estado Vacío)

```
┌─────────────────────────────────────────────────────────┐
│  ← [Volver]              Mi Despensa                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                                                         │
│                         📦                              │
│                                                         │
│            No hay productos en tu despensa             │
│                                                         │
│        Añade tu primer producto pulsando el botón +    │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│                                              ┌────────┐ │
│                                              │   +    │ │
│                                              │  (56)  │ │
│                                              └────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Wireframe: Página "Mi Despensa" (Con Productos)

```
┌─────────────────────────────────────────────────────────┐
│  ← [Volver]              Mi Despensa                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📋 Productos en Despensa (3)                          │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Huevos                                           │  │
│  │  12 ud                                            │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Leche                                            │  │
│  │  2 ud                                             │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Pan                                              │  │
│  │  1 ud                                             │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│                                                         │
│                                                         │
│                                              ┌────────┐ │
│                                              │   +    │ │
│                                              │  (56)  │ │
│                                              └────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Elementos:**
- **Header:** Título "Mi Despensa" centrado, botón "Volver" a la izquierda (44px altura)
- **Contador:** "Productos en Despensa (N)" - muestra el total
- **Lista de productos:**
  - Cada item: card con nombre y cantidad
  - Altura mínima: 60px por item
  - Padding: py-4 px-4 (touch-friendly)
  - Ordenados alfabéticamente
- **FAB (Floating Action Button):**
  - Botón circular con icono "+"
  - Tamaño: 56x56px (touch-friendly)
  - Posición: bottom-right con margin
  - Color: Verde (#10b981 - tema de la app)

---

## Wireframe: Página "Mi Despensa" (Loading State)

```
┌─────────────────────────────────────────────────────────┐
│  ← [Volver]              Mi Despensa                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📋 Productos en Despensa                              │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  ▓▓▓▓▓▓▓▓▓▓                                       │  │
│  │  ▓▓▓▓▓                                            │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓                                    │  │
│  │  ▓▓▓▓▓                                            │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  ▓▓▓▓▓▓▓▓                                         │  │
│  │  ▓▓▓▓▓                                            │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│                                                         │
│                                              ┌────────┐ │
│                                              │   +    │ │
│                                              │  (56)  │ │
│                                              └────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Skeleton Loader:**
- 3 items placeholder con animación pulse
- Simula la estructura: nombre (línea larga) + cantidad (línea corta)

---

## Wireframe: Página "Añadir Producto"

```
┌─────────────────────────────────────────────────────────┐
│  ← [Volver]          Añadir Producto                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                                                         │
│  Nombre del producto *                                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Ej: Leche, Pan...                                 │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│                                                         │
│                                                         │
│  Cantidad inicial                                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 0                                                 │  │
│  └───────────────────────────────────────────────────┘  │
│  unidades (ud)                                         │
│                                                         │
│                                                         │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │                    Guardar                        │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Elementos del formulario:**

1. **Input Nombre:**
   - Tipo: `text`
   - Label: "Nombre del producto *" (asterisco indica requerido)
   - Placeholder: "Ej: Leche, Pan..."
   - Font-size: 16px (prevenir zoom en iOS)
   - Altura: 44px mínimo
   - Validación: Requerido, mínimo 2 caracteres

2. **Input Cantidad:**
   - Tipo: `number`
   - Label: "Cantidad inicial"
   - Placeholder: "0"
   - Atributo: `inputmode="numeric"` (teclado numérico en móvil)
   - Font-size: 16px
   - Altura: 44px mínimo
   - Helper text: "unidades (ud)"
   - Validación: >= 0

3. **Botón Guardar:**
   - Ancho: 100% (full-width)
   - Altura: 48px (muy touch-friendly)
   - Color: Verde primario (#10b981)
   - Estado disabled mientras loading

---

## Wireframe: Página "Añadir Producto" (Con Errores de Validación)

```
┌─────────────────────────────────────────────────────────┐
│  ← [Volver]          Añadir Producto                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                                                         │
│  Nombre del producto *                                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │ A                                                 │  │
│  └───────────────────────────────────────────────────┘  │
│  ⚠️ El nombre debe tener al menos 2 caracteres          │
│                                                         │
│                                                         │
│  Cantidad inicial                                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │ -5                                                │  │
│  └───────────────────────────────────────────────────┘  │
│  ⚠️ La cantidad no puede ser negativa                   │
│  unidades (ud)                                         │
│                                                         │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │                    Guardar                        │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Mensajes de error:**
- Color: Rojo (#ef4444)
- Icono: ⚠️
- Posición: Directamente debajo del input con error
- Font-size: 14px

---

## Wireframe: Página "Añadir Producto" (Loading State)

```
┌─────────────────────────────────────────────────────────┐
│  ← [Volver]          Añadir Producto                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                                                         │
│  Nombre del producto *                                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Leche                                             │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│                                                         │
│                                                         │
│  Cantidad inicial                                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 2                                                 │  │
│  └───────────────────────────────────────────────────┘  │
│  unidades (ud)                                         │
│                                                         │
│                                                         │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │          ⏳ Guardando...                          │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Estado de loading:**
- Botón muestra spinner + texto "Guardando..."
- Botón deshabilitado (no se puede pulsar dos veces)
- Inputs deshabilitados durante el guardado

---

## Flujo de Navegación

```
┌────────────────┐         FAB (+)         ┌──────────────────┐
│  Mi Despensa   │ ───────────────────────> │ Añadir Producto  │
│  (Catálogo)    │                          │   (Formulario)   │
│                │ <─────────────────────── │                  │
└────────────────┘   Volver / Guardar OK    └──────────────────┘
```

1. Usuario inicia en "Mi Despensa"
2. Pulsa FAB "+" → Navega a "Añadir Producto"
3. Rellena formulario → Pulsa "Guardar"
4. Si éxito → Vuelve a "Mi Despensa" con producto añadido
5. Si error → Permanece en "Añadir Producto" con mensaje de error

---

## Paleta de Colores

- **Verde primario:** #10b981 (botones principales, FAB)
- **Gris texto:** #374151 (texto principal)
- **Gris claro:** #f3f4f6 (fondos de cards)
- **Rojo error:** #ef4444 (mensajes de validación)
- **Blanco:** #ffffff (fondo principal)

---

## Tipografía Mobile-First

- **Títulos (h1):** 24px / font-bold
- **Subtítulos (h2):** 18px / font-semibold
- **Texto body:** 16px / font-normal ⚠️ (mínimo para evitar zoom en iOS)
- **Labels:** 14px / font-medium
- **Helper text:** 14px / font-normal
- **Errores:** 14px / font-medium

---

## Especificaciones Touch-Friendly

### Tamaños Mínimos
- **Botones principales:** 44px altura (Apple HIG)
- **FAB:** 56x56px (Material Design)
- **Inputs:** 44px altura
- **Items de lista:** 60px altura mínimo

### Espaciados
- **Padding en cards:** py-4 px-4 (16px)
- **Espaciado entre inputs:** space-y-6 (24px)
- **Margen del FAB:** bottom-6 right-6 (24px desde bordes)

### Safe Areas (iOS)
- **Top:** env(safe-area-inset-top) - Para el notch
- **Bottom:** env(safe-area-inset-bottom) - Para la barra home

---

## Funcionalidades de la Iteración 1

### ✅ Incluido en esta iteración:

1. **Ver catálogo de productos**
   - Lista completa de productos
   - Ordenados alfabéticamente
   - Muestra cantidad actual en unidades (ud)

2. **Estado vacío**
   - Mensaje amigable
   - Call-to-action claro
   - Ilustración/icono

3. **Añadir producto nuevo**
   - Formulario con nombre y cantidad
   - Validación en tiempo real
   - Mensajes de error claros

4. **Persistencia**
   - Datos guardados en localStorage
   - Persisten entre sesiones

5. **Mobile-first**
   - Diseño optimizado para 375px width
   - Botones touch-friendly (44px+)
   - Inputs sin zoom involuntario (16px font)

6. **Loading states**
   - Skeleton loader en lista
   - Spinner en botón de guardar

### ❌ NO incluido (futuras iteraciones):

- Editar productos existentes
- Eliminar productos
- Categorías
- Imágenes de productos
- Otros tipos de unidades (kg, litros, etc.)
- Búsqueda/filtrado
- Backend/API

---

## Notas de Implementación

1. **Formulario mobile-first:**
   - Usar `inputmode="numeric"` en campo cantidad
   - Font-size >= 16px en todos los inputs
   - Autocomplete off si no aplica

2. **FAB posicionamiento:**
   - Fixed position
   - z-index alto para estar siempre visible
   - Margin suficiente para no tapar contenido

3. **Validación:**
   - Validar en submit
   - Mostrar errores debajo de cada campo
   - No permitir submit si hay errores

4. **Accesibilidad:**
   - Labels asociados a inputs (htmlFor)
   - Mensajes de error con role="alert"
   - Botones con aria-label descriptivos

---

**Última actualización:** 2025-10-22