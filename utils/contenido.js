/**
 * Sistema de carga de contenido completamente seguro
 * Este archivo implementa un sistema de importación estática de todos los recursos
 * de contenido (lecciones y exámenes) para evitar problemas de bundling y asegurar
 * que solo se referencian archivos que realmente existen.
 */

/**
 * Imports estáticos para evitar problemas de bundling en React Native
 * Al importar estáticamente todos los archivos, nos aseguramos que:
 * 1. El bundler incluya todos los archivos necesarios en el paquete final
 * 2. No haya errores de "archivo no encontrado" en tiempo de ejecución
 * 3. La aplicación funcione correctamente sin conexión a internet
 */
// BÁSICO - LECCIONES (incluye micro-unidades y unidades completas)
import unidad1a_leccion_basico from '../data/basico/unidad1a_leccion.json';
import unidad1b_leccion_basico from '../data/basico/unidad1b_leccion.json';
import unidad1c_leccion_basico from '../data/basico/unidad1c_leccion.json';
import unidad2a_leccion_basico from '../data/basico/unidad2a_leccion.json';
import unidad2b_leccion_basico from '../data/basico/unidad2b_leccion.json';
import unidad3a_leccion_basico from '../data/basico/unidad3a_leccion.json';
import unidad3b_leccion_basico from '../data/basico/unidad3b_leccion.json';
import unidad4a_leccion_basico from '../data/basico/unidad4a_leccion.json';
import unidad4b_leccion_basico from '../data/basico/unidad4b_leccion.json';
import unidad5a_leccion_basico from '../data/basico/unidad5a_leccion.json';
import unidad5b_leccion_basico from '../data/basico/unidad5b_leccion.json';
import unidad5c_leccion_basico from '../data/basico/unidad5c_leccion.json';
import unidad5d_leccion_basico from '../data/basico/unidad5d_leccion.json';
import unidad1_leccion_basico from '../data/basico/unidad1_leccion.json';
import unidad2_leccion_basico from '../data/basico/unidad2_leccion.json';
import unidad3_leccion_basico from '../data/basico/unidad3_leccion.json';
import unidad4_leccion_basico from '../data/basico/unidad4_leccion.json';
import unidad5_leccion_basico from '../data/basico/unidad5_leccion.json';
import unidad6_leccion_basico from '../data/basico/unidad6_leccion.json';
import unidad7_leccion_basico from '../data/basico/unidad7_leccion.json';
import unidad8_leccion_basico from '../data/basico/unidad8_leccion.json';
import unidad9_leccion_basico from '../data/basico/unidad9_leccion.json';
import unidad10_leccion_basico from '../data/basico/unidad10_leccion.json';

// BÁSICO - EXÁMENES (incluye exámenes para micro-unidades y unidades completas)
import unidad1a_examen_basico from '../data/basico/unidad1a_examen.json';
import unidad1b_examen_basico from '../data/basico/unidad1b_examen.json';
import unidad1c_examen_basico from '../data/basico/unidad1c_examen.json';
import unidad2a_examen_basico from '../data/basico/unidad2a_examen.json';
import unidad2b_examen_basico from '../data/basico/unidad2b_examen.json';
import unidad3a_examen_basico from '../data/basico/unidad3a_examen.json';
import unidad3b_examen_basico from '../data/basico/unidad3b_examen.json';
import unidad1_examen_basico from '../data/basico/unidad1_examen.json';
import unidad2_examen_basico from '../data/basico/unidad2_examen.json';
import unidad3_examen_basico from '../data/basico/unidad3_examen.json';
import unidad4_examen_basico from '../data/basico/unidad4_examen.json';
import unidad5_examen_basico from '../data/basico/unidad5_examen.json';
import unidad6_examen_basico from '../data/basico/unidad6_examen.json';
import unidad7_examen_basico from '../data/basico/unidad7_examen.json';
import unidad8_examen_basico from '../data/basico/unidad8_examen.json';
import unidad9_examen_basico from '../data/basico/unidad9_examen.json';
import unidad10_examen_basico from '../data/basico/unidad10_examen.json';
import examen_generico from '../data/basico/examen_generico.json';

// INTERMEDIO - LECCIONES (contenido para estudiantes con nivel básico)
import unidad1_leccion_intermedio from '../data/intermedio/unidad1_leccion.json';
import unidad2_leccion_intermedio from '../data/intermedio/unidad2_leccion.json';
import unidad3_leccion_intermedio from '../data/intermedio/unidad3_leccion.json';
import unidad4_leccion_intermedio from '../data/intermedio/unidad4_leccion.json';
import unidad5_leccion_intermedio from '../data/intermedio/unidad5_leccion.json';
import unidad6_leccion_intermedio from '../data/intermedio/unidad6_leccion.json';

