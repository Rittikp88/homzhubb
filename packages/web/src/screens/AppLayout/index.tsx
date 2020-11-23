import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { MainRouter } from '@homzhub/web/src/router/MainRouter';
import { theme } from '@homzhub/common/src/styles/theme';
import Footer from '@homzhub/web/src/screens/AppLayout/Footer';
import SideMenu from '@homzhub/web/src/screens/dashboard/components/SideMenu';
import Navbar from '@homzhub/web/src/components/molecules/Navbar';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const AppLayout: FC = () => {
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const sideMenuItemClicked = (ItemId: number): void => {
    // TODO: side menu item click handler
  };
  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.mainContent}>
        {!isTablet && <SideMenu onItemClick={sideMenuItemClicked} />}
        <MainRouter />
      </View>
      <Footer />
    </View>
  );
};

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
