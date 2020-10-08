import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import Documents from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/Documents';
import DummyView from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/DummyView';
import NotificationTab from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/NotificationTab';
import PropertyVisits from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/PropertyVisits';
import TenantHistoryScreen from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/TenantHistoryScreen';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

export type TopTabNavigatorParamList = {
  [ScreensKeys.NotificationTab]: undefined;
  [ScreensKeys.TicketsTab]: undefined;
  [ScreensKeys.OffersTab]: undefined;
  [ScreensKeys.ReviewsTab]: undefined;
  [ScreensKeys.SiteVisitsTab]: undefined;
  [ScreensKeys.FinancialsTab]: undefined;
  [ScreensKeys.MessagesTab]: undefined;
  [ScreensKeys.DocumentsTab]: undefined;
  [ScreensKeys.TenantHistoryTab]: undefined;
  [ScreensKeys.DetailsTab]: undefined;
};

const TopTabNavigator = createMaterialTopTabNavigator<TopTabNavigatorParamList>();

export const TopTabs = (): React.ReactElement => {
  return (
    <TopTabNavigator.Navigator
      initialRouteName={ScreensKeys.NotificationTab}
      style={styles.container}
      lazy
      initialLayout={theme.viewport}
      sceneContainerStyle={styles.sceneContainer}
      tabBarOptions={{
        scrollEnabled: true,
        showIcon: true,
        activeTintColor: theme.colors.blue,
        inactiveTintColor: theme.colors.darkTint3,
        labelStyle: { textTransform: 'none', fontSize: 14 },
      }}
    >
      <TopTabNavigator.Screen
        name={ScreensKeys.NotificationTab}
        component={NotificationTab}
        options={{
          tabBarLabel: Tabs.NOTIFICATIONS,
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.alert} color={color} size={22} />
          ),
        }}
      />
      <TopTabNavigator.Screen
        name={ScreensKeys.TicketsTab}
        component={DummyView}
        options={{
          tabBarLabel: Tabs.TICKETS,
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.headset} color={color} size={22} />
          ),
        }}
      />
      <TopTabNavigator.Screen
        name={ScreensKeys.OffersTab}
        component={DummyView}
        options={{
          tabBarLabel: Tabs.OFFERS,
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.offers} color={color} size={22} />
          ),
        }}
      />
      <TopTabNavigator.Screen
        name={ScreensKeys.ReviewsTab}
        component={DummyView}
        options={{
          tabBarLabel: Tabs.REVIEWS,
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.reviews} color={color} size={22} />
          ),
        }}
      />
      <TopTabNavigator.Screen
        name={ScreensKeys.SiteVisitsTab}
        component={PropertyVisits}
        options={{
          tabBarLabel: Tabs.SITE_VISITS,
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => {
            return <Icon name={icons.watch} color={color} size={22} />;
          },
        }}
      />
      <TopTabNavigator.Screen
        name={ScreensKeys.FinancialsTab}
        component={DummyView}
        options={{
          tabBarLabel: Tabs.FINANCIALS,
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => {
            return <Icon name={icons.financials} color={color} size={22} />;
          },
        }}
      />
      <TopTabNavigator.Screen
        name={ScreensKeys.MessagesTab}
        component={DummyView}
        options={{
          tabBarLabel: Tabs.MESSAGES,
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => {
            return <Icon name={icons.mail} color={color} size={22} />;
          },
        }}
      />
      <TopTabNavigator.Screen
        name={ScreensKeys.DocumentsTab}
        component={Documents}
        options={{
          tabBarLabel: Tabs.DOCUMENTS,
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => {
            return <Icon name={icons.documents} color={color} size={22} />;
          },
        }}
      />
      <TopTabNavigator.Screen
        name={ScreensKeys.TenantHistoryTab}
        component={TenantHistoryScreen}
        options={{
          tabBarLabel: Tabs.TENANT_HISTORY,
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => {
            return <Icon name={icons.history} color={color} size={22} />;
          },
        }}
      />
      <TopTabNavigator.Screen
        name={ScreensKeys.DetailsTab}
        component={DummyView}
        options={{
          tabBarLabel: Tabs.DETAILS,
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => {
            return <Icon name={icons.detail} color={color} size={22} />;
          },
        }}
      />
    </TopTabNavigator.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    marginTop: 14,
  },
  sceneContainer: {
    backgroundColor: theme.colors.white,
  },
});
