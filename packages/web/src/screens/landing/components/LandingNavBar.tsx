import React, { FC, useState } from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown, useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { LinkingService, URLs } from '@homzhub/web/src/services/LinkingService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import NavLogo from '@homzhub/common/src/assets/images/appLogoWithName.svg';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { StickyHeader } from '@homzhub/web/src/components';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import SideBar from '@homzhub/web/src/components/molecules/Drawer/BurgerMenu';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { icons } from '@homzhub/common/src/assets/icon';

const LandingNavBar: FC = () => {
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isLaptop = useUp(deviceBreakpoint.LAPTOP);
  const styles = navBarStyle(isMobile);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const onMenuClose = (): void => {
    setIsMenuOpen(false);
  };
  const onMenuOpen = (): void => {
    setIsMenuOpen(true);
  };
  return (
    <StickyHeader>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.subContainer}>
            <View style={styles.logo}>
              <NavLogo />
            </View>
            {isLaptop && <RenderNavItems />}
          </View>
          {isLaptop ? (
            <View style={styles.subContainer}>
              <Button type="text" fontType="regular" title={t('login')} />
              <Button type="primary" title={t('signUp')} />
            </View>
          ) : (
            <Button
              type="text"
              icon={icons.hamburgerMenu}
              iconSize={30}
              iconColor={theme.colors.darkTint2}
              onPress={onMenuOpen}
              containerStyle={styles.hamburgerMenu}
            />
          )}
        </View>
      </View>
      {!isLaptop && (
        <SideBar open={isMenuOpen} onClose={onMenuClose}>
          <RenderNavItems />
        </SideBar>
      )}
    </StickyHeader>
  );
};

const RenderNavItems = (): React.ReactElement => {
  const [isSelected, setIsSelected] = useState(0);
  const { t } = useTranslation(LocaleConstants.namespacesKey.landing);
  const isLaptop = useUp(deviceBreakpoint.LAPTOP);
  const styles = navItemStyle(isLaptop, false);
  const navItems = [
    {
      text: t('home'),
      url: RouteNames.publicRoutes.APP_BASE,
    },
    {
      text: t('featuredProperties'),
      url: URLs.featuredProperties,
    },
    {
      text: t('pricing'),
      url: RouteNames.publicRoutes.PRICING,
    },
  ];
  const login = [
    {
      text: t('common:login'),
      url: RouteNames.publicRoutes.LOGIN,
    },
    {
      text: t('common:signUp'),
      url: RouteNames.publicRoutes.SIGNUP,
    },
  ];
  const menuItems = isLaptop ? navItems : [...navItems, ...login];
  const onNavItemPress = (index: number): void => {
    setIsSelected(index);
    if (navItems[index].text === t('featuredProperties')) {
      LinkingService.redirect(URLs.featuredPropertiesSearch);
    }
    // TODO: uncomment when links have respective component
    //  NavigationUtils.navigate(history, { path: navItems[index].url });
  };
  return (
    <>
      {!isLaptop && (
        <View style={styles.container}>
          <Typography variant="text" size="small" fontWeight="regular" style={styles.header}>
            {t('menu')}
          </Typography>
        </View>
      )}
      {menuItems.map((item, index) => (
        <NavItem
          key={item.text}
          text={item.text}
          isActive={isSelected === index}
          onNavItemPress={onNavItemPress}
          index={index}
        />
      ))}
    </>
  );
};
interface INavItem {
  text: string;
  index: number;
  isActive: boolean;
  onNavItemPress: (index: number) => void;
}
const NavItem: FC<INavItem> = ({ text, index, isActive, onNavItemPress }: INavItem) => {
  const isLaptop = useUp(deviceBreakpoint.LAPTOP);
  const styles = navItemStyle(isLaptop, isActive);
  const itemPressed = (): void => {
    onNavItemPress(index);
  };
  return (
    <TouchableOpacity onPress={itemPressed} style={styles.container}>
      <Typography
        variant="text"
        size="small"
        fontWeight="regular"
        minimumFontScale={0.5}
        style={[styles.text, !isLaptop && styles.mobileText]}
      >
        {text}
      </Typography>
      <Divider containerStyles={[styles.activeNavItemBar, !isLaptop && styles.mobileActiveItem]} />
    </TouchableOpacity>
  );
};

interface INavBarStyle {
  container: ViewStyle;
  subContainer: ViewStyle;
  content: ViewStyle;
  logo: ViewStyle;
  hamburgerMenu: ViewStyle;
}

const navBarStyle = (isMobile: boolean): StyleSheet.NamedStyles<INavBarStyle> =>
  StyleSheet.create<INavBarStyle>({
    container: {
      width: '100%',
      backgroundColor: theme.colors.white,
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 4,
      },
    },
    subContainer: {
      flexDirection: 'row',
    },
    hamburgerMenu: {
      marginRight: 16,
    },
    content: {
      width: isMobile ? theme.layout.dashboardMobileWidth : theme.layout.dashboardWidth,
      flexDirection: 'row',
      paddingVertical: 24,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      marginRight: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
interface INavItemStyle {
  container: ViewStyle;
  activeNavItemBar: ViewStyle;
  mobileActiveItem: ViewStyle;
  text: TextStyle;
  mobileText: TextStyle;
  header: ViewStyle;
}
const navItemStyle = (isLaptop: boolean, isActive: boolean): StyleSheet.NamedStyles<INavItemStyle> =>
  StyleSheet.create<INavItemStyle>({
    container: {
      marginTop: isLaptop ? 8 : 0,
      marginLeft: !isLaptop ? 0 : 30,
      alignItems: isLaptop ? 'center' : 'flex-start',
    },
    text: {
      color: isActive ? theme.colors.primaryColor : theme.colors.darkTint4,
    },
    activeNavItemBar: {
      width: '100%',
      marginTop: 8,
      borderColor: theme.colors.primaryColor,
      opacity: isActive ? 1 : 0,
    },
    mobileActiveItem: {
      borderColor: theme.colors.darkTint12,
      opacity: 1,
    },
    header: {
      backgroundColor: theme.colors.gray6,
      color: theme.colors.gray7,
      lineHeight: 80,
      paddingLeft: 18,
      textTransform: 'uppercase',
      letterSpacing: 1,
      width: '100%',
      alignItems: 'center',
    },
    mobileText: {
      lineHeight: 64,
      height: 64,
      paddingLeft: 16,
      color: theme.colors.darkTint4,
    },
  });
export default React.memo(LandingNavBar);
