import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import AssetDescription from '@homzhub/mobile/src/screens/AssetDescription';
import PropertySearchScreen from '@homzhub/mobile/src/screens/PropertySearch/PropertySearchScreen';
import PropertySearchLanding from '@homzhub/mobile/src/screens/PropertySearch/PropertySearchLanding';
import PropertyFilters from '@homzhub/mobile/src/screens/PropertySearch/PropertyFilters';
import { ScreensKeys, IAssetDescriptionProps } from '@homzhub/mobile/src/navigation/interfaces';

const SearchStack = createStackNavigator<SearchStackParamList>();

export type SearchStackParamList = {
  [ScreensKeys.PropertySearchLanding]: undefined;
  [ScreensKeys.PropertySearchScreen]: undefined;
  [ScreensKeys.PropertyFilters]: undefined;
  [ScreensKeys.PropertyAssetDescription]: IAssetDescriptionProps;
};

export const SearchStackScreen = (): React.ReactElement => {
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SearchStack.Screen name={ScreensKeys.PropertySearchLanding} component={PropertySearchLanding} />
      <SearchStack.Screen name={ScreensKeys.PropertySearchScreen} component={PropertySearchBottomTabs} />
      <SearchStack.Screen name={ScreensKeys.PropertyAssetDescription} component={AssetDescription} />
      <SearchStack.Screen name={ScreensKeys.PropertyFilters} component={PropertyFilters} />
    </SearchStack.Navigator>
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
        component={PropertySearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.search} color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={PropertySearchScreen}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.heartOutline} color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Compare"
        component={PropertySearchScreen}
        options={{
          tabBarLabel: 'Compare',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.compare} color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Tenancies"
        component={PropertySearchScreen}
        options={{
          tabBarLabel: 'Tenancies',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.homeOutline} color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={PropertySearchScreen}
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
