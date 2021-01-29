import React, { FC, useState } from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDown, useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import NavLogo from '@homzhub/common/src/assets/images/appLogoWithName.svg';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { StickyHeader } from '@homzhub/web/src/components';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const LandingNavBar: FC = () => {
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isLaptop = useUp(deviceBreakpoint.LAPTOP);
  const styles = navBarStyle(isMobile);

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
            <Button type="text" icon={icons.hamburgerMenu} iconSize={30} iconColor={theme.colors.darkTint2} />
          )}
        </View>
      </View>
    </StickyHeader>
  );
};

const RenderNavItems = (): React.ReactElement => {
  const [isSelected, setIsSelected] = useState(-1);
  const { t } = useTranslation(LocaleConstants.namespacesKey.landing);
  const history = useHistory();
  const navItems = [
    {
      text: t('home'),
      url: RouteNames.publicRoutes.APP_BASE,
    },
    {
      text: t('featuredProperties'),
      url: RouteNames.publicRoutes.FEATURED,
    },
    {
      text: t('pricing'),
      url: RouteNames.publicRoutes.PRICING,
    },
  ];
  const onNavItemPress = (index: number): void => {
    setIsSelected(index);
    NavigationUtils.navigate(history, { path: navItems[index].url });
  };
  return (
    <>
      {navItems.map((item, index) => (
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
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = navItemStyle(isMobile, isActive);
  const itemPressed = (): void => {
    onNavItemPress(index);
  };
  return (
    <TouchableOpacity onPress={itemPressed} style={styles.container}>
      <Typography variant="text" size="small" fontWeight="regular" minimumFontScale={0.5} style={styles.text}>
        {text}
      </Typography>
      <Divider containerStyles={styles.activeNavItemBar} />
    </TouchableOpacity>
  );
};

interface INavBarStyle {
  container: ViewStyle;
  subContainer: ViewStyle;
  content: ViewStyle;
  logo: ViewStyle;
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
    content: {
      width: isMobile ? theme.layout.dashboardMobileWidth : theme.layout.dashboardWidth,
      flexDirection: 'row',
      paddingVertical: 24,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      marginRight: 16,
    },
  });

interface INavItemStyle {
  container: ViewStyle;
  activeNavItemBar: ViewStyle;
  text: TextStyle;
}

const navItemStyle = (isMobile: boolean, isActive: boolean): StyleSheet.NamedStyles<INavItemStyle> =>
  StyleSheet.create<INavItemStyle>({
    container: {
      marginTop: 8,
      marginLeft: isMobile ? 0 : 30,
      alignItems: 'center',
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
  });

export default LandingNavBar;
