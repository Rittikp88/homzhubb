import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { createStackNavigator } from '@react-navigation/stack';
import AssetDescription from '@homzhub/mobile/src/screens/AssetDescription';
import PropertySearchScreen from '@homzhub/mobile/src/screens/PropertySearch/PropertySearchScreen';

const SearchStack = createStackNavigator();

const SearchStackScreen = (): React.ReactElement => {
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SearchStack.Screen name="AssetDescription" component={AssetDescription} />
      <SearchStack.Screen name="Search" component={PropertySearchScreen} />
    </SearchStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

export const BottomTabs = (): React.ReactElement => {
  return (
    <Tab.Navigator
      initialRouteName="Search"
      tabBarOptions={{
        activeTintColor: theme.colors.primaryColor,
      }}
    >
      <Tab.Screen
        name="Search"
        component={SearchStackScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.search} color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SearchStackScreen}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.heartOutline} color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Compare"
        component={SearchStackScreen}
        options={{
          tabBarLabel: 'Compare',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.compare} color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Tenancies"
        component={SearchStackScreen}
        options={{
          tabBarLabel: 'Tenancies',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.homeOutline} color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={SearchStackScreen}
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
