# Contexto del Proyecto Peluditos

## Patrón de Vista con Panel de Preview

### Comportamiento Estándar para Todas las Vistas con Edición

**Vista por Defecto:**
- La columna de preview está oculta
- Vista full width sin panel lateral
- Máximo espacio para la lista/grid principal

**Interacción:**
- Click en cualquier elemento abre el panel de preview
- El panel lateral aparece instantáneamente sin animación
- Click en el mismo elemento cierra el panel
- Doble click navega a la página de edición

**Skeleton:**
- El skeleton general muestra la columna de preview como visible
- Esto simula el estado final con panel abierto
- Ayuda a visualizar el layout completo durante la carga

### Aplicación en Organizaciones
- ✅ Vista grid full width por defecto
- ✅ Panel lateral se abre solo al hacer click
- ✅ Skeleton muestra el panel como visible
- ✅ Toggle de selección funcional
- ✅ Doble click para editar

## Sistema de Persistencia de UX

### LocalStorage/SessionStorage para User Experience
- **Objetivo**: Mantener las preferencias del usuario entre sesiones
- **Implementación**: Contexto React + localStorage/sessionStorage
- **Primera funcionalidad**: Vista de organizaciones (grid/list)
- **Consideración**: Usar contexto para manejo de estado global

### Funcionalidades a Persistir
1. **Organizations View Mode**: grid | list
2. **Futuras funcionalidades**: Filtros, ordenamiento, preferencias de UI

---
*Este patrón debe aplicarse a todas las vistas con funcionalidad de edición*