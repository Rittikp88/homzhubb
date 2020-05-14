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
  dark: '#001b36',
};

const colorTints = {
  darkTint3: '#4C5F72',
  darkTint4: '#33495E',
};

// Theme based color scheme
const themedColors = {
  primaryColor: namedColors.blue,
  splashScreenBackgroundColor: '',
  splashScreenIndicatorColor: '',
  active: namedColors.blue,
  success: namedColors.completed,
  error: namedColors.error,
};

export const colors = {
  ...namedColors,
  ...themedColors,
  ...colorTints,
};
