# US-009: Escanear ticket y registrar compra (OCR)

**Épica**: Gestión Avanzada de Inventario
**Estado**: 🔴 Pendiente
**Prioridad**: 🔥 CRÍTICA
**Sprint**: Sprint 5 (Siguiente)
**Estimación**: 5 story points (~3-4 horas)

---

## Historia de Usuario

**Como** usuario que acaba de hacer la compra
**Quiero** escanear el ticket de compra y que el sistema detecte automáticamente los productos
**Para** registrar mi compra en segundos sin tener que escribir cada producto manualmente

---

## Contexto y Justificación

Esta es una **funcionalidad crítica** para el éxito del producto. El registro manual de compras (US-008) es funcional pero tiene alto friction:
- ⏱️ Toma 5-10 minutos registrar una compra completa
- 😓 Es tedioso seleccionar productos uno por uno
- ❌ Los usuarios pueden abandonar el proceso a mitad

**Con OCR de tickets**:
- ✅ Registro en <3 minutos
- ✅ Experiencia fluida y moderna
- ✅ Reduce errores de entrada manual
- ✅ Aumenta adopción del producto

### Estrategia de Validación
Esta US es un **MVP para validar**:
1. ¿Los usuarios encuentran útil la funcionalidad?
2. ¿La precisión del OCR es suficiente?
3. ¿El flujo de revisión/corrección es intuitivo?

**Si la validación es exitosa** → Iterar mejoras en Sprint 6
**Si falla** → Revisar enfoque antes de invertir más

---

## Criterios de Aceptación

### Funcionales
- [ ] Puedo subir una foto del ticket (desde móvil o desktop)
- [ ] El sistema procesa la imagen y extrae texto mediante OCR
- [ ] Veo una lista de productos detectados con sus cantidades
- [ ] Puedo revisar y editar los productos detectados antes de confirmar
- [ ] Puedo eliminar productos incorrectos de la lista
- [ ] Puedo añadir productos que no se detectaron
- [ ] Puedo modificar cantidades de productos detectados
- [ ] Al confirmar, el inventario se actualiza igual que en US-008
- [ ] Veo confirmación visual de que la compra fue registrada
- [ ] Si el OCR falla completamente, recibo un mensaje claro

### No Funcionales
- [ ] El procesamiento OCR toma <10 segundos
- [ ] Soporta formatos: JPG, PNG, HEIC (móviles)
- [ ] Tamaño máximo de imagen: 10MB
- [ ] La precisión de detección es ≥60% de productos correctos
- [ ] La interfaz de revisión es intuitiva (validar con usuarios)

### Métricas de Éxito (Validación)
- [ ] 70%+ de tickets procesados sin error técnico
- [ ] 60%+ de productos detectados correctamente
- [ ] <3 minutos para completar flujo (upload → revisión → confirmar)
- [ ] 80%+ usuarios prefieren OCR vs registro manual
- [ ] NPS ≥7/10 en usabilidad

---

## Detalles Técnicos

### Arquitectura (Clean Architecture)

```
Presentation Layer
  └─ ProductCatalogPage.tsx
      └─ TicketScanModal.tsx (NUEVO)
          └─ TicketUploadView.tsx (NUEVO)
          └─ TicketProcessingView.tsx (NUEVO)
          └─ ReviewDetectedItemsView.tsx (NUEVO)
              └─ useTicketScan() custom hook (NUEVO)
                  └─ ScanTicket (Use Case - NUEVO)
                      ├─ OCRService (Port - NUEVO)
                      │   └─ GoogleVisionOCRService (Adapter - NUEVO)
                      ├─ ProductRepository
                      └─ InventoryRepository
```

### Nuevas Entidades y Value Objects

