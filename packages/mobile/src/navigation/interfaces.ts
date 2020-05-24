import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';

// Route keys
export enum ScreensKeys {
  OnBoarding = 'OnBoarding',
  Home = 'Home',
  GettingStarted = 'Getting Started',
  SignUp = 'SignUp',
  OTP = 'OTP',
  MobileVerification = 'Mobile Verification',
  Login = 'Login',
  EmailLogin = 'Email Login',
  ForgotPassword = 'Forgot Password',
  ResetPassword = 'Reset Password',
  SuccessResetPassword = 'Success Reset Password',
}

// Tab keys
export enum TabKeys {
  Home = 'Home',
  Profile = 'Profile',
}

// To be used as Titles in tab bar
export const ScreensTitles = {
  [ScreensKeys.Home]: 'Home',
  [ScreensKeys.SignUp]: 'Sign Up',
};

export enum OtpNavTypes {
  Login = 'Login',
  SignUp = 'SignUp',
  SocialMedia = 'SocialMedia',
}

export type NavigationScreenProps<S extends Record<string, object | undefined>, T extends keyof S> = {
  navigation: StackNavigationProp<S, T>;
  route: RouteProp<S, T>;
};

export interface IOtpNavProps {
  type: OtpNavTypes;
  title: string;
  countryCode: string;
  phone: string;
  userData?: any;
  ref: FormTextInput;
}

export interface IVerificationProps {
  title: string;
  subTitle: string;
  icon: string;
  buttonTitle: string;
  message?: string;
}
