import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components';
import { TabKeys } from '@homzhub/mobile/src/navigation/interfaces';

const TabNavigator = createBottomTabNavigator<AppTabParamList>();
export type AppTabParamList = {
  [TabKeys.Home]: undefined;
  [TabKeys.Profile]: undefined;
};

const dummy = (): React.ReactElement => {
  return (
    <View style={styles.container}>
      <Text type="regular" textType="regular">
        Welcome to Homzhub
      </Text>
    </View>
  );
};

export const AppNavigator = (): React.ReactElement => {
  return (
    <TabNavigator.Navigator>
      <TabNavigator.Screen name={TabKeys.Home} component={dummy} />
      <TabNavigator.Screen name={TabKeys.Profile} component={dummy} />
    </TabNavigator.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
});
