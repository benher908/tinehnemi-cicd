import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../contexts/AppContext';

export default function OnboardingScreen() {
  const [nombre, setNombre] = useState('');
  const [nivelSeleccionado, setNivelSeleccionado] = useState<'nuevo' | 'hablante' | null>(null);
  const { createProfile } = useAppContext();

  const handleContinuar = () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre');
      return;
    }

    if (!nivelSeleccionado) {
      Alert.alert('Error', 'Por favor selecciona tu nivel');
      return;
    }

    if (nivelSeleccionado === 'nuevo') {
      // Crear perfil básico
      createProfile(nombre).then(() => {
        router.replace('/(tabs)');
      }).catch(() => {
        Alert.alert('Error', 'No se pudo crear el perfil');
      });
    } else {
      // Crear perfil y ir al examen diagnóstico
      createProfile(nombre).then(() => {
        router.push('/(tabs)/diagnostico');
      }).catch(() => {
        Alert.alert('Error', 'No se pudo crear el perfil');
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>¡Bienvenido a Tinehnemi!</Text>
      <Text style={styles.subtitulo}>Aprende náhuatl de la Sierra Negra</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>¿Cómo te llamas?</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Escribe tu nombre"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.nivelContainer}>
        <Text style={styles.label}>¿Cuál es tu nivel?</Text>
        
        <TouchableOpacity
          style={[
            styles.opcionBoton,
            nivelSeleccionado === 'nuevo' && styles.opcionSeleccionada
          ]}
          onPress={() => setNivelSeleccionado('nuevo')}
        >
          <Text style={[
            styles.opcionTexto,
            nivelSeleccionado === 'nuevo' && styles.opcionTextoSeleccionado
          ]}>
            Nuevo en náhuatl
          </Text>
          <Text style={styles.opcionDescripcion}>
            Empezaré desde lo básico
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.opcionBoton,
            nivelSeleccionado === 'hablante' && styles.opcionSeleccionada
          ]}
          onPress={() => setNivelSeleccionado('hablante')}
        >
          <Text style={[
            styles.opcionTexto,
            nivelSeleccionado === 'hablante' && styles.opcionTextoSeleccionado
          ]}>
            Soy hablante
          </Text>
          <Text style={styles.opcionDescripcion}>
            Ya conozco algo de náhuatl
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.continuarBoton,
          (!nombre.trim() || !nivelSeleccionado) && styles.botonDeshabilitado
        ]}
        onPress={handleContinuar}
        disabled={!nombre.trim() || !nivelSeleccionado}
      >
        <Text style={styles.continuarTexto}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 16,
    textAlign: 'center',
    color: '#7f8c8d',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nivelContainer: {
    marginBottom: 40,
  },
  opcionBoton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  opcionSeleccionada: {
    borderColor: '#3498db',
    backgroundColor: '#ebf3fd',
  },
  opcionTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  opcionTextoSeleccionado: {
    color: '#3498db',
  },
  opcionDescripcion: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  continuarBoton: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
  },
  botonDeshabilitado: {
    backgroundColor: '#bdc3c7',
  },
  continuarTexto: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});