// INTERMEDIO - EXÁMENES (evaluaciones para estudiantes con nivel básico)
import unidad1_examen_intermedio from '../data/intermedio/unidad1_examen.json';
import unidad2_examen_intermedio from '../data/intermedio/unidad2_examen.json';
import unidad3_examen_intermedio from '../data/intermedio/unidad3_examen.json';
import unidad4_examen_intermedio from '../data/intermedio/unidad4_examen.json';
import unidad5_examen_intermedio from '../data/intermedio/unidad5_examen.json';
import unidad6_examen_intermedio from '../data/intermedio/unidad6_examen.json';

// AVANZADO - LECCIONES (contenido para estudiantes con nivel intermedio)
import unidad1_leccion_avanzado from '../data/avanzado/unidad1_leccion.json';
import unidad2_leccion_avanzado from '../data/avanzado/unidad2_leccion.json';
import unidad3_leccion_avanzado from '../data/avanzado/unidad3_leccion.json';
import unidad4_leccion_avanzado from '../data/avanzado/unidad4_leccion.json';
import unidad5_leccion_avanzado from '../data/avanzado/unidad5_leccion.json';
import unidad6_leccion_avanzado from '../data/avanzado/unidad6_leccion.json';

// AVANZADO - EXÁMENES (evaluaciones para estudiantes con nivel intermedio)
import unidad1_examen_avanzado from '../data/avanzado/unidad1_examen.json';
import unidad2_examen_avanzado from '../data/avanzado/unidad2_examen.json';
import unidad3_examen_avanzado from '../data/avanzado/unidad3_examen.json';
import unidad4_examen_avanzado from '../data/avanzado/unidad4_examen.json';
import unidad5_examen_avanzado from '../data/avanzado/unidad5_examen.json';
import unidad6_examen_avanzado from '../data/avanzado/unidad6_examen.json';

/**
 * Mapeo estático de todo el contenido importado
 * Organiza todos los recursos por tipo (lecciones/exámenes), nivel y unidad
 * para facilitar su acceso mediante referencias consistentes
 */
const CONTENIDO_ESTATICO = {
  lecciones: {
    basico: {
      'unidad1a_leccion': unidad1a_leccion_basico,
      'unidad1b_leccion': unidad1b_leccion_basico,
      'unidad1c_leccion': unidad1c_leccion_basico,
      'unidad2a_leccion': unidad2a_leccion_basico,
      'unidad2b_leccion': unidad2b_leccion_basico,
      'unidad3a_leccion': unidad3a_leccion_basico,
      'unidad3b_leccion': unidad3b_leccion_basico,
      'unidad4a_leccion': unidad4a_leccion_basico,
      'unidad4b_leccion': unidad4b_leccion_basico,
      'unidad5a_leccion': unidad5a_leccion_basico,
      'unidad5b_leccion': unidad5b_leccion_basico,
      'unidad5c_leccion': unidad5c_leccion_basico,
      'unidad5d_leccion': unidad5d_leccion_basico,
      'unidad1_leccion': unidad1_leccion_basico,
      'unidad2_leccion': unidad2_leccion_basico,
      'unidad3_leccion': unidad3_leccion_basico,
      'unidad4_leccion': unidad4_leccion_basico,
      'unidad5_leccion': unidad5_leccion_basico,
      'unidad6_leccion': unidad6_leccion_basico,
      'unidad7_leccion': unidad7_leccion_basico,
      'unidad8_leccion': unidad8_leccion_basico,
      'unidad9_leccion': unidad9_leccion_basico,
      'unidad10_leccion': unidad10_leccion_basico
    },
    intermedio: {
      'unidad1_leccion': unidad1_leccion_intermedio,
      'unidad2_leccion': unidad2_leccion_intermedio,
      'unidad3_leccion': unidad3_leccion_intermedio,
      'unidad4_leccion': unidad4_leccion_intermedio,
      'unidad5_leccion': unidad5_leccion_intermedio,
      'unidad6_leccion': unidad6_leccion_intermedio
    },
    avanzado: {
      'unidad1_leccion': unidad1_leccion_avanzado,
      'unidad2_leccion': unidad2_leccion_avanzado,
      'unidad3_leccion': unidad3_leccion_avanzado,
      'unidad4_leccion': unidad4_leccion_avanzado,
      'unidad5_leccion': unidad5_leccion_avanzado,
      'unidad6_leccion': unidad6_leccion_avanzado
    }
  },
  examenes: {
    basico: {
      'unidad1a_examen': unidad1a_examen_basico,
      'unidad1b_examen': unidad1b_examen_basico,
      'unidad1c_examen': unidad1c_examen_basico,
      'unidad2a_examen': unidad2a_examen_basico,
      'unidad2b_examen': unidad2b_examen_basico,
      'unidad3a_examen': unidad3a_examen_basico,
      'unidad3b_examen': unidad3b_examen_basico,
      'unidad1_examen': unidad1_examen_basico,
      'unidad2_examen': unidad2_examen_basico,
      'unidad3_examen': unidad3_examen_basico,
      'unidad4_examen': unidad4_examen_basico,
      'unidad5_examen': unidad5_examen_basico,
      'unidad6_examen': unidad6_examen_basico,
      'unidad7_examen': unidad7_examen_basico,
      'unidad8_examen': unidad8_examen_basico,
      'unidad9_examen': unidad9_examen_basico,
      'unidad10_examen': unidad10_examen_basico
    },
    intermedio: {
      'unidad1_examen': unidad1_examen_intermedio,
      'unidad2_examen': unidad2_examen_intermedio,
      'unidad3_examen': unidad3_examen_intermedio,
      'unidad4_examen': unidad4_examen_intermedio,
      'unidad5_examen': unidad5_examen_intermedio,
      'unidad6_examen': unidad6_examen_intermedio
    },
    avanzado: {
      'unidad1_examen': unidad1_examen_avanzado,
      'unidad2_examen': unidad2_examen_avanzado,
      'unidad3_examen': unidad3_examen_avanzado,
      'unidad4_examen': unidad4_examen_avanzado,
      'unidad5_examen': unidad5_examen_avanzado,
      'unidad6_examen': unidad6_examen_avanzado
    }
  }
};

