// Importaciones principales para la pantalla de examen
import { router } from 'expo-router'; // Navegación entre pantallas
import React, { useEffect, useState } from 'react'; // React y hooks
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'; // Componentes básicos de React Native
import { useAppContext } from '../../contexts/AppContext'; // Contexto global de la aplicación
import { useRouteParams } from '../../hooks/useRouteParams'; // Hook para obtener parámetros de ruta
import { useNavigation } from '../../hooks/useNavigation'; // Hook para navegación
import { cargarExamenSeguro } from '../../utils/contenido'; // Utilidad para cargar datos de exámenes de forma segura

/**
 * Interfaz que define la estructura de una pregunta de examen
 */
interface Pregunta {
  tipo: 'seleccion' | 'completar' | 'traduccion'; // Tipo de pregunta que determina cómo se muestra y responde
  pregunta: string;                               // Texto de la pregunta
  opciones?: string[];                            // Opciones de respuesta para preguntas de selección
  respuestaCorrecta: string;                      // Respuesta correcta a la pregunta
  explicacion?: string;                           // Explicación opcional para mostrar después de responder
}

/**
 * Interfaz para los metadatos del examen
 */
interface ExamenMetadata {
  unidad: string;      // Identificador de la unidad del examen
  nivel: string;       // Nivel de dificultad (básico, intermedio, avanzado)
  objetivos: string[]; // Lista de objetivos de aprendizaje que evalúa el examen
}

/**
 * Interfaz principal para un examen completo
 */
interface Examen {
  metadata?: ExamenMetadata; // Metadatos opcionales del examen
  preguntas: Pregunta[];    // Lista de preguntas que componen el examen
}

/**
 * Interfaz para almacenar información detallada de cada respuesta del usuario
 */
interface RespuestaDetallada {
  pregunta: string;          // Texto de la pregunta
  respuestaUsuario: string;  // Respuesta proporcionada por el usuario
  respuestaCorrecta: string; // Respuesta correcta para comparación
  esCorrecta: boolean;       // Indica si la respuesta del usuario fue correcta
  explicacion?: string;      // Explicación opcional para mostrar en los resultados
}

/**
 * Pantalla de examen que evalúa el conocimiento del usuario sobre una unidad específica
 */
