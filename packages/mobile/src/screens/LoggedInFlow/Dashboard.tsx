import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LoggedInBottomTabNavigatorParamList } from '@homzhub/mobile/src/navigation/AppNavigator';

type libraryProps = NavigationScreenProps<LoggedInBottomTabNavigatorParamList, ScreensKeys.Dashboard>;
type Props = libraryProps;

export class Dashboard extends React.PureComponent<Props, {}> {
  public render = (): React.ReactElement => {
    return (
      <View style={styles.screen}>
        <Text>Dashboard Screen</Text>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
