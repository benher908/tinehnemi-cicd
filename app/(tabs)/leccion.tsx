/**
 * Pantalla de lección - Componente principal para mostrar y gestionar el contenido educativo
 * 
 * Este componente maneja la visualización de lecciones, incluyendo secciones de contenido,
 * vocabulario, ejemplos, diálogos y ejercicios de práctica. También gestiona la navegación
 * entre secciones y la evaluación de respuestas en los ejercicios.
 */

import { router, useLocalSearchParams } from 'expo-router'; // Navegación y parámetros de ruta
import React, { useEffect, useRef, useState } from 'react'; // Hooks de React
import { Alert, Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Componentes UI
import { useAppContext } from '../../contexts/AppContext'; // Contexto global de la aplicación
import { cargarLeccionSegura } from '../../utils/contenido.js'; // Utilidad para cargar lecciones

/**
 * Interfaces para modelar la estructura de datos de las lecciones
 */

/**
 * Representa una palabra de vocabulario con su traducción y ejemplo opcional
 */
interface Palabra {
  nahuatl: string;   // Palabra en náhuatl
  espanol: string;   // Traducción al español
  ejemplo?: string;  // Ejemplo de uso (opcional)
}

/**
 * Representa un ejemplo de uso del idioma con su traducción
 */
interface Ejemplo {
  nahuatl: string;  // Frase en náhuatl
  espanol: string;  // Traducción al español
}

/**
 * Representa una línea de diálogo en una conversación
 */
interface DialogoLinea {
  persona: string;    // Nombre de la persona que habla
  texto: string;      // Texto en náhuatl
  traduccion: string; // Traducción al español
}

/**
 * Representa una sección de contenido dentro de una lección
 */
interface Seccion {
  titulo: string;           // Título de la sección
  contenido: string;        // Texto explicativo principal
  palabras?: Palabra[];     // Lista de vocabulario (opcional)
  ejemplos?: Ejemplo[];     // Lista de ejemplos (opcional)
  dialogo?: DialogoLinea[]; // Diálogo de práctica (opcional)
}

/**
 * Representa un ejercicio de práctica con opciones y respuesta correcta
 */
interface Ejercicio {
  pregunta?: string;        // Pregunta del ejercicio (opcional)
  frase?: string;           // Frase a completar o traducir (opcional)
  opciones: string[];       // Opciones de respuesta
  respuestaCorrecta: string; // Respuesta correcta
}

/**
 * Representa la sección de práctica de una lección
 */
interface Practica {
  titulo: string;           // Título de la práctica
  instrucciones: string;    // Instrucciones para los ejercicios
  ejercicios: Ejercicio[];  // Lista de ejercicios
}

/**
 * Representa una lección completa con todas sus secciones y práctica
 */
interface Leccion {
  titulo: string;         // Título de la lección
  descripcion: string;    // Descripción breve
  secciones: Seccion[];   // Secciones de contenido
  practica: Practica;     // Sección de práctica
}

/**
 * Componente principal de la pantalla de lección
 * Gestiona la visualización y navegación a través del contenido educativo
 */
export default function LeccionScreen() {
  // Parámetros de navegación con valores por defecto
  const params = useLocalSearchParams() || {};
  const nivel = (params?.nivel as string) || 'basico';     // Nivel de dificultad
  const unidad = (params?.unidad as string) || 'unidad1';  // Identificador de unidad
  const modo = (params?.modo as string) || '';            // Modo de visualización (normal o repaso)
  
  // Estado para gestionar la lección y su progreso
  const [leccion, setLeccion] = useState<Leccion | null>(null);                // Datos de la lección
  const [seccionActual, setSeccionActual] = useState(0);                       // Índice de sección actual
  const [mostrarPractica, setMostrarPractica] = useState(false);               // Indica si mostrar la práctica
  const [ejercicioActual, setEjercicioActual] = useState(0);                   // Índice de ejercicio actual
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string>(''); // Respuesta seleccionada
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(0);          // Contador de respuestas correctas
  const [practicaCompletada, setPracticaCompletada] = useState(false);         // Indica si la práctica está completada
  
  // Acceso al contexto global de la aplicación
  const { state } = useAppContext();
  
  // Referencia al ScrollView para controlar el desplazamiento
  const scrollViewRef = useRef<ScrollView>(null);

  /**
   * Función para resetear el estado de la lección a sus valores iniciales
   * Se utiliza al cambiar de lección o al desmontar el componente
   */
  const resetearEstado = () => {
    setLeccion(null);
    setSeccionActual(0);
    setMostrarPractica(false);
    setEjercicioActual(0);
    setRespuestaSeleccionada('');
    setRespuestasCorrectas(0);
    setPracticaCompletada(false);
  };

  // Valores para animaciones de transición entre secciones
  const fadeAnim = useRef(new Animated.Value(0)).current;  // Animación de opacidad (fade in)
  const slideAnim = useRef(new Animated.Value(50)).current; // Animación de deslizamiento vertical

  /**
   * Efecto para cargar la lección cuando cambian los parámetros de nivel o unidad
   */
  useEffect(() => {
    // Resetear estado cuando cambian los parámetros
    resetearEstado();
    // Los parámetros ahora siempre tienen valores por defecto válidos
    cargarLeccionData();
  }, [nivel, unidad]);

  /**
   * Efecto para limpiar el estado cuando se desmonta el componente
   * Evita fugas de memoria y estados inconsistentes
   */
  useEffect(() => {
    return () => {
      resetearEstado();
    };
  }, []);

  /**
   * Efecto para animar la entrada de contenido cuando cambia la sección,
   * el estado de práctica o el ejercicio actual
   */
  useEffect(() => {
    // Animar la entrada de contenido con fade in y deslizamiento hacia arriba
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [seccionActual, mostrarPractica, practicaCompletada, ejercicioActual]);

  /**
   * Carga los datos de la lección desde el sistema de contenido
   * Utiliza la función segura que garantiza que el contenido existe
   */
  const cargarLeccionData = async () => {
    try {
      // Validar que los parámetros existan
      if (!nivel || !unidad) {
        throw new Error('Parámetros de lección faltantes');
      }

      // Usar la utilidad segura para cargar la lección
      const leccionData = cargarLeccionSegura(nivel, unidad);
      setLeccion(leccionData);
    } catch (error) {
      console.error('Error cargando lección:', error);
      Alert.alert('Error', 'No se pudo cargar la lección');
      router.back(); // Volver a la pantalla anterior en caso de error
    }
  };

  /**
   * Avanza a la siguiente sección de la lección o a la práctica
   * si ya se han mostrado todas las secciones
   */
  const siguienteSeccion = () => {
    if (!leccion) return;

    // Reiniciar animaciones para la transición
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    if (seccionActual < leccion.secciones.length - 1) {
      // Avanzar a la siguiente sección
      setSeccionActual(seccionActual + 1);
      // Scroll al inicio para mostrar el contenido desde arriba
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
      }
    } else {
      // Si ya se mostraron todas las secciones, pasar a la práctica
      setMostrarPractica(true);
    }
  };

  /**
   * Retrocede a la sección anterior de la lección
   * Solo disponible si no estamos en la primera sección
   */
  const seccionAnterior = () => {
    // Reiniciar animaciones para la transición
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    if (seccionActual > 0) {
      // Retroceder a la sección anterior
      setSeccionActual(seccionActual - 1);
      // Scroll al inicio para mostrar el contenido desde arriba
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
      }
    }
  };

  /**
   * Verifica si la respuesta seleccionada es correcta
   * Muestra retroalimentación al usuario y actualiza el contador de respuestas correctas
   */
  const verificarRespuesta = () => {
    if (!leccion || !respuestaSeleccionada) {
      Alert.alert('Atención', 'Por favor selecciona una respuesta');
      return;
    }

    const ejercicio = leccion.practica.ejercicios[ejercicioActual];
    const esCorrecta = respuestaSeleccionada === ejercicio.respuestaCorrecta;

    // Incrementar contador si la respuesta es correcta
    if (esCorrecta) {
      setRespuestasCorrectas(prev => prev + 1);
    }

    // Mostrar retroalimentación al usuario
    Alert.alert(
      esCorrecta ? '¡Correcto! 🎉' : 'Incorrecto 😕',
      esCorrecta
        ? '¡Muy bien! Continúa así.'
        : `La respuesta correcta es: ${ejercicio.respuestaCorrecta}`,
      [{ text: 'Continuar', onPress: siguienteEjercicio }]
    );
  };

  /**
   * Avanza al siguiente ejercicio o finaliza la práctica
   * si ya se han completado todos los ejercicios
   */
  const siguienteEjercicio = () => {
    if (!leccion) return;

    // Limpiar respuesta seleccionada para el siguiente ejercicio
    setRespuestaSeleccionada('');

    // Reiniciar animaciones para la transición
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    if (ejercicioActual < leccion.practica.ejercicios.length - 1) {
      // Avanzar al siguiente ejercicio
      setEjercicioActual(prev => prev + 1);
    } else {
      // Práctica completada - mostrar resultados
      const porcentaje = (respuestasCorrectas / leccion.practica.ejercicios.length) * 100;

      Alert.alert(
        'Práctica completada 🎓',
        `¡Felicidades! Has obtenido ${respuestasCorrectas} de ${leccion.practica.ejercicios.length} respuestas correctas (${porcentaje.toFixed(0)}%).`,
        [
          {
            text: 'Continuar',
            onPress: () => setPracticaCompletada(true)
          }
        ]
      );
    }
  };

  /**
   * Finaliza la lección y navega según el modo (normal o repaso)
   * En modo normal, va directamente al examen
   * En modo repaso, ofrece opciones al usuario
   */
  const finalizarLeccion = () => {
    const esRepaso = modo === 'repaso';

    if (esRepaso) {
      // En modo repaso, ofrecer opciones al usuario
      Alert.alert(
        '📚 Repaso Completado',
        '¿Qué te gustaría hacer ahora?',
        [
          {
            text: 'Tomar Examen',
            onPress: () => {
              router.push({
                pathname: '/(tabs)/examen',
                params: { nivel, unidad }
              });
            }
          },
          {
            text: 'Volver al Inicio',
            onPress: () => router.replace('/(tabs)')
          }
        ]
      );
    } else {
      // Modo normal, ir directamente al examen
      router.push({
        pathname: '/(tabs)/examen',
        params: { nivel, unidad }
      });
    }
  };

  /**
   * Navega de vuelta a la pantalla de inicio
   * Utiliza replace para evitar que el usuario pueda volver atrás
   */
  const volverAlInicio = () => {
    router.replace('/(tabs)');
  };

  /**
   * Obtiene el color temático según el nivel de dificultad
   * Utilizado para mantener consistencia visual en toda la lección
   * @returns Color hexadecimal correspondiente al nivel
   */
  const getNivelColor = () => {
    switch (nivel) {
      case 'basico':
        return '#2E86C1'; // Azul para nivel básico
      case 'intermedio':
        return '#16A085'; // Verde para nivel intermedio
      case 'avanzado':
        return '#8E44AD'; // Morado para nivel avanzado
      default:
        return '#2E86C1'; // Azul por defecto
    }
  };

  /**
   * Renderizado condicional - Pantalla de carga
   * Se muestra mientras se cargan los datos de la lección
   */
  if (!leccion) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando lección...</Text>
      </View>
    );
  }

  /**
   * Renderizado de la pantalla de lección completada
   * Se muestra cuando el usuario ha terminado todos los ejercicios de práctica
   * Ofrece la opción de continuar al examen o volver al inicio según el modo
   */
  if (practicaCompletada) {
    return (
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}>
        <View style={[styles.header, { backgroundColor: getNivelColor() }]}>
          <Text style={styles.titulo}>{leccion.titulo}</Text>
        </View>

        <Animated.View
          style={[
            styles.completadoContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}>
          <View style={styles.celebracionIcono}>
            <Text style={styles.celebracionTexto}>🎉</Text>
          </View>
          <Text style={styles.completadoTitulo}>
            {modo === 'repaso' ? '¡Repaso completado!' : '¡Lección completada!'}
          </Text>
          <Text style={styles.completadoTexto}>
            {modo === 'repaso' 
              ? `Has repasado la lección "${leccion.titulo}". ¿Te gustaría tomar el examen para evaluar tu conocimiento o volver al inicio?`
              : `Has completado la lección "${leccion.titulo}". Ahora puedes tomar el examen para evaluar tu conocimiento o volver al inicio.`
            }
          </Text>

          <View style={styles.botonesContainer}>
            <TouchableOpacity
              style={[styles.boton, styles.botonPrimario, { backgroundColor: getNivelColor() }]}
              onPress={finalizarLeccion}
            >
              <Text style={styles.botonTexto}>Tomar examen</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.boton, styles.botonSecundario, { borderColor: getNivelColor() }]}
              onPress={volverAlInicio}
            >
              <Text style={[styles.botonTexto, styles.botonTextoSecundario, { color: getNivelColor() }]}>Volver al inicio</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    );
  }

  /**
   * Renderizado de la sección de práctica
   * Muestra los ejercicios interactivos para que el usuario practique lo aprendido
   * Incluye la pregunta o frase, opciones de respuesta y botón de verificación
   */
  if (mostrarPractica) {
    const ejercicio = leccion.practica.ejercicios[ejercicioActual];

    return (
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}>
        <View style={[styles.header, { backgroundColor: getNivelColor() }]}>
          <Text style={styles.titulo}>{leccion.practica.titulo}</Text>
          <Text style={styles.subtitulo}>
            Ejercicio {ejercicioActual + 1} de {leccion.practica.ejercicios.length}
          </Text>
        </View>

        <Animated.View
          style={[
            styles.practicaContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}>
          {/* Instrucciones de la práctica */}
          <Text style={styles.instrucciones}>{leccion.practica.instrucciones}</Text>

          {/* Pregunta del ejercicio (si existe) */}
          {ejercicio.pregunta && (
            <Text style={styles.pregunta}>{ejercicio.pregunta}</Text>
          )}

          {/* Frase a completar o traducir (si existe) */}
          {ejercicio.frase && (
            <Text style={styles.frase}>{ejercicio.frase}</Text>
          )}

          {/* Opciones de respuesta */}
          <View style={styles.opcionesContainer}>
            {ejercicio.opciones.map((opcion, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.opcionBoton,
                  respuestaSeleccionada === opcion && [styles.opcionSeleccionada, { borderColor: getNivelColor(), backgroundColor: `${getNivelColor()}15` }]
                ]}
                onPress={() => setRespuestaSeleccionada(opcion)}
              >
                <Text style={[
                  styles.opcionTexto,
                  respuestaSeleccionada === opcion && [styles.opcionTextoSeleccionado, { color: getNivelColor() }]
                ]}>
                  {opcion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Botón para verificar la respuesta */}
          <TouchableOpacity
            style={[
              styles.boton,
              styles.botonPrimario,
              { backgroundColor: getNivelColor() },
              !respuestaSeleccionada && styles.botonDeshabilitado
            ]}
            onPress={verificarRespuesta}
            disabled={!respuestaSeleccionada}
          >
            <Text style={styles.botonTexto}>Verificar</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    );
  }

  /**
   * Renderizado principal - Sección de contenido de la lección
   * Muestra el contenido educativo organizado en secciones con vocabulario,
   * ejemplos y diálogos según corresponda
   */
  const seccion = leccion.secciones[seccionActual];

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}>
      {/* Encabezado con título de la lección y sección actual */}
      <View style={[styles.header, { backgroundColor: getNivelColor() }]}>
        <Text style={styles.titulo}>{leccion.titulo}</Text>
        <Text style={styles.subtitulo}>
          Sección {seccionActual + 1} de {leccion.secciones.length}: {seccion.titulo}
        </Text>
      </View>

      <Animated.View
        style={[
          styles.seccionContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
        {/* Contenido principal explicativo */}
        <Text style={styles.contenido}>{seccion.contenido}</Text>

        {/* Renderizado condicional de palabras de vocabulario */}
        {seccion.palabras && seccion.palabras.length > 0 && (
          <View style={styles.palabrasContainer}>
            <Text style={[styles.subtituloSeccion, { color: getNivelColor() }]}>Vocabulario:</Text>

            {seccion.palabras.map((palabra, index) => (
              <View key={index} style={styles.palabraCard}>
                <View style={styles.palabraHeader}>
                  <Text style={[styles.palabraNahuatl, { color: getNivelColor() }]}>{palabra.nahuatl}</Text>
                  <Text style={styles.palabraEspanol}>{palabra.espanol}</Text>
                </View>

                {palabra.ejemplo && (
                  <Text style={styles.palabraEjemplo}>{palabra.ejemplo}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Renderizado condicional de ejemplos de uso */}
        {seccion.ejemplos && seccion.ejemplos.length > 0 && (
          <View style={styles.ejemplosContainer}>
            <Text style={[styles.subtituloSeccion, { color: getNivelColor() }]}>Ejemplos:</Text>

            {seccion.ejemplos.map((ejemplo, index) => (
              <View key={index} style={styles.ejemploCard}>
                <Text style={[styles.ejemploNahuatl, { color: getNivelColor() }]}>{ejemplo.nahuatl}</Text>
                <Text style={styles.ejemploEspanol}>{ejemplo.espanol}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Renderizado condicional de diálogos de práctica */}
        {seccion.dialogo && seccion.dialogo.length > 0 && (
          <View style={styles.dialogoContainer}>
            <Text style={[styles.subtituloSeccion, { color: getNivelColor() }]}>Diálogo:</Text>

            {seccion.dialogo.map((linea, index) => (
              <View key={index} style={[
                styles.dialogoCard,
                index % 2 === 0 ? { borderLeftColor: getNivelColor() } : { borderRightColor: getNivelColor(), borderLeftWidth: 0, borderRightWidth: 4 }
              ]}>
                <Text style={[styles.dialogoPersona, { color: getNivelColor() }]}>{linea.persona}:</Text>
                <Text style={styles.dialogoTexto}>{linea.texto}</Text>
                <Text style={styles.dialogoTraduccion}>{linea.traduccion}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Botones de navegación entre secciones */}
        <View style={styles.botonesNavegacion}>
          {seccionActual > 0 && (
            <TouchableOpacity
              style={[styles.boton, styles.botonSecundario, { borderColor: getNivelColor() }]}
              onPress={seccionAnterior}
            >
              <Text style={[styles.botonTexto, styles.botonTextoSecundario, { color: getNivelColor() }]}>Anterior</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.boton, styles.botonPrimario, { backgroundColor: getNivelColor() }]}
            onPress={siguienteSeccion}
          >
            <Text style={styles.botonTexto}>
              {seccionActual < leccion.secciones.length - 1 ? 'Siguiente' : 'Ir a la práctica'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

/**
 * Estilos para los componentes de la pantalla de lección
 * Organizados por secciones para facilitar el mantenimiento
 */
const styles = StyleSheet.create({
  // Contenedores principales
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  header: {
    padding: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  seccionContainer: {
    padding: 20,
  },
  contenido: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  subtituloSeccion: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 20,
  },
  palabrasContainer: {
    marginBottom: 20,
  },
  palabraCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  palabraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  palabraNahuatl: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  palabraEspanol: {
    fontSize: 16,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  palabraEjemplo: {
    fontSize: 14,
    color: '#34495e',
    marginTop: 10,
    fontStyle: 'italic',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
  },
  ejemplosContainer: {
    marginBottom: 20,
  },
  ejemploCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ejemploNahuatl: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ejemploEspanol: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  dialogoContainer: {
    marginBottom: 20,
  },
  dialogoCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
  },
  dialogoPersona: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dialogoTexto: {
    fontSize: 16,
    marginBottom: 5,
  },
  dialogoTraduccion: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  botonesNavegacion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  boton: {
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  botonPrimario: {
    flex: 1,
    marginLeft: 10,
  },
  botonSecundario: {
    backgroundColor: 'white',
    borderWidth: 2,
  },
  botonTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  botonTextoSecundario: {
    fontSize: 16,
    fontWeight: '600',
  },
  botonDeshabilitado: {
    backgroundColor: '#bdc3c7',
  },
  practicaContainer: {
    padding: 20,
  },
  instrucciones: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pregunta: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  frase: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  opcionesContainer: {
    marginBottom: 20,
  },
  opcionBoton: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  opcionSeleccionada: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  opcionTexto: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
  opcionTextoSeleccionado: {
    fontWeight: '600',
  },
  completadoContainer: {
    padding: 20,
    alignItems: 'center',
  },
  celebracionIcono: {
    fontSize: 50,
    marginBottom: 20,
  },
  celebracionTexto: {
    fontSize: 60,
  },
  completadoTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  completadoTexto: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  botonesContainer: {
    width: '100%',
    gap: 10,
  }
});