import { router } from 'expo-router';
import { useCallback } from 'react';

export const useNavigation = () => {
  const navigateToLesson = useCallback((nivel: string, unidad: string, modo?: string) => {
    // Limpiar cualquier estado previo antes de navegar
    const params: any = { nivel, unidad };
    if (modo) params.modo = modo;
    
    console.log('Navegando a lección:', params);
    router.push({
      pathname: '/(tabs)/leccion',
      params
    });
  }, []);

  const navigateToExam = useCallback((nivel: string, unidad: string) => {
    // Limpiar cualquier estado previo antes de navegar
    const params = { nivel, unidad };
    
    console.log('Navegando a examen:', params);
    router.push({
      pathname: '/(tabs)/examen',
      params
    });
  }, []);

  const navigateToHome = useCallback(() => {
    console.log('Navegando al inicio');
    router.replace('/(tabs)');
  }, []);

  const navigateBack = useCallback(() => {
    console.log('Navegando hacia atrás');
    router.back();
  }, []);

  return {
    navigateToLesson,
    navigateToExam,
    navigateToHome,
    navigateBack
  };
};

export default useNavigation;