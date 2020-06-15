// Add all colors here, try to add as per hex order
const namedColors = {
  white: '#FFFFFF',
  disabled: '#C9D6DF',
  informational: '#58C2f1',
  lowPriority: '#78B7FA',
  blue: '#0084F8',
  completed: '#47C2B1',
  green: '#2CBA67',
  warning: '#F9A901',
  mediumPriority: '#FBC02D',
  highPriority: '#FF8576',
  error: '#F23C06',
  dark: '#001B36',
  background: '#F0F5F9',
  shadow: '#000',
  transparent: 'transparent',
};

const tintColors = {
  darkTint1: '#001B36',
  darkTint2: '#19324A',
  darkTint3: '#33495E',
  darkTint4: '#4C5F72',
  darkTint5: '#667686',
  darkTint6: '#808D9B',
  darkTint7: '#99A4AF',
  darkTint9: '#CCD1D7',
  darkTint10: '#E5E8EB',
  darkTint11: '#9A99A2',
};

// Theme based color scheme
const themedColors = {
  primaryColor: namedColors.blue,
  secondaryColor: namedColors.white,
  splashScreenBackgroundColor: '',
  splashScreenIndicatorColor: '',
  onBoardingScreenBackground: namedColors.background,
  active: namedColors.blue,
  success: namedColors.completed,
  error: namedColors.error,
};

// colors for adding gradients on UI
const gradientColors = {
  splashGradientA: '#037ADE',
  splashGradientB: '#03E5B7',
  propertyGradientA: '#409DFF',
  propertyGradientB: '#016EE2',
};

const opacity = {
  whiteOpacity: 'rgba(255, 255, 255, 0.1)',
};

export const colors = {
  ...namedColors,
  ...themedColors,
  ...gradientColors,
  ...tintColors,
  ...opacity,
};
