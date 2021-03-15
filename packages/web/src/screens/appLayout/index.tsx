import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { History } from 'history';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { compareUrlsWithPathname } from '@homzhub/web/src/utils/LayoutUtils';
import { MainRouter } from '@homzhub/web/src/router/MainRouter';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import { Navbar, NavigationInfo } from '@homzhub/web/src/components';
import Footer from '@homzhub/web/src/screens/appLayout/Footer';
import SideMenu from '@homzhub/web/src/screens/dashboard/components/SideMenu';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { AppLayoutContext } from '@homzhub/web/src/screens/appLayout/AppLayoutContext';

interface IProps {
  location: LocationParams;
  history: History;
}

type LocationParams = { pathname: string };

const AppLayout: FC<IProps> = (props: IProps) => {
  const { location, history } = props;
  const { pathname } = location;
  const { protectedRoutes } = RouteNames;
  const { DASHBOARD, FINANCIALS } = protectedRoutes;
  const isSideMenuVisible = compareUrlsWithPathname([DASHBOARD, FINANCIALS], pathname);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const [goBackClicked, setGoBackClicked] = useState(false);
  return (
    <AppLayoutContext.Provider value={{ goBackClicked, setGoBackClicked }}>
      <View style={styles.container}>
        <Navbar history={history} location={location} />
        <NavigationInfo />
        <View>
          <View style={[styles.mainContent, isMobile && styles.mainContentMobile]}>
            {!isTablet && isSideMenuVisible && <SideMenu onItemClick={FunctionUtils.noop} />}
            <MainRouter />
          </View>
          <Footer />
        </View>
      </View>
    </AppLayoutContext.Provider>
  );
};

export default AppLayout;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  mainContent: {
    width: theme.layout.dashboardWidth,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  mainContentMobile: {
    width: theme.layout.dashboardMobileWidth,
  },
});
