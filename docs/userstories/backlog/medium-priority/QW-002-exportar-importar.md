# QW-002: Exportar/Importar datos

**Épica**: Quick Wins
**Estado**: 🔴 Pendiente
**Story Points**: 3 SP (~2-3h)
**Prioridad**: 🟡 Media (⭐⭐⭐)

---

## Historia de Usuario

**Como** usuario
**Quiero** exportar e importar mis datos
**Para** hacer backup o migrar a otro dispositivo

---

## Criterios de Aceptación

### 1. Exportar
- [ ] Exportar inventario a CSV
- [ ] Exportar a JSON (backup completo)
- [ ] Descargar archivo automáticamente

### 2. Importar
- [ ] Importar productos desde CSV
- [ ] Restaurar desde JSON backup
- [ ] Validar formato antes de importar
- [ ] Merge o reemplazo (opciones)

### 3. Backup automático
- [ ] Opcional: backup automático semanal
- [ ] Almacenar en LocalStorage o descargar

---

## Detalles Técnicos

- Use cases: `ExportData`, `ImportData`
- Librería para parsing CSV
- Validación de datos importados

---

## Definition of Done

- [ ] Tests para export/import
- [ ] Funcionalidad completa
- [ ] UX clara y segura
