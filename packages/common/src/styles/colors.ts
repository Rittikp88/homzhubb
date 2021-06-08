// Add all colors here, try to add as per hex order
const namedColors = {
  white: '#FFFFFF',
  disabled: '#C9D6DF',
  informational: '#58C2f1',
  lowPriority: '#78B7FA',
  blue: '#0084F8',
  footerBlue: '#147AEE',
  completed: '#47C2B1',
  green: '#2CBA67',
  incomeGreen: '#61D773',
  referGreen: '#27AE60',
  warning: '#F9A901',
  mediumPriority: '#FBC02D',
  highPriority: '#FF8576',
  expenseOrange: '#FDB113',
  error: '#F23C06',
  dark: '#001B36',
  background: '#F0F5F9',
  shadow: '#000',
  transparent: 'transparent',
  disabledPreference: '#B3BBC3',
  disabledSearch: '#80C1FC',
  danger: '#D60D31',
  alert: '#D60D31',
  orange: '#FB6E07',
  notificationGreen: '#13AB46',
  notificationRed: '#E93F33',
  lightBlue: '#C2E4FF',
  lightGrayishBlue: '#F7FAFC',
  darkGrayishBlue: '#0A79DA',
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
  divider: '#E5E8EC',
  maroon: '#FD689A',
  carousalBackground: '#f4f9fe',
  yellow: '#ffe603',
  pinkRed: '#AE434D',
  red: '#D42E17',
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
  blueTint3: '#D3A6F0',
  blueTint4: '#3E4FC2',
  blueTint5: '#2F2685',
  blueTint6: '#323E70',
  blueTint7: '#99CEFC',
  blueTint8: '#B2DAFD',
  blueTint9: '#CCE6FE',
  blueTint10: '#E5F3FE',
  blueTint11: '#E6F3FE',
  blueTint12: '#0084F8',

  // green
  greenTint6: '#006A0A',
  greenTint7: '#73ce64',
  greenTint8: '#47C2B1',
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
  headerGradientA: namedColors.blue,
  headerGradientB: '#2DC8C3',
  headerGradientC: '#32CFBE',
  landingCarouselGradientA: 'rgba(0, 13, 26, 0)',
  landingCarouselGradientB: 'rgba(0, 15, 30, 0.54)',
};

// rgba functions for opacity
const opacity = {
  whiteOpacity: 'rgba(255, 255, 255, 0.1)',
  cardOpacity: 'rgba(255, 255, 255, 0.2)',
  crossIconContainer: 'rgba(0, 0, 0, 0.2)',
  crossIconContainerWeb: 'rgba(242, 60, 6, 0.6)',
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
  greenLightOpacity: 'rgba(44,186,103,0.12)',
  blueOpacity: 'rgba(0, 132, 248, 0.1)',
  reviewCardOpacity: 'rgba(44, 186, 103, 0.1)',
  disabledOpacity: 'rgba(153, 164, 175, 0.1)',
  activeOpacity: 'rgba(0, 132, 248, 0.1)',
  boxShadow: 'rgba(0, 0, 0, 0.24)',
  alertOpacity: '#FDF5F5',
  subHeader: 'rgba(255, 255, 255, 0.16)',
  backgroundOpacity: 'rgba(240,245,249,0.5)',
  landingCardShadow: 'rgba(0, 0, 0, 0.08)',
  cardShadowDark: 'rgba(0, 0, 0, 0.3)',
  primaryOpacity: 'rgba(0, 132, 248, 0.05)',
  darkOpacity: 'rgba(0, 0, 0, 0.8)',
  lightOpacity: 'rgba(0, 0, 0, 0.54)',
  darkPrimaryOpacity: 'rgba(0, 132, 248, 0.24)',
  grayOpacity: 'rgba(51, 73, 94, 0.1)',
  redOpacity: 'rgba(242, 60, 6, 0.1)',
  orange: 'rgb(260,121,121)',
  transparent: 'rgba(0,0,0,0)',
};
const grayShades = {
  grey1: '#F9FCFE',
  gray2: '#4F4F4F',
  gray3: '#828282',
  grey4: '#D3D3D3',
  grey5: '#FDFDFD',
  gray6: '#EEEEEE',
  gray7: '#222222',
  gray8: '#FAFAFA',
  gray9: '#F2F3F6',
  gray10: '#F7F8FB',
  gray11: '#E9EEF2',
  gray12: '#FBFBFC',
  gray13: '#D3D6D8',
  gray14: '#F1F2F4',
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
  ...grayShades,
  ...chartColors,
};
