# Roadmap - Shopping Manager

**Last Updated**: 2025-12-06
**Progress**: 11/27 stories (41%)
**Current Focus**: Épica 4 - Gestión de Consumo

---

## 🎯 Épicas Status

| Epic | Stories | Status | Priority |
|------|---------|--------|----------|
| 📦 Épica 1: Gestión de Inventario | 5/5 | ✅ Complete | - |
| 🔧 Épica 2: Gestión Avanzada | 3/3 | ✅ Complete | - |
| 📸 Épica 3: Automatización de Compras | 3/3 | ✅ Complete | - |
| 🔄 **Épica 4: Gestión de Consumo** | 0/4 | 🚧 Next | 🔥 High |
| 📊 Épica 5: Inteligencia de Consumo | 0/6 | ⏳ Backlog | 🟡 Medium |
| 🏪 Épica 6: Gestión de Tiendas | 0/3 | ⏳ Backlog | 🟢 Low |
| ✨ Quick Wins | 0/3 | ⏳ Backlog | 🟡 Medium |

---

## 🔥 Next Up (Épica 4)

1. [US-012: Registrar consumo de productos](./userstories/backlog/high-priority/US-012-registrar-consumo.md) ⭐⭐⭐⭐⭐
2. [US-014: Alertas de stock bajo](./userstories/backlog/high-priority/US-014-alertas-stock-bajo.md) ⭐⭐⭐⭐
3. [US-015: Lista de compras automática](./userstories/backlog/high-priority/US-015-lista-compras-automatica.md) ⭐⭐⭐⭐⭐

**Why Important**: Without consumption tracking, inventory is static and loses value. This completes the product lifecycle: Buy → Store → **Consume** → Alert → Auto-generate list.

---

## 📊 Progress

- **Velocity**: ~2 stories/sprint
- **Total Tests**: 393+ (392 unit + 12 e2e)
- **Architecture**: Clean Architecture + DDD
- **Tech Debt**: 2 items tracked in OpenSpec

---

## 🎉 Recent Achievements

### Sprint 7 (Dec 2025)
- ✅ US-011: Excluir productos del escaneo de ticket
- Feature: Remove scanned products before adding to inventory

### Sprint 6 (Nov 2025)
- ✅ US-010: Mejorar matching de productos
- Feature: Advanced product name normalization (60% confidence threshold)

### Sprint 5 (Nov 2025)
- ✅ US-009: Escanear ticket y registrar compra (OCR)
- Feature: OCR with Gemini Vision API (100% accuracy)

See [CHANGELOG.md](./CHANGELOG.md) for full release history.

---

## 📚 Quick Links

- [All User Stories](./userstories/README.md) - Full index and details
- [Completed Work](./userstories/completed/) - What's been built
- [Backlog](./userstories/backlog/) - What's next
- [Changelog](./CHANGELOG.md) - Release history
- [Project Plan](../CLAUDE.md) - Architecture and methodology