/**
 * Mapeo de lecciones disponibles organizado por nivel de dificultad y unidad.
 * Este objeto utiliza funciones de carga diferida (lazy loading) para evitar errores de bundling
 * y optimizar el rendimiento al cargar solo los recursos necesarios cuando se solicitan.
 */
export const LECCIONES_DISPONIBLES = {
  /**
   * Nivel básico: contiene tanto micro-unidades (fragmentadas) como unidades completas originales
   */
  basico: {
    // Micro-unidades
    'unidad1a': () => require('../data/basico/unidad1a_leccion.json'),
    'unidad1b': () => require('../data/basico/unidad1b_leccion.json'),
    'unidad1c': () => require('../data/basico/unidad1c_leccion.json'),
    'unidad2a': () => require('../data/basico/unidad2a_leccion.json'),
    'unidad2b': () => require('../data/basico/unidad2b_leccion.json'),
    'unidad3a': () => require('../data/basico/unidad3a_leccion.json'),
    'unidad3b': () => require('../data/basico/unidad3b_leccion.json'),
    'unidad4a': () => require('../data/basico/unidad4a_leccion.json'),
    'unidad4b': () => require('../data/basico/unidad4b_leccion.json'),
    'unidad5a': () => require('../data/basico/unidad5a_leccion.json'),
    'unidad5b': () => require('../data/basico/unidad5b_leccion.json'),
    'unidad5c': () => require('../data/basico/unidad5c_leccion.json'),
    'unidad5d': () => require('../data/basico/unidad5d_leccion.json'),
    // Unidades originales
    'unidad1': () => require('../data/basico/unidad1_leccion.json'),
    'unidad2': () => require('../data/basico/unidad2_leccion.json'),
    'unidad3': () => require('../data/basico/unidad3_leccion.json'),
    'unidad4': () => require('../data/basico/unidad4_leccion.json'),
    'unidad5': () => require('../data/basico/unidad5_leccion.json'),
    'unidad6': () => require('../data/basico/unidad6_leccion.json'),
    'unidad7': () => require('../data/basico/unidad7_leccion.json'),
    'unidad8': () => require('../data/basico/unidad8_leccion.json'),
    'unidad9': () => require('../data/basico/unidad9_leccion.json'),
    'unidad10': () => require('../data/basico/unidad10_leccion.json'),
  },
  /**
   * Nivel intermedio: contiene unidades para estudiantes con conocimientos básicos del idioma
   */
  intermedio: {
    'unidad1': () => require('../data/intermedio/unidad1_leccion.json'),
    'unidad2': () => require('../data/intermedio/unidad2_leccion.json'),
    'unidad3': () => require('../data/intermedio/unidad3_leccion.json'),
    'unidad4': () => require('../data/intermedio/unidad4_leccion.json'),
    'unidad5': () => require('../data/intermedio/unidad5_leccion.json'),
    'unidad6': () => require('../data/intermedio/unidad6_leccion.json'),

  },
  /**
   * Nivel avanzado: contiene unidades para estudiantes con dominio intermedio del idioma
   */
  avanzado: {
    'unidad1': () => require('../data/avanzado/unidad1_leccion.json'),
    'unidad2': () => require('../data/avanzado/unidad2_leccion.json'),
    'unidad3': () => require('../data/avanzado/unidad3_leccion.json'),
    'unidad4': () => require('../data/avanzado/unidad4_leccion.json'),
    'unidad5': () => require('../data/avanzado/unidad5_leccion.json'),
    'unidad6': () => require('../data/avanzado/unidad6_leccion.json'),
  }
};

/**
 * Función para cargar una lección específica con manejo de errores robusto.
 * 
 * @param nivel - El nivel de dificultad de la lección (basico, intermedio, avanzado)
 * @param unidad - El identificador de la unidad a cargar (ej: unidad1, unidad2a)
 * @returns El contenido de la lección solicitada
 * @throws Error si el nivel o la unidad no existen
 */
export const cargarLeccion = (nivel: string, unidad: string) => {
  try {
    console.log(`Intentando cargar lección: ${nivel}/${unidad}`);
    
    const nivelLecciones = LECCIONES_DISPONIBLES[nivel as keyof typeof LECCIONES_DISPONIBLES];
    if (!nivelLecciones) {
      throw new Error(`Nivel no encontrado: ${nivel}`);
    }
    
    const leccionLoader = nivelLecciones[unidad as keyof typeof nivelLecciones];
    if (!leccionLoader) {
      throw new Error(`Unidad no encontrada: ${unidad} en nivel ${nivel}`);
    }
    
    const leccionData = leccionLoader();
    console.log(`Lección cargada exitosamente: ${nivel}/${unidad}`);
    return leccionData;
  } catch (error) {
    console.error(`Error cargando lección ${nivel}/${unidad}:`, error);
    throw error;
  }
};

/**
 * Exportación por defecto de las utilidades de lecciones
 */
export default {
  LECCIONES_DISPONIBLES,
  cargarLeccion
};