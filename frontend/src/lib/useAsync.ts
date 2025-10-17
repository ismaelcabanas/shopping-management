import { useState, useEffect, useCallback, useRef } from 'react';

type AsyncState<T> = {
  loading: boolean;
  error: Error | null;
  data: T | null;
};

export function useAsync<T = unknown>(asyncFunction: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({ loading: true, error: null, data: null });
  const mounted = useRef(true);

  const run = useCallback(async () => {
    setState({ loading: true, error: null, data: null });
    try {
      const data = await asyncFunction();
      if (!mounted.current) return;
      setState({ loading: false, error: null, data });
      return data;
    } catch (error) {
      if (!mounted.current) return;
      setState({ loading: false, error: error as Error, data: null });
      // Don't re-throw error to avoid Unhandled Rejection
      // Error is already available in the hook state
      return undefined;
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mounted.current = true;
    // Catch any error from initial run to avoid Unhandled Rejection
    run().catch(() => {
      // Error is already handled in hook state
    });
    return () => {
      mounted.current = false;
    };
  }, [run]);

  return { ...state, run } as AsyncState<T> & { run: () => Promise<T | undefined> };
}

export default useAsync;
