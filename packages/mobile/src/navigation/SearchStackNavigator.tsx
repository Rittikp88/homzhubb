import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { ScreensKeys, IAssetDescriptionProps, IContactProps } from '@homzhub/mobile/src/navigation/interfaces';
import AssetDescription from '@homzhub/mobile/src/screens/Asset/Search/AssetDescription';
import ContactForm from '@homzhub/mobile/src/screens/Asset/Search/ContactForm';
import AssetSearchScreen from '@homzhub/mobile/src/screens/Asset/Search/AssetSearchScreen';
import AssetSearchLanding from '@homzhub/mobile/src/screens/Asset/Search/AssetSearchLanding';
import AssetFilters from '@homzhub/mobile/src/screens/Asset/Search/AssetFilters';
import { Saved } from '@homzhub/mobile/src/screens/Asset/Search/Saved';
import { Compare } from '@homzhub/mobile/src/screens/Asset/Search/Compare';
import { Tenancies } from '@homzhub/mobile/src/screens/Asset/Search/Tenancies';
import { AssetSearchMore } from '@homzhub/mobile/src/screens/Asset/Search/More';

export type RootStackParamList = {
  [ScreensKeys.PropertySearchLanding]: undefined;
  [ScreensKeys.PropertySearchScreen]: undefined;
  [ScreensKeys.PropertyAssetDescription]: IAssetDescriptionProps;
  [ScreensKeys.PropertyFilters]: undefined;
  [ScreensKeys.ContactForm]: IContactProps;
};

const RootStack = createStackNavigator<RootStackParamList>();

export const RootSearchStackNavigator = (): React.ReactElement => {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      mode="modal"
    >
      <RootStack.Screen name={ScreensKeys.PropertySearchLanding} component={AssetSearchLanding} />
      <RootStack.Screen name={ScreensKeys.PropertySearchScreen} component={PropertySearchBottomTabs} />
      <RootStack.Screen name={ScreensKeys.PropertyAssetDescription} component={AssetDescription} />
      <RootStack.Screen name={ScreensKeys.PropertyFilters} component={AssetFilters} />
      <RootStack.Screen name={ScreensKeys.ContactForm} component={ContactForm} />
    </RootStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

export const PropertySearchBottomTabs = (): React.ReactElement => {
  return (
    <Tab.Navigator
      initialRouteName="Search"
      tabBarOptions={{
        activeTintColor: theme.colors.primaryColor,
      }}
    >
      <Tab.Screen
        name="Search"
        component={AssetSearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.search} color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={Saved}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.heartOutline} color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Compare"
        component={Compare}
        options={{
          tabBarLabel: 'Compare',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.compare} color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Tenancies"
        component={Tenancies}
        options={{
          tabBarLabel: 'Tenancies',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.homeOutline} color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={AssetSearchMore}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.threeDots} color={color} size={22} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
