import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Breakpoints para diferentes tamaños de pantalla
export const BREAKPOINTS = {
  small: 320,
  medium: 375,
  large: 414,
  xlarge: 768,
};

// Funciones de utilidad para responsividad
export const isSmallScreen = () => screenWidth <= BREAKPOINTS.small;
export const isMediumScreen = () => screenWidth > BREAKPOINTS.small && screenWidth <= BREAKPOINTS.medium;
export const isLargeScreen = () => screenWidth > BREAKPOINTS.medium && screenWidth <= BREAKPOINTS.large;
export const isXLargeScreen = () => screenWidth > BREAKPOINTS.large;

// Función para escalar tamaños basado en el ancho de pantalla
export const scale = (size: number) => {
  const baseWidth = 375; // iPhone X como referencia
  return (screenWidth / baseWidth) * size;
};

// Función para escalar verticalmente
export const verticalScale = (size: number) => {
  const baseHeight = 812; // iPhone X como referencia
  return (screenHeight / baseHeight) * size;
};

// Función para escalar moderadamente (híbrido)
export const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Configuraciones responsivas para diferentes componentes
export const RESPONSIVE_CONFIG = {
  unitCard: {
    width: isSmallScreen() ? '100%' : '48%',
    padding: isSmallScreen() ? 12 : 15,
    minHeight: isSmallScreen() ? 100 : 120,
  },
  fontSize: {
    small: moderateScale(12),
    medium: moderateScale(14),
    large: moderateScale(16),
    xlarge: moderateScale(18),
    xxlarge: moderateScale(20),
  },
  spacing: {
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(12),
    lg: moderateScale(16),
    xl: moderateScale(20),
    xxl: moderateScale(24),
  },
};

export default {
  scale,
  verticalScale,
  moderateScale,
  isSmallScreen,
  isMediumScreen,
  isLargeScreen,
  isXLargeScreen,
  RESPONSIVE_CONFIG,
  screenWidth,
  screenHeight,
};