/**
 * Mapeo de archivos disponibles para validación
 * Genera listas de los archivos disponibles para cada categoría
 * Útil para verificar rápidamente si un recurso existe antes de intentar cargarlo
 */
const ARCHIVOS_DISPONIBLES = {
  lecciones: {
    basico: Object.keys(CONTENIDO_ESTATICO.lecciones.basico),
    intermedio: Object.keys(CONTENIDO_ESTATICO.lecciones.intermedio),
    avanzado: Object.keys(CONTENIDO_ESTATICO.lecciones.avanzado)
  },
  examenes: {
    basico: Object.keys(CONTENIDO_ESTATICO.examenes.basico),
    intermedio: Object.keys(CONTENIDO_ESTATICO.examenes.intermedio),
    avanzado: Object.keys(CONTENIDO_ESTATICO.examenes.avanzado)
  }
};

/**
 * Función para cargar una lección de manera segura
 * Busca y devuelve el contenido de una lección específica desde el mapeo estático
 * 
 * @param {string} nivel - Nivel de dificultad (basico, intermedio, avanzado)
 * @param {string} unidad - Identificador de la unidad (ej: unidad1, unidad2a)
 * @returns {Object} - Contenido de la lección solicitada
 * @throws {Error} - Si la lección no existe en el mapeo estático
 */
export const cargarLeccionSegura = (nivel, unidad) => {
  try {
    const archivo = `${unidad}_leccion`;
    const contenidoNivel = CONTENIDO_ESTATICO.lecciones[nivel];
    
    if (!contenidoNivel || !contenidoNivel[archivo]) {
      throw new Error(`Lección no disponible: ${nivel}/${unidad}`);
    }

    // Retornar contenido estático
    return contenidoNivel[archivo];
  } catch (error) {
    console.error(`Error cargando lección ${nivel}/${unidad}:`, error);
    throw error;
  }
};

/**
 * Función para cargar un examen de manera segura
 * Busca y devuelve el contenido de un examen específico desde el mapeo estático
 * Si el examen solicitado no existe, devuelve un examen genérico como fallback
 * 
 * @param {string} nivel - Nivel de dificultad (basico, intermedio, avanzado)
 * @param {string} unidad - Identificador de la unidad (ej: unidad1, unidad2a)
 * @returns {Object} - Contenido del examen solicitado o examen genérico
 */
export const cargarExamenSeguro = (nivel, unidad) => {
  try {
    const archivo = `${unidad}_examen`;
    const contenidoNivel = CONTENIDO_ESTATICO.examenes[nivel];
    
    if (!contenidoNivel || !contenidoNivel[archivo]) {
      console.log(`Examen específico no disponible: ${nivel}/${unidad}, usando genérico`);
      return examen_generico;
    }

    // Retornar contenido estático
    return contenidoNivel[archivo];
  } catch (error) {
    console.error(`Error cargando examen ${nivel}/${unidad}:`, error);
    console.log('Usando examen genérico como fallback');
    return examen_generico;
  }
};

/**
 * Función para verificar si un archivo de contenido existe
 * Comprueba si un recurso específico está disponible en el mapeo estático
 * 
 * @param {string} tipo - Tipo de contenido (leccion, examen)
 * @param {string} nivel - Nivel de dificultad (basico, intermedio, avanzado)
 * @param {string} unidad - Identificador de la unidad (ej: unidad1, unidad2a)
 * @returns {boolean} - true si el contenido existe, false en caso contrario
 */
export const existeContenido = (tipo, nivel, unidad) => {
  const archivo = `${unidad}_${tipo}`;
  const contenidoNivel = CONTENIDO_ESTATICO[`${tipo}s`][nivel];
  return contenidoNivel && contenidoNivel[archivo] !== undefined;
};

/**
 * Exportación por defecto de las utilidades de contenido
 */
export default {
  cargarLeccionSegura,
  cargarExamenSeguro,
  existeContenido,
  ARCHIVOS_DISPONIBLES
};