#### TicketScanResult (DTO)
```typescript
// src/application/dtos/TicketScanResult.ts
export interface TicketScanResult {
  rawText: string                   // Texto completo extraído
  detectedItems: DetectedItem[]     // Productos parseados
  confidence: number                // Confianza global (0-1)
  processingTimeMs: number          // Tiempo de procesamiento
  ocrProvider: string               // 'google-vision', 'tesseract', etc.
}

export interface DetectedItem {
  id: string                        // ID temporal para UI
  rawLine: string                   // Línea original del ticket
  productName: string               // Nombre extraído
  quantity: number                  // Cantidad detectada
  confidence: number                // Confianza en este item (0-1)
  matchedProductId?: string         // Si encontró match en catálogo
  matchedProductName?: string       // Nombre del producto matched
  status: 'matched' | 'unmatched' | 'low-confidence'
}
```

### Componentes a Crear

#### Nuevos

**1. TicketScanModal.tsx**
- Modal principal con 3 stages: upload → processing → review
- Gestiona estado del flujo completo
- Integra con useTicketScan hook

**2. TicketUploadView.tsx**
- Drag & drop para subir imagen
- Botón de "Tomar foto" (móviles)
- Preview de imagen subida
- Validación de formato/tamaño

**3. TicketProcessingView.tsx**
- Loading spinner durante OCR
- Mensaje: "Analizando ticket..."
- Progress bar (opcional)

**4. ReviewDetectedItemsView.tsx**
- Lista de productos detectados
- Cada item con:
  - Nombre del producto
  - Cantidad
  - Badge de confianza (alta/media/baja)
  - Botón editar
  - Botón eliminar
- Botón "Añadir producto" (si falta alguno)
- Botón "Confirmar" (disabled si hay errores)
- Botón "Cancelar"

**5. useTicketScan() custom hook**
```typescript
interface UseTicketScanResult {
  scanResult: TicketScanResult | null
  isProcessing: boolean
  error: Error | null
  scanTicket: (file: File) => Promise<void>
  resetScan: () => void
}
```

**6. ScanTicket Use Case**
```typescript
// src/application/use-cases/ScanTicket.ts
export interface ScanTicketCommand {
  imageFile: File
}

export class ScanTicket {
  constructor(
    private ocrService: OCRService,
    private productRepository: ProductRepository
  ) {}

  async execute(command: ScanTicketCommand): Promise<TicketScanResult> {
    // 1. Extraer texto usando OCR
    const rawText = await this.ocrService.extractText(command.imageFile)

    // 2. Parsear texto a estructura de productos
    const detectedItems = this.parseTicketText(rawText)

    // 3. Intentar match con productos existentes en catálogo
    const matchedItems = await this.matchProducts(detectedItems)

    // 4. Calcular confianza global
    const confidence = this.calculateGlobalConfidence(matchedItems)

    return {
      rawText,
      detectedItems: matchedItems,
      confidence,
      processingTimeMs: Date.now() - startTime,
      ocrProvider: this.ocrService.getProviderName()
    }
  }

  private parseTicketText(text: string): DetectedItem[] {
    // Regex para detectar líneas de productos
    // Formato común: "NOMBRE_PRODUCTO  CANTIDAD  PRECIO"
    // Ejemplo: "LECHE PASCUAL 1L    2    3.50"
    const lines = text.split('\n')
    const productLines: DetectedItem[] = []

    for (const line of lines) {
      const parsed = this.parseLine(line)
      if (parsed) {
        productLines.push(parsed)
      }
    }

    return productLines
  }

  private parseLine(line: string): DetectedItem | null {
    // Regex básico (mejorar en iteraciones futuras)
    const pattern = /^(.+?)\s+(\d+)\s+[\d,\.]+$/
    const match = line.match(pattern)

    if (match) {
      return {
        id: uuidv4(),
        rawLine: line,
        productName: match[1].trim(),
        quantity: parseInt(match[2]),
        confidence: 0.5, // Media por defecto
        status: 'unmatched'
      }
    }

    return null
  }

  private async matchProducts(items: DetectedItem[]): Promise<DetectedItem[]> {
    const allProducts = await this.productRepository.findAll()

    return items.map(item => {
      // Fuzzy matching simple (Levenshtein distance)
      const bestMatch = this.findBestMatch(item.productName, allProducts)

      if (bestMatch && bestMatch.similarity > 0.7) {
        return {
          ...item,
          matchedProductId: bestMatch.product.id.value,
          matchedProductName: bestMatch.product.name,
          confidence: bestMatch.similarity,
          status: 'matched'
        }
      }

      return {
        ...item,
        status: item.confidence > 0.6 ? 'low-confidence' : 'unmatched'
      }
    })
  }

  private findBestMatch(name: string, products: Product[]): { product: Product, similarity: number } | null {
    let bestMatch: { product: Product, similarity: number } | null = null

    for (const product of products) {
      const similarity = this.calculateSimilarity(
        name.toLowerCase(),
        product.name.toLowerCase()
      )

      if (!bestMatch || similarity > bestMatch.similarity) {
        bestMatch = { product, similarity }
      }
    }

    return bestMatch
  }

  private calculateSimilarity(str1: string, str2: string): number {
    // Levenshtein distance normalizado
    // Implementación simplificada - usar librería en producción
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1.0

    const distance = this.levenshteinDistance(longer, shorter)
    return (longer.length - distance) / longer.length
  }

  private calculateGlobalConfidence(items: DetectedItem[]): number {
    if (items.length === 0) return 0

    const avgConfidence = items.reduce((sum, item) => sum + item.confidence, 0) / items.length
    return avgConfidence
  }
}
```

