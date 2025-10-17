# Shopping Manager 🛒

Un sistema inteligente de gestión de inventario personal y optimización de compras desarrollado con React, TypeScript y Tailwind CSS.

## 📋 Descripción del Proyecto

Shopping Manager es una aplicación web que te permite:

- **Gestión de Inventario Personal**: Controlar el stock de productos que habitualmente compras
- **Lista de Compras Inteligente**: Generar automáticamente listas basadas en el stock actual
- **Optimización de Precios**: Comparar precios entre diferentes tiendas (próximas iteraciones)
- **Inteligencia de Compras**: Analizar patrones de consumo para mejores decisiones

## 🚀 Estado Actual - MVP Funcional

### ✅ Funcionalidades Implementadas

- **Lista de compras interactiva** con productos precargados
- **Edición inline de cantidades** (click en "Edit")
- **Marcar/desmarcar productos** como comprados con checkboxes
- **Botones de acción**: "Marcar todos como comprados" y "Limpiar lista"
- **Separación visual** entre productos necesarios y ya comprados
- **Estados responsivos** con feedback visual claro

### 🏗 Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite 7.1.9
- **Styling**: Tailwind CSS 3.4.0 + PostCSS 8.4.0
- **Desarrollo**: VS Code con extensiones configuradas
- **Arquitectura**: Clean Architecture / Hexagonal Architecture **implementada**
- **Patrones**: Domain-Driven Design, Repository Pattern, Use Cases

## 🛠 Instalación y Desarrollo

### Pre-requisitos

- Node.js (versión 18 o superior)
- npm o yarn
- VS Code (recomendado)

### Configuración Inicial

```bash
# Clonar el repositorio
git clone <repository-url>
cd shopping-management

# Instalar dependencias del frontend
cd frontend
npm install

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173/`

### Estructura del Proyecto

```
shopping-management/
├── frontend/                 # Aplicación React con Clean Architecture
│   ├── src/
│   │   ├── domain/          # 🧠 Lógica de negocio pura
│   │   │   ├── entities/    # ShoppingListItem, Product
│   │   │   ├── value-objects/ # ItemStatus, Quantity, Unit
│   │   │   └── repositories/  # Interfaces
│   │   ├── application/     # ⚙️ Casos de uso y servicios
│   │   │   ├── use-cases/   # UpdateQuantity, ToggleStatus
│   │   │   └── services/    # ShoppingListService
│   │   ├── infrastructure/  # 🔧 Detalles técnicos
│   │   │   ├── repositories/ # MockShoppingListRepository
│   │   │   ├── adapters/    # ShoppingListAdapter
│   │   │   └── storage/     # Datos mock
│   │   └── presentation/    # 🎨 UI Layer
│   │       ├── components/  # ShoppingList, ShoppingListItem
│   │       └── hooks/       # useShoppingList
│   ├── tailwind.config.js   # Configuración Tailwind
│   ├── postcss.config.js    # Configuración PostCSS
│   └── package.json
├── design/                  # Mockups y documentación de diseño
├── CLAUDE.md               # Especificaciones del proyecto
├── SETUP_LOG.md            # Log detallado del setup
├── CLEAN_ARCHITECTURE_GUIDE.md # Guía de desarrollo
└── README.md               # Este archivo
```

## 🎯 Datos Iniciales

El MVP incluye 5 productos precargados:

- **Pan** (2 unidades)
- **Leche Entera** (1 litro)
- **Tomates** (1 kg)
- **Brócoli** (1 unidad)
- **Plátanos** (6 unidades)

## 🔧 Configuración de VS Code

### Extensiones Recomendadas

```json
{
  "recommendations": [
    "dsznajder.es7-react-js-snippets",
    "pmneo.tsimporter",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint"
  ]
}
```

### Configuración del Workspace

El proyecto incluye configuración específica de VS Code en `.vscode/settings.json` para:

- Formateo automático con Prettier
- IntelliSense de Tailwind CSS
- Organización automática de imports
- Soporte completo de TypeScript

## 🧪 Testing

```bash
# Tests unitarios (preparado para futuras iteraciones)
npm run test

# Coverage
npm run test:coverage
```

## 🏗 Build y Producción

```bash
# Build optimizado para producción
npm run build

# Preview del build
npm run preview
```

## 📈 Próximas Iteraciones

### Iteración 2: Persistencia y Nuevos Productos
- [ ] Persistencia en localStorage
- [ ] Formulario para añadir productos nuevos
- [ ] Gestión de categorías

### Iteración 3: Gestión de Tiendas
- [ ] CRUD de tiendas
- [ ] Historial de precios por tienda
- [ ] Comparación de precios

### Iteración 4: Inteligencia de Compras
- [ ] Sugerencias automáticas de compra
- [ ] Optimización de rutas
- [ ] Predicción de precios

### Iteración 5: UI/UX Avanzada
- [ ] Shadcn/UI components
- [ ] Dark mode
- [ ] Animaciones y transiciones
- [ ] PWA (Progressive Web App)

## 🤝 Contribución

Este proyecto sigue los principios de:

- **Domain-Driven Design (DDD)**
- **Test-Driven Development (TDD)**
- **Clean Architecture**
- **Desarrollo iterativo**

Para contribuir:

1. Fork el proyecto
2. Crea una feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit con mensajes descriptivos
4. Push a la branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Notas de Desarrollo

- **Tailwind CSS**: Configurado con tree-shaking automático
- **TypeScript**: Strict mode habilitado con importaciones de tipos
- **PostCSS**: Autoprefixer configurado para compatibilidad de navegadores
- **Vite**: Hot Module Replacement (HMR) configurado

## 🏛 Arquitectura Clean Implementada

El proyecto implementa **Clean Architecture** con **Domain-Driven Design**:

### **🧠 Domain Layer**
- **Value Objects**: `ItemStatus`, `Quantity`, `Unit` con validaciones ricas
- **Entities**: `ShoppingListItem`, `Product` con lógica de negocio
- **Repository Interfaces**: Contratos para persistencia

### **⚙️ Application Layer**
- **Use Cases**: `UpdateQuantityUseCase`, `ToggleItemStatusUseCase`
- **Services**: `ShoppingListService` como facade para React

### **🔧 Infrastructure Layer**
- **Repositories**: `MockShoppingListRepository` (implementación actual)
- **Adapters**: `ShoppingListAdapter` para integración
- **Storage**: Datos mock organizados

### **🎨 Presentation Layer**
- **Custom Hooks**: `useShoppingList` conecta React con Clean Architecture
- **Components**: UI pura sin lógica de negocio

## 📚 Documentación Adicional

- [CLAUDE.md](./CLAUDE.md) - Especificaciones completas del proyecto
- [SETUP_LOG.md](./SETUP_LOG.md) - Log detallado del proceso de configuración
- [CLEAN_ARCHITECTURE_GUIDE.md](./CLEAN_ARCHITECTURE_GUIDE.md) - **Guía de desarrollo con Clean Architecture**
- [design/mockups/](./design/mockups/) - Wireframes y mockups de diseño

---

**Versión actual**: MVP v1.5 - Clean Architecture implementada
**Última actualización**: 2025-10-10
**Estado**: ✅ Arquitectura empresarial funcional y documentada