import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Route keys
export enum ScreensKeys {
  OnBoarding = 'OnBoarding',
  Home = 'Home',
  GettingStarted = 'Getting Started',
}

// Tab keys
export enum TabKeys {
  Home = 'Home',
  Profile = 'Profile',
}

// To be used as Titles in tab bar
export const ScreensTitles = {
  [ScreensKeys.Home]: 'Home',
};

export type NavigationScreenProps<S extends Record<string, object | undefined>, T extends keyof S> = {
  navigation: StackNavigationProp<S, T>;
  route: RouteProp<S, T>;
};
