import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../contexts/AppContext';

interface Pregunta {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: string;
  nivel: 'basico' | 'intermedio' | 'avanzado';
  categoria: string;
}

export default function DiagnosticoScreen() {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string>('');
  const [respuestas, setRespuestas] = useState<string[]>([]);
  const [examenIniciado, setExamenIniciado] = useState(false);
  const { updateCurrentProfile } = useAppContext();

  useEffect(() => {
    cargarPreguntas();
  }, []);

  const cargarPreguntas = () => {
    const preguntasDiagnostico: Pregunta[] = [
      {
        pregunta: "¿Qué significa 'nolti'?",
        opciones: ["Hola", "Gracias", "Adiós", "Por favor"],
        respuestaCorrecta: "Hola",
        nivel: "basico",
        categoria: "saludos"
      },
      {
        pregunta: "¿Cómo se dice 'gracias' en náhuatl?",
        opciones: ["nolti", "tlasohkamati", "mostla timoita", "se tlapalewili"],
        respuestaCorrecta: "tlasohkamati",
        nivel: "basico",
        categoria: "cortesia"
      },
      {
        pregunta: "¿Qué significa 'tonalti'?",
        opciones: ["Buenas noches", "Buenos días/temprano", "Buenas tardes", "Hasta luego"],
        respuestaCorrecta: "Buenos días/temprano",
        nivel: "basico",
        categoria: "saludos"
      },
      {
        pregunta: "¿Cómo se dice 'agua' en náhuatl?",
        opciones: ["tlā'tli", "chīchītl", "tlācuāni", "amatl"],
        respuestaCorrecta: "tlā'tli",
        nivel: "basico",
        categoria: "naturaleza"
      },
      {
        pregunta: "¿Qué significa 'amatl'?",
        opciones: ["Agua", "Flor", "Hoja/papel", "Comida"],
        respuestaCorrecta: "Hoja/papel",
        nivel: "basico",
        categoria: "material_escolar"
      },
      {
        pregunta: "¿Cómo se dice 'yo escribo' en náhuatl?",
        opciones: ["neh nitlahkwiloa", "teh titlahkwiloa", "yehwa tlahkwiloa", "niteca"],
        respuestaCorrecta: "neh nitlahkwiloa",
        nivel: "intermedio",
        categoria: "verbos"
      },
      {
        pregunta: "¿Qué significa 'xikwika tlen amatl'?",
        opciones: ["Abre la hoja", "Toma la hoja", "Cierra la hoja", "Pasa la hoja"],
        respuestaCorrecta: "Toma la hoja",
        nivel: "intermedio",
        categoria: "instrucciones"
      },
      {
        pregunta: "¿Cómo se dice 'tú escribes' en náhuatl?",
        opciones: ["nitlahkwiloa", "teh titlahkwiloa", "yehwa tlahkwiloa", "antlahkwiloa"],
        respuestaCorrecta: "teh titlahkwiloa",
        nivel: "intermedio",
        categoria: "verbos"
      },
      {
        pregunta: "¿Qué significa 'welis nias ipan baño?'?",
        opciones: ["¿Dónde está el baño?", "¿Puedo ir al baño?", "¿Cómo llego al baño?", "¿Hay baño aquí?"],
        respuestaCorrecta: "¿Puedo ir al baño?",
        nivel: "intermedio",
        categoria: "preguntas"
      },
      {
        pregunta: "¿Cómo se dice 'necesito una hoja más' en náhuatl?",
        opciones: ["moneki amatl", "moneki okse amatl", "xikwika amatl", "kaninka amatl"],
        respuestaCorrecta: "moneki okse amatl",
        nivel: "intermedio",
        categoria: "peticiones"
      },
      {
        pregunta: "¿Qué significa 'neh nitlahkwiloke'?",
        opciones: ["Yo escribo", "Yo escribí", "Yo escribiré", "Yo escribiría"],
        respuestaCorrecta: "Yo escribí",
        nivel: "avanzado",
        categoria: "tiempos_verbales"
      },
      {
        pregunta: "¿Cómo se dice 'yo trabajaría' en náhuatl?",
        opciones: ["nitekiti", "nitekitike", "nitekitiskia", "nitekitis"],
        respuestaCorrecta: "nitekitiskia",
        nivel: "avanzado",
        categoria: "condicional"
      },
      {
        pregunta: "¿Qué significa 'hwelis nimitzpalehwis?'?",
        opciones: ["¿Necesitas ayuda?", "¿Te puedo ayudar?", "¿Quieres ayuda?", "¿Dónde está la ayuda?"],
        respuestaCorrecta: "¿Te puedo ayudar?",
        nivel: "avanzado",
        categoria: "interaccion"
      },
      {
        pregunta: "¿Cómo se dice 'vamos a hacer' en náhuatl?",
        opciones: ["xinech kwalika", "ma tihchiwakaj", "hwelis nimitzpalehwis", "moneki okse"],
        respuestaCorrecta: "ma tihchiwakaj",
        nivel: "avanzado",
        categoria: "invitaciones"
      },
      {
        pregunta: "¿Qué significa 'mostla timoita'?",
        opciones: ["Buenos días", "Buenas noches", "Hasta mañana", "Que tengas buen día"],
        respuestaCorrecta: "Hasta mañana",
        nivel: "avanzado",
        categoria: "despedidas"
      }
    ];

    const preguntasSeleccionadas = preguntasDiagnostico
      .sort(() => Math.random() - 0.5)
      .slice(0, 15);
    
    setPreguntas(preguntasSeleccionadas);
  };

  const manejarRespuesta = () => {
    if (!respuestaSeleccionada) {
      Alert.alert('Atención', 'Por favor selecciona una respuesta');
      return;
    }

    const nuevasRespuestas = [...respuestas, respuestaSeleccionada];
    setRespuestas(nuevasRespuestas);
    setRespuestaSeleccionada('');

    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      evaluarResultados(nuevasRespuestas);
    }
  };

  const evaluarResultados = (todasRespuestas: string[]) => {
    let aciertosBasicos = 0, totalBasicos = 0;
    let aciertosIntermedios = 0, totalIntermedios = 0;
    let aciertosAvanzados = 0, totalAvanzados = 0;

    preguntas.forEach((pregunta, index) => {
      const respuestaUsuario = todasRespuestas[index];
      const esCorrecta = respuestaUsuario === pregunta.respuestaCorrecta;
      
      if (pregunta.nivel === 'basico') {
        totalBasicos++;
        if (esCorrecta) aciertosBasicos++;
      } else if (pregunta.nivel === 'intermedio') {
        totalIntermedios++;
        if (esCorrecta) aciertosIntermedios++;
      } else if (pregunta.nivel === 'avanzado') {
        totalAvanzados++;
        if (esCorrecta) aciertosAvanzados++;
      }
    });

    const porcentajeBasico = totalBasicos > 0 ? (aciertosBasicos / totalBasicos) * 100 : 0;
    const porcentajeIntermedio = totalIntermedios > 0 ? (aciertosIntermedios / totalIntermedios) * 100 : 0;
    const porcentajeAvanzado = totalAvanzados > 0 ? (aciertosAvanzados / totalAvanzados) * 100 : 0;

    const nivelAsignado = determinarNivel(porcentajeBasico, porcentajeIntermedio, porcentajeAvanzado);
    const aciertosTotal = aciertosBasicos + aciertosIntermedios + aciertosAvanzados;
    const porcentajeTotal = (aciertosTotal / preguntas.length) * 100;

    const datosActualizados = {
      nivel: nivelAsignado,
      ultimaEntrada: new Date().toISOString().split('T')[0],
      porcentajeAvance: {
        basico: porcentajeBasico,
        intermedio: porcentajeIntermedio,
        avanzado: porcentajeAvanzado
      },
      primerUso: false
    };

    updateCurrentProfile(datosActualizados);
    mostrarResultados(aciertosTotal, preguntas.length, porcentajeTotal, nivelAsignado);
  };

  const determinarNivel = (basico: number, intermedio: number, avanzado: number): 'basico' | 'intermedio' | 'avanzado' => {
    if (avanzado >= 60 && intermedio >= 70 && basico >= 80) {
      return 'avanzado';
    } else if (intermedio >= 60 && basico >= 70) {
      return 'intermedio';
    } else {
      return 'basico';
    }
  };

  const mostrarResultados = (aciertos: number, total: number, porcentaje: number, nivel: string) => {
    let mensaje = `🎯 Resultado: ${aciertos}/${total} (${porcentaje.toFixed(0)}%)\n\n`;
    mensaje += `📊 Nivel asignado: ${nivel.toUpperCase()}\n\n`;
    mensaje += `¡Comienza tu viaje de aprendizaje del náhuatl! 🌟`;

    Alert.alert('Diagnóstico Completado', mensaje, [
      { text: 'Comenzar', onPress: () => router.replace('/(tabs)') }
    ]);
  };

  if (!examenIniciado) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.bienvenidaContainer}>
          <Text style={styles.tituloBienvenida}>🎯 Examen Diagnóstico</Text>
          <Text style={styles.subtituloBienvenida}>Evaluación de Náhuatl</Text>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitulo}>¿Qué evaluaremos?</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcono}>📚</Text>
              <Text style={styles.infoTexto}>Vocabulario básico e intermedio</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcono}>⚙️</Text>
              <Text style={styles.infoTexto}>Gramática y conjugaciones</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcono}>🎭</Text>
              <Text style={styles.infoTexto}>Expresiones culturales</Text>
            </View>
          </View>

          <View style={styles.instruccionesContainer}>
            <Text style={styles.instruccionesTitulo}>Instrucciones:</Text>
            <Text style={styles.instruccionesTexto}>
              • 15 preguntas de opción múltiple{'\n'}
              • Responde lo mejor que puedas{'\n'}
              • No te preocupes si no sabes alguna{'\n'}
              • El resultado determinará tu nivel inicial
            </Text>
          </View>

          <TouchableOpacity
            style={styles.comenzarBoton}
            onPress={() => setExamenIniciado(true)}
          >
            <Text style={styles.comenzarTexto}>Comenzar Examen</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (preguntas.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.cargando}>Preparando examen...</Text>
      </View>
    );
  }

  const pregunta = preguntas[preguntaActual];
  const progreso = ((preguntaActual + 1) / preguntas.length) * 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Examen Diagnóstico</Text>
        <Text style={styles.progreso}>
          Pregunta {preguntaActual + 1} de {preguntas.length}
        </Text>
        <View style={styles.progresoBarraFondo}>
          <View style={[styles.progresoBarraRelleno, { width: `${progreso}%` }]} />
        </View>
      </View>

      <View style={styles.preguntaContainer}>
        <View style={styles.nivelIndicador}>
          <Text style={[styles.nivelTexto, { 
            backgroundColor: pregunta.nivel === 'basico' ? '#3498DB' : 
                           pregunta.nivel === 'intermedio' ? '#2ECC71' : '#9B59B6' 
          }]}>
            {pregunta.nivel.toUpperCase()}
          </Text>
        </View>
        
        <Text style={styles.preguntaTexto}>{pregunta.pregunta}</Text>

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
      </View>

      <TouchableOpacity
        style={[
          styles.siguienteBoton,
          !respuestaSeleccionada && styles.botonDeshabilitado
        ]}
        onPress={manejarRespuesta}
        disabled={!respuestaSeleccionada}
      >
        <Text style={styles.siguienteTexto}>
          {preguntaActual < preguntas.length - 1 ? 'Siguiente' : 'Finalizar Examen'}
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
  bienvenidaContainer: {
    padding: 20,
    alignItems: 'center',
  },
  tituloBienvenida: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtituloBienvenida: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoIcono: {
    fontSize: 20,
    marginRight: 10,
    width: 30,
  },
  infoTexto: {
    fontSize: 16,
    color: '#34495e',
    flex: 1,
  },
  instruccionesContainer: {
    backgroundColor: '#e8f4fd',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  instruccionesTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  instruccionesTexto: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
  },
  comenzarBoton: {
    backgroundColor: '#3498db',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  comenzarTexto: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  progreso: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  progresoBarraFondo: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progresoBarraRelleno: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 4,
  },
  preguntaContainer: {
    padding: 20,
  },
  nivelIndicador: {
    alignItems: 'center',
    marginBottom: 15,
  },
  nivelTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
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
});