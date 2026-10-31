// Importaciones necesarias para el contexto de la aplicación
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para almacenamiento persistente
import React, { createContext, useContext, useEffect, useReducer } from 'react'; // Hooks de React

/**
 * Interfaz que define la estructura de los resultados detallados del diagnóstico
 * Almacena información sobre el rendimiento del usuario en diferentes niveles y categorías
 */
interface DiagnosticoDetallado {
  fecha: string; // Fecha en que se realizó el diagnóstico
  resultadosPorNivel: {
    basico: { aciertos: number; total: number; porcentaje: number };
    intermedio: { aciertos: number; total: number; porcentaje: number };
    avanzado: { aciertos: number; total: number; porcentaje: number };
  };
  resultadosPorCategoria: { [key: string]: { categoria: string; aciertos: number; total: number; porcentaje: number } };
  recomendaciones: string[]; // Recomendaciones personalizadas basadas en los resultados
}

/**
 * Interfaz principal que define la estructura del progreso de un usuario
 * Contiene toda la información relacionada con el avance, estadísticas y preferencias
 */
interface UserProgress {
  id: string; // Identificador único del perfil
  usuario: string; // Nombre del usuario
  nivel: 'basico' | 'intermedio' | 'avanzado'; // Nivel actual del usuario
  racha: number; // Días consecutivos de uso
  ultimaEntrada: string; // Última fecha de acceso (formato YYYY-MM-DD)
  unidadesCompletadas: {
    basico: string[]; // Array con IDs de unidades completadas de nivel básico
    intermedio: string[]; // Array con IDs de unidades completadas de nivel intermedio
    avanzado: string[]; // Array con IDs de unidades completadas de nivel avanzado
  };
  porcentajeAvance: {
    basico: number; // Porcentaje de avance en nivel básico (0-100)
    intermedio: number; // Porcentaje de avance en nivel intermedio (0-100)
    avanzado: number; // Porcentaje de avance en nivel avanzado (0-100)
  };
  primerUso: boolean; // Indica si es la primera vez que el usuario usa la app
  fechaCreacion: string; // Fecha de creación del perfil
  diagnosticoDetallado?: DiagnosticoDetallado; // Resultados del examen diagnóstico (opcional)
  estadisticas?: {
    tiempoTotalEstudio: number; // Tiempo total de estudio en minutos
    leccionesCompletadas: number; // Número de lecciones completadas
    examenesAprobados: number; // Número de exámenes aprobados
    palabrasAprendidas: number; // Estimación de palabras aprendidas
    fechaRegistro: string; // Fecha de registro inicial
  };
}

/**
 * Estado global de la aplicación
 * Contiene todos los perfiles de usuario y el perfil actualmente seleccionado
 */
interface AppState {
  profiles: UserProgress[]; // Array con todos los perfiles de usuario
  currentProfileId: string | null; // ID del perfil actualmente seleccionado
  isLoading: boolean; // Indica si la aplicación está cargando datos
}

/**
 * Tipo que define todas las acciones posibles para el reducer
 * Cada acción tiene un tipo específico y una carga útil (payload)
 */
type AppAction = 
  | { type: 'SET_PROFILES'; payload: UserProgress[] } // Establece todos los perfiles
  | { type: 'SET_CURRENT_PROFILE'; payload: string } // Cambia el perfil activo
  | { type: 'ADD_PROFILE'; payload: UserProgress } // Añade un nuevo perfil
  | { type: 'UPDATE_PROFILE'; payload: { id: string; data: Partial<UserProgress> } } // Actualiza un perfil existente
  | { type: 'DELETE_PROFILE'; payload: string } // Elimina un perfil
  | { type: 'SET_LOADING'; payload: boolean } // Cambia el estado de carga
  | { type: 'COMPLETE_UNIT'; payload: { nivel: string; unidad: string } }; // Marca una unidad como completada

/**
 * Estado inicial de la aplicación
 * Comienza con una lista vacía de perfiles y en estado de carga
 */
const initialState: AppState = {
  profiles: [], // Inicialmente no hay perfiles
  currentProfileId: null, // Ningún perfil seleccionado
  isLoading: true, // Comienza en estado de carga
};

/**
 * Contexto principal de la aplicación
 * Proporciona acceso al estado global y funciones para manipularlo
 */
