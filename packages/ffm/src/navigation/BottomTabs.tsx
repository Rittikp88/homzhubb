import React from 'react';
import { useTranslation } from 'react-i18next';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import Focused from '@homzhub/common/src/assets/images/homzhubLogo.svg';
import Unfocused from '@homzhub/common/src/assets/images/homzhubLogoUnfocused.svg';
import { theme } from '@homzhub/common/src/styles/theme';
import ComingSoon from '@homzhub/ffm/src/screens/Common/ComingSoon';
import MoreStack from '@homzhub/ffm/src/navigation/MoreStack';
import VisitStack from '@homzhub/ffm/src/navigation/VisitStack';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

type BottomTabNavigatorParamList = {
  [ScreenKeys.Dashboard]: undefined;
  [ScreenKeys.SiteVisits]: undefined;
  [ScreenKeys.Requests]: undefined;
  [ScreenKeys.Supplies]: undefined;
  [ScreenKeys.More]: undefined;
};

const BottomTabNavigator = createBottomTabNavigator<BottomTabNavigatorParamList>();

const BottomTabs = (): React.ReactElement => {
  const { t } = useTranslation();
  return (
    <BottomTabNavigator.Navigator
      initialRouteName={ScreenKeys.Dashboard}
      tabBarOptions={{
        activeTintColor: theme.colors.primaryColor,
        inactiveTintColor: theme.colors.darkTint7,
        style: {
          height: PlatformUtils.isIOS() ? theme.viewport.height * 0.1 : 60,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 8,
        },
      }}
    >
      <BottomTabNavigator.Screen
        name={ScreenKeys.Dashboard}
        component={ComingSoon}
        options={{
          tabBarLabel: t('assetDashboard:dashboard'),
          tabBarIcon: ({ focused }: { focused: boolean }): React.ReactElement => {
            return focused ? <Focused /> : <Unfocused />;
          },
        }}
      />
      <BottomTabNavigator.Screen
        name={ScreenKeys.SiteVisits}
        component={VisitStack}
        options={{
          tabBarLabel: t('property:siteVisits'),
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }): React.ReactElement => {
            return <Icon name={icons.visit} color={color} size={focused ? 24 : 20} />;
          },
        }}
      />
      <BottomTabNavigator.Screen
        name={ScreenKeys.Requests}
        component={ComingSoon}
        options={{
          tabBarLabel: t('assetDashboard:tickets'),
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }): React.ReactElement => {
            return <Icon name={icons.serviceRequest} color={color} size={focused ? 24 : 20} />;
          },
        }}
      />
      <BottomTabNavigator.Screen
        name={ScreenKeys.Supplies}
        component={ComingSoon}
        options={{
          tabBarLabel: t('supplies'),
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }): React.ReactElement => {
            return <Icon name={icons.home} color={color} size={focused ? 24 : 20} />;
          },
        }}
      />
      <BottomTabNavigator.Screen
        name={ScreenKeys.More}
        component={MoreStack}
        options={{
          tabBarLabel: t('assetMore:more'),
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }): React.ReactElement => {
            return <Icon name={icons.threeDots} color={color} size={focused ? 24 : 20} />;
          },
        }}
      />
    </BottomTabNavigator.Navigator>
  );
};

export default BottomTabs;
