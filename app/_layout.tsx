// Importaciones principales para el layout raíz de la aplicación
import FontAwesome from '@expo/vector-icons/FontAwesome'; // Iconos de FontAwesome
import { useFonts } from 'expo-font'; // Hook para cargar fuentes
import { Stack } from 'expo-router'; // Navegación tipo Stack de Expo Router
import React, { useEffect } from 'react'; // React y hook de efecto
import { AppProvider } from '../contexts/AppContext'; // Proveedor del contexto global

/**
 * Componente principal que define la estructura de navegación raíz de la aplicación
 * Configura el proveedor de contexto global y la navegación Stack
 */
export default function RootLayout() {
  // Carga las fuentes necesarias para la aplicación
  const [loaded, error] = useFonts({
    ...FontAwesome.font, // Carga los iconos de FontAwesome
  });

  // Expo Router usa Error Boundaries para detectar errores en la navegación
  useEffect(() => {
    if (error) throw error; // Si hay error al cargar fuentes, lanza excepción
  }, [error]);

  return (
    <AppProvider>
      {/* Configuración de navegación Stack principal */}
      <Stack>
        {/* La pantalla de pestañas es la principal y no muestra encabezado */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AppProvider>
  );
}