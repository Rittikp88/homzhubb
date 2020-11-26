import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { MainRouter } from '@homzhub/web/src/router/MainRouter';
import { theme } from '@homzhub/common/src/styles/theme';
import { Navbar, NavigationInfo } from '@homzhub/web/src/components';
import Footer from '@homzhub/web/src/screens/AppLayout/Footer';
import SideMenu from '@homzhub/web/src/screens/dashboard/components/SideMenu';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const AppLayout: FC = () => {
  const isTablet = useDown(deviceBreakpoint.TABLET);
  return (
    <View style={styles.container}>
      <Navbar />
      <View>
        <NavigationInfo />
        <View style={styles.mainContent}>
          {!isTablet && <SideMenu onItemClick={FunctionUtils.noop} />}
          <MainRouter />
        </View>
        <Footer />
      </View>
    </View>
  );
};

export default AppLayout;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  mainContent: {
    width: '90vw',
    flexDirection: 'row',
    alignSelf: 'center',
    maxWidth: '1280px',
  },
});
