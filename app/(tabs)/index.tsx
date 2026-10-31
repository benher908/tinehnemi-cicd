// Importaciones principales para la pantalla de inicio
import { router } from 'expo-router'; // Navegación entre pantallas
import React, { useEffect, useState } from 'react'; // React y hooks necesarios
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Componentes UI
import { useAppContext } from '../../contexts/AppContext'; // Contexto global de la aplicación

/**
 * Interfaz que define la estructura de una unidad de aprendizaje
 */
interface Unidad {
  id: string;       // Identificador único de la unidad
  titulo: string;   // Título descriptivo de la unidad
  completada: boolean; // Indica si el usuario ha completado la unidad
  bloqueada: boolean;  // Indica si la unidad está bloqueada para el usuario
}

/**
 * Pantalla principal que muestra las unidades de aprendizaje disponibles
 * organizadas por nivel y estado (completadas, bloqueadas)
 */
export default function InicioScreen() {
  // Obtener estado global y perfil actual del contexto
  const { state, currentProfile, createProfile } = useAppContext();
  // Estado local para las unidades de aprendizaje
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  // Estado para el nivel seleccionado (básico, intermedio, avanzado)
  const [nivelSeleccionado, setNivelSeleccionado] = useState<string>('basico');

  /**
   * Efecto para manejar la navegación inicial y cargar las unidades
   * según el perfil del usuario
   */
  useEffect(() => {
    if (state.profiles.length === 0 && !state.isLoading) {
      // Si no hay perfiles, redirigir a onboarding para crear uno
      router.replace('/(tabs)/onboarding');
      return;
    }

    if (!currentProfile && state.profiles.length > 0) {
      // Si hay perfiles pero ninguno seleccionado, ir a selección de perfiles
      router.push('/(tabs)/perfiles');
      return;
    }

    // Cargar unidades según el nivel actual del usuario
    if (currentProfile) {
      const nivelValido = currentProfile.nivel || 'basico';
      setNivelSeleccionado(nivelValido);
      cargarUnidades(nivelValido);
    }
  }, [currentProfile, state.profiles, state.isLoading]); // Dependencias del efecto

  /**
   * Carga las unidades de aprendizaje según el nivel seleccionado
   * y marca cuáles están completadas o bloqueadas
   * @param {string} nivel - Nivel de dificultad (basico, intermedio, avanzado)
   */
  const cargarUnidades = (nivel: string) => {
    if (!currentProfile) return;

    // Obtener las unidades que el usuario ya ha completado en este nivel
    const completadas = currentProfile.unidadesCompletadas[nivel] || [];

    // Unidades según el nivel seleccionado
    let unidadesEjemplo: Unidad[] = [];
    
    // Unidades del nivel básico
    if (nivel === 'basico') {
      unidadesEjemplo = [
        // Saludos divididos en micro-unidades
        {
          id: 'unidad1a',
          titulo: 'Solo "Hola"',
          completada: completadas.includes('unidad1a'),
          bloqueada: false
        },
        {
          id: 'unidad1b',
          titulo: 'Buenos Días',
          completada: completadas.includes('unidad1b'),
          bloqueada: !completadas.includes('unidad1a')
        },
        {
          id: 'unidad1c',
          titulo: 'Buenas Tardes',
          completada: completadas.includes('unidad1c'),
          bloqueada: !completadas.includes('unidad1b')
        },
        // Cortesía dividida en micro-unidades
        {
          id: 'unidad2a',
          titulo: 'Solo "Gracias"',
          completada: completadas.includes('unidad2a'),
          bloqueada: !completadas.includes('unidad1c')
        },
        {
          id: 'unidad2b',
          titulo: 'Por Favor',
          completada: completadas.includes('unidad2b'),
          bloqueada: !completadas.includes('unidad2a')
        },
        // Material escolar dividido
        {
          id: 'unidad3a',
          titulo: 'Solo "Papel"',
          completada: completadas.includes('unidad3a'),
          bloqueada: !completadas.includes('unidad2b')
        },
        {
          id: 'unidad3b',
          titulo: 'Solo "Lápiz"',
          completada: completadas.includes('unidad3b'),
          bloqueada: !completadas.includes('unidad3a')
        },
        // Números básicos
        {
          id: 'unidad4a',
          titulo: 'Solo "Uno"',
          completada: completadas.includes('unidad4a'),
          bloqueada: !completadas.includes('unidad3b')
        },
        {
          id: 'unidad4b',
          titulo: 'Solo "Dos"',
          completada: completadas.includes('unidad4b'),
          bloqueada: !completadas.includes('unidad4a')
        },
        // Naturaleza de la Sierra
        {
          id: 'unidad5a',
          titulo: 'Solo "Cerro"',
          completada: completadas.includes('unidad5a'),
          bloqueada: !completadas.includes('unidad4b')
        },
        {
          id: 'unidad5b',
          titulo: 'Solo "Árbol"',
          completada: completadas.includes('unidad5b'),
          bloqueada: !completadas.includes('unidad5a')
        },
        {
          id: 'unidad5c',
          titulo: 'Solo "Pino"',
          completada: completadas.includes('unidad5c'),
          bloqueada: !completadas.includes('unidad5b')
        },
        {
          id: 'unidad5d',
          titulo: 'Solo "Elote"',
          completada: completadas.includes('unidad5d'),
          bloqueada: !completadas.includes('unidad5c')
        },
        // Unidades originales (mantenidas para compatibilidad)
        {
          id: 'unidad6',
          titulo: 'Yo, Tú, Él/Ella',
          completada: completadas.includes('unidad6'),
          bloqueada: !completadas.includes('unidad5d')
        },
        {
          id: 'unidad7',
          titulo: 'Números 3-5',
          completada: completadas.includes('unidad7'),
          bloqueada: !completadas.includes('unidad6')
        },
        {
          id: 'unidad8',
          titulo: 'Números 6-10',
          completada: completadas.includes('unidad8'),
          bloqueada: !completadas.includes('unidad7')
        },
        {
          id: 'unidad9',
          titulo: 'Colores Básicos',
          completada: completadas.includes('unidad9'),
          bloqueada: !completadas.includes('unidad8')
        },
        {
          id: 'unidad10',
          titulo: 'Mi Familia',
          completada: completadas.includes('unidad10'),
          bloqueada: !completadas.includes('unidad9')
        }
      ];
    } else if (nivel === 'intermedio') {
      // Verificar si el usuario ha completado el nivel básico
      const todasUnidadesBasicoCompletadas = 
        currentProfile.unidadesCompletadas.basico.length >= 18;
      
      unidadesEjemplo = [
        {
          id: 'unidad1',
          titulo: 'Pasado Simple',
          completada: completadas.includes('unidad1'),
          bloqueada: !todasUnidadesBasicoCompletadas
        },
        {
          id: 'unidad2',
          titulo: 'Futuro Básico',
          completada: completadas.includes('unidad2'),
          bloqueada: !completadas.includes('unidad1')
        },
        {
          id: 'unidad3',
          titulo: 'Preguntas y Respuestas',
          completada: completadas.includes('unidad3'),
          bloqueada: !completadas.includes('unidad2')
        },
        {
          id: 'unidad4',
          titulo: 'Describiendo Personas',
          completada: completadas.includes('unidad4'),
          bloqueada: !completadas.includes('unidad3')
        },
        {
          id: 'unidad5',
          titulo: 'En la Casa',
          completada: completadas.includes('unidad5'),
          bloqueada: !completadas.includes('unidad4')
        },
        {
          id: 'unidad6',
          titulo: 'Comida y Bebida',
          completada: completadas.includes('unidad6'),
          bloqueada: !completadas.includes('unidad5')
        },

      ];
    } else {
      // Verificar si el usuario ha completado el nivel intermedio
      const todasUnidadesIntermedioCompletadas = 
        currentProfile.unidadesCompletadas.intermedio.length >= 6;
      
      unidadesEjemplo = [
        {
          id: 'unidad1',
          titulo: 'Condicional Simple',
          completada: completadas.includes('unidad1'),
          bloqueada: !todasUnidadesIntermedioCompletadas
        },
        {
          id: 'unidad2',
          titulo: 'Expresiones de Tiempo',
          completada: completadas.includes('unidad2'),
          bloqueada: !completadas.includes('unidad1')
        },
        {
          id: 'unidad3',
          titulo: 'Naturaleza y Elementos',
          completada: completadas.includes('unidad3'),
          bloqueada: !completadas.includes('unidad2')
        },
        {
          id: 'unidad4',
          titulo: 'Tradiciones y Cultura',
          completada: completadas.includes('unidad4'),
          bloqueada: !completadas.includes('unidad3')
        },
        {
          id: 'unidad5',
          titulo: 'Expresiones Poéticas',
          completada: completadas.includes('unidad5'),
          bloqueada: !completadas.includes('unidad4')
        },
        {
          id: 'unidad6',
          titulo: 'Filosofía Náhuatl',
          completada: completadas.includes('unidad6'),
          bloqueada: !completadas.includes('unidad5')
        }
      ];
    }

    setUnidades(unidadesEjemplo);
  };

  /**
   * Cambia el nivel seleccionado y carga las unidades correspondientes
   * @param {string} nivel - Nuevo nivel a seleccionar
   */
  const cambiarNivel = (nivel: string) => {
    setNivelSeleccionado(nivel);
    cargarUnidades(nivel);
  };

  /**
   * Maneja la apertura de una unidad de aprendizaje
   * Verifica si está bloqueada y muestra opciones según su estado
   * @param {Unidad} unidad - La unidad seleccionada
   */
  const abrirUnidad = (unidad: Unidad) => {
    // Permitir acceso si es el usuario cheat code o si la unidad no está bloqueada
    // El usuario especial 'Hesoyam2025' puede acceder a todas las unidades
    const esCheatMode = currentProfile?.usuario === 'Hesoyam2025';
    
    if (unidad.bloqueada && !esCheatMode) {
      Alert.alert('Unidad bloqueada', 'Completa la unidad anterior para desbloquear esta.');
      return;
    }

    // Validar que tenemos los parámetros necesarios
    if (!nivelSeleccionado || !unidad.id) {
      Alert.alert('Error', 'No se pueden cargar los datos de la unidad');
      return;
    }

    // Si la unidad ya está completada, mostrar opciones de repaso
    if (unidad.completada) {
      Alert.alert(
        '📚 Unidad Completada',
        `Has completado "${unidad.titulo}". ¿Qué te gustaría hacer?`,
        [
          {
            text: 'Repasar Lección',
            onPress: () => {
              router.push({
                pathname: '/(tabs)/leccion',
                params: { 
                  nivel: nivelSeleccionado || 'basico', 
                  unidad: unidad.id, 
                  modo: 'repaso' 
                }
              });
            }
          },
          {
            text: 'Tomar Examen',
            onPress: () => {
              router.push({
                pathname: '/(tabs)/examen',
                params: { 
                  nivel: nivelSeleccionado || 'basico', 
                  unidad: unidad.id 
                }
              });
            }
          },
          {
            text: 'Cancelar',
            style: 'cancel'
          }
        ]
      );
    } else {
      // Si no está completada, ir directo a la lección
      router.push({
        pathname: '/(tabs)/leccion',
        params: { 
          nivel: nivelSeleccionado || 'basico', 
          unidad: unidad.id 
        }
      });
    }
  };

  if (state.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (!currentProfile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Configurando perfil...</Text>
      </View>
    );
  }

  // Validación adicional para asegurar que tenemos datos válidos
  if (!nivelSeleccionado || unidades.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Preparando contenido...</Text>
      </View>
    );
  }

  /**
   * Calcula el porcentaje de progreso del usuario en el nivel actual
   * @returns {number} - Porcentaje de unidades completadas (0-100)
   */
  const calcularProgreso = () => {
    if (!currentProfile) return 0;
    
    // Contar unidades completadas en el nivel seleccionado
    const completadas = currentProfile.unidadesCompletadas[nivelSeleccionado]?.length || 0;
    const total = unidades.length;
    return total > 0 ? Math.round((completadas / total) * 100) : 0;
  };

  /**
   * Obtiene el color principal según el nivel seleccionado
   * Cada nivel tiene un esquema de color distintivo
   * @returns {string} - Código de color hexadecimal
   */
  const getNivelColor = () => {
    switch (nivelSeleccionado) {
      case 'basico':
        return '#3498DB'; // Azul más vibrante para nivel básico
      case 'intermedio':
        return '#2ECC71'; // Verde más vibrante para nivel intermedio
      case 'avanzado':
        return '#9B59B6'; // Morado más vibrante para nivel avanzado
      default:
        return '#3498DB';
    }
  };

  const getNivelColorSecondary = () => {
    switch (nivelSeleccionado) {
      case 'basico':
        return '#2980B9'; // Azul más oscuro
      case 'intermedio':
        return '#27AE60'; // Verde más oscuro
      case 'avanzado':
        return '#8E44AD'; // Morado más oscuro
      default:
        return '#2980B9';
    }
  };

  const getNivelGradient = () => {
    switch (nivelSeleccionado) {
      case 'basico':
        return ['#3498DB', '#2874A6']; // Azul
      case 'intermedio':
        return ['#2ECC71', '#27AE60']; // Verde
      case 'avanzado':
        return ['#9B59B6', '#8E44AD']; // Morado
      default:
        return ['#3498DB', '#2874A6'];
    }
  };

  /**
   * Obtiene el emoji/icono correspondiente a una unidad según su índice y nivel
   * @param {number} index - Índice de la unidad en la lista
   * @param {string} nivel - Nivel de la unidad
   * @returns {string} - Emoji que representa la unidad
   */
  const getIconoUnidad = (index: number, nivel: string) => {
    if (nivel === 'basico') {
      const iconosBasico = [
        '👋', // Solo "Hola"
        '🌅', // Buenos Días
        '🌇', // Buenas Tardes
        '🙏', // Solo "Gracias"
        '🤝', // Por Favor
        '📄', // Solo "Papel"
        '✏️', // Solo "Lápiz"
        '1️⃣', // Solo "Uno"
        '2️⃣', // Solo "Dos"
        '⛰️', // Solo "Cerro"
        '🌳', // Solo "Árbol"
        '🌲', // Solo "Pino"
        '🌽', // Solo "Elote"
        '👤', // Yo, Tú, Él/Ella
        '🔢', // Números 3-5
        '🔢', // Números 6-10
        '🎨', // Colores Básicos
        '👨‍👩‍👧‍👦' // Mi Familia
      ];
      return iconosBasico[index % iconosBasico.length];
    } else if (nivel === 'intermedio') {
      const iconosIntermedio = ['⏰', '🔮', '❓', '👥', '🏠', '🍽️', '📅', '💬'];
      return iconosIntermedio[index % iconosIntermedio.length];
    } else {
      const iconosAvanzado = ['🌟', '⏳', '🌍', '🎭', '📜', '🧠'];
      return iconosAvanzado[index % iconosAvanzado.length];
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Cabecera con información del usuario y progreso */}
      <View style={[styles.header, { backgroundColor: getNivelColor() }]}>
        <View style={[styles.headerGradientOverlay, { backgroundColor: getNivelColorSecondary(), opacity: 0.3 }]} />
        <View style={styles.userInfoContainer}>
          <View style={[
            styles.avatarContainer,
            currentProfile.usuario === 'Hesoyam2025' && styles.avatarCheatCode
          ]}>
            <Text style={styles.avatarText}>
              {currentProfile.usuario === 'Hesoyam2025' ? '👑' : currentProfile.usuario.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userTextContainer}>
            <Text style={[
              styles.welcomeText,
              currentProfile.usuario === 'Hesoyam2025' && styles.welcomeCheatCode
            ]}>
              ¡Hola, {currentProfile.usuario}!
              {currentProfile.usuario === 'Hesoyam2025' && ' 🎮'}
            </Text>
            <View style={styles.streakContainer}>
              <Text style={styles.streakText}>🔥 {currentProfile.racha} días</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.progresoContainer}>
          <View style={styles.progresoInfo}>
            <Text style={styles.progresoLabel}>Tu progreso</Text>
            <Text style={styles.progresoValor}>{calcularProgreso()}%</Text>
          </View>
          <View style={styles.progresoBarraFondo}>
            <View 
              style={[
                styles.progresoBarraRelleno,
                { width: `${calcularProgreso()}%`, backgroundColor: 'rgba(255,255,255,0.9)' }
              ]}
            />
          </View>
        </View>
      </View>

      {/* Selector de nivel (básico, intermedio, avanzado) */}
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

      {/* Contenedor principal de unidades de aprendizaje */}
      <View style={styles.unitsContainer}>
        <Text style={styles.sectionTitle}>Unidades</Text>
        
        {/* Cuadrícula de tarjetas de unidades */}
        <View style={styles.unidadesGrid}>
          {unidades.map((unidad, index) => (
            <TouchableOpacity
              key={unidad.id}
              style={[
                styles.unitCard,
                unidad.completada && [styles.completedUnit, { borderColor: getNivelColor() }],
                unidad.bloqueada && styles.blockedUnit
              ]}
              onPress={() => abrirUnidad(unidad)}
              disabled={unidad.bloqueada}
            >
              <View style={[styles.unitIconContainer, { backgroundColor: unidad.bloqueada ? '#bdc3c7' : getNivelColor() }]}>
                <Text style={styles.unitIcon}>{getIconoUnidad(index, nivelSeleccionado)}</Text>
              </View>
              
              <Text style={[
                styles.unitTitle,
                unidad.bloqueada && styles.blockedText
              ]}>
                {unidad.titulo}
              </Text>
              
              {unidad.completada && (
                <View style={[styles.completedBadge, { backgroundColor: getNivelColor() }]}>
                  <Text style={styles.completedText}>✓</Text>
                </View>
              )}
              
              {unidad.bloqueada && (
                <View style={styles.blockedBadge}>
                  <Text style={styles.blockedBadgeText}>🔒</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.motivationContainer}>
        <Text style={styles.motivationText}>
          &ldquo;Ma tihchiwakaj, ma titlamachti náhuatl.&rdquo;
        </Text>
        <Text style={styles.motivationTranslation}>
          &ldquo;Vamos a hacer, vamos a estudiar náhuatl.&rdquo;
        </Text>
      </View>
    </ScrollView>
  );
}

/**
 * Estilos para los componentes de la pantalla de inicio
 */
const styles = StyleSheet.create({
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  headerGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarCheatCode: {
    backgroundColor: 'rgba(243, 156, 18, 0.8)',
    borderWidth: 2,
    borderColor: '#f39c12',
    shadowColor: '#f39c12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  userTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  welcomeCheatCode: {
    color: '#f39c12',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  progresoContainer: {
    marginTop: 10,
  },
  progresoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progresoLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  progresoValor: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  progresoBarraFondo: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  progresoBarraRelleno: {
    height: '100%',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  nivelSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  nivelBoton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 22,
    marginHorizontal: 4,
    backgroundColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    flex: 1,
    maxWidth: 120,
  },
  nivelSeleccionado: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1.05 }],
  },
  nivelTexto: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
    textAlign: 'center',
  },
  nivelTextoSeleccionado: {
    color: 'white',
    fontWeight: 'bold',
  },
  unitsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  unidadesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  unitCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 12,
    borderRadius: 18,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
    position: 'relative',
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  unitIconContainer: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  unitIcon: {
    fontSize: 24,
  },
  completedUnit: {
    backgroundColor: '#f0fff4',
    borderWidth: 2,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  blockedUnit: {
    backgroundColor: '#f0f0f0',
    opacity: 0.7,
  },
  unitTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 5,
  },
  completedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  completedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  blockedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#95a5a6',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'white',
  },
  blockedBadgeText: {
    fontSize: 12,
  },
  blockedText: {
    color: '#95a5a6',
  },
  motivationContainer: {
    backgroundColor: 'white',
    padding: 25,
    margin: 20,
    borderRadius: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#3498db',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  motivationText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#2c3e50',
    marginBottom: 5,
    textAlign: 'center',
  },
  motivationTranslation: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});