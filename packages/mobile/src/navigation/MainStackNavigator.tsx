import React from 'react';
import { useSelector } from 'react-redux';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import GettingStarted from '@homzhub/mobile/src/screens/GettingStarted';
import OnBoarding from '@homzhub/mobile/src/screens/OnBoarding';
import { NestedNavigatorParams, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { RootSearchStackNavigator } from '@homzhub/mobile/src/navigation/SearchStackNavigator';
import { AuthStack, AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';

export type MainStackParamList = {
  [ScreensKeys.OnBoarding]: undefined;
  [ScreensKeys.GettingStarted]: undefined;
  [ScreensKeys.AuthStack]: NestedNavigatorParams<AuthStackParamList>;
  [ScreensKeys.SearchStack]: undefined;
};

const MainStackNavigator = createStackNavigator<MainStackParamList>();

export function MainStack(): React.ReactElement {
  const hasOnBoardingCompleted = useSelector(UserSelector.hasOnBoardingCompleted);

  const showOnBoardingScreen = (): React.ReactNode => {
    if (!hasOnBoardingCompleted) {
      return <MainStackNavigator.Screen name={ScreensKeys.OnBoarding} component={OnBoarding} />;
    }
    return null;
  };

  return (
    <MainStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {showOnBoardingScreen()}
      <MainStackNavigator.Screen name={ScreensKeys.GettingStarted} component={GettingStarted} />
      <MainStackNavigator.Screen name={ScreensKeys.AuthStack} component={AuthStack} />
      <MainStackNavigator.Screen name={ScreensKeys.SearchStack} component={RootSearchStackNavigator} />
    </MainStackNavigator.Navigator>
  );
}
