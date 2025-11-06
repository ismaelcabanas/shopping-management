# ADR 007: Prevención de Memory Leaks en Custom Hooks

**Estado:** Aceptado
**Fecha:** 2024-11-06
**Autores:** Equipo de Desarrollo

## Contexto

Los custom hooks con operaciones asíncronas pueden causar memory leaks cuando:
- Un componente se desmonta antes de que termine una operación async
- El hook intenta actualizar estado de un componente desmontado
- React lanza una advertencia: "Can't perform a React state update on an unmounted component"

## Decisión

Todos los custom hooks con operaciones asíncronas deben implementar **prevención de memory leaks** usando `useRef` para trackear si el componente está montado.

### Patrón Establecido

```typescript
export function useCustomHook() {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // ✅ Track mount status
  const isMountedRef = useRef<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await asyncOperation();

      // ✅ Only update if still mounted
      if (isMountedRef.current) {
        setData(result);
      }
    } catch (err) {
      // ✅ Only update if still mounted
      if (isMountedRef.current) {
        setError(err);
      }
    } finally {
      // ✅ Only update if still mounted
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadData();

    // ✅ Cleanup: mark as unmounted
    return () => {
      isMountedRef.current = false;
    };
  }, [loadData]);

  return { data, isLoading, error, refetch: loadData };
}
```

### Implementaciones

- ✅ `useProducts()` - Implementa prevención
- ✅ `useInventory()` - Implementa prevención

### Tests Requeridos

Todo hook debe incluir test de cleanup:

```typescript
it('should not update state after unmounting', async () => {
  let resolvePromise: (value: T[]) => void;
  const promise = new Promise<T[]>((resolve) => {
    resolvePromise = resolve;
  });

  mockFindAll.mockReturnValue(promise);

  const { result, unmount } = renderHook(() => useCustomHook());

  // Unmount before promise resolves
  unmount();

  // Resolve after unmount
  resolvePromise!(mockData);

  // Wait a bit
  await new Promise((resolve) => setTimeout(resolve, 10));

  // No errors should have been thrown
});
```

## Consecuencias

### Positivas

- ✅ **Sin memory leaks**: Previene actualizaciones de estado en componentes desmontados
- ✅ **Sin warnings**: Elimina warnings de React en desarrollo
- ✅ **Estabilidad**: Aplicación más estable en navegación rápida
- ✅ **Patrón consistente**: Mismo approach en todos los hooks
- ✅ **Tests requeridos**: Verificamos el comportamiento en tests

### Negativas

- ⚠️ **Código extra**: 3-4 líneas adicionales por hook
- ⚠️ **Complejidad**: Concepto que hay que entender

### Cuándo Aplicar

**Siempre que:**
- El hook tiene operaciones asíncronas (`async/await`, `Promise`, `setTimeout`)
- El hook actualiza estado de React
- El hook puede ejecutarse en componentes que se desmontan rápido

**No necesario cuando:**
- El hook es síncrono
- El hook no maneja estado
- El hook solo calcula valores