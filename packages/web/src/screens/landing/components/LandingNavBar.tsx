import React, { FC, useState, useEffect } from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useDown, useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { AppModes, ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { URLs } from '@homzhub/web/src/services/LinkingService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import NavLogo from '@homzhub/common/src/assets/images/appLogoWithName.svg';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { StickyHeader } from '@homzhub/web/src/components';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import SideBar from '@homzhub/web/src/components/molecules/Drawer/BurgerMenu';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  featuredPropertiesRef?: any;
  plansSectionRef?: any;
  storeLinksSectionRef?: any;
}

const LandingNavBar: FC<IProps> = (props: IProps) => {
  const [scrollLength, setScrollLength] = useState(0);
  useEffect(() => {
    if (scrollLength > 0) {
      window.scrollTo({
        top: scrollLength,
        left: 0,
        behavior: 'smooth',
      });
    }
    setScrollLength(0);
  }, [scrollLength]);
  const history = useHistory();
  const { featuredPropertiesRef, plansSectionRef, storeLinksSectionRef } = props;
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isLaptop = useUp(deviceBreakpoint.LAPTOP);
  const styles = navBarStyle(isMobile);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isReleaseMode = ConfigHelper.getAppMode() !== AppModes.DEBUG;
  const onMenuClose = (): void => {
    setIsMenuOpen(false);
  };
  const onMenuOpen = (): void => {
    setIsMenuOpen(true);
  };
  const navigateToScreen = (path: string): void => {
    NavigationUtils.navigate(history, { path });
  };
  const onButtonScrollPress = (): void => {
    if (storeLinksSectionRef) {
      storeLinksSectionRef.measure((x: number, y: number) => {
        setScrollLength(Math.floor(y));
      });
    }
  };
  return (
    <>
      <StickyHeader>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.subContainer}>
              <TouchableOpacity onPress={(): void => navigateToScreen(RouteNames.publicRoutes.APP_BASE)}>
                <View style={styles.logo}>
                  <NavLogo />
                </View>
              </TouchableOpacity>
              {isLaptop && (
                <RenderNavItems featuredPropertiesRef={featuredPropertiesRef} plansSectionRef={plansSectionRef} />
              )}
            </View>
            {isLaptop ? (
              <View style={styles.subContainer}>
                <Button
                  type="primary"
                  textType="label"
                  textSize="large"
                  title={t('landing:downloadApp')}
                  containerStyle={styles.downloadButton}
                  titleStyle={styles.downloadButtonTitle}
                  onPress={onButtonScrollPress}
                />
                <Button disabled={isReleaseMode} type="text" fontType="regular" title={t('login')} />
                <Button disabled={isReleaseMode} type="primary" title={t('signUp')} />
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
      </StickyHeader>
      {!isLaptop && (
        <SideBar open={isMenuOpen} onClose={onMenuClose}>
          <RenderNavItems
            featuredPropertiesRef={featuredPropertiesRef}
            plansSectionRef={plansSectionRef}
            storeLinksSectionRef={storeLinksSectionRef}
          />
        </SideBar>
      )}
    </>
  );
};
const RenderNavItems: FC<IProps> = (props: IProps) => {
  const { featuredPropertiesRef, plansSectionRef, storeLinksSectionRef } = props;
  const [isSelected, setIsSelected] = useState(0);
  const [scrollLength, setScrollLength] = useState(0);

  // To scroll to the appropriate section when clicked.
  useEffect(() => {
    if (scrollLength > 0) {
      window.scrollTo({
        top: scrollLength,
        left: 0,
        behavior: 'smooth',
      });
    }
    setScrollLength(0);
  }, [scrollLength]);

  const { t } = useTranslation(LocaleConstants.namespacesKey.landing);
  const isLaptop = useUp(deviceBreakpoint.LAPTOP);
  const styles = navItemStyle(isLaptop, false);
  const isReleaseMode = ConfigHelper.getAppMode() !== AppModes.DEBUG;
  const navItems = [
    {
      text: t('featuredProperties'),
      url: URLs.featuredProperties,
      disabled: false,
    },
    {
      text: t('membershipPlans'),
      url: RouteNames.publicRoutes.PRICING,
      disabled: false,
    },
  ];
  const mobileItems = [
    {
      text: t('landing:downloadApp'),
      disabled: false,
    },
  ];
  const login = [
    {
      text: t('common:login'),
      url: RouteNames.publicRoutes.LOGIN,
      disabled: isReleaseMode,
    },
    {
      text: t('common:signUp'),
      url: RouteNames.publicRoutes.SIGNUP,
      disabled: isReleaseMode,
    },
  ];
  const menuItems = isLaptop ? navItems : [...navItems, ...mobileItems, ...login];

  const onNavItemPress = (index: number): void => {
    setIsSelected(index);
    if (menuItems[index].text === t('featuredProperties')) {
      if (featuredPropertiesRef) {
        featuredPropertiesRef.measure((x: number, y: number) => {
          setScrollLength(Math.floor(y));
        });
      }
    }
    if (menuItems[index].text === t('membershipPlans')) {
      if (plansSectionRef) {
        plansSectionRef.measure((x: number, y: number) => {
          setScrollLength(Math.floor(y));
        });
      }
    }
    if (menuItems[index].text === t('landing:downloadApp')) {
      if (storeLinksSectionRef) {
        storeLinksSectionRef.measure((x: number, y: number) => {
          setScrollLength(Math.floor(y));
        });
      }
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
          isDisabled={item.disabled}
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
  isDisabled: boolean;
  onNavItemPress: (index: number) => void;
}
const NavItem: FC<INavItem> = ({ text, index, isDisabled, isActive, onNavItemPress }: INavItem) => {
  const isLaptop = useUp(deviceBreakpoint.LAPTOP);
  const styles = navItemStyle(isLaptop, isActive);
  const itemPressed = (): void => {
    onNavItemPress(index);
  };
  return (
    <TouchableOpacity disabled={isDisabled} onPress={itemPressed} style={styles.container}>
      <Typography
        variant="text"
        size="small"
        fontWeight="regular"
        minimumFontScale={0.5}
        style={[styles.text, !isLaptop && styles.mobileText, isDisabled && styles.textDisabled]}
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
  downloadButton: ViewStyle;
  downloadButtonTitle: ViewStyle;
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
    downloadButton: {
      backgroundColor: theme.colors.blueOpacity,
    },
    downloadButtonTitle: {
      color: theme.colors.blue,
    },
  });
interface INavItemStyle {
  container: ViewStyle;
  activeNavItemBar: ViewStyle;
  mobileActiveItem: ViewStyle;
  text: TextStyle;
  mobileText: TextStyle;
  header: ViewStyle;
  textDisabled: TextStyle;
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
    textDisabled: {
      color: theme.colors.darkTint8,
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
