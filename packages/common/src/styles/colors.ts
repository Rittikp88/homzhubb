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
  disabledPreference: '#B3BBC3',
  disabledSearch: '#80C1FC',
  danger: '#D60D31',
  orange: '#FB6E07',
  notificationGreen: '#13AB46',
  lightBlue: '#C2E4FF',
  lightGrayishBlue: '#F7FAFC',
  expense: '#FFC5BE',
  income: '#85DACF',
  blueDonut: '#A2D2FD',
  unreadNotification: '#F2F9FF',
  moreSeparator: '#F8FCFF',
  favourite: '#EA464C',
  rental: '#6CCEC1',
  sell: '#FFB876',
  gold: '#FFD700',
  lightGreen: '#4FA800',
  alertInfo: '#52616B',
};

const tintColors = {
  // dark
  darkTint1: '#001B36',
  darkTint2: '#19324A',
  darkTint3: '#33495E',
  darkTint4: '#4C5F72',
  darkTint5: '#667686',
  darkTint6: '#808D9B',
  darkTint7: '#99A4AF',
  darkTint8: '#B2BBC3',
  darkTint9: '#CCD1D7',
  darkTint10: '#E5E8EB',
  darkTint11: '#9A99A2',
  darkTint12: '#E0E0E0',

  // blue
  blueTint7: '#99CEFC',
  blueTint8: '#B2DAFD',
  blueTint9: '#CCE6FE',
  blueTint10: '#E5F3FE',
};

// Theme based color scheme
const themedColors = {
  primaryColor: namedColors.blue,
  secondaryColor: namedColors.white,
  screenBackground: namedColors.white,
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

// rgba functions for opacity
const opacity = {
  whiteOpacity: 'rgba(255, 255, 255, 0.1)',
  crossIconContainer: 'rgba(0, 0, 0, 0.2)',
  overlay: 'rgba(0, 0, 0, 0.25)',
  imageThumbnailBackground: 'rgba(0, 27, 54, 0.6)',
  markerOpacity: 'rgba(0, 132, 248, 0.3)',
  carouselCardOpacity: 'rgba(0, 27, 54, 0.25)',
  favoriteBackground: 'rgba(25, 50, 74, 0.25)',
  imageVideoPaginationBackground: 'rgba(25, 50, 74, 0.65)',
  ratingLow: 'rgba(242, 61, 6, 0.12)',
  ratingHigh: 'rgba(71, 194, 178, 0.12)',
  reminderBackground: 'rgba(0, 132, 248, 0.1)',
  greenOpacity: '#DDF4E7',
  blueOpacity: 'rgba(0, 132, 248, 0.1)',
  reviewCardOpacity: 'rgba(44, 186, 103, 0.1)',
};

const gradientAssetMetrics = {
  gradientA: '#61D773',
  gradientB: '#94EF90',
  gradientC: '#FDB113',
  gradientD: '#FFDB8F',
  gradientF: '#84ECE4',
  gradientG: '#FD8313',
  gradientH: '#FFD2A9',
  gradientI: '#aa7474',
  gradientJ: '#fc3b3b',
  gradientK: '#F1F6FA',
};

const grayShades = {
  grey1: '#F9FCFE',
  gray2: '#4F4F4F',
  gray3: '#828282',
};

const chartColors = {
  income: '#2EC1AC',
  expense: '#EA5455',
};

export const colors = {
  ...namedColors,
  ...themedColors,
  ...gradientColors,
  ...tintColors,
  ...opacity,
  ...gradientAssetMetrics,
  ...grayShades,
  ...chartColors,
};
