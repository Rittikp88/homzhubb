import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { SideMenu } from '@homzhub/web/src/screens/dashboard/components/SideMenu';

class Dashboard extends React.PureComponent {
  public render(): React.ReactNode {
    return (
      <View style={styles.container}>
        <SideMenu onItemClick={this.sideMenuItemClicked} />
      </View>
    );
  }

  private sideMenuItemClicked = (ItemId: number): void => {
    // TODO: side menu item click handler
  };
}

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 'fit-content',
    flexDirection: 'row',
    padding: 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
