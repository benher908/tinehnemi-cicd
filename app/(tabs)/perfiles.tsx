import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../contexts/AppContext';

export default function PerfilesScreen() {
  const { state, currentProfile, createProfile, switchProfile, deleteProfile } = useAppContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el perfil');
      return;
    }

    if (state.profiles.some(p => p.usuario.toLowerCase() === newProfileName.trim().toLowerCase())) {
      Alert.alert('Error', 'Ya existe un perfil con ese nombre');
      return;
    }

    try {
      await createProfile(newProfileName.trim());
      setNewProfileName('');
      setShowCreateModal(false);
      
      if (newProfileName.trim() === 'Hesoyam2025') {
        Alert.alert(
          '🎉 ¡CHEAT CODE ACTIVADO! 👑', 
          '¡Felicidades! Has desbloqueado todo el contenido:\n\n' +
          '✅ Todos los niveles completados\n' +
          '✅ Todas las unidades desbloqueadas\n' +
          '✅ Estadísticas máximas\n' +
          '✅ Racha de 365 días\n\n' +
          '¡Disfruta explorando todo el contenido!',
          [{ text: '¡Genial!', style: 'default' }]
        );
      } else {
        Alert.alert('Éxito', 'Perfil creado correctamente');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el perfil');
    }
  };

  const handleDeleteProfile = (profileId: string, profileName: string) => {
    if (state.profiles.length <= 1) {
      Alert.alert('Error', 'Debe existir al menos un perfil');
      return;
    }

    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar el perfil "${profileName}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => deleteProfile(profileId)
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'basico': return '#3498DB';
      case 'intermedio': return '#2ECC71';
      case 'avanzado': return '#9B59B6';
      default: return '#95A5A6';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Perfiles de Usuario</Text>
        <Text style={styles.subtitulo}>Selecciona o crea un perfil</Text>
      </View>

      <View style={styles.perfilesContainer}>
        {state.profiles.map((profile) => (
          <TouchableOpacity
            key={profile.id}
            style={[
              styles.perfilCard,
              currentProfile?.id === profile.id && styles.perfilActivo,
              profile.usuario === 'Hesoyam2025' && styles.perfilCheatCodeCard
            ]}
            onPress={() => switchProfile(profile.id)}
          >
            <View style={styles.perfilHeader}>
              <View style={styles.perfilInfo}>
                <Text style={[
                  styles.perfilNombre,
                  profile.usuario === 'Hesoyam2025' && styles.perfilCheatCode
                ]}>
                  {profile.usuario}
                  {profile.usuario === 'Hesoyam2025' && ' 👑'}
                </Text>
                <View style={[styles.nivelBadge, { backgroundColor: getNivelColor(profile.nivel) }]}>
                  <Text style={styles.nivelTexto}>{profile.nivel.toUpperCase()}</Text>
                </View>
              </View>
              {currentProfile?.id === profile.id && (
                <View style={styles.activoBadge}>
                  <Text style={styles.activoTexto}>ACTIVO</Text>
                </View>
              )}
            </View>

            <View style={styles.perfilStats}>
              <View style={styles.stat}>
                <Text style={styles.statNumero}>{profile.racha}</Text>
                <Text style={styles.statLabel}>Racha</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumero}>
                  {(profile.unidadesCompletadas.basico.length + 
                    profile.unidadesCompletadas.intermedio.length + 
                    profile.unidadesCompletadas.avanzado.length)}
                </Text>
                <Text style={styles.statLabel}>Unidades</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumero}>{profile.estadisticas?.examenesAprobados || 0}</Text>
                <Text style={styles.statLabel}>Exámenes</Text>
              </View>
            </View>

            <Text style={styles.fechaCreacion}>
              Creado: {formatDate(profile.fechaCreacion)}
            </Text>

            <View style={styles.perfilAcciones}>
              <TouchableOpacity
                style={styles.botonEliminar}
                onPress={() => handleDeleteProfile(profile.id, profile.usuario)}
              >
                <Text style={styles.botonEliminarTexto}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.crearPerfilCard}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.crearPerfilIcono}>+</Text>
          <Text style={styles.crearPerfilTexto}>Crear nuevo perfil</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.volverBoton}
        onPress={() => router.back()}
      >
        <Text style={styles.volverTexto}>Volver</Text>
      </TouchableOpacity>

      <Modal
        visible={showCreateModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Crear Nuevo Perfil</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Nombre del perfil"
              value={newProfileName}
              onChangeText={setNewProfileName}
              maxLength={20}
            />

            <View style={styles.modalBotones}>
              <TouchableOpacity
                style={[styles.modalBoton, styles.modalBotonCancelar]}
                onPress={() => {
                  setShowCreateModal(false);
                  setNewProfileName('');
                }}
              >
                <Text style={styles.modalBotonTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBoton, styles.modalBotonCrear]}
                onPress={handleCreateProfile}
              >
                <Text style={[styles.modalBotonTexto, styles.modalBotonCrearTexto]}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  perfilesContainer: {
    padding: 20,
  },
  perfilCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  perfilActivo: {
    borderColor: '#3498db',
    backgroundColor: '#f8f9fa',
  },
  perfilHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  perfilInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  perfilNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: 10,
  },
  perfilCheatCode: {
    color: '#f39c12',
    textShadowColor: 'rgba(243, 156, 18, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  perfilCheatCodeCard: {
    borderColor: '#f39c12',
    borderWidth: 2,
    backgroundColor: '#fef9e7',
    shadowColor: '#f39c12',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nivelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nivelTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activoBadge: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activoTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  perfilStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  stat: {
    alignItems: 'center',
  },
  statNumero: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  fechaCreacion: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    marginBottom: 10,
  },
  perfilAcciones: {
    alignItems: 'center',
  },
  botonEliminar: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  botonEliminarTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  crearPerfilCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  crearPerfilIcono: {
    fontSize: 40,
    color: '#3498db',
    marginBottom: 10,
  },
  crearPerfilTexto: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  volverBoton: {
    backgroundColor: '#95a5a6',
    borderRadius: 25,
    padding: 15,
    margin: 20,
    alignItems: 'center',
  },
  volverTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    maxWidth: 300,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  modalBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBoton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalBotonCancelar: {
    backgroundColor: '#95a5a6',
  },
  modalBotonCrear: {
    backgroundColor: '#3498db',
  },
  modalBotonTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalBotonCrearTexto: {
    color: 'white',
  },
});