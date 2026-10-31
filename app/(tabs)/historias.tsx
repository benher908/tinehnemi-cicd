// Importaciones principales para la pantalla de historias
import React, { useEffect, useState } from 'react'; // React y hooks
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Componentes básicos de React Native

/**
 * Interfaz que define la estructura de una historia tradicional
 */
interface Historia {
  titulo: string; // Título de la historia
  texto: string; // Contenido completo de la historia
  categoria?: string; // Categoría opcional de la historia
}

/**
 * Pantalla de historias tradicionales de la Sierra Negra de Puebla
 * Muestra una lista de relatos tradicionales
 */
export default function HistoriasScreen() {
  // Estado para almacenar todas las historias cargadas
  const [historias, setHistorias] = useState<Historia[]>([]);
  // Estado para la historia seleccionada actualmente
  const [historiaSeleccionada, setHistoriaSeleccionada] = useState<Historia | null>(null);

  useEffect(() => {
    cargarHistorias();
  }, []);

  /**
   * Carga todas las historias disponibles desde los archivos JSON
   * y las almacena en el estado
   */
  const cargarHistorias = async () => {
    try {
      // Cargar historias disponibles
      const historia1 = require('../../data/historias/historia1.json'); // Primera historia tradicional
      const historia2 = require('../../data/historias/historia2.json'); // Segunda historia tradicional
      const historia3 = require('../../data/historias/historia3.json'); // Tercera historia tradicional
      const historia4 = require('../../data/historias/historia4.json'); // Cuarta historia tradicional
      const historia5 = require('../../data/historias/historia5.json'); // Quinta historia tradicional
      
      setHistorias([historia1, historia2, historia3, historia4, historia5]);
    } catch (error) {
      console.error('Error cargando historias:', error);
      Alert.alert('Error', 'No se pudieron cargar las historias');
    }
  };

  /**
   * Renderiza la lista de historias disponibles
   * @returns {JSX.Element} - ScrollView con la lista de historias
   */
  const renderListaHistorias = () => (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Historias Tradicionales</Text>
      <Text style={styles.subtitulo}>
        Relatos de la Sierra Negra de Puebla
      </Text>
      
      {historias.map((historia, index) => (
        <TouchableOpacity
          key={index}
          style={styles.historiaCard}
          onPress={() => setHistoriaSeleccionada(historia)}
        >
          <Text style={styles.historiaTitulo}>{historia.titulo}</Text>
          {historia.categoria && (
            <Text style={styles.historiaCategoria}>{historia.categoria}</Text>
          )}
          <Text style={styles.historiaPreview}>
            {historia.texto.substring(0, 100)}...
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  /**
   * Renderiza la vista detallada de una historia seleccionada
   * @returns {JSX.Element|null} - ScrollView con la historia completa o null si no hay selección
   */
  const renderHistoria = () => {
    if (!historiaSeleccionada) return null;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.volverBoton}
            onPress={() => setHistoriaSeleccionada(null)}
          >
            <Text style={styles.volverTexto}>← Volver</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.historiaCompleta}>
          {historiaSeleccionada.titulo}
        </Text>
        
        {historiaSeleccionada.categoria && (
          <Text style={styles.categoriaCompleta}>
            {historiaSeleccionada.categoria}
          </Text>
        )}

        <View style={styles.textoContainer}>
          <Text style={styles.textoHistoria}>
            {historiaSeleccionada.texto}
          </Text>
        </View>
      </ScrollView>
    );
  };

  return historiaSeleccionada ? renderHistoria() : renderListaHistorias();
}

/**
 * Estilos para la pantalla de historias
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  volverBoton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  volverTexto: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  historiaCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historiaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  historiaCategoria: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 10,
  },
  historiaPreview: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  historiaCompleta: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  categoriaCompleta: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  textoContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textoHistoria: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
    textAlign: 'justify',
  },
});