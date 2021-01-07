import React, { FC, useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useHistory, useLocation } from 'react-router-dom';
import { History } from 'history';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import BreadCrumbs from '@homzhub/web/src/components/molecules/BreadCrumbs';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import PopupMenuOptions, { IPopupOptions } from '@homzhub/web/src/components/molecules/PopupMenuOptions';
import { PopupActions } from 'reactjs-popup/dist/types';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import '@homzhub/web/src/components/molecules/NavigationInfo/NavigationInfo.scss';

const humanize = (str: string): string => {
  const splicedStr = str.split('/');
  const lastIndex = splicedStr.length - 1;
  return splicedStr[lastIndex].replace('/', '').replace(/^[a-z]/, (m) => m.toUpperCase());
};

interface IQuickActions extends IPopupOptions {
  route: string;
}

const quickActionOptions: IQuickActions[] = [
  { icon: icons.stackFilled, label: 'Add Property', route: RouteNames.protectedRoutes.ADD_PROPERTY },
  { icon: icons.stackFilled, label: 'Add Records', route: RouteNames.protectedRoutes.DASHBOARD },
  { icon: icons.stackFilled, label: 'Create Support Ticket', route: RouteNames.protectedRoutes.DASHBOARD },
  { icon: icons.stackFilled, label: 'Create Service Ticket', route: RouteNames.protectedRoutes.DASHBOARD },
];

// todo: replace  dummy data with actual data
export const NavigationInfo: FC = () => {
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const popupRef = useRef<PopupActions>(null);
  const onMenuItemClick = (option: IQuickActions): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
    NavigationUtils.navigate(history, { path: option.route });
  };
  const currentScreen = location.pathname === '/' ? 'Home' : humanize(location.pathname);
  const popupOptionStyle = { marginTop: '4px', alignItems: 'stretch' };
  return (
    <View>
      <div className="navigation-bg" />
      <View style={[styles.container, isMobile && styles.containerMobile]}>
        <View>
          <Typography variant="text" size="regular" style={styles.link}>
            {currentScreen}
          </Typography>
          <View style={styles.breadCrumbs}>
            <BreadCrumbs />
          </View>
        </View>
        <View style={[styles.buttonsGrp, isMobile && styles.buttonsGrpMobile]}>
          <Button type="secondaryOutline" containerStyle={[styles.button, isMobile && styles.countryBtnMobile]}>
            <Image source={{ uri: 'https://www.countryflags.io/IN/flat/48.png' }} style={styles.flagStyle} />
            {!isMobile && (
              <Typography variant="label" size="large" style={styles.buttonTitle}>
                India
              </Typography>
            )}
            <Icon name={icons.downArrow} color={theme.colors.white} />
          </Button>
          <Button type="secondaryOutline" containerStyle={styles.button}>
            <Typography variant="label" size="large" style={styles.buttonTitle}>
              {!isMobile && 'INR'} &#x20B9;
            </Typography>
            <Icon name={icons.downArrow} color={theme.colors.white} />
          </Button>
          <View style={[styles.addBtnContainer, isMobile && styles.addBtnContainerMobile]}>
            <Popover
              forwardedRef={popupRef}
              content={<PopupMenuOptions options={quickActionOptions} onMenuOptionPress={onMenuItemClick} />}
              popupProps={{
                position: 'bottom right',
                on: ['click'],
                arrow: false,
                contentStyle: popupOptionStyle,
                closeOnDocumentClick: true,
                children: undefined,
              }}
            >
              <Button type="secondary" containerStyle={[styles.button, styles.addBtn]}>
                <Icon name={icons.plus} color={theme.colors.primaryColor} style={styles.buttonIconRight} />
                <Typography variant="label" size="large" style={styles.buttonBlueTitle}>
                  {t('addCamelCase')}
                </Typography>
              </Button>
            </Popover>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: theme.layout.dashboardWidth,
    marginTop: 24,
    marginBottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
  containerMobile: {
    width: theme.layout.dashboardMobileWidth,
    flexDirection: 'column',
    alignItems: undefined,
  },
  currentScreen: {
    color: theme.colors.white,
  },
  link: {
    color: theme.colors.white,
  },
  breadCrumbs: {
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonsGrp: {
    flexDirection: 'row',
  },
  buttonIconRight: {
    marginRight: 8,
  },
  buttonsGrpMobile: {
    marginTop: 16,
  },
  button: {
    borderColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 16,
    width: 'max-content',
  },
  addBtn: {
    paddingHorizontal: 24,
    marginLeft: 0,
  },
  addBtnContainerMobile: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addBtnContainer: {
    marginLeft: 16,
    alignItems: 'stretch',
  },
  countryBtnMobile: {
    marginLeft: 0,
  },
  buttonTitle: {
    color: theme.colors.white,
    marginRight: 8,
  },
  buttonBlueTitle: {
    color: theme.colors.primaryColor,
    marginRight: 8,
  },
  flagStyle: {
    marginRight: 8,
    borderRadius: 2,
    width: 24,
    height: 24,
  },
});
