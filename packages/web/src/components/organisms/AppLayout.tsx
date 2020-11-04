import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { MainRouter } from '@homzhub/web/src/router/MainRouter';
import Footer from '@homzhub/web/src/components/organisms/Footer';
import SideMenu from '@homzhub/web/src/screens/dashboard/components/SideMenu';

class AppLayout extends React.PureComponent {
  public render(): React.ReactNode {
    return (
      <View style={styles.container}>
        <View style={styles.mainContent}>
          <SideMenu onItemClick={this.sideMenuItemClicked} />
          <MainRouter />
        </View>
        <Footer />
      </View>
    );
  }

  private sideMenuItemClicked = (ItemId: number): void => {
    // TODO: side menu item click handler
  };
}

export default AppLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100vh',
    backgroundColor: theme.colors.background,
  },
  mainContent: {
    width: '90vw',
    flexDirection: 'row',
    alignSelf: 'center',
    maxWidth: '1280px',
  },
});
