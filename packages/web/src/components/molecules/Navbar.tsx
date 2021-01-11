import React, { FC, useState } from 'react';
import { ImageStyle, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import NavLogo from '@homzhub/common/src/assets/images/appLogoWithName.svg';
import HomzhubLogo from '@homzhub/common/src/assets/images/homzhubLogo.svg';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { SearchField } from '@homzhub/web/src/components/atoms/SearchField';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { Button } from '@homzhub/common/src/components/atoms/Button';

interface INavItem {
  icon: string;
  text: string;
  index: number;
  isActive: boolean;
  onNavItemPress: (index: number) => void;
}

const NavItem: FC<INavItem> = ({ icon, text, index, isActive, onNavItemPress }: INavItem) => {
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const navItemStyles = navItemStyle(isMobile, isActive);
  const { darkTint3, primaryColor } = theme.colors;
  const itemPressed = (): void => {
    onNavItemPress(index);
  };
  return (
    <TouchableOpacity onPress={itemPressed} style={navItemStyles.container}>
      <Icon name={icon} size={22} color={isActive ? primaryColor : darkTint3} style={navItemStyles.icon} />
      {!isTablet && (
        <Label type="large" textType="regular" minimumFontScale={0.5} style={navItemStyles.text}>
          {text}
        </Label>
      )}
    </TouchableOpacity>
  );
};

const Navbar: FC = () => {
  const { t } = useTranslation();
  const isDesktop = useDown(deviceBreakpoint.DESKTOP);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const [isSelected, setIsSelected] = useState(-1);
  const [searchText, setSearchText] = useState('');
  const navBarStyles = navBarStyle(isMobile, isTablet, isDesktop);
  const history = useHistory();
  const navItems = [
    {
      icon: icons.headset,
      text: t('assetMore:support'),
      url: RouteNames.protectedRoutes.HELP_SUPPORT,
    },
    {
      icon: icons.refer,
      text: t('assetMore:refer'),
      url: RouteNames.protectedRoutes.REFER_EARN,
    },
  ];
  const onNavItemPress = (index: number): void => {
    setIsSelected(index);
    NavigationUtils.navigate(history, { path: navItems[index].url });
  };
  const onChange = (text: string): void => {
    setSearchText(text);
  };
  return (
    <View style={navBarStyles.container}>
      <View style={navBarStyles.subContainer}>
        {isTablet && (
          <Button
            type="primary"
            icon={icons.hamburgerMenu}
            iconSize={22}
            iconColor={theme.colors.darkTint6}
            containerStyle={navBarStyles.menuIc}
          />
        )}
        <View style={navBarStyles.logo}>{isMobile ? <HomzhubLogo /> : <NavLogo />}</View>
        <View style={navBarStyles.search}>
          {!isTablet ? (
            <SearchField placeholder={t('property:searchInWeb')} value={searchText} updateValue={onChange} />
          ) : (
            <Button
              type="primary"
              icon={icons.search}
              iconSize={22}
              iconColor={theme.colors.darkTint6}
              containerStyle={navBarStyles.searchIc}
              testID="btnSearch"
            />
          )}
        </View>
        <View style={navBarStyles.itemsContainer}>
          {navItems.map((item, index) => (
            <NavItem
              key={item.icon}
              icon={item.icon}
              text={item.text}
              isActive={isSelected === index}
              onNavItemPress={onNavItemPress}
              index={index}
            />
          ))}
          <View style={navBarStyles.items}>
            {/** TODO: Replace name once login API integrated * */}
            <Avatar fullName={t('User')} isOnlyAvatar />
          </View>
        </View>
      </View>
    </View>
  );
};

interface INavBarStyle {
  container: ViewStyle;
  subContainer: ViewStyle;
  logo: ViewStyle;
  search: ViewStyle;
  itemsContainer: ViewStyle;
  items: ViewStyle;
  menuIc: ViewStyle;
  searchIc: ViewStyle;
}

const navBarStyle = (isMobile: boolean, isTablet: boolean, isDesktop: boolean): StyleSheet.NamedStyles<INavBarStyle> =>
  StyleSheet.create<INavBarStyle>({
    container: {
      width: '100%',
      backgroundColor: theme.colors.white,
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOpacity: 0.04,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 4,
      },
    },
    subContainer: {
      width: isMobile ? theme.layout.dashboardMobileWidth : theme.layout.dashboardWidth,
      flexDirection: 'row',
      paddingVertical: 4,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      marginRight: 16,
    },
    search: {
      flex: 1,
      maxWidth: 403,
      marginRight: isTablet ? 0 : isDesktop ? '4%' : '10%',
      marginLeft: isTablet ? 0 : isDesktop ? '2%' : '7%',
      alignItems: isTablet ? 'flex-end' : undefined,
    },
    itemsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    items: {
      marginLeft: isMobile ? 0 : 30,
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuIc: {
      marginRight: isMobile ? 8 : 24,
      backgroundColor: theme.colors.secondaryColor,
    },
    searchIc: {
      marginRight: 12,
      backgroundColor: theme.colors.secondaryColor,
    },
  });

interface INavItemStyle {
  container: ViewStyle;
  text: TextStyle;
  icon: ImageStyle;
}

const navItemStyle = (isMobile: boolean, isActive: boolean): StyleSheet.NamedStyles<INavItemStyle> =>
  StyleSheet.create<INavItemStyle>({
    container: {
      marginLeft: isMobile ? 0 : 30,
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      color: isActive ? theme.colors.primaryColor : theme.colors.darkTint4,
    },
    icon: {
      margin: 12,
    },
  });

export default Navbar;
