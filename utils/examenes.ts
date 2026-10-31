/**
 * Mapeo de exámenes disponibles por nivel y unidad
 * Utiliza importaciones estáticas para evitar errores de bundling
 * Cada función retorna el contenido JSON del examen correspondiente
 */
export const EXAMENES_DISPONIBLES = {
  basico: {
    // Micro-unidades
    'unidad1a': () => require('../data/basico/unidad1a_examen.json'),
    'unidad1b': () => require('../data/basico/unidad1b_examen.json'),
    'unidad1c': () => require('../data/basico/unidad1c_examen.json'),
    'unidad2a': () => require('../data/basico/unidad2a_examen.json'),
    'unidad2b': () => require('../data/basico/unidad2b_examen.json'),
    'unidad3a': () => require('../data/basico/unidad3a_examen.json'),
    'unidad3b': () => require('../data/basico/unidad3b_examen.json'),
    // Unidades originales
    'unidad1': () => require('../data/basico/unidad1_examen.json'),
    'unidad2': () => require('../data/basico/unidad2_examen.json'),
    'unidad3': () => require('../data/basico/unidad3_examen.json'),
    'unidad4': () => require('../data/basico/unidad4_examen.json'),
    'unidad5': () => require('../data/basico/unidad5_examen.json'),
    'unidad6': () => require('../data/basico/unidad6_examen.json'),
    'unidad7': () => require('../data/basico/unidad7_examen.json'),
    'unidad8': () => require('../data/basico/unidad8_examen.json'),
    'unidad9': () => require('../data/basico/unidad9_examen.json'),
    'unidad10': () => require('../data/basico/unidad10_examen.json'),
  },
  intermedio: {
    'unidad1': () => require('../data/intermedio/unidad1_examen.json'),
    'unidad2': () => require('../data/intermedio/unidad2_examen.json'),
    'unidad3': () => require('../data/intermedio/unidad3_examen.json'),
    'unidad4': () => require('../data/intermedio/unidad4_examen.json'),
    'unidad5': () => require('../data/intermedio/unidad5_examen.json'),
    'unidad6': () => require('../data/intermedio/unidad6_examen.json'),

  },
  avanzado: {
    'unidad1': () => require('../data/avanzado/unidad1_examen.json'),
    'unidad2': () => require('../data/avanzado/unidad2_examen.json'),
    'unidad3': () => require('../data/avanzado/unidad3_examen.json'),
    'unidad4': () => require('../data/avanzado/unidad4_examen.json'),
    'unidad5': () => require('../data/avanzado/unidad5_examen.json'),
    'unidad6': () => require('../data/avanzado/unidad6_examen.json'),
  }
};

/**
 * Examen genérico que se utiliza como fallback cuando no se encuentra el examen solicitado
 * @returns {Object} Datos del examen genérico
 */
export const EXAMEN_GENERICO = () => require('../data/basico/examen_generico.json');

/**
 * Función para cargar un examen específico con fallback automático
 * Si el examen solicitado no existe, se carga un examen genérico
 * @param {string} nivel - Nivel de dificultad del examen (basico, intermedio, avanzado)
 * @param {string} unidad - Identificador de la unidad (ej: unidad1, unidad2a)
 * @returns {Object} Datos del examen solicitado o del examen genérico como fallback
 */
export const cargarExamen = (nivel: string, unidad: string) => {
  try {
    console.log(`Intentando cargar examen: ${nivel}/${unidad}`);
    
    // Obtener el objeto de exámenes para el nivel especificado
    const nivelExamenes = EXAMENES_DISPONIBLES[nivel as keyof typeof EXAMENES_DISPONIBLES];
    
    // Verificar si existe el nivel y la unidad solicitada
    if (nivelExamenes && nivelExamenes[unidad as keyof typeof nivelExamenes]) {
      // Cargar el examen específico
      const examenData = nivelExamenes[unidad as keyof typeof nivelExamenes]();
      console.log(`Examen cargado exitosamente: ${nivel}/${unidad}`);
      return examenData;
    }
    
    // Si no se encuentra el examen específico, usar el genérico
    console.log(`Examen específico no encontrado para ${nivel}/${unidad}, usando genérico`);
    return EXAMEN_GENERICO();
  } catch (error) {
    // En caso de error durante la carga, usar el examen genérico
    console.error(`Error cargando examen ${nivel}/${unidad}:`, error);
    console.log(`Usando examen genérico como fallback`);
    return EXAMEN_GENERICO();
  }
};

/**
 * Exportación por defecto de todas las utilidades de exámenes
 */
export default {
  EXAMENES_DISPONIBLES, // Mapeo de exámenes disponibles
  EXAMEN_GENERICO,      // Función para cargar el examen genérico
  cargarExamen          // Función principal para cargar exámenes
};