import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import AssetDescription from '@homzhub/mobile/src/screens/PropertySearch/AssetDescription';
import ContactForm from '@homzhub/mobile/src/screens/PropertySearch/ContactForm';
import PropertySearchScreen from '@homzhub/mobile/src/screens/PropertySearch/PropertySearchScreen';
import PropertySearchLanding from '@homzhub/mobile/src/screens/PropertySearch/PropertySearchLanding';
import PropertyFilters from '@homzhub/mobile/src/screens/PropertySearch/PropertyFilters';
import {
  ScreensKeys,
  IAssetDescriptionProps,
  IContactProps,
  NestedNavigatorParams,
} from '@homzhub/mobile/src/navigation/interfaces';
import { AuthStack, AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';

export type SearchStackParamList = {
  [ScreensKeys.PropertySearchLanding]: undefined;
  [ScreensKeys.PropertySearchScreen]: undefined;
  [ScreensKeys.PropertyAssetDescription]: IAssetDescriptionProps;
  [ScreensKeys.PropertyFilters]: undefined;
};

export type RootStackParamList = {
  [ScreensKeys.SearchStack]: NestedNavigatorParams<SearchStackParamList>;
  [ScreensKeys.ContactForm]: IContactProps;
  [ScreensKeys.AuthStack]: NestedNavigatorParams<AuthStackParamList>;
};

const SearchStackNavigator = createStackNavigator<SearchStackParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

export const SearchStack = (): React.ReactElement => {
  return (
    <SearchStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SearchStackNavigator.Screen name={ScreensKeys.PropertySearchLanding} component={PropertySearchLanding} />
      <SearchStackNavigator.Screen name={ScreensKeys.PropertySearchScreen} component={PropertySearchBottomTabs} />
      <SearchStackNavigator.Screen name={ScreensKeys.PropertyAssetDescription} component={AssetDescription} />
      <SearchStackNavigator.Screen name={ScreensKeys.PropertyFilters} component={PropertyFilters} />
    </SearchStackNavigator.Navigator>
  );
};

export const RootSearchStackNavigator = (): React.ReactElement => {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      mode="modal"
    >
      <RootStack.Screen name={ScreensKeys.SearchStack} component={SearchStack} />
      <RootStack.Screen name={ScreensKeys.ContactForm} component={ContactForm} />
      <RootStack.Screen name={ScreensKeys.AuthStack} component={AuthStack} />
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
