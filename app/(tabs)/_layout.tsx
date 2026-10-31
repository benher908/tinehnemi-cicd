// Importaciones principales para el layout de pestañas
import FontAwesome from '@expo/vector-icons/FontAwesome'; // Iconos de FontAwesome
import { Tabs, usePathname } from 'expo-router'; // Componente de navegación por pestañas y hook para obtener la ruta actual
import React from 'react';

/**
 * Componente para mostrar iconos en la barra de pestañas
 * Puedes explorar las familias de iconos incorporadas en https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']; // Nombre del icono de FontAwesome
  color: string; // Color del icono
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

/**
 * Componente principal que define la estructura de navegación por pestañas
 * Configura las pestañas visibles y las rutas ocultas de la aplicación
 */
export default function TabLayout() {
  // Obtener la ruta actual para determinar si estamos en la pantalla de onboarding
  const pathname = usePathname();
  
  // Verificar si estamos en la pantalla de onboarding para ocultar la barra de navegación
  const isOnboarding = pathname.includes('/onboarding');
  
  return (
    <Tabs
      screenOptions={{
        // Configura el color activo de las pestañas
        tabBarActiveTintColor: '#4CAF50',
        // Ocultar la barra de navegación en la pantalla de onboarding
        tabBarStyle: isOnboarding ? { display: 'none' } : undefined,
      }}>
      {/* Pestaña de Inicio - Pantalla principal */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      {/* Pestaña de Vocabulario - Muestra palabras por categorías */}
      <Tabs.Screen
        name="vocabulario"
        options={{
          title: 'Vocabulario',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      {/* Pestaña de Historias - Muestra relatos tradicionales */}
      <Tabs.Screen
        name="historias"
        options={{
          title: 'Historias',
          tabBarIcon: ({ color }) => <TabBarIcon name="bookmark" color={color} />,
        }}
      />
      {/* Pestaña de Juegos - Acceso a los minijuegos educativos */}
      <Tabs.Screen
        name="minijuegos"
        options={{
          title: 'Juegos',
          tabBarIcon: ({ color }) => <TabBarIcon name="gamepad" color={color} />,
        }}
      />
      {/* Pestaña de Perfil - Gestión de perfiles de usuario */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      
      {/* Rutas ocultas - No aparecen como pestañas pero son accesibles mediante navegación */}
      <Tabs.Screen
        name="onboarding"
        options={{
          href: null, // No accesible directamente por URL
          tabBarStyle: { display: 'none' }, // Ocultar la barra de navegación
          headerShown: false, // Ocultar el encabezado
        }}
      />
      <Tabs.Screen
        name="diagnostico"
        options={{
          href: null, // Pantalla de diagnóstico inicial
        }}
      />
      <Tabs.Screen
        name="leccion"
        options={{
          href: null, // Pantalla de lecciones
        }}
      />
      <Tabs.Screen
        name="examen"
        options={{
          href: null, // Pantalla de exámenes
        }}
      />
      <Tabs.Screen
        name="perfiles"
        options={{
          href: null, // Gestión de múltiples perfiles
        }}
      />
    </Tabs>
  );
}