**7. OCRService Port (Interface)**
```typescript
// src/application/ports/OCRService.ts
export interface OCRService {
  extractText(imageFile: File): Promise<string>
  getProviderName(): string
}
```

**8. GoogleVisionOCRService Adapter**
```typescript
// src/infrastructure/services/GoogleVisionOCRService.ts
export class GoogleVisionOCRService implements OCRService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async extractText(imageFile: File): Promise<string> {
    // 1. Convertir File a base64
    const base64Image = await this.fileToBase64(imageFile)

    // 2. Llamar a Google Vision API
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: base64Image },
            features: [{ type: 'TEXT_DETECTION' }]
          }]
        })
      }
    )

    const data = await response.json()

    // 3. Extraer texto
    if (data.responses?.[0]?.fullTextAnnotation?.text) {
      return data.responses[0].fullTextAnnotation.text
    }

    throw new Error('No text detected in image')
  }

  getProviderName(): string {
    return 'google-vision'
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
}
```

#### Modificar

- **ProductCatalogPage.tsx**: Añadir botón "Escanear Ticket" junto a "Registrar Compra"
- **RegisterPurchase Use Case**: Reutilizar para confirmar items detectados

---

## Testing

### Use Case Tests (~10 tests)

**ScanTicket Use Case**:
- ✅ Extrae texto del OCR service correctamente
- ✅ Parsea texto en lista de DetectedItems
- ✅ Detecta productos con formato válido
- ✅ Ignora líneas que no son productos (totales, fecha, etc.)
- ✅ Hace match con productos existentes en catálogo
- ✅ Calcula similarity correctamente (fuzzy matching)
- ✅ Marca items matched con alta confianza
- ✅ Marca items unmatched con baja confianza
- ✅ Calcula confianza global correctamente
- ✅ Lanza error si OCR falla

**Total**: ~10 tests

### Service Tests (~5 tests)

**GoogleVisionOCRService**:
- ✅ Convierte File a base64 correctamente
- ✅ Llama a API de Google Vision con formato correcto
- ✅ Extrae texto de respuesta exitosa
- ✅ Lanza error si no se detecta texto
- ✅ Maneja errores de API correctamente

**Total**: ~5 tests

### Hook Tests (~5 tests)

**useTicketScan**:
- ✅ scanTicket() ejecuta use case correctamente
- ✅ Actualiza isProcessing durante ejecución
- ✅ Guarda resultado en scanResult
- ✅ Maneja errores y los almacena en error state
- ✅ resetScan() limpia estado correctamente

**Total**: ~5 tests

### Component Tests (~12 tests)

