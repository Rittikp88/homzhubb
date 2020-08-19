import React from 'react';
import { useSelector } from 'react-redux';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import GettingStarted from '@homzhub/mobile/src/screens/GettingStarted';
import OnBoarding from '@homzhub/mobile/src/screens/OnBoarding';
import { NestedNavigatorParams, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { WrapperSearchStack } from '@homzhub/mobile/src/navigation/WrapperSearchStack';
import { AuthStack, AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';

export type GuestStackNavigatorParamList = {
  [ScreensKeys.OnBoarding]: undefined;
  [ScreensKeys.GettingStarted]: undefined;
  [ScreensKeys.AuthStack]: NestedNavigatorParams<AuthStackParamList>;
  [ScreensKeys.SearchStack]: undefined;
};

const GuestStackNavigator = createStackNavigator<GuestStackNavigatorParamList>();

export function GuestStack(): React.ReactElement {
  const hasOnBoardingCompleted = useSelector(UserSelector.hasOnBoardingCompleted);

  const showOnBoardingScreen = (): React.ReactNode => {
    if (!hasOnBoardingCompleted) {
      return <GuestStackNavigator.Screen name={ScreensKeys.OnBoarding} component={OnBoarding} />;
    }
    return null;
  };

  return (
    <GuestStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {showOnBoardingScreen()}
      <GuestStackNavigator.Screen name={ScreensKeys.GettingStarted} component={GettingStarted} />
      <GuestStackNavigator.Screen name={ScreensKeys.AuthStack} component={AuthStack} />
      <GuestStackNavigator.Screen name={ScreensKeys.SearchStack} component={WrapperSearchStack} />
    </GuestStackNavigator.Navigator>
  );
}
