import { useLocalSearchParams } from 'expo-router';

export function useRouteParams() {
  try {
    const params = useLocalSearchParams();
    return params || {};
  } catch (error) {
    console.error('Error obteniendo parámetros de ruta:', error);
    return {};
  }
}

export function useSafeRouteParams<T extends Record<string, string>>(defaultValues: T): T {
  const params = useRouteParams();
  
  const safeParams = {} as T;
  
  for (const key in defaultValues) {
    safeParams[key] = (params[key] as string) || defaultValues[key];
  }
  
  return safeParams;
}