**TicketScanModal**:
- ✅ Renderiza stage 'upload' inicialmente
- ✅ Cambia a 'processing' al subir imagen
- ✅ Cambia a 'review' cuando OCR completa
- ✅ Permite cancelar en cualquier stage

**TicketUploadView**:
- ✅ Muestra área de drag & drop
- ✅ Valida formato de archivo
- ✅ Valida tamaño de archivo
- ✅ Preview de imagen subida

**ReviewDetectedItemsView**:
- ✅ Renderiza lista de items detectados
- ✅ Muestra badge de confianza por item
- ✅ Permite editar cantidad de item
- ✅ Permite eliminar item de lista
- ✅ Permite añadir producto manualmente
- ✅ Desabilita "Confirmar" si lista vacía
- ✅ Llama onConfirm al confirmar
- ✅ Llama onCancel al cancelar

**Total**: ~12 tests

### E2E Tests (~3 tests)

- ✅ Flujo completo: Upload → Procesamiento → Revisión → Confirmar
- ✅ Flujo con correcciones: Usuario edita productos detectados
- ✅ Flujo de error: Imagen sin texto válido

**Total estimado**: ~35 tests

---

## Flujo de Usuario

### Flujo Principal (Éxito)

1. Usuario navega a `/catalog`
2. Ve botón "📷 Escanear Ticket" junto a "Registrar Compra"
3. Hace clic en "Escanear Ticket"
4. Se abre modal en stage 'upload'
5. Usuario hace foto o sube imagen del ticket
6. Modal cambia a stage 'processing'
   - Loading spinner
   - "Analizando ticket..."
7. OCR procesa imagen (5-10 seg)
8. Modal cambia a stage 'review'
9. Ve lista de productos detectados:
   ```
   ✅ Leche Pascual (2 unidades) [Confianza: Alta]
   ⚠️ Pan Bimbo (1 unidad) [Confianza: Media]
   ❌ ZANAHORIAS (3 unidades) [Sin Match]
   ```
10. Usuario revisa:
    - ✅ Leche: correcto
    - ⚠️ Pan: corrige nombre a "Pan de Molde"
    - ❌ Zanahorias: selecciona producto "Zanahorias" del catálogo
11. Usuario hace clic en "Confirmar"
12. Sistema ejecuta RegisterPurchase con items confirmados
13. Inventario se actualiza
14. Toast ✅ "Compra registrada desde ticket"
15. Modal se cierra
16. Dashboard muestra cantidades actualizadas

**Tiempo total**: ~2 minutos

### Flujo Alternativo: OCR Falla

1-6. (igual que flujo principal)
7. OCR no detecta texto o falla API
8. Modal muestra error:
   ```
   ❌ No pudimos leer el ticket

   Posibles causas:
   - Imagen borrosa
   - Ticket muy arrugado
   - Formato no soportado

   [Reintentar]  [Registrar Manualmente]
   ```
9. Usuario puede:
   - Reintentar con otra foto
   - Cancelar y usar registro manual (US-008)

### Flujo Alternativo: Baja Confianza

1-8. (igual que flujo principal)
9. Todos los items tienen confianza <50%
10. Modal muestra warning:
    ```
    ⚠️ Baja confianza en productos detectados

    Revisa cuidadosamente antes de confirmar.

    [Revisar]  [Registrar Manualmente]
    ```
11. Usuario revisa y corrige
12. Continúa flujo normal

### Flujo Alternativo: Usuario Cancela

1-9. (igual que flujo principal)
10. Usuario hace clic en "Cancelar"
11. Modal se cierra sin registrar nada
12. Vuelve a catálogo

---

## Stack Técnico

### OCR Provider: Google Cloud Vision API (Recomendado para MVP)

**Ventajas**:
- ✅ Precisión 90%+ en texto impreso
- ✅ Soporta español perfecto
- ✅ Gratis hasta 1,000 solicitudes/mes
- ✅ Setup rápido (1 hora)
- ✅ API simple (REST)

**Desventajas**:
- ❌ Requiere internet
- ❌ Costo después de límite: $1.50 por 1,000 solicitudes

