import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../contexts/AppContext';

export default function PerfilScreen() {
  const { state, currentProfile, deleteProfile } = useAppContext();

  const reiniciarProgreso = () => {
    if (!currentProfile) return;
    
    Alert.alert(
      'Reiniciar progreso',
      `¿Estás seguro de que quieres reiniciar todo el progreso de ${currentProfile.usuario}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProfile(currentProfile.id);
              router.replace('/(tabs)/onboarding');
            } catch (error) {
              console.error('Error reiniciando progreso:', error);
              Alert.alert('Error', 'No se pudo reiniciar el progreso');
            }
          }
        }
      ]
    );
  };

  const calcularProgreso = () => {
    if (!currentProfile) return { total: 0, completadas: 0 };

    const { unidadesCompletadas } = currentProfile;
    const totalUnidades = 24; // 10 básico + 8 intermedio + 6 avanzado
    const completadas = 
      unidadesCompletadas.basico.length +
      unidadesCompletadas.intermedio.length +
      unidadesCompletadas.avanzado.length;

    return { total: totalUnidades, completadas };
  };

  if (state.isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Cargando...</Text>
      </View>
    );
  }

  if (!currentProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No hay perfil seleccionado</Text>
        <TouchableOpacity
          style={styles.gestionarPerfilesBoton}
          onPress={() => router.push('/(tabs)/perfiles')}
        >
          <Text style={styles.gestionarPerfilesTexto}>Gestionar Perfiles</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { total, completadas } = calcularProgreso();
  const porcentajeTotal = total > 0 ? Math.round((completadas / total) * 100) : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.nombre}>{currentProfile.usuario}</Text>
        <Text style={styles.nivel}>
          Nivel: {currentProfile.nivel.toUpperCase()}
        </Text>
        <TouchableOpacity
          style={styles.gestionarPerfilesBoton}
          onPress={() => router.push('/(tabs)/perfiles')}
        >
          <Text style={styles.gestionarPerfilesTexto}>Gestionar Perfiles</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.estadisticasContainer}>
        <Text style={styles.seccionTitulo}>Estadísticas</Text>
        
        <View style={styles.estadisticaCard}>
          <Text style={styles.estadisticaLabel}>Progreso general</Text>
          <Text style={styles.estadisticaValor}>
            {completadas} de {total} unidades ({porcentajeTotal}%)
          </Text>
        </View>

        <View style={styles.estadisticaCard}>
          <Text style={styles.estadisticaLabel}>Racha actual</Text>
          <Text style={styles.estadisticaValor}>
            {currentProfile.racha} días
          </Text>
        </View>

        <View style={styles.estadisticaCard}>
          <Text style={styles.estadisticaLabel}>Último acceso</Text>
          <Text style={styles.estadisticaValor}>
            {new Date(currentProfile.ultimaEntrada).toLocaleDateString('es-ES')}
          </Text>
        </View>
      </View>

      <View style={styles.progresoNiveles}>
        <Text style={styles.seccionTitulo}>Progreso por nivel</Text>
        
        <View style={styles.nivelCard}>
          <Text style={styles.nivelNombre}>Básico</Text>
          <Text style={styles.nivelProgreso}>
            {currentProfile.unidadesCompletadas.basico.length} de 10 unidades completadas
          </Text>
          <View style={styles.barraProgreso}>
            <View 
              style={[
                styles.barraRelleno,
                { width: `${(currentProfile.unidadesCompletadas.basico.length / 10) * 100}%` }
              ]}
            />
          </View>
        </View>

        <View style={styles.nivelCard}>
          <Text style={styles.nivelNombre}>Intermedio</Text>
          <Text style={styles.nivelProgreso}>
            {currentProfile.unidadesCompletadas.intermedio.length} de 8 unidades completadas
          </Text>
          <View style={styles.barraProgreso}>
            <View 
              style={[
                styles.barraRelleno,
                { width: `${(currentProfile.unidadesCompletadas.intermedio.length / 8) * 100}%` }
              ]}
            />
          </View>
        </View>

        <View style={styles.nivelCard}>
          <Text style={styles.nivelNombre}>Avanzado</Text>
          <Text style={styles.nivelProgreso}>
            {currentProfile.unidadesCompletadas.avanzado.length} de 6 unidades completadas
          </Text>
          <View style={styles.barraProgreso}>
            <View 
              style={[
                styles.barraRelleno,
                { width: `${(currentProfile.unidadesCompletadas.avanzado.length / 6) * 100}%` }
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.accionesContainer}>
        <TouchableOpacity
          style={styles.botonReiniciar}
          onPress={reiniciarProgreso}
        >
          <Text style={styles.textoBotonReiniciar}>Reiniciar progreso</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#3498db',
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  nombre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  nivel: {
    fontSize: 18,
    color: 'white',
    marginBottom: 15,
  },
  gestionarPerfilesBoton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  gestionarPerfilesTexto: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
  estadisticasContainer: {
    padding: 20,
  },
  seccionTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  estadisticaCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  estadisticaLabel: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  estadisticaValor: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: 'bold',
  },
  progresoNiveles: {
    padding: 20,
    paddingTop: 0,
  },
  nivelCard: {
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
  nivelNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  nivelProgreso: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  barraProgreso: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barraRelleno: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 4,
  },
  accionesContainer: {
    padding: 20,
    paddingTop: 0,
  },
  botonReiniciar: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
  },
  textoBotonReiniciar: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: 50,
  },
});