export default function ExamenScreen() {
  // Obtener parámetros de la ruta (nivel y unidad)
  const params = useRouteParams();
  const nivel = (params?.nivel as string) || 'basico'; // Nivel de dificultad, por defecto 'basico'
  const unidad = (params?.unidad as string) || 'unidad1'; // Unidad a evaluar, por defecto 'unidad1'
  
  // Estados para gestionar el examen
  const [examen, setExamen] = useState<Examen | null>(null); // Datos completos del examen
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState<Pregunta[]>([]); // Preguntas seleccionadas para este intento
  const [preguntaActual, setPreguntaActual] = useState(0); // Índice de la pregunta actual
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string>(''); // Para preguntas de selección
  const [respuestaTexto, setRespuestaTexto] = useState<string>(''); // Para preguntas de completar o traducción
  const [respuestasDetalladas, setRespuestasDetalladas] = useState<RespuestaDetallada[]>([]); // Historial de respuestas
  const [tiempoInicio, setTiempoInicio] = useState<number>(Date.now()); // Para medir el tiempo de realización
  const [mostrandoResultados, setMostrandoResultados] = useState(false); // Controla la vista de resultados
  
  // Acceso al contexto global y navegación
  const { state, dispatch, currentProfile, updateCurrentProfile } = useAppContext();
  const { navigateToHome } = useNavigation();

  /**
   * Función para resetear el estado del examen a sus valores iniciales
   * Útil para reiniciar el examen o prepararlo para un nuevo intento
   */
  const resetearEstado = () => {
    setExamen(null); // Limpiar datos del examen
    setPreguntasSeleccionadas([]); // Limpiar preguntas seleccionadas
    setPreguntaActual(0); // Volver a la primera pregunta
    setRespuestaSeleccionada(''); // Limpiar respuesta seleccionada
    setRespuestaTexto(''); // Limpiar respuesta de texto
    setRespuestasDetalladas([]); // Limpiar historial de respuestas
    setTiempoInicio(Date.now()); // Reiniciar el temporizador
    setMostrandoResultados(false); // Ocultar resultados
  };

  useEffect(() => {
    // Resetear estado cuando cambian los parámetros
    resetearEstado();
    // Los parámetros ahora siempre tienen valores por defecto válidos
    cargarExamenData();
  }, [nivel, unidad]);

  // Efecto para limpiar estado al desmontar el componente
  useEffect(() => {
    return () => {
      resetearEstado();
    };
  }, []);

  /**
   * Carga los datos del examen según el nivel y unidad especificados
   * Selecciona un subconjunto aleatorio de preguntas para el examen actual
   */
  const cargarExamenData = async () => {
    try {
      // Validar que los parámetros existan
      if (!nivel || !unidad) {
        throw new Error('Parámetros de examen faltantes');
      }

      // Usar la utilidad segura para cargar el examen
      const examenData = cargarExamenSeguro(nivel, unidad);
      
      // Guardar los datos completos del examen
      setExamen(examenData);
      
      // Seleccionar preguntas (máximo 10 o todas las disponibles)
      const maxPreguntas = Math.min(10, examenData.preguntas.length);
      // Mezclar las preguntas aleatoriamente y seleccionar un subconjunto
      const preguntasAleatorias = examenData.preguntas
        .sort(() => Math.random() - 0.5) // Mezcla aleatoria
        .slice(0, maxPreguntas); // Seleccionar solo las primeras N preguntas
      setPreguntasSeleccionadas(preguntasAleatorias);
    } catch (error) {
      console.error('Error cargando examen:', error);
      Alert.alert('Error', 'No se pudo cargar el examen');
      router.back(); // Volver a la pantalla anterior en caso de error
    }
  };

  const manejarRespuesta = () => {
    if (preguntasSeleccionadas.length === 0) return;

    const pregunta = preguntasSeleccionadas[preguntaActual];
    let respuestaUsuario = '';

    // Obtener la respuesta del usuario según el tipo de pregunta
    if (pregunta.tipo === 'completar' || pregunta.tipo === 'traduccion') {
      respuestaUsuario = respuestaTexto.trim();
    } else if (pregunta.tipo === 'seleccion') {
      respuestaUsuario = respuestaSeleccionada;
    }

    // Validar que hay una respuesta
    if (!respuestaUsuario) {
      Alert.alert('Atención', 'Por favor proporciona una respuesta');
      return;
    }

    // Crear respuesta detallada
    const esCorrecta = compararRespuestas(respuestaUsuario, pregunta.respuestaCorrecta);
    const respuestaDetallada: RespuestaDetallada = {
      pregunta: pregunta.pregunta,
      respuestaUsuario,
      respuestaCorrecta: pregunta.respuestaCorrecta,
      esCorrecta,
      explicacion: pregunta.explicacion
    };

    // Actualizar respuestas detalladas
    const nuevasRespuestasDetalladas = [...respuestasDetalladas, respuestaDetallada];
    setRespuestasDetalladas(nuevasRespuestasDetalladas);
    
    // Limpiar respuestas para la siguiente pregunta
    setRespuestaSeleccionada('');
    setRespuestaTexto('');

    // Avanzar a la siguiente pregunta o finalizar examen
    if (preguntaActual < preguntasSeleccionadas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      // Examen completado
      evaluarExamen(nuevasRespuestasDetalladas);
    }
  };

  /**
   * Compara la respuesta del usuario con la respuesta correcta
   * Utiliza normalización de texto y algoritmos de similitud para ser flexible con errores menores
   * @param {string} respuestaUsuario - La respuesta proporcionada por el usuario
   * @param {string} respuestaCorrecta - La respuesta correcta según el examen
   * @returns {boolean} - true si la respuesta es correcta, false en caso contrario
   */
  const compararRespuestas = (respuestaUsuario: string, respuestaCorrecta: string): boolean => {
    // Función para normalizar texto: minúsculas, sin acentos, sin puntuación
    const normalizar = (str: string) => str.toLowerCase().trim()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^\w\s]/g, ''); // Remover puntuación
    
    // Normalizar ambas respuestas para comparación
    const usuarioNorm = normalizar(respuestaUsuario);
    const correctaNorm = normalizar(respuestaCorrecta);
    
    // Verificar coincidencia exacta después de normalizar
    if (usuarioNorm === correctaNorm) return true;
    
    // Verificar si una respuesta contiene a la otra (útil para frases)
    if (usuarioNorm.includes(correctaNorm) || correctaNorm.includes(usuarioNorm)) {
      return true;
    }
    
    // Para errores menores, usar algoritmo de similitud de texto
    // Si la similitud es mayor al 80%, considerar correcta
    return calcularSimilitud(usuarioNorm, correctaNorm) > 0.8;
  };

  const calcularSimilitud = (str1: string, str2: string): number => {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null));

    for (let i = 0; i <= len1; i++) matrix[0][i] = i;
    for (let j = 0; j <= len2; j++) matrix[j][0] = j;

    for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }

    const distance = matrix[len2][len1];
    return 1 - distance / Math.max(len1, len2);
  };

  /**
   * Evalúa el examen completo y actualiza el perfil del usuario si aprueba
   * @param {RespuestaDetallada[]} todasRespuestasDetalladas - Lista de todas las respuestas del usuario
   */
  const evaluarExamen = (todasRespuestasDetalladas: RespuestaDetallada[]) => {
    // Calcular estadísticas del examen
    const aciertos = todasRespuestasDetalladas.filter(r => r.esCorrecta).length;
    const total = todasRespuestasDetalladas.length;
    const porcentaje = (aciertos / total) * 100;
    const tiempoTotal = Math.round((Date.now() - tiempoInicio) / 1000 / 60); // Tiempo en minutos
    
    // Criterios de aprobación
    const aprobado = porcentaje >= 70; // 70% para aprobar
    const excelente = porcentaje >= 90; // 90% para excelente
    const bueno = porcentaje >= 80; // 80% para bueno

    // Si el usuario aprobó y hay un perfil activo
    if (aprobado && currentProfile) {
      // Marcar la unidad como completada en el estado global
      if (nivel && unidad) {
        dispatch({
          type: 'COMPLETE_UNIT',
          payload: { nivel: nivel as string, unidad: unidad as string }
        });
      }

      // Actualizar estadísticas del perfil del usuario
      actualizarEstadisticas(aprobado, aciertos, total, tiempoTotal);
    }

    // Mostrar la pantalla de resultados
    setMostrandoResultados(true);
  };

  /**
   * Actualiza las estadísticas del perfil del usuario después de completar un examen
   * Incluye actualización de racha diaria, tiempo de estudio y exámenes aprobados
   * @param {boolean} aprobado - Indica si el usuario aprobó el examen
   * @param {number} aciertos - Número de respuestas correctas
   * @param {number} total - Número total de preguntas
   * @param {number} tiempo - Tiempo en minutos que tomó completar el examen
   */
  const actualizarEstadisticas = (aprobado: boolean, aciertos: number, total: number, tiempo: number) => {
    if (!currentProfile) return;

    // Obtener fecha actual en formato YYYY-MM-DD
    const hoy = new Date().toISOString().split('T')[0];
    const ultimaEntrada = currentProfile.ultimaEntrada;
    
    // Calcular fecha de ayer para verificar racha
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const ayerStr = ayer.toISOString().split('T')[0];

    // Actualizar racha de días consecutivos
    let nuevaRacha = currentProfile.racha;
    if (ultimaEntrada === ayerStr) {
      // Si el usuario entró ayer, incrementar racha
      nuevaRacha += 1;
    } else if (ultimaEntrada !== hoy) {
      // Si no entró ayer ni hoy, reiniciar racha
      nuevaRacha = 1;
    }

    // Obtener o inicializar estadísticas del usuario
    const estadisticasActuales = currentProfile.estadisticas || {
      tiempoTotalEstudio: 0,
      leccionesCompletadas: 0,
      examenesAprobados: 0,
      palabrasAprendidas: 0,
      fechaRegistro: hoy
    };

    // Actualizar el perfil con las nuevas estadísticas
    updateCurrentProfile({
      ultimaEntrada: hoy, // Actualizar fecha de último acceso
      racha: nuevaRacha, // Actualizar racha de días
      estadisticas: {
        ...estadisticasActuales,
        tiempoTotalEstudio: estadisticasActuales.tiempoTotalEstudio + tiempo, // Sumar tiempo de estudio
        examenesAprobados: aprobado ? estadisticasActuales.examenesAprobados + 1 : estadisticasActuales.examenesAprobados, // Incrementar exámenes aprobados si aprobó
        palabrasAprendidas: estadisticasActuales.palabrasAprendidas + aciertos // Sumar palabras aprendidas (aciertos)
      }
    });
  };

  const mostrarResultadosDetallados = () => {
    const aciertos = respuestasDetalladas.filter(r => r.esCorrecta).length;
    const total = respuestasDetalladas.length;
    const porcentaje = (aciertos / total) * 100;
    const aprobado = porcentaje >= 70;

    return (
      <ScrollView style={styles.container}>
        <View style={[styles.header, { backgroundColor: aprobado ? '#27AE60' : '#E74C3C' }]}>
          <Text style={styles.titulo}>
            {aprobado ? '🎉 ¡Examen Aprobado!' : '📚 Sigue Practicando'}
          </Text>
          <Text style={styles.subtitulo}>
            {aciertos}/{total} correctas ({porcentaje.toFixed(0)}%)
          </Text>
          <Text style={styles.info}>
            {aprobado ? '¡Excelente trabajo!' : 'Necesitas 70% para aprobar'}
          </Text>
        </View>

        <View style={styles.resultadosContainer}>
          <Text style={styles.resultadosTitulo}>Revisión Detallada</Text>
          
          {respuestasDetalladas.map((respuesta, index) => (
            <View key={index} style={[
              styles.respuestaCard,
              { borderLeftColor: respuesta.esCorrecta ? '#27AE60' : '#E74C3C' }
            ]}>
              <Text style={styles.preguntaReview}>{respuesta.pregunta}</Text>
              
              <View style={styles.respuestaComparacion}>
                <View style={styles.respuestaItem}>
                  <Text style={styles.respuestaLabel}>Tu respuesta:</Text>
                  <Text style={[
                    styles.respuestaTexto,
                    { color: respuesta.esCorrecta ? '#27AE60' : '#E74C3C' }
                  ]}>
                    {respuesta.respuestaUsuario}
                  </Text>
                </View>
                
                {!respuesta.esCorrecta && (
                  <View style={styles.respuestaItem}>
                    <Text style={styles.respuestaLabel}>Respuesta correcta:</Text>
                    <Text style={[styles.respuestaTexto, { color: '#27AE60' }]}>
                      {respuesta.respuestaCorrecta}
                    </Text>
                  </View>
                )}
              </View>

              {respuesta.explicacion && (
                <View style={styles.explicacionContainer}>
                  <Text style={styles.explicacionTexto}>💡 {respuesta.explicacion}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.accionesContainer}>
          {aprobado ? (
            <TouchableOpacity
              style={[styles.accionBoton, { backgroundColor: '#27AE60' }]}
              onPress={() => navigateToHome()}
            >
              <Text style={styles.accionTexto}>Continuar</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.accionBoton, { backgroundColor: '#3498DB' }]}
                onPress={reiniciarExamen}
              >
                <Text style={styles.accionTexto}>Reintentar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.accionBoton, { backgroundColor: '#95A5A6' }]}
                onPress={() => navigateToHome()}
              >
                <Text style={styles.accionTexto}>Volver al Inicio</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    );
  };

  /**
   * Verifica si el usuario ha proporcionado una respuesta para la pregunta actual
   * @returns {boolean} - true si hay una respuesta, false en caso contrario
   */
  const tieneRespuesta = (): boolean => {
    // Si no hay preguntas seleccionadas, no puede haber respuesta
    if (preguntasSeleccionadas.length === 0) return false;
    
    // Obtener la pregunta actual
    const pregunta = preguntasSeleccionadas[preguntaActual];
    
    // Verificar según el tipo de pregunta
    if (pregunta.tipo === 'completar' || pregunta.tipo === 'traduccion') {
      // Para preguntas de completar o traducción, verificar que haya texto
      return respuestaTexto.trim().length > 0;
    } else if (pregunta.tipo === 'seleccion') {
      // Para preguntas de selección, verificar que haya una opción seleccionada
      return respuestaSeleccionada.length > 0;
    }
    
    return false; // Por defecto, no hay respuesta
  };

  /**
   * Reinicia el examen para un nuevo intento
   * Resetea el estado y carga nuevamente los datos del examen
   */
  const reiniciarExamen = () => {
    console.log('Reiniciando examen');
    resetearEstado(); // Limpiar todos los estados
    cargarExamenData(); // Cargar nuevamente el examen (posiblemente con preguntas diferentes)
  };

  if (mostrandoResultados) {
    return mostrarResultadosDetallados();
  }

  if (!examen || preguntasSeleccionadas.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.cargando}>Cargando examen...</Text>
      </View>
    );
  }

  const pregunta = preguntasSeleccionadas[preguntaActual];
  const progreso = ((preguntaActual + 1) / preguntasSeleccionadas.length) * 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Examen - {examen.metadata?.unidad || 'Unidad'}</Text>
        <Text style={styles.subtitulo}>
          Pregunta {preguntaActual + 1} de {preguntasSeleccionadas.length}
        </Text>
        <Text style={styles.info}>Necesitas 70% para aprobar</Text>
        
        <View style={styles.progresoBarraFondo}>
          <View style={[styles.progresoBarraRelleno, { width: `${progreso}%` }]} />
        </View>
      </View>

      <View style={styles.preguntaContainer}>
        <Text style={styles.preguntaTexto}>{pregunta.pregunta}</Text>

        {pregunta.tipo === 'seleccion' && pregunta.opciones && (
          <View style={styles.opcionesContainer}>
            {pregunta.opciones.map((opcion, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.opcionBoton,
                  respuestaSeleccionada === opcion && styles.opcionSeleccionada
                ]}
                onPress={() => setRespuestaSeleccionada(opcion)}
              >
                <Text style={[
                  styles.opcionTexto,
                  respuestaSeleccionada === opcion && styles.opcionTextoSeleccionado
                ]}>
                  {opcion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}



        {(pregunta.tipo === 'completar' || pregunta.tipo === 'traduccion') && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={respuestaTexto}
              onChangeText={setRespuestaTexto}
              placeholder={pregunta.tipo === 'traduccion' ? "Escribe la traducción aquí" : "Completa la frase aquí"}
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.siguienteBoton,
          !tieneRespuesta() && styles.botonDeshabilitado
        ]}
        onPress={manejarRespuesta}
        disabled={!tieneRespuesta()}
      >
        <Text style={styles.siguienteTexto}>
          {preguntaActual < preguntasSeleccionadas.length - 1 ? 'Siguiente' : 'Finalizar Examen'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#3498db',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  titulo: {
    fontSize: 22,
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
  info: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10,
    opacity: 0.8,
  },
  progresoBarraFondo: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progresoBarraRelleno: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  preguntaContainer: {
    padding: 20,
  },
  preguntaTexto: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 26,
  },
  opcionesContainer: {
    marginTop: 10,
  },
  opcionBoton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  opcionSeleccionada: {
    borderColor: '#3498db',
    backgroundColor: '#ebf3fd',
  },
  opcionTexto: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
  opcionTextoSeleccionado: {
    color: '#3498db',
    fontWeight: '600',
  },

  inputContainer: {
    marginTop: 10,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#ddd',
    textAlign: 'center',
  },
  siguienteBoton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    padding: 18,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  botonDeshabilitado: {
    backgroundColor: '#bdc3c7',
  },
  siguienteTexto: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  cargando: {
    fontSize: 18,
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: 50,
  },
  // Estilos para resultados
  resultadosContainer: {
    padding: 20,
  },
  resultadosTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  respuestaCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  preguntaReview: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  respuestaComparacion: {
    marginBottom: 8,
  },
  respuestaItem: {
    marginBottom: 8,
  },
  respuestaLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  respuestaTexto: {
    fontSize: 16,
    fontWeight: '500',
  },
  explicacionContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  explicacionTexto: {
    fontSize: 14,
    color: '#34495e',
    fontStyle: 'italic',
  },
  accionesContainer: {
    padding: 20,
    gap: 12,
  },
  accionBoton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  accionTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});