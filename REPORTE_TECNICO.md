# Reporte Técnico - Tinehnemi

## Resumen del Proyecto

Tinehnemi es una aplicación móvil educativa desarrollada con React Native y Expo para el aprendizaje del náhuatl de la Sierra Negra de Puebla. La aplicación ofrece un enfoque estructurado de aprendizaje con unidades progresivas, vocabulario, historias tradicionales, exámenes y minijuegos interactivos.

## Estructura del Proyecto

### Arquitectura

La aplicación utiliza una arquitectura basada en componentes con las siguientes características principales:

- **Expo Router**: Sistema de navegación basado en archivos que define la estructura de la aplicación.
- **Contexto Global**: Manejo de estado centralizado mediante `AppContext` para gestionar perfiles de usuario y progreso.
- **Componentes Funcionales**: Uso de React Hooks para la gestión de estado y efectos secundarios.
- **Carga Dinámica de Contenido**: Sistema para cargar lecciones, exámenes y vocabulario desde archivos JSON.

### Estructura de Directorios

```
/
├── app/                    # Estructura de navegación y pantallas principales
│   ├── _layout.tsx         # Layout raíz de la aplicación
│   ├── (tabs)/             # Pantallas principales con navegación por pestañas
│   │   ├── _layout.tsx     # Configuración de las pestañas
│   │   ├── index.tsx       # Pantalla de inicio (InicioScreen)
│   │   ├── vocabulario.tsx # Pantalla de vocabulario
│   │   ├── historias.tsx   # Pantalla de historias tradicionales
│   │   ├── minijuegos.tsx  # Pantalla de minijuegos
│   │   ├── examen.tsx      # Pantalla de exámenes
│   │   └── perfil.tsx      # Pantalla de perfil de usuario
├── assets/                 # Recursos estáticos (imágenes, fuentes, etc.)
├── components/             # Componentes reutilizables
├── contexts/               # Contextos de React
│   └── AppContext.tsx      # Contexto principal de la aplicación
├── data/                   # Datos estáticos en formato JSON
│   ├── basico/             # Contenido de nivel básico
│   ├── intermedio/         # Contenido de nivel intermedio
│   └── avanzado/           # Contenido de nivel avanzado
├── hooks/                  # Hooks personalizados
├── utils/                  # Utilidades y funciones auxiliares
│   ├── contenido.js        # Gestión de importaciones de contenido
│   ├── lecciones.ts        # Utilidades para lecciones
│   └── examenes.ts         # Utilidades para exámenes
```

## Componentes Principales

### AppContext

El contexto global de la aplicación gestiona:

- **Perfiles de Usuario**: Creación, selección y eliminación de perfiles.
- **Progreso de Aprendizaje**: Seguimiento de unidades completadas, nivel actual y estadísticas.
- **Persistencia de Datos**: Almacenamiento local mediante AsyncStorage.

### Pantallas Principales

1. **InicioScreen (index.tsx)**
   - Muestra las unidades de aprendizaje disponibles según el nivel del usuario.
   - Gestiona la navegación a lecciones y exámenes.
   - Implementa la lógica de desbloqueo progresivo de unidades.

2. **VocabularioScreen**
   - Presenta palabras categorizadas por temas y niveles.
   - Incluye reproducción de audio para cada palabra.
   - Permite filtrar por categorías.

3. **HistoriasScreen**
   - Muestra historias tradicionales de la Sierra Negra.
   - Carga dinámicamente el contenido desde archivos JSON.

4. **MinijuegosScreen**
   - Ofrece juegos educativos: Memorama, Ahorcado, Quiz y Frases desordenadas.
   - Implementa verificación de nivel requerido para cada juego.
   - Cada juego tiene su propia lógica y sistema de puntuación.

5. **ExamenScreen**
   - Evalúa el conocimiento del usuario sobre una unidad específica.
   - Selecciona preguntas aleatorias de un conjunto predefinido.
   - Implementa diferentes tipos de preguntas (selección, completar, traducción).
   - Actualiza el progreso del usuario al aprobar.

## Sistema de Contenido

### Lecciones

Las lecciones se organizan por niveles (básico, intermedio, avanzado) y unidades. Cada lección se almacena en un archivo JSON con la siguiente estructura:

```json
{
  "metadata": {
    "titulo": "Título de la lección",
    "descripcion": "Descripción breve",
    "nivel": "basico"
  },
  "contenido": [
    {
      "tipo": "texto",
      "contenido": "Contenido textual"
    },
    {
      "tipo": "vocabulario",
      "palabras": [...]
    }
  ]
}
```

### Exámenes

Los exámenes siguen una estructura similar, con preguntas de diferentes tipos:

```json
{
  "preguntas": [
    {
      "tipo": "seleccion",
      "pregunta": "¿Qué significa 'tlaxkal'?",
      "opciones": ["Pan", "Tortilla", "Fruta"],
      "respuestaCorrecta": "Tortilla"
    },
    {
      "tipo": "completar",
      "pregunta": "Traduce: 'maíz'",
      "respuestaCorrecta": "tlaolli"
    }
  ]
}
```

## Gestión de Progreso

El progreso del usuario se almacena en el perfil y contiene:

- **Nivel**: Básico, intermedio o avanzado.
- **Unidades Completadas**: Registro de unidades finalizadas por nivel.
- **Estadísticas**: Tiempo de estudio, exámenes aprobados, palabras aprendidas.
- **Racha**: Días consecutivos de uso de la aplicación.

## Características Técnicas

### Manejo de Audio

La aplicación utiliza la API de Audio de Expo para reproducir pronunciaciones de palabras en náhuatl.

### Algoritmos de Evaluación

Para la evaluación de respuestas en exámenes y juegos, se implementan:

- **Normalización de Texto**: Elimina acentos, convierte a minúsculas y elimina puntuación.
- **Cálculo de Similitud**: Permite cierta flexibilidad en las respuestas para errores menores.

### Optimización de Rendimiento

- **Carga Perezosa**: El contenido se carga dinámicamente según sea necesario.
- **Importaciones Estáticas**: Para evitar errores de bundling en archivos de contenido.

## Recomendaciones para Desarrollo Futuro

1. **Implementación de Backend**
   - Migrar el almacenamiento de datos a un servidor para sincronización entre dispositivos.
   - Implementar autenticación de usuarios.

2. **Mejoras de Contenido**
   - Expandir el vocabulario y lecciones para el nivel avanzado.
   - Añadir más historias tradicionales con audio.

3. **Optimizaciones Técnicas**
   - Implementar caché para recursos de audio.
   - Mejorar el sistema de animaciones para una experiencia más fluida.
   - Optimizar el tamaño de la aplicación mediante la compresión de recursos.

4. **Nuevas Funcionalidades**
   - Implementar un sistema de comunidad para interacción entre estudiantes.
   - Añadir reconocimiento de voz para práctica de pronunciación.
   - Desarrollar un modo offline completo.

## Conclusión

Tinehnemi es una aplicación educativa bien estructurada con un enfoque sólido en la experiencia de usuario y la pedagogía. El código está organizado de manera modular y sigue buenas prácticas de desarrollo en React Native. La arquitectura actual permite una fácil expansión del contenido y la adición de nuevas funcionalidades.