const AppContext = createContext<{
  state: AppState; // Estado actual de la aplicación
  dispatch: React.Dispatch<AppAction>; // Función para despachar acciones
  currentProfile: UserProgress | null; // Perfil actualmente seleccionado
  createProfile: (name: string) => Promise<string>; // Crea un nuevo perfil
  switchProfile: (profileId: string) => void; // Cambia al perfil especificado
  deleteProfile: (profileId: string) => Promise<void>; // Elimina un perfil
  updateCurrentProfile: (data: Partial<UserProgress>) => void; // Actualiza el perfil actual
  saveProfiles: () => Promise<void>; // Guarda los perfiles en AsyncStorage
  loadProfiles: () => Promise<void>; // Carga los perfiles desde AsyncStorage
} | null>(null);

/**
 * Reducer para manejar todas las acciones del estado global
 * Implementa la lógica para cada tipo de acción definida
 * @param state Estado actual
 * @param action Acción a ejecutar
 * @returns Nuevo estado
 */
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PROFILES':
      // Establece la lista completa de perfiles
      return { ...state, profiles: action.payload };
      
    case 'SET_CURRENT_PROFILE':
      // Cambia el perfil actualmente seleccionado
      return { ...state, currentProfileId: action.payload };
      
    case 'ADD_PROFILE':
      // Añade un nuevo perfil y lo establece como actual
      return { 
        ...state, 
        profiles: [...state.profiles, action.payload],
        currentProfileId: action.payload.id
      };
      
    case 'UPDATE_PROFILE':
      // Actualiza un perfil específico manteniendo el resto igual
      return {
        ...state,
        profiles: state.profiles.map(profile => 
          profile.id === action.payload.id 
            ? { ...profile, ...action.payload.data }
            : profile
        )
      };
      
    case 'DELETE_PROFILE':
      // Elimina un perfil y actualiza el perfil actual si es necesario
      const newProfiles = state.profiles.filter(p => p.id !== action.payload);
      return {
        ...state,
        profiles: newProfiles,
        currentProfileId: state.currentProfileId === action.payload 
          ? (newProfiles.length > 0 ? newProfiles[0].id : null)
          : state.currentProfileId
      };
      
    case 'SET_LOADING':
      // Actualiza el estado de carga
      return { ...state, isLoading: action.payload };
      
    case 'COMPLETE_UNIT':
      // Marca una unidad como completada para el perfil actual
      const currentProfile = state.profiles.find(p => p.id === state.currentProfileId);
      if (!currentProfile) return state;
      
      const { nivel, unidad } = action.payload;
      const unidadesActuales = currentProfile.unidadesCompletadas[nivel as keyof typeof currentProfile.unidadesCompletadas] || [];
      
      // Solo agregar si no está ya completada
      if (!unidadesActuales.includes(unidad)) {
        const updatedUnidades = {
          ...currentProfile.unidadesCompletadas,
          [nivel]: [...unidadesActuales, unidad]
        };
        
        return {
          ...state,
          profiles: state.profiles.map(profile => 
            profile.id === state.currentProfileId
              ? { ...profile, unidadesCompletadas: updatedUnidades }
              : profile
          )
        };
      }
      
      return state;
      
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const currentProfile = state.profiles.find(p => p.id === state.currentProfileId) || null;

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const createProfile = async (name: string): Promise<string> => {
    try {
      // Validar que el nombre no esté vacío
      if (!name || name.trim().length === 0) {
        throw new Error('El nombre no puede estar vacío');
      }

      // Cheat code: Si el nombre es 'Hesoyam2025', desbloquear todo
      const isCheatCode = name === 'Hesoyam2025';
      
      const newProfile: UserProgress = {
        id: generateId(),
        usuario: name.trim(),
        nivel: isCheatCode ? 'avanzado' : 'basico',
        racha: isCheatCode ? 365 : 0,
        ultimaEntrada: new Date().toISOString().split('T')[0],
        unidadesCompletadas: isCheatCode 
          ? { 
              basico: [
                // Nuevas micro-unidades
                'unidad1a', 'unidad1b', 'unidad1c', 'unidad2a', 'unidad2b', 
                'unidad3a', 'unidad3b', 'unidad4a', 'unidad4b', 'unidad5a', 
                'unidad5b', 'unidad5c', 'unidad5d',
                // Unidades originales
                'unidad1', 'unidad2', 'unidad3', 'unidad4', 'unidad5', 
                'unidad6', 'unidad7', 'unidad8', 'unidad9', 'unidad10'
              ], 
              intermedio: ['unidad1', 'unidad2', 'unidad3', 'unidad4', 'unidad5', 'unidad6'], 
              avanzado: ['unidad1', 'unidad2', 'unidad3', 'unidad4', 'unidad5', 'unidad6'] 
            }
          : { basico: [], intermedio: [], avanzado: [] },
        porcentajeAvance: isCheatCode 
          ? { basico: 100, intermedio: 100, avanzado: 100 }
          : { basico: 0, intermedio: 0, avanzado: 0 },
        primerUso: !isCheatCode,
        fechaCreacion: new Date().toISOString(),
        estadisticas: {
          tiempoTotalEstudio: isCheatCode ? 15000 : 0,
          leccionesCompletadas: isCheatCode ? 31 : 0,
          examenesAprobados: isCheatCode ? 31 : 0,
          palabrasAprendidas: isCheatCode ? 750 : 0,
          fechaRegistro: new Date().toISOString().split('T')[0]
        }
      };

      console.log('Creando nuevo perfil:', newProfile.usuario);
      dispatch({ type: 'ADD_PROFILE', payload: newProfile });
      await saveProfiles();
      console.log('Perfil creado exitosamente:', newProfile.id);
      return newProfile.id;
    } catch (error) {
      console.error('Error creando perfil:', error);
      throw error;
    }
  };

  const switchProfile = (profileId: string) => {
    dispatch({ type: 'SET_CURRENT_PROFILE', payload: profileId });
  };

  const deleteProfile = async (profileId: string) => {
    dispatch({ type: 'DELETE_PROFILE', payload: profileId });
    await saveProfiles();
  };

  const updateCurrentProfile = (data: Partial<UserProgress>) => {
    if (state.currentProfileId) {
      console.log('Actualizando perfil:', state.currentProfileId, data);
      dispatch({ 
        type: 'UPDATE_PROFILE', 
        payload: { id: state.currentProfileId, data } 
      });
    }
  };

  const clearAppState = async () => {
    try {
      await AsyncStorage.clear();
      dispatch({ type: 'SET_PROFILES', payload: [] });
      dispatch({ type: 'SET_CURRENT_PROFILE', payload: '' });
      console.log('Estado de la aplicación limpiado');
    } catch (error) {
      console.error('Error limpiando estado:', error);
    }
  };

  const saveProfiles = async () => {
    try {
      console.log('Guardando perfiles:', state.profiles.length);
      await AsyncStorage.setItem('profiles', JSON.stringify(state.profiles));
      await AsyncStorage.setItem('currentProfileId', state.currentProfileId || '');
      console.log('Perfiles guardados exitosamente');
    } catch (error) {
      console.error('Error guardando perfiles:', error);
      throw error;
    }
  };

  const loadProfiles = async () => {
    try {
      // Migrar datos antiguos si existen
      const oldProgress = await AsyncStorage.getItem('userProgress');
      if (oldProgress) {
        const progress = JSON.parse(oldProgress);
        const migratedProfile: UserProgress = {
          ...progress,
          id: generateId(),
          fechaCreacion: new Date().toISOString()
        };
        dispatch({ type: 'ADD_PROFILE', payload: migratedProfile });
        await AsyncStorage.removeItem('userProgress');
        await saveProfiles();
        return;
      }

      // Cargar perfiles nuevos
      const savedProfiles = await AsyncStorage.getItem('profiles');
      const savedCurrentId = await AsyncStorage.getItem('currentProfileId');
      
      if (savedProfiles) {
        const profiles = JSON.parse(savedProfiles);
        dispatch({ type: 'SET_PROFILES', payload: profiles });
        
        if (savedCurrentId && profiles.find((p: UserProgress) => p.id === savedCurrentId)) {
          dispatch({ type: 'SET_CURRENT_PROFILE', payload: savedCurrentId });
        } else if (profiles.length > 0) {
          dispatch({ type: 'SET_CURRENT_PROFILE', payload: profiles[0].id });
        }
      }
    } catch (error) {
      console.error('Error cargando perfiles:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    if (state.profiles.length > 0 && !state.isLoading) {
      saveProfiles();
    }
  }, [state.profiles, state.currentProfileId]);

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch, 
      currentProfile,
      createProfile,
      switchProfile,
      deleteProfile,
      updateCurrentProfile,
      saveProfiles,
      loadProfiles,
      clearAppState
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe usarse dentro de AppProvider');
  }
  return context;
}