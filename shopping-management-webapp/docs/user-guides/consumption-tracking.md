# Seguimiento de Consumo por Niveles

Esta guía explica cómo usar la funcionalidad de seguimiento de consumo por niveles de stock en Shopping Manager.

## ¿Qué es el Seguimiento de Consumo?

El seguimiento de consumo te permite gestionar fácilmente tus productos sin necesidad de contar unidades exactas. En lugar de registrar cantidades precisas, simplemente actualizas el nivel de stock con **2 taps en menos de 5 segundos**.

## Los 4 Niveles de Stock

Shopping Manager usa 4 niveles de stock simples y visuales:

| Nivel | Indicador | Significado | Acción Automática |
|-------|-----------|-------------|-------------------|
| **Alto** | 🟢 Verde | Tengo suficiente stock | - |
| **Medio** | 🟡 Amarillo | Stock normal | - |
| **Bajo** | 🔴 Rojo | Necesito comprar pronto | ✅ Se añade a Lista de Compras |
| **Vacío** | ⚫ Gris | Sin stock | ✅ Se añade a Lista de Compras |

## Cómo Actualizar el Nivel de Stock

### Desde el Catálogo de Productos

1. **Navega a "Mi Despensa"** (icono de paquete en el menú superior)
2. **Localiza el producto** que quieres actualizar
3. **Tap en el icono de gráfico** 📊 junto al nombre del producto
4. **Selecciona el nuevo nivel** de stock:
   - **Alto**: Plenty in stock
   - **Medio**: Normal level
   - **Bajo**: Buy soon
   - **Vacío**: Out of stock
5. **Tap "Confirm"** para guardar

✅ **¡Listo!** El nivel de stock se actualiza inmediatamente.

### Indicador Visual

Cada producto muestra un indicador visual del nivel de stock:

```
Alto:   ████████████████░░░░ 100% (verde)
Medio:  ████████░░░░░░░░░░░░  50% (amarillo)
Bajo:   ████░░░░░░░░░░░░░░░░  25% (rojo)
Vacío:  ░░░░░░░░░░░░░░░░░░░░   0% (gris)
```

## Integración con Lista de Compras

### Añadido Automático

Cuando un producto alcanza nivel **Bajo** o **Vacío**:
- ✅ Se añade automáticamente a tu Lista de Compras
- 🏷️ Aparece con una etiqueta indicando el nivel:
  - "Stock bajo" (amarillo) para nivel Bajo
  - "Sin stock" (rojo) para nivel Vacío
- 📝 Se marca como "Agregado automáticamente"

### Eliminación Automática

Cuando actualizas un producto a nivel **Alto** o **Medio**:
- ❌ Se elimina automáticamente de tu Lista de Compras
- 🔄 La lista se actualiza al instante

### Marcar Como Comprado

Cuando compras un producto de la lista:

1. **Navega a "Lista de Compras"** (icono de bolsa en el menú)
2. **Localiza el producto** que compraste
3. **Tap en el botón "Comprado"** ✅
4. El producto se elimina de la lista

> **Nota:** Recuerda actualizar el nivel de stock del producto después de comprarlo para reflejar que ahora tienes stock.

## Flujo de Trabajo Recomendado

### Después de Cocinar/Consumir

```
1. Abres "Mi Despensa"
2. Seleccionas el producto que consumiste (ej: "Huevos")
3. Tap en el icono de actualización 📊
4. Cambias el nivel según corresponda (ej: de "Alto" a "Medio")
5. Tap "Confirm"
```

### Antes de Ir a Comprar

```
1. Abres "Lista de Compras"
2. Revisas los productos marcados como "Stock bajo" o "Sin stock"
3. Vas al supermercado con tu lista
```

### Después de Comprar

```
1. Abres "Lista de Compras"
2. Para cada producto comprado:
   - Tap en "Comprado" ✅
3. Abres "Mi Despensa"
4. Para cada producto comprado:
   - Tap en actualizar stock 📊
   - Cambias el nivel a "Alto"
   - Tap "Confirm"
```

## Ventajas del Sistema

✅ **Rápido**: Solo 2 taps y menos de 5 segundos por producto

✅ **Simple**: No necesitas contar unidades exactas

✅ **Automático**: La lista de compras se gestiona sola

✅ **Visual**: Indicadores de color para ver el estado de un vistazo

✅ **Flexible**: Puedes cancelar cambios si te equivocas

## Preguntas Frecuentes

### ¿Puedo cancelar un cambio de nivel?

Sí. Cuando abres el modal de actualización, puedes cerrar haciendo tap en "Cancel" sin guardar los cambios.

### ¿Qué pasa si accidentalmente marco un producto como "Vacío"?

No hay problema. Simplemente vuelve a actualizar el nivel al correcto. El producto se añadirá o quitará de la lista de compras automáticamente según el nuevo nivel.

### ¿Los productos se eliminan de mi inventario?

No. El seguimiento de consumo solo actualiza el **nivel de stock**, no elimina productos. Tus productos siempre permanecen en "Mi Despensa".

### ¿Puedo ver el historial de cambios de nivel?

Actualmente, el sistema registra la fecha de última actualización de cada producto. En futuras versiones se añadirá un historial completo.

### ¿Qué pasa si tengo muchos productos?

El sistema está diseñado para manejar cualquier número de productos. La lista de compras solo mostrará aquellos que necesitan reposición, manteniéndola siempre manejable.

## Próximas Mejoras

En futuras versiones se añadirán:

- 📊 **Dashboard de estadísticas**: Patrones de consumo y análisis de frecuencia
- 🔔 **Alertas personalizadas**: Notificaciones cuando productos llegan a nivel bajo
- 📈 **Historial de cambios**: Registro completo de actualizaciones de stock
- 🤖 **Sugerencias inteligentes**: Predicción basada en patrones de consumo

---

**¿Necesitas más ayuda?** Consulta la [Guía de Inicio Rápido](./quick-start.md) o revisa las [Preguntas Frecuentes Generales](./faq.md).
