// Importaciones principales para la pantalla de vocabulario
import { Audio } from 'expo-av'; // API de audio de Expo
import React, { useEffect, useMemo, useRef, useState } from 'react'; // React y hooks
import { Alert, Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Componentes básicos de React Native
import { audioAssets } from '../services/audioService'; // Importar el mapa de assets de audio
 // Importar el mapa de assets de audio

// Sistema dinámico de carga de audio para vocabulario
// Este sistema permite cargar archivos de audio de forma dinámica basándose en
// la estructura de directorios y los datos JSON del vocabulario


/**
 * Interfaz que define la estructura de una palabra en náhuatl
 */
interface Palabra {
  nahuatl: string; // Palabra en idioma náhuatl
  espanol: string; // Traducción al español
  audio: string; // Ruta al archivo de audio con la pronunciación
}

/**
 * Interfaz que define la estructura de una categoría de vocabulario
 */
interface CategoriaVocabulario {
  categoria: string; // Nombre de la categoría
  palabras: Palabra[]; // Lista de palabras en esta categoría
}

/**
 * Pantalla de vocabulario que muestra palabras en náhuatl organizadas por categorías
 * Permite filtrar por nivel y reproducir la pronunciación
 */
export default function VocabularioScreen() {
  // Estado para almacenar todas las categorías de vocabulario
  const [categorias, setCategorias] = useState<CategoriaVocabulario[]>([]);
  // Estado para la categoría seleccionada actualmente
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  // Estado para el objeto de sonido (reproducción de audio)
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  // Estado para el nivel de dificultad seleccionado
  const [nivelSeleccionado, setNivelSeleccionado] = useState<string>('basico');

  // Índice insensible a mayúsculas/minúsculas para resolver diferencias de capitalización
  const audioIndexCI = useMemo(() => {
    const index: { [key: string]: any } = {};
    Object.keys(audioAssets).forEach((k) => {
      index[k.toLowerCase()] = audioAssets[k];
    });
    return index;
  }, []);

  // Referencias para las animaciones de entrada y transición
  const fadeAnim = useRef(new Animated.Value(0)).current; // Animación de opacidad
  const slideAnim = useRef(new Animated.Value(50)).current; // Animación de deslizamiento

  /**
   * Efecto que se ejecuta al montar el componente
   * Carga el vocabulario y configura las animaciones iniciales
   */
  useEffect(() => {
    cargarVocabulario(); // Cargar datos de vocabulario

    // Animar entrada con animaciones paralelas de opacidad y deslizamiento
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

    // Limpiar recursos de audio al desmontar
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  /**
   * Efecto que se ejecuta cuando cambia el nivel o categoría seleccionada
   * Aplica animaciones de transición para una experiencia visual fluida
   */
  useEffect(() => {
    // Animar cambios de nivel o categoría con animaciones más rápidas
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300, // Duración más corta para transiciones
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [nivelSeleccionado, categoriaSeleccionada]);

  /**
   * Carga todas las categorías de vocabulario desde archivos JSON
   */
  const cargarVocabulario = async () => {
    try {
      // Cargar todas las categorías de vocabulario - Nivel Básico
      const saludos = require('../../data/vocabulario/saludos.json'); // Saludos y expresiones básicas
      const vocabularioGeneral = require('../../data/vocabulario/vocabulario_general.json'); // Vocabulario de uso común
      const materialEscolar = require('../../data/vocabulario/material_escolar.json'); // Objetos escolares
      const numeros = require('../../data/vocabulario/numeros.json'); // Sistema numérico náhuatl
      const colores = require('../../data/vocabulario/colores.json'); // Nombres de colores
      const cuerpo = require('../../data/vocabulario/cuerpo.json'); // Partes del cuerpo
      const animales = require('../../data/vocabulario/animales.json'); // Nombres de animales
      const entorno = require('../../data/vocabulario/entorno.json'); // Elementos del entorno
      const pronombres = require('../../data/vocabulario/pronombres.json'); // Pronombres personales

      // Cargar categorías de nivel intermedio
      const vidaCotidiana = require('../../data/vocabulario/vida_cotidiana.json'); // Actividades diarias
      const verbos = require('../../data/vocabulario/verbos.json'); // Verbos comunes
      const tiemposVerbales = require('../../data/vocabulario/tiempos_verbales.json'); // Conjugaciones verbales
      const conectores = require('../../data/vocabulario/conectores.json'); // Palabras conectoras
      const comidaFamilia = require('../../data/vocabulario/comida_familia.json'); // Términos de comida y familia

      // Cargar categorías de nivel avanzado
      const conceptosAbstractos = require('../../data/vocabulario/conceptos_abstractos.json'); // Conceptos filosóficos
      const elementosNaturales = require('../../data/vocabulario/elementos_naturales.json'); // Elementos de la naturaleza
      const tiemposCelebraciones = require('../../data/vocabulario/tiempos_celebraciones.json'); // Festividades
      const expresionesAvanzadas = require('../../data/vocabulario/expresiones_avanzadas.json'); // Frases complejas

      // Cargar categorías específicas de la Sierra Negra
      const naturalezaSierra = require('../../data/vocabulario/naturaleza_sierra.json'); // Flora y fauna local
      const plantasSierra = require('../../data/vocabulario/plantas_sierra.json'); // Plantas medicinales

      // Actualizar el estado con todas las categorías cargadas, agrupadas por nivel
      setCategorias([
        // Nivel Básico - Vocabulario fundamental para principiantes
        saludos, vocabularioGeneral, materialEscolar, numeros, colores, cuerpo, animales, entorno, pronombres,
        // Nivel Intermedio - Para estudiantes con conocimientos básicos
        vidaCotidiana, verbos, tiemposVerbales, conectores, comidaFamilia, naturalezaSierra, plantasSierra,
        // Nivel Avanzado - Para estudiantes con dominio del idioma
        conceptosAbstractos, elementosNaturales, tiemposCelebraciones, expresionesAvanzadas
      ]);
    } catch (error) {
      console.error('Error cargando vocabulario:', error);
      Alert.alert('Error', 'No se pudo cargar el vocabulario');
    }
  };

  /**
   * Mapeo de categorías de vocabulario a sus directorios de audio correspondientes
   * Esto permite una carga dinámica y organizada de los archivos de audio
   */
  const categoriasAudioMap: { [key: string]: string } = {
    // Nivel Básico
    'Saludos y Cortesía': 'Basico/Saludos',
    'Animales': 'Basico/animales',
    'Colores': 'Basico/colores',
    'Material Escolar': 'Basico/material escolar',
    'Números': 'Basico/numeros',
    'Objetos y entorno': 'Basico/objetos entorno',
    'Partes del cuerpo': 'Basico/partes del cuerpo',
    'Pronombres personales': 'Basico/pronombres',
    'Vocabulario General': 'Basico/vocabulario general',
    
    // Nivel Intermedio
    'Conectores y expresiones': 'Intermedio/conectores',
    'Comida y familia': 'Intermedio/familia',
    'Familia': 'Intermedio/familia', // Nueva entrada para familia.json
    'Verbos comunes': 'Intermedio/verbos',
    'Tiempos verbales': 'Intermedio/tiempos verbales',
    'Vida cotidiana': 'Intermedio/vida cotidiana',
    
    // Nivel Avanzado
    'Conceptos abstractos y culturales': 'Avanzado/conceptos abstractos',
    'Expresiones avanzadas': 'Avanzado/expresiones avanzadas',
    'Elementos naturales y cosmogonía': 'Avanzado/elemntos naturales', // Corregido el typo en la ruta
    'Plantas de la Sierra': 'Avanzado/plantas sierra',
    'Naturaleza de la Sierra': 'Avanzado/naturaleza sierra',
    'Tiempos y celebraciones': 'Avanzado/tiempos celebraciones'
  };

  /**
   * Obtiene el recurso de audio pre-cargado desde el mapa de assets.
   * @param categoria - Categoría del vocabulario.
   * @param audioFile - Nombre del archivo de audio (ej. 'hola.mp3').
   * @returns El recurso de audio requerido o null si no se encuentra.
   */
  const obtenerRutaAudio = (nivel: string, categoria: string, audioFile: string): any => {
    // Nota: ignoramos 'nivel' porque el mapeo de categoría YA incluye el nivel en la ruta
    const directorioCategoria = categoriasAudioMap[categoria];
    if (!directorioCategoria) {
      console.warn(`Directorio para categoría no encontrado: ${categoria}`);
      return null;
    }

    // Respetar el nombre EXACTO proporcionado en el JSON.
    // Si no trae extensión, asumimos .mp3 (sin normalizar mayúsculas/minúsculas ni guiones).
    const archivoConExtension = /\.(mp3|wav|m4a)$/i.test(audioFile)
      ? audioFile
      : `${audioFile}.mp3`;

    // La clave en el mapa es: "<Nivel>/<DirectorioCategoria>/<archivo>"
    // Como 'directorioCategoria' ya incluye el nivel (p.ej. Basico/Saludos), no anteponemos nada más.
    const rutaCompleta = `${directorioCategoria}/${archivoConExtension}`;

    if (audioAssets[rutaCompleta]) {
      return audioAssets[rutaCompleta];
    }

    // Fallback insensible a mayúsculas/minúsculas
    const rutaLower = rutaCompleta.toLowerCase();
    if (audioIndexCI[rutaLower]) {
      return audioIndexCI[rutaLower];
    }

    console.warn(`Audio no encontrado (búsqueda exacta): ${rutaCompleta}`);
    return null;
  };

  /**
   * Reproduce el audio de pronunciación de una palabra
   * @param {string} item - Palabra a reproducir
   */
  const reproducirAudio = async (item: Palabra) => {
    if (sound) {
        await sound.unloadAsync();
    }

    if (!categoriaSeleccionada) {
        console.error('Error: No hay una categoría seleccionada para reproducir el audio.');
        Alert.alert('Error', 'No se ha seleccionado ninguna categoría.');
        return;
    }

    const nivelActual = nivelSeleccionado || 'Basico';
    const rutaAudio = obtenerRutaAudio(nivelActual, categoriaSeleccionada, item.audio);

    if (!rutaAudio) {
        console.error('No se pudo encontrar la ruta del audio para:', item.audio);
        Alert.alert('Error', 'No se pudo encontrar el audio para esta palabra.');
        return;
    }

    try {
        console.log(`Cargando audio: ${item.audio}`);
        const { sound: newSound } = await Audio.Sound.createAsync(
            rutaAudio,
            { shouldPlay: true }
        );
        setSound(newSound);

        newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                newSound.unloadAsync();
            }
        });
    } catch (error) {
        console.error('Error al reproducir el audio:', error);
        Alert.alert('Error', 'Ocurrió un error al reproducir el audio.');
    }
};

  /**
   * Filtra las categorías de vocabulario según el nivel de dificultad seleccionado
   * @param {string} nivel - Nivel de dificultad ('basico', 'intermedio', 'avanzado')
   * @returns {CategoriaVocabulario[]} - Lista de categorías filtradas
   */
  const filtrarCategoriasPorNivel = (nivel: string) => {
    switch (nivel) {
      case 'basico':
        // Categorías para principiantes
        return categorias.filter(c =>
          ['Saludos y Cortesía', 'Vocabulario General', 'Material Escolar', 'Números', 'Colores', 'Partes del cuerpo', 'Animales', 'Objetos y entorno', 'Pronombres personales'].includes(c.categoria)
        );
      case 'intermedio':
        // Categorías para nivel intermedio
        return categorias.filter(c =>
          ['Vida cotidiana', 'Verbos comunes', 'Tiempos verbales', 'Conectores y expresiones', 'Comida y familia', 'Naturaleza de la Sierra', 'Plantas de la Sierra'].includes(c.categoria)
        );
      case 'avanzado':
        // Categorías para estudiantes avanzados
        return categorias.filter(c =>
          ['Conceptos abstractos y culturales', 'Elementos naturales y cosmogonía', 'Tiempos y celebraciones', 'Expresiones avanzadas'].includes(c.categoria)
        );
      default:
        // Si no hay filtro o es desconocido, devolver todas las categorías
        return categorias;
    }
  };

  /**
   * Obtiene el color temático según el nivel de dificultad seleccionado
   * Cada nivel tiene un color distintivo para mejorar la experiencia visual
   * @returns {string} - Código de color hexadecimal
   */
  const getNivelColor = () => {
    switch (nivelSeleccionado) {
      case 'basico':
        return '#2E86C1'; // Azul para nivel básico
      case 'intermedio':
        return '#16A085'; // Verde para nivel intermedio
      case 'avanzado':
        return '#8E44AD'; // Morado para nivel avanzado
      default:
        return '#2E86C1'; // Color por defecto
    }
  };

  /**
   * Cambia el nivel de dificultad seleccionado y reinicia las animaciones
   * @param {string} nivel - Nuevo nivel a seleccionar
   */
  const cambiarNivel = (nivel: string) => {
    // Reiniciar animaciones para crear efecto de transición
    fadeAnim.setValue(0); // Reiniciar opacidad a 0
    slideAnim.setValue(50); // Reiniciar posición de deslizamiento

    // Actualizar el nivel seleccionado
    setNivelSeleccionado(nivel);
  };

  /**
   * Selecciona una categoría de vocabulario y reinicia las animaciones
   * @param {string} categoria - Nombre de la categoría a seleccionar
   */
  const seleccionarCategoria = (categoria: string) => {
    // Reiniciar animaciones para crear efecto de transición
    fadeAnim.setValue(0); // Reiniciar opacidad a 0
    slideAnim.setValue(50); // Reiniciar posición de deslizamiento

    // Actualizar la categoría seleccionada
    setCategoriaSeleccionada(categoria);
  };

  /**
   * Renderiza la vista de selección de categorías
   * Muestra las categorías filtradas por nivel y permite seleccionar una
   * @returns {JSX.Element} - Componente ScrollView con las categorías
   */
  const renderCategorias = () => {
    // Obtener las categorías filtradas según el nivel seleccionado
    const categoriasFiltradas = filtrarCategoriasPorNivel(nivelSeleccionado);

    return (
      <ScrollView style={styles.container}>
        <View style={[styles.header, { backgroundColor: getNivelColor() }]}>
          <Text style={styles.titulo}>Vocabulario</Text>
          <Text style={styles.subtitulo}>Explora palabras y frases en náhuatl</Text>
        </View>

        <View style={styles.nivelSelector}>
          <TouchableOpacity
            style={[
              styles.nivelBoton,
              nivelSeleccionado === 'basico' && [styles.nivelSeleccionado, {
                backgroundColor: '#3498DB',
                shadowColor: '#3498DB'
              }]
            ]}
            onPress={() => cambiarNivel('basico')}
          >
            <Text style={[
              styles.nivelTexto,
              nivelSeleccionado === 'basico' && styles.nivelTextoSeleccionado
            ]}>
              🌟 Básico
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nivelBoton,
              nivelSeleccionado === 'intermedio' && [styles.nivelSeleccionado, {
                backgroundColor: '#2ECC71',
                shadowColor: '#2ECC71'
              }]
            ]}
            onPress={() => cambiarNivel('intermedio')}
          >
            <Text style={[
              styles.nivelTexto,
              nivelSeleccionado === 'intermedio' && styles.nivelTextoSeleccionado
            ]}>
              🚀 Intermedio
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nivelBoton,
              nivelSeleccionado === 'avanzado' && [styles.nivelSeleccionado, {
                backgroundColor: '#9B59B6',
                shadowColor: '#9B59B6'
              }]
            ]}
            onPress={() => cambiarNivel('avanzado')}
          >
            <Text style={[
              styles.nivelTexto,
              nivelSeleccionado === 'avanzado' && styles.nivelTextoSeleccionado
            ]}>
              💎 Avanzado
            </Text>
          </TouchableOpacity>
        </View>

        <Animated.View
          style={[
            styles.categoriasContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}>
          <Text style={styles.instruccion}>Selecciona una categoría para explorar</Text>

          <View style={styles.categoriasGrid}>
            {categoriasFiltradas.map((categoria, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoriaCard}
                onPress={() => seleccionarCategoria(categoria.categoria)}
              >
                <View style={[styles.categoriaIcono, { backgroundColor: getNivelColor() }]}>
                  <Text style={styles.categoriaIconoTexto}>{categoria.categoria.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.categoriaTitulo}>{categoria.categoria}</Text>
                <Text style={styles.categoriaConteo}>
                  {categoria.palabras.length} palabras
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    );
  };

  /**
   * Renderiza la vista de palabras de una categoría seleccionada
   * Muestra la lista de palabras con su traducción y botón de audio
   * @returns {JSX.Element|null} - Componente ScrollView con las palabras o null si no hay categoría
   */
  const renderPalabras = () => {
    const categoria = categorias.find(c => c.categoria === categoriaSeleccionada);

    if (!categoria) {
      return null; // O un componente de carga/error
    }

    return (
      <ScrollView style={styles.container}>
        <View style={[styles.header, { backgroundColor: getNivelColor() }]}>
          <TouchableOpacity onPress={() => setCategoriaSeleccionada(null)} style={styles.volverBoton}>
            <Text style={styles.volverTexto}>← Volver a categorías</Text>
          </TouchableOpacity>
          <Text style={styles.tituloPalabras}>{categoria.categoria}</Text>
        </View>

        <Animated.View
          style={[
            styles.palabrasContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}>
          {categoria.palabras.map((palabra, index) => {
            const nivelActual = nivelSeleccionado || 'Basico';
            const categoriaActual = categoriaSeleccionada || '';
            const tieneAudio = obtenerRutaAudio(nivelActual, categoriaActual, palabra.audio) !== null;

            return (
              <View key={index} style={styles.palabraCard}>
                <View style={styles.palabraInfo}>
                  <Text style={[styles.palabraNahuatl, { color: getNivelColor() }]}>{palabra.nahuatl}</Text>
                  <Text style={styles.palabraEspanol}>{palabra.espanol}</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.audioBoton,
                    tieneAudio ? { backgroundColor: getNivelColor() } : styles.audioBotonDesactivado,
                  ]}
                  onPress={() => reproducirAudio(palabra)}
                >
                  <Text style={styles.audioTexto}>🔊</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </Animated.View>
      </ScrollView>
    );
  };

  return categoriaSeleccionada ? renderPalabras() : renderCategorias();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },
  titulo: {
    fontSize: 28,
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
  volverBoton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  volverTexto: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  tituloPalabras: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  categoriasContainer: {
    padding: 15,
  },
  instruccion: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  categoriasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoriaCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    minHeight: 120,
  },
  categoriaIcono: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  categoriaIconoTexto: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  categoriaTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
    textAlign: 'center',
    lineHeight: 16,
  },
  categoriaConteo: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  palabrasContainer: {
    padding: 15,
  },
  palabraCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  palabraInfo: {
    flex: 1,
  },
  palabraNahuatl: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  palabraEspanol: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  audioBoton: {
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  audioTexto: {
    fontSize: 20,
    color: 'white',
  },
  audioBotonDesactivado: {
    backgroundColor: '#cccccc',
    opacity: 0.5,
  },
  nivelSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  nivelBoton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 5,
    backgroundColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  nivelSeleccionado: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1.05 }],
  },
  nivelTexto: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  nivelTextoSeleccionado: {
    color: 'white',
    fontWeight: 'bold',
  },
});