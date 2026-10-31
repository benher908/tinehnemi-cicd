// Importaciones principales para la pantalla de minijuegos
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../contexts/AppContext';

/**
 * Interfaz que define la estructura de un juego
 */
interface Juego {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  disponible: boolean;
  nivelMinimo: 'basico' | 'intermedio' | 'avanzado';
}

/**
 * Interfaz que define un par de palabras náhuatl-español
 */
interface PalabraPar {
  nahuatl: string;
  espanol: string;
  id: number;
}

/**
 * Interfaz que define una carta del juego de memoria
 */
interface CartaMemoria {
  id: number;
  texto: string;
  tipo: 'nahuatl' | 'espanol';
  pareja: number;
  volteada: boolean;
  emparejada: boolean;
}

/**
 * Tipos de juegos disponibles en la aplicación
 */
type TipoJuego = 'menu' | 'memorama' | 'frases' | 'ahorcado' | 'quiz';

/**
 * Pantalla principal de minijuegos educativos para practicar náhuatl
 * Permite al usuario seleccionar entre diferentes juegos según su nivel
 */
export default function MinijuegosScreen() {
  const { state, currentProfile } = useAppContext();
  const [juegoActual, setJuegoActual] = useState<TipoJuego>('menu');
  const [puntuacion, setPuntuacion] = useState(0);
  const [nivel, setNivel] = useState(1);

  /**
   * Lista de juegos disponibles en la aplicación
   * Cada juego tiene un identificador, título, descripción, icono y nivel mínimo requerido
   */
  const juegos: Juego[] = [
    {
      id: 'memorama',
      titulo: 'Memorama',
      descripcion: 'Empareja palabras en náhuatl con su traducción en español',
      icono: '🧠',
      disponible: true, // Indica si el juego está implementado
      nivelMinimo: 'basico' // Nivel mínimo requerido para jugar
    },
    {
      id: 'frases',
      titulo: 'Frases desordenadas',
      descripcion: 'Ordena las palabras para formar frases correctas en náhuatl',
      icono: '🔤',
      disponible: true,
      nivelMinimo: 'basico'
    },
    {
      id: 'ahorcado',
      titulo: 'Adivina la palabra',
      descripcion: 'Adivina la palabra en náhuatl antes de que se complete el dibujo',
      icono: '🎯',
      disponible: true,
      nivelMinimo: 'intermedio' // Requiere nivel intermedio
    },
    {
      id: 'quiz',
      titulo: 'Quiz Rápido',
      descripcion: 'Responde preguntas rápidas sobre vocabulario náhuatl',
      icono: '⚡',
      disponible: true,
      nivelMinimo: 'basico'
    }
  ];

  /**
   * Palabras básicas para los juegos
   * Incluye pares de palabras en náhuatl y su traducción al español
   * Utilizadas en los diferentes minijuegos como Memorama y Ahorcado
   */
  const palabrasBasicas: PalabraPar[] = [
    { nahuatl: 'tlā\'tli', espanol: 'agua', id: 1 },
    { nahuatl: 'chīchītl', espanol: 'flor', id: 2 },
    { nahuatl: 'tlācuāni', espanol: 'comida', id: 3 },
    { nahuatl: 'nolti', espanol: 'hola', id: 4 },
    { nahuatl: 'tlasohkamati', espanol: 'gracias', id: 5 },
    { nahuatl: 'amatl', espanol: 'hoja', id: 6 },
    { nahuatl: 'tekitl', espanol: 'trabajo', id: 7 },
    { nahuatl: 'tlamantli', espanol: 'material', id: 8 }
  ];

  /**
   * Inicia un juego seleccionado después de verificar disponibilidad y nivel requerido
   * @param {Juego} juego - El juego que se desea iniciar
   */
  const iniciarJuego = (juego: Juego) => {
    // Verificar si el juego está disponible en esta versión
    if (!juego.disponible) {
      Alert.alert('Próximamente', 'Este juego estará disponible en una próxima actualización');
      return;
    }

    // Verificar si el usuario tiene el nivel requerido para jugar
    const nivelUsuario = currentProfile?.nivel || 'basico';
    const nivelesOrden = ['basico', 'intermedio', 'avanzado'];
    
    if (nivelesOrden.indexOf(nivelUsuario) < nivelesOrden.indexOf(juego.nivelMinimo)) {
      Alert.alert(
        'Nivel insuficiente', 
        `Necesitas alcanzar el nivel ${juego.nivelMinimo} para jugar este juego.`
      );
      return;
    }

    // Inicializar el juego seleccionado
    setJuegoActual(juego.id as TipoJuego);
    setPuntuacion(0);
    setNivel(1);
    
    // Mostrar instrucciones específicas del juego
    const instrucciones = {
      memorama: '🧠 Encuentra las parejas de palabras náhuatl-español. ¡Usa tu memoria!',
      ahorcado: '🎯 Adivina la palabra letra por letra. Tienes 6 intentos y 2 pistas.',
      quiz: '⚡ Responde rápido las preguntas. Gana puntos extra por velocidad y rachas.',
      frases: '🔤 Ordena las palabras para formar frases correctas en náhuatl.'
    };
    
    Alert.alert(
      `🎮 ${juego.titulo}`,
      instrucciones[juego.id as keyof typeof instrucciones] || 'Diviértete aprendiendo náhuatl',
      [{ text: '¡Empezar!', style: 'default' }]
    );
  };

  /**
   * Vuelve al menú principal de juegos y reinicia los estados
   */
  const volverAlMenu = () => {
    setJuegoActual('menu');
    setPuntuacion(0);
    setNivel(1);
  };

  /**
   * Componente para el juego de Memorama
   * Permite al usuario encontrar pares de palabras en náhuatl y español
   */
  const JuegoMemorama = () => {
    const [cartas, setCartas] = useState<CartaMemoria[]>([]);
    const [cartasVolteadas, setCartasVolteadas] = useState<number[]>([]);
    const [movimientos, setMovimientos] = useState(0);
    const [parejasEncontradas, setParejasEncontradas] = useState(0);
    const [bloqueado, setBloqueado] = useState(false);
    const [tiempoInicio, setTiempoInicio] = useState<number>(Date.now());

    // Inicializar el juego cuando se monta el componente
    useEffect(() => {
      inicializarMemorama();
    }, []);

    /**
     * Inicializa el juego de memorama con cartas según el nivel del usuario
     */
    const inicializarMemorama = () => {
      // Seleccionar palabras aleatorias según el nivel del usuario
      const nivelUsuario = currentProfile?.nivel || 'basico';
      let numParejas = 6;
      
      if (nivelUsuario === 'intermedio') numParejas = 8;
      if (nivelUsuario === 'avanzado') numParejas = 10;
      
      const palabrasSeleccionadas = [...palabrasBasicas]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(numParejas, palabrasBasicas.length));
      
      const cartasNuevas: CartaMemoria[] = [];
      
      palabrasSeleccionadas.forEach((palabra, index) => {
        cartasNuevas.push({
          id: index * 2,
          texto: palabra.nahuatl,
          tipo: 'nahuatl',
          pareja: palabra.id,
          volteada: false,
          emparejada: false
        });
        cartasNuevas.push({
          id: index * 2 + 1,
          texto: palabra.espanol,
          tipo: 'espanol',
          pareja: palabra.id,
          volteada: false,
          emparejada: false
        });
      });

      // Mezclar cartas con algoritmo Fisher-Yates
      const cartasMezcladas = [...cartasNuevas];
      for (let i = cartasMezcladas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartasMezcladas[i], cartasMezcladas[j]] = [cartasMezcladas[j], cartasMezcladas[i]];
      }

      setCartas(cartasMezcladas);
      setMovimientos(0);
      setParejasEncontradas(0);
      setBloqueado(false);
      setTiempoInicio(Date.now());
      setPuntuacion(0);
    };

    /**
     * Maneja el evento de voltear una carta
     * @param {number} id - ID de la carta seleccionada
     */
    const voltearCarta = (id: number) => {
      // Prevenir interacciones si el juego está bloqueado
      if (bloqueado || cartasVolteadas.length >= 2) return;
      
      const carta = cartas.find(c => c.id === id);
      if (!carta || carta.volteada || carta.emparejada) return;

      const nuevasCartasVolteadas = [...cartasVolteadas, id];
      setCartasVolteadas(nuevasCartasVolteadas);

      setCartas(prev => prev.map(c => 
        c.id === id ? { ...c, volteada: true } : c
      ));

      if (nuevasCartasVolteadas.length === 2) {
        setBloqueado(true); // Bloquear interacciones durante la verificación
        setMovimientos(prev => prev + 1);
        
        setTimeout(() => {
          verificarPareja(nuevasCartasVolteadas);
        }, 1200); // Tiempo más largo para ver las cartas
      }
    };

    /**
     * Verifica si dos cartas volteadas forman una pareja
     * @param {number[]} cartasIds - IDs de las cartas a verificar
     */
    const verificarPareja = (cartasIds: number[]) => {
      const carta1 = cartas.find(c => c.id === cartasIds[0]);
      const carta2 = cartas.find(c => c.id === cartasIds[1]);

      if (carta1 && carta2 && carta1.pareja === carta2.pareja) {
        // Es una pareja correcta
        setCartas(prev => prev.map(c => 
          cartasIds.includes(c.id) ? { ...c, emparejada: true } : c
        ));
        
        const nuevasParejasEncontradas = parejasEncontradas + 1;
        setParejasEncontradas(nuevasParejasEncontradas);
        
        // Sistema de puntuación mejorado
        const tiempoTranscurrido = (Date.now() - tiempoInicio) / 1000;
        const bonusTiempo = Math.max(0, 300 - tiempoTranscurrido); // Bonus por velocidad
        const bonusMovimientos = Math.max(0, 50 - movimientos); // Bonus por eficiencia
        const puntosPorPareja = 100 + bonusTiempo + bonusMovimientos;
        
        setPuntuacion(prev => prev + Math.round(puntosPorPareja));
        
        // Verificar si el juego está completo
        const totalParejas = cartas.length / 2;
        if (nuevasParejasEncontradas === totalParejas) {
          setTimeout(() => {
            const tiempoFinal = Math.round((Date.now() - tiempoInicio) / 1000);
            Alert.alert(
              '🎉 ¡Felicidades!',
              `¡Completaste el memorama!\n\n⏱️ Tiempo: ${tiempoFinal}s\n🎯 Movimientos: ${movimientos}\n🏆 Puntuación: ${puntuacion}`,
              [
                { text: 'Jugar de nuevo', onPress: inicializarMemorama },
                { text: 'Volver al menú', onPress: volverAlMenu }
              ]
            );
          }, 500);
        }
      } else {
        // No es pareja, voltear de vuelta
        setCartas(prev => prev.map(c => 
          cartasIds.includes(c.id) ? { ...c, volteada: false } : c
        ));
      }
      
      setCartasVolteadas([]);
      setBloqueado(false); // Desbloquear interacciones
    };

    return (
      <View style={styles.juegoContainer}>
        <View style={styles.juegoHeader}>
          <TouchableOpacity onPress={volverAlMenu} style={styles.botonVolver}>
            <Text style={styles.botonVolverTexto}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.juegoTitulo}>🧠 Memorama</Text>
          <View style={styles.estadisticas}>
            <Text style={styles.estadisticaTexto}>Movimientos: {movimientos}</Text>
            <Text style={styles.estadisticaTexto}>Puntos: {puntuacion}</Text>
          </View>
        </View>

        <View style={styles.tableroMemorama}>
          {cartas.map((carta) => (
            <TouchableOpacity
              key={carta.id}
              style={[
                styles.cartaMemorama,
                carta.volteada || carta.emparejada ? styles.cartaVolteada : styles.cartaOculta,
                carta.emparejada && styles.cartaEmparejada
              ]}
              onPress={() => voltearCarta(carta.id)}
              disabled={carta.volteada || carta.emparejada}
            >
              <Text style={[
                styles.cartaTexto,
                carta.tipo === 'nahuatl' && styles.textoNahuatl
              ]}>
                {carta.volteada || carta.emparejada ? carta.texto : '?'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {parejasEncontradas === 6 && (
          <View style={styles.juegoCompletado}>
            <Text style={styles.felicitacionesTexto}>¡Felicidades! 🎉</Text>
            <Text style={styles.resultadoTexto}>
              Completaste el memorama en {movimientos} movimientos
            </Text>
            <TouchableOpacity 
              style={styles.botonReiniciar}
              onPress={inicializarMemorama}
            >
              <Text style={styles.botonTexto}>Jugar de nuevo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  /**
   * Componente para el juego del Ahorcado
   * Permite al usuario adivinar palabras en náhuatl letra por letra
   */
  const JuegoAhorcado = () => {
    const [palabraActual, setPalabraActual] = useState<PalabraPar | null>(null);
    const [letrasAdivinadas, setLetrasAdivinadas] = useState<string[]>([]);
    const [errores, setErrores] = useState(0);
    const [juegoTerminado, setJuegoTerminado] = useState(false);
    const [pistas, setPistas] = useState(0);
    const [tiempoInicio, setTiempoInicio] = useState<number>(Date.now());
    const maxErrores = 6;
    const maxPistas = 2;

    // Letras disponibles incluyendo caracteres especiales del náhuatl
    const letrasDisponibles = 'abcdefghijklmnopqrstuvwxyzāēīōū\''.split('');

    // Inicializar el juego con una palabra aleatoria cuando se monta el componente
    useEffect(() => {
      iniciarNuevaPalabra();
    }, []);

    /**
     * Selecciona una nueva palabra aleatoria para el juego
     * Filtra palabras según el nivel del usuario
     */
    const iniciarNuevaPalabra = () => {
      // Filtrar palabras según el nivel del usuario
      const nivelUsuario = currentProfile?.nivel || 'basico';
      let palabrasFiltradas = palabrasBasicas;
      
      if (nivelUsuario === 'basico') {
        palabrasFiltradas = palabrasBasicas.filter(p => p.nahuatl.length <= 6);
      } else if (nivelUsuario === 'intermedio') {
        palabrasFiltradas = palabrasBasicas.filter(p => p.nahuatl.length <= 8);
      }
      
      const palabraAleatoria = palabrasFiltradas[Math.floor(Math.random() * palabrasFiltradas.length)];
      setPalabraActual(palabraAleatoria);
      setLetrasAdivinadas([]);
      setErrores(0);
      setJuegoTerminado(false);
      setPistas(0);
      setTiempoInicio(Date.now());
    };

    /**
     * Procesa el intento de adivinar una letra
     * @param {string} letra - La letra que el usuario intenta adivinar
     */
    const adivinarLetra = (letra: string) => {
      if (letrasAdivinadas.includes(letra) || juegoTerminado) return;

      const nuevasLetras = [...letrasAdivinadas, letra];
      setLetrasAdivinadas(nuevasLetras);

      // Normalizar la palabra para comparación
      const palabraNormalizada = palabraActual?.nahuatl.toLowerCase().replace(/'/g, '\'');
      
      if (!palabraNormalizada?.includes(letra)) {
        const nuevosErrores = errores + 1;
        setErrores(nuevosErrores);
        
        if (nuevosErrores >= maxErrores) {
          setJuegoTerminado(true);
          // Mostrar resultado de derrota
          setTimeout(() => {
            Alert.alert(
              '😔 ¡Perdiste!',
              `La palabra era: "${palabraActual?.nahuatl}" (${palabraActual?.espanol})`,
              [
                { text: 'Nueva palabra', onPress: iniciarNuevaPalabra },
                { text: 'Volver al menú', onPress: volverAlMenu }
              ]
            );
          }, 500);
        }
      } else {
        // Verificar si se completó la palabra
        const palabraCompleta = palabraNormalizada
          .split('')
          .every(l => l === ' ' || nuevasLetras.includes(l));
        
        if (palabraCompleta) {
          setJuegoTerminado(true);
          
          // Sistema de puntuación mejorado
          const tiempoTranscurrido = (Date.now() - tiempoInicio) / 1000;
          const bonusTiempo = Math.max(0, 120 - tiempoTranscurrido);
          const bonusErrores = Math.max(0, (maxErrores - errores) * 20);
          const bonusPistas = Math.max(0, (maxPistas - pistas) * 30);
          const puntosTotales = 150 + bonusTiempo + bonusErrores + bonusPistas;
          
          setPuntuacion(prev => prev + Math.round(puntosTotales));
          
          setTimeout(() => {
            Alert.alert(
              '🎉 ¡Ganaste!',
              `¡Excelente! Adivinaste "${palabraActual?.nahuatl}"\n\n⏱️ Tiempo: ${Math.round(tiempoTranscurrido)}s\n❌ Errores: ${errores}\n🏆 Puntos: ${Math.round(puntosTotales)}`,
              [
                { text: 'Nueva palabra', onPress: iniciarNuevaPalabra },
                { text: 'Volver al menú', onPress: volverAlMenu }
              ]
            );
          }, 500);
        }
      }
    };

    /**
     * Muestra la palabra actual con las letras adivinadas y guiones para las no adivinadas
     * @returns {string} - La palabra formateada para mostrar
     */
    const mostrarPalabra = () => {
      if (!palabraActual) return '';
      
      return palabraActual.nahuatl.toLowerCase()
        .split('')
        .map(letra => {
          if (letra === ' ') return ' ';
          return letrasAdivinadas.includes(letra) ? letra : '_';
        })
        .join(' ');
    };

    /**
     * Proporciona una pista revelando una letra no adivinada
     * Limitado a un número máximo de pistas por juego
     */
    const usarPista = () => {
      if (pistas >= maxPistas || juegoTerminado || !palabraActual) return;
      
      // Encontrar una letra que no haya sido adivinada
      const letrasNoAdivinadas = palabraActual.nahuatl.toLowerCase()
        .split('')
        .filter(letra => letra !== ' ' && !letrasAdivinadas.includes(letra));
      
      if (letrasNoAdivinadas.length > 0) {
        const letraAleatoria = letrasNoAdivinadas[Math.floor(Math.random() * letrasNoAdivinadas.length)];
        adivinarLetra(letraAleatoria);
        setPistas(prev => prev + 1);
      }
    };

    const dibujoAhorcado = ['😊', '😐', '😟', '😰', '😵', '💀'];

    return (
      <View style={styles.juegoContainer}>
        <View style={styles.juegoHeader}>
          <TouchableOpacity onPress={volverAlMenu} style={styles.botonVolver}>
            <Text style={styles.botonVolverTexto}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.juegoTitulo}>🎯 Adivina la palabra</Text>
          <Text style={styles.estadisticaTexto}>Puntos: {puntuacion}</Text>
        </View>

        <View style={styles.ahorcadoContainer}>
          <Text style={styles.dibujoAhorcado}>
            {dibujoAhorcado[errores] || '😊'}
          </Text>
          
          <Text style={styles.palabraAhorcado}>
            {mostrarPalabra()}
          </Text>
          
          <View style={styles.pistaContainer}>
            <Text style={styles.pistaTexto}>
              Pista: {palabraActual?.espanol}
            </Text>
            <TouchableOpacity
              style={[
                styles.botonPista,
                (pistas >= maxPistas || juegoTerminado) && styles.botonPistaDeshabilitado
              ]}
              onPress={usarPista}
              disabled={pistas >= maxPistas || juegoTerminado}
            >
              <Text style={styles.textoPista}>
                💡 Pista ({maxPistas - pistas} restantes)
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.letrasContainer}>
            {letrasDisponibles.map(letra => (
              <TouchableOpacity
                key={letra}
                style={[
                  styles.letraBoton,
                  letrasAdivinadas.includes(letra) && styles.letraUsada
                ]}
                onPress={() => adivinarLetra(letra)}
                disabled={letrasAdivinadas.includes(letra) || juegoTerminado}
              >
                <Text style={styles.letraTexto}>{letra.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {juegoTerminado && (
            <View style={styles.juegoCompletado}>
              <Text style={styles.felicitacionesTexto}>
                {errores >= maxErrores ? '😔 ¡Perdiste!' : '🎉 ¡Ganaste!'}
              </Text>
              <Text style={styles.resultadoTexto}>
                La palabra era: {palabraActual?.nahuatl} ({palabraActual?.espanol})
              </Text>
              <TouchableOpacity 
                style={styles.botonReiniciar}
                onPress={iniciarNuevaPalabra}
              >
                <Text style={styles.botonTexto}>Nueva palabra</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  /**
   * Componente para el juego de Quiz Rápido
   * Presenta preguntas de opción múltiple sobre vocabulario náhuatl
   */
  const JuegoQuiz = () => {
    const [preguntaActual, setPreguntaActual] = useState(0);
    const [respuestasCorrectas, setRespuestasCorrectas] = useState(0);
    const [preguntasQuiz, setPreguntasQuiz] = useState<{pregunta: string; opciones: string[]; respuestaCorrecta: string; tipo: string}[]>([]);
    const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string | null>(null);
    const [mostrandoResultado, setMostrandoResultado] = useState(false);
    const [tiempoInicio, setTiempoInicio] = useState<number>(Date.now());
    const [tiempoRestante, setTiempoRestante] = useState(15);
    const [racha, setRacha] = useState(0);

    // Generar preguntas aleatorias cuando se monta el componente
    useEffect(() => {
      generarPreguntas();
    }, []);

    // Controlar el temporizador para cada pregunta
    useEffect(() => {
      if (!mostrandoResultado && tiempoRestante > 0) {
        const timer = setTimeout(() => {
          setTiempoRestante(prev => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else if (tiempoRestante === 0 && !mostrandoResultado) {
        // Tiempo agotado, procesar como respuesta incorrecta
        responder('TIEMPO_AGOTADO');
      }
    }, [tiempoRestante, mostrandoResultado]);

    /**
     * Genera preguntas aleatorias para el quiz según el nivel del usuario
     * Crea preguntas de traducción náhuatl-español y español-náhuatl
     */
    const generarPreguntas = () => {
      const nivelUsuario = currentProfile?.nivel || 'basico';
      const numPreguntas = nivelUsuario === 'basico' ? 5 : nivelUsuario === 'intermedio' ? 7 : 10;
      
      // Mezclar palabras y seleccionar
      const palabrasMezcladas = [...palabrasBasicas].sort(() => Math.random() - 0.5);
      const preguntasGeneradas = [];
      
      for (let i = 0; i < Math.min(numPreguntas, palabrasMezcladas.length); i++) {
        const palabra = palabrasMezcladas[i];
        const tiposPregunta = ['nahuatl-espanol', 'espanol-nahuatl'];
        const tipoPregunta = tiposPregunta[Math.floor(Math.random() * tiposPregunta.length)];
        
        let pregunta, respuestaCorrecta, opciones;
        
        if (tipoPregunta === 'nahuatl-espanol') {
          pregunta = `¿Qué significa "${palabra.nahuatl}"?`;
          respuestaCorrecta = palabra.espanol;
          opciones = [palabra.espanol];
          
          // Agregar opciones incorrectas
          while (opciones.length < 4) {
            const palabraAleatoria = palabrasMezcladas[Math.floor(Math.random() * palabrasMezcladas.length)];
            if (!opciones.includes(palabraAleatoria.espanol)) {
              opciones.push(palabraAleatoria.espanol);
            }
          }
        } else {
          pregunta = `¿Cómo se dice "${palabra.espanol}" en náhuatl?`;
          respuestaCorrecta = palabra.nahuatl;
          opciones = [palabra.nahuatl];
          
          // Agregar opciones incorrectas
          while (opciones.length < 4) {
            const palabraAleatoria = palabrasMezcladas[Math.floor(Math.random() * palabrasMezcladas.length)];
            if (!opciones.includes(palabraAleatoria.nahuatl)) {
              opciones.push(palabraAleatoria.nahuatl);
            }
          }
        }

        preguntasGeneradas.push({
          pregunta,
          opciones: opciones.sort(() => Math.random() - 0.5),
          respuestaCorrecta,
          tipo: tipoPregunta
        });
      }

      setPreguntasQuiz(preguntasGeneradas);
      setPreguntaActual(0);
      setRespuestasCorrectas(0);
      setTiempoInicio(Date.now());
      setRacha(0);
    };

    /**
     * Procesa la respuesta seleccionada por el usuario
     * @param {string} respuesta - La opción seleccionada o 'TIEMPO_AGOTADO'
     */
    const responder = (respuesta: string) => {
      setRespuestaSeleccionada(respuesta);
      setMostrandoResultado(true);

      const esCorrecta = respuesta !== 'TIEMPO_AGOTADO' && respuesta === preguntasQuiz[preguntaActual].respuestaCorrecta;
      
      if (esCorrecta) {
        const nuevaRacha = racha + 1;
        setRacha(nuevaRacha);
        setRespuestasCorrectas(prev => prev + 1);
        
        // Sistema de puntuación mejorado
        const bonusTiempo = Math.max(0, tiempoRestante * 5); // Bonus por tiempo restante
        const bonusRacha = nuevaRacha >= 3 ? nuevaRacha * 10 : 0; // Bonus por racha
        const puntosTotales = 50 + bonusTiempo + bonusRacha;
        
        setPuntuacion(prev => prev + puntosTotales);
      } else {
        setRacha(0); // Reiniciar racha si falla
      }

      setTimeout(() => {
        if (preguntaActual < preguntasQuiz.length - 1) {
          setPreguntaActual(prev => prev + 1);
          setRespuestaSeleccionada(null);
          setMostrandoResultado(false);
          setTiempoRestante(15); // Reiniciar tiempo para la siguiente pregunta
        } else {
          // Quiz completado
          const tiempoTotal = Math.round((Date.now() - tiempoInicio) / 1000);
          const porcentaje = Math.round((respuestasCorrectas / preguntasQuiz.length) * 100);
          
          Alert.alert(
            '🎯 Quiz Completado',
            `¡Terminaste el quiz!\n\n✅ Correctas: ${respuestasCorrectas}/${preguntasQuiz.length} (${porcentaje}%)\n⏱️ Tiempo total: ${tiempoTotal}s\n🔥 Racha máxima: ${racha}\n🏆 Puntuación: ${puntuacion}`,
            [
              { text: 'Nuevo quiz', onPress: generarPreguntas },
              { text: 'Volver al menú', onPress: volverAlMenu }
            ]
          );
        }
      }, 1500);
    };

    if (preguntasQuiz.length === 0) {
      return <Text>Cargando...</Text>;
    }

    const pregunta = preguntasQuiz[preguntaActual];
    const quizTerminado = preguntaActual >= preguntasQuiz.length - 1 && mostrandoResultado;

    return (
      <View style={styles.juegoContainer}>
        <View style={styles.juegoHeader}>
          <TouchableOpacity onPress={volverAlMenu} style={styles.botonVolver}>
            <Text style={styles.botonVolverTexto}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.juegoTitulo}>⚡ Quiz Rápido</Text>
          <View style={styles.estadisticas}>
            <Text style={styles.estadisticaTexto}>
              {preguntaActual + 1}/{preguntasQuiz.length}
            </Text>
            <Text style={[styles.estadisticaTexto, { 
              color: tiempoRestante <= 5 ? '#e74c3c' : '#2ecc71' 
            }]}>
              ⏰ {tiempoRestante}s
            </Text>
            <Text style={styles.estadisticaTexto}>
              🏆 {puntuacion}
            </Text>
            {racha > 0 && (
              <Text style={styles.estadisticaTexto}>
                🔥 {racha}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.quizContainer}>
          <Text style={styles.preguntaQuiz}>{pregunta.pregunta}</Text>
          
          <View style={styles.opcionesQuiz}>
            {pregunta.opciones.map((opcion: string, index: number) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.opcionQuiz,
                  mostrandoResultado && opcion === pregunta.respuestaCorrecta && styles.opcionCorrecta,
                  mostrandoResultado && opcion === respuestaSeleccionada && 
                  opcion !== pregunta.respuestaCorrecta && styles.opcionIncorrecta
                ]}
                onPress={() => responder(opcion)}
                disabled={mostrandoResultado}
              >
                <Text style={styles.opcionTextoQuiz}>{opcion}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {quizTerminado && (
            <View style={styles.juegoCompletado}>
              <Text style={styles.felicitacionesTexto}>¡Quiz completado! 🎉</Text>
              <Text style={styles.resultadoTexto}>
                Respuestas correctas: {respuestasCorrectas}/{preguntasQuiz.length}
              </Text>
              <TouchableOpacity 
                style={styles.botonReiniciar}
                onPress={generarPreguntas}
              >
                <Text style={styles.botonTexto}>Nuevo quiz</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Renderizar el componente correspondiente según el juego seleccionado
  if (juegoActual === 'memorama') {
    return <JuegoMemorama />; // Juego de memorama
  }
  
  if (juegoActual === 'ahorcado') {
    return <JuegoAhorcado />; // Juego del ahorcado
  }
  
  if (juegoActual === 'quiz') {
    return <JuegoQuiz />; // Juego de quiz rápido
  }

  // Renderizar el menú principal de juegos
  return (
    <ScrollView style={styles.container}>
      {/* Encabezado con título y perfil del usuario */}
      <View style={styles.headerContainer}>
        <Text style={styles.titulo}>🎮 Minijuegos</Text>
        <Text style={styles.subtitulo}>Practica lo aprendido de forma divertida</Text>
        
        {/* Información del perfil del usuario si está disponible */}
        {currentProfile && (
          <View style={styles.perfilJugador}>
            <Text style={styles.perfilTexto}>
              👤 {currentProfile.usuario} | Nivel: {currentProfile.nivel}
            </Text>
            <Text style={styles.perfilTexto}>
              🏆 Puntuación total: {puntuacion}
            </Text>
          </View>
        )}
      </View>

      {/* Cuadrícula de juegos disponibles */}
      <View style={styles.juegosGrid}>
        {juegos.map((juego) => {
          // Determinar si el juego está disponible para el nivel del usuario
          const nivelUsuario = currentProfile?.nivel || 'basico';
          const nivelesOrden = ['basico', 'intermedio', 'avanzado'];
          const disponible = juego.disponible && 
            nivelesOrden.indexOf(nivelUsuario) >= nivelesOrden.indexOf(juego.nivelMinimo);

          return (
            <TouchableOpacity
              key={juego.id}
              style={[
                styles.juegoCard,
                !disponible && styles.juegoNoDisponible // Estilo diferente para juegos no disponibles
              ]}
              onPress={() => iniciarJuego(juego)}
              disabled={!disponible} // Deshabilitar interacción si no está disponible
            >
              <Text style={styles.juegoIcono}>{juego.icono}</Text>
              <Text style={styles.juegoTitulo}>{juego.titulo}</Text>
              <Text style={styles.juegoDescripcion}>{juego.descripcion}</Text>
              
              <View style={styles.juegoInfo}>
                <Text style={styles.nivelRequerido}>
                  Nivel: {juego.nivelMinimo}
                </Text>
                {/* Mostrar indicador de bloqueado si no está disponible */}
                {!disponible && (
                  <Text style={styles.bloqueado}>🔒 Bloqueado</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Sección de consejos para el usuario */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitulo}>💡 Consejos</Text>
        <Text style={styles.infoTexto}>
          • Los minijuegos te ayudan a memorizar vocabulario{"\n"}
          • Completa unidades para desbloquear más juegos{"\n"}
          • Practica regularmente para mejorar tu puntuación{"\n"}
          • Cada juego refuerza diferentes habilidades
        </Text>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

/**
 * Estilos para la pantalla de minijuegos y sus componentes
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 25,
    backgroundColor: '#9B59B6',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 15,
  },
  perfilJugador: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
  },
  perfilTexto: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  juegosGrid: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  juegoCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 22,
    marginBottom: 15,
    width: (width - 50) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
    minHeight: 190,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  juegoNoDisponible: {
    opacity: 0.7,
    backgroundColor: '#f8f9fa',
    borderColor: 'rgba(0,0,0,0.1)',
  },
  juegoIcono: {
    fontSize: 40,
    marginBottom: 10,
  },
  juegoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  juegoDescripcion: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 16,
  },
  juegoInfo: {
    alignItems: 'center',
  },
  nivelRequerido: {
    fontSize: 11,
    color: '#9B59B6',
    fontWeight: '600',
    marginBottom: 4,
  },
  bloqueado: {
    fontSize: 11,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  infoTexto: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 22,
  },
  
  // Estilos para juegos individuales
  juegoContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  juegoHeader: {
    backgroundColor: '#9B59B6',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  botonVolver: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  botonVolverTexto: {
    color: 'white',
    fontWeight: '600',
  },
  quizHeaderTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  estadisticas: {
    alignItems: 'flex-end',
  },
  estadisticaTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Memorama
  tableroMemorama: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 20,
  },
  cartaMemorama: {
    width: (width - 80) / 4,
    height: 80,
    margin: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartaOculta: {
    backgroundColor: '#3498db',
  },
  cartaVolteada: {
    backgroundColor: 'white',
  },
  cartaEmparejada: {
    backgroundColor: '#2ecc71',
  },
  cartaTexto: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
  },
  textoNahuatl: {
    color: '#9B59B6',
    fontStyle: 'italic',
  },
  
  // Ahorcado
  ahorcadoContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  dibujoAhorcado: {
    fontSize: 80,
    marginVertical: 20,
  },
  palabraAhorcado: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    letterSpacing: 4,
    marginVertical: 20,
  },
  pistaContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pistaTexto: {
    fontSize: 18,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  botonPista: {
    backgroundColor: '#f39c12',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  botonPistaDeshabilitado: {
    backgroundColor: '#bdc3c7',
    opacity: 0.6,
  },
  textoPista: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  letrasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: width - 40,
  },
  letraBoton: {
    backgroundColor: 'white',
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  letraUsada: {
    backgroundColor: '#bdc3c7',
  },
  letraTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  
  // Quiz
  quizContainer: {
    flex: 1,
    padding: 20,
  },
  preguntaQuiz: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginVertical: 30,
    lineHeight: 32,
  },
  opcionesQuiz: {
    marginTop: 20,
  },
  opcionQuiz: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  opcionCorrecta: {
    backgroundColor: '#d5f4e6',
    borderColor: '#27ae60',
    borderWidth: 2,
  },
  opcionIncorrecta: {
    backgroundColor: '#fadbd8',
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  opcionTextoQuiz: {
    fontSize: 18,
    color: '#2c3e50',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Completado
  juegoCompletado: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  felicitacionesTexto: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 10,
  },
  resultadoTexto: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  botonReiniciar: {
    backgroundColor: '#9B59B6',
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  botonTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});