**Setup**:
1. Crear proyecto en Google Cloud Console
2. Habilitar Vision API
3. Crear API Key
4. Configurar en variable de entorno: `VITE_GOOGLE_VISION_API_KEY`

**Alternativa (Fase 2)**: Tesseract.js (open source, offline, menor precisión)

### Librería de Fuzzy Matching

**fuse.js** o **string-similarity**
```bash
npm install fuse.js
```

Uso:
```typescript
import Fuse from 'fuse.js'

const fuse = new Fuse(products, {
  keys: ['name'],
  threshold: 0.3  // 0 = exact match, 1 = anything matches
})

const results = fuse.search('leche pascual')
// results[0].item = producto matched
// results[0].score = similitud (0-1)
```

---

## Consideraciones de UX

### Feedback durante Procesamiento
- ✅ Loading spinner con mensaje claro
- ✅ Tiempo estimado: "Esto tomará ~10 segundos"
- ✅ Progress bar si es posible
- ❌ No permitir cerrar modal durante procesamiento

### Interfaz de Revisión
- ✅ Colores por confianza:
  - Verde: >80% (alta confianza)
  - Amarillo: 50-80% (media confianza)
  - Rojo: <50% (baja confianza)
- ✅ Permitir edición inline de cantidades
- ✅ Búsqueda rápida para reemplazar producto
- ✅ Botón "Añadir manualmente" prominente

### Manejo de Errores
- ✅ Mensajes claros sobre qué falló
- ✅ Sugerencias de cómo resolverlo
- ✅ Siempre ofrecer fallback a registro manual
- ✅ No culpar al usuario ("tu imagen está borrosa" → "la imagen no es clara")

---

## Métricas y Analytics

### Tracking de Eventos
```typescript
// Eventos a trackear
analytics.track('ticket_scan_started', { source: 'catalog_page' })
analytics.track('ticket_scan_completed', {
  processingTimeMs: 8500,
  itemsDetected: 12,
  avgConfidence: 0.75
})
analytics.track('ticket_scan_failed', {
  error: 'no_text_detected',
  retryCount: 2
})
analytics.track('ticket_scan_confirmed', {
  itemsEdited: 3,
  itemsAdded: 1,
  itemsRemoved: 0,
  totalItems: 13
})
```

### Métricas de Producto
- Tasa de éxito: `scans_completed / scans_started`
- Precisión: `items_correct / items_detected`
- Tasa de edición: `items_edited / items_detected`
- Tiempo promedio: `avg(processingTimeMs + reviewTimeMs)`
- Preferencia: `scans_completed / (scans_completed + manual_registrations)`

---

## Implementación por Pasos (TDD)

### Fase 1: OCR Service (0.5h)
1. **Red**: Tests de GoogleVisionOCRService
2. **Green**: Implementar adapter
3. **Refactor**: Manejar errores

### Fase 2: Parsing & Matching (1h)
1. **Red**: Tests de parseTicketText()
2. **Green**: Implementar regex básico
3. **Red**: Tests de matchProducts()
4. **Green**: Implementar fuzzy matching
5. **Refactor**: Optimizar algoritmos

### Fase 3: Use Case (0.5h)
1. **Red**: Tests de ScanTicket
2. **Green**: Implementar orquestación
3. **Refactor**: Limpiar código

### Fase 4: Custom Hook (0.5h)
1. **Red**: Tests de useTicketScan
2. **Green**: Implementar hook
3. **Refactor**: Manejar estados

### Fase 5: UI Components (1.5h)
1. **Red**: Tests de componentes
2. **Green**: Implementar TicketScanModal + views
3. **Refactor**: Mejorar UX

### Fase 6: Integration & E2E (0.5h)
1. Integrar en ProductCatalogPage
2. Tests E2E completos
3. Validación manual con tickets reales

**Total estimado**: 4-5 horas

---

## Riesgos y Mitigaciones

