# ADR 003: Custom Hooks para Abstracción de Use Cases

**Estado:** Aceptado
**Fecha:** 2024-11-06
**Autores:** Equipo de Desarrollo

## Contexto

Los componentes React necesitan interactuar con la capa de aplicación (use cases). Sin una abstracción adecuada:
- Los componentes instancian use cases directamente
- Se repite lógica de gestión de estado (loading, error)
- Dificulta el testing de componentes
- Acopla componentes a detalles de implementación

## Decisión

Creamos **Custom Hooks** que encapsulan:
1. Instanciación de use cases y repositorios
2. Gestión de estados (loading, error, data)
3. Operaciones asíncronas (fetch, refetch, mutate)
4. Prevención de memory leaks

### Patrón Establecido

```typescript
export function useCustomHook(): UseCustomHookReturn {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Instanciar repositorios y use case
      const repository = new LocalStorageRepository();
      const useCase = new GetData(repository);

      const result = await useCase.execute();

      if (isMountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadData();
    return () => { isMountedRef.current = false; };
  }, [loadData]);

  return { data, isLoading, error, refetch: loadData };
}
```

### Hooks Implementados

- ✅ `useProducts()` - Gestión de productos
- ✅ `useInventory()` - Gestión de inventario con operaciones de escritura

## Consecuencias

### Positivas

- ✅ **Reusabilidad**: Múltiples componentes usan el mismo hook
- ✅ **Testabilidad**: Componentes se testean mockeando solo el hook
- ✅ **Desacoplamiento**: Componentes no conocen repositorios ni infraestructura
- ✅ **Consistencia**: Mismo patrón de estados en toda la aplicación
- ✅ **Seguridad**: Prevención automática de memory leaks
- ✅ **Mantenibilidad**: Cambios en use cases no afectan múltiples componentes

### Negativas

- ⚠️ **Capa extra**: Añade una capa de abstracción
- ⚠️ **Complejidad inicial**: Requiere entender el patrón

### Mitigaciones

- Documentación JSDoc completa con ejemplos
- Tests exhaustivos para cada hook
- Patrón consistente y predecible