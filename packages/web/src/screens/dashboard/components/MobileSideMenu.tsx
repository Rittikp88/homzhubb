import React, { FC, useState } from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { IAuthCallback } from '@homzhub/common/src/modules/user/interface';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface INavProps {
  onMenuClose: () => void;
}
interface IDispatchProps {
  logout: (payload: IAuthCallback) => void;
}

type Props = INavProps & IDispatchProps;

const MobileSideMenu: FC<Props> = (props: Props) => {
  const { onMenuClose, logout } = props;
  const [isSelected, setIsSelected] = useState(0);
  const history = useHistory();
  const { t } = useTranslation(LocaleConstants.namespacesKey.landing);
  const isLaptop = useUp(deviceBreakpoint.LAPTOP);
  const styles = navItemStyle(isLaptop, false);
  const mobileItems = [
    {
      text: t('assetDashboard:dashboard'),
      url: RouteNames.protectedRoutes.DASHBOARD,
    },
    {
      text: t('assetPortfolio:portfolio'),
      url: RouteNames.protectedRoutes.PORTFOLIO,
    },
    {
      text: t('assetMore:savedProperties'),
      url: RouteNames.protectedRoutes.SAVED_PROPERTIES,
    },
    {
      text: t('assetMore:propertyVisits'),
      url: RouteNames.protectedRoutes.PROPERTY_VISITS,
    },
    {
      text: t('assetMore:valueAddedServices'),
      url: RouteNames.protectedRoutes.VALUE_ADDED_SERVICES,
    },
    {
      text: t('common:logout'),
      url: RouteNames.publicRoutes.APP_BASE,
    },
  ];
  const menuItems = [...mobileItems];
  const onNavItemPress = (index: number): void => {
    setIsSelected(index);
    if (menuItems[index].text === t('common:logout') && menuItems[index].url === RouteNames.publicRoutes.APP_BASE) {
      onMenuClose();
      logout({
        callback: (status: boolean): void => {
          if (status) {
            NavigationUtils.navigate(history, { path: RouteNames.publicRoutes.APP_BASE });
          }
        },
      });
    } else {
      onMenuClose();
      NavigationUtils.navigate(history, { path: menuItems[index].url });
      setTimeout(() => {
        if (PlatformUtils.isWeb()) {
          window.scrollTo(0, 0);
        }
      }, 100);
    }
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
      {menuItems.map((item, index) => {
        return (
          <NavItem
            key={item.text}
            text={item.text}
            isDisabled={false}
            isActive={isSelected === index}
            onNavItemPress={onNavItemPress}
            index={index}
          />
        );
      })}
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
export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { logout } = UserActions;
  return bindActionCreators(
    {
      logout,
    },
    dispatch
  );
};
export default connect(null, mapDispatchToProps)(MobileSideMenu);