### Riesgo 1: Baja precisión de OCR
**Probabilidad**: Media
**Impacto**: Alto
**Mitigación**:
- ✅ Usar Google Vision (alta precisión)
- ✅ UI de revisión/corrección intuitiva
- ✅ Permitir fallback a registro manual
- ✅ Iterar mejoras en Sprint 6

### Riesgo 2: Tickets muy variados (formatos diferentes)
**Probabilidad**: Alta
**Impacto**: Medio
**Mitigación**:
- ✅ Empezar con regex simple (MVP)
- ✅ Documentar formatos que funcionan
- ✅ Pedir feedback sobre cadenas específicas
- ✅ Fase 2: Templates por supermercado

### Riesgo 3: Usuarios no saben qué hacer con items "sin match"
**Probabilidad**: Media
**Impacto**: Medio
**Mitigación**:
- ✅ Tooltips explicativos
- ✅ Botón claro "Buscar en catálogo"
- ✅ Opción "Crear nuevo producto"

### Riesgo 4: Límite de API gratuita (1,000/mes)
**Probabilidad**: Baja (en MVP)
**Impacto**: Alto (si producto crece)
**Mitigación**:
- ✅ Monitorear uso mensual
- ✅ Alertar a 80% del límite
- ✅ Plan B: Tesseract.js (gratis, offline)
- ✅ Considerar cache de resultados

### Riesgo 5: Tiempo de procesamiento muy largo
**Probabilidad**: Baja
**Impacto**: Medio
**Mitigación**:
- ✅ Google Vision es rápido (5-10seg)
- ✅ Mostrar progress/loading claro
- ✅ Timeout a 30seg con retry

---

## Definition of Done

- [ ] GoogleVisionOCRService implementado y testeado
- [ ] Use Case ScanTicket con parsing y matching
- [ ] Custom Hook useTicketScan()
- [ ] Componente TicketScanModal con 3 stages
- [ ] Componente TicketUploadView
- [ ] Componente ReviewDetectedItemsView
- [ ] Integración en ProductCatalogPage
- [ ] 35+ tests escritos y pasando (TDD)
- [ ] Validación con tickets reales de 3+ supermercados
- [ ] Métricas de tracking implementadas
- [ ] Google Vision API configurada y funcionando
- [ ] Documentación de uso para usuarios
- [ ] Tests E2E verificados
- [ ] Code review completado
- [ ] Desplegado y verificado en desarrollo

### Criterios de Validación (Post-Release)
- [ ] 70%+ tasa de éxito en procesamiento
- [ ] 60%+ precisión de detección
- [ ] <3 min tiempo promedio de registro
- [ ] 80%+ usuarios prefieren OCR vs manual
- [ ] NPS ≥7/10 en usabilidad

**Si NO se cumplen** → Iterar mejoras antes de siguiente sprint

---

## Mejoras Futuras (Post-MVP)

### Sprint 6: OCR v2
- [ ] Templates por supermercado (Mercadona, Carrefour, etc.)
- [ ] Detección de precios (preparar para épica de tiendas)
- [ ] Machine learning para mejorar matching
- [ ] Histórico de nombres alternativos aprendidos

### Sprint 7+: Features Avanzadas
- [ ] Procesamiento de tickets largos (múltiples páginas)
- [ ] Escaneo de código de barras (alternativa a OCR)
- [ ] Procesamiento batch (múltiples tickets)
- [ ] OCR offline con Tesseract.js

---

## Referencias

- [Google Cloud Vision API Docs](https://cloud.google.com/vision/docs/ocr)
- [Fuzzy Matching with Fuse.js](https://fusejs.io/)
- [React File Upload Best Practices](https://web.dev/file-upload/)
- [US-008: Registrar compra manual](./US-008-registrar-compra-actualizar-inventario.md) - Reutilizar RegisterPurchase

---

## Notas Adicionales

- Esta US es **crítica para adopción del producto**
- Requiere validación con usuarios reales lo antes posible
- La precisión perfecta NO es el objetivo del MVP
- Una buena UX de corrección es más importante que alta precisión
- El flujo debe ser **rápido y obvio**, no perfecto