import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useLocation } from 'react-router-dom';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import BreadCrumbs from '@homzhub/web/src/components/molecules/BreadCrumbs';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import '@homzhub/web/src/components/molecules/NavigationInfo/NavigationInfo.scss';

const humanize = (str: string): string => {
  return str.replace('/', '').replace(/^[a-z]/, (m) => m.toUpperCase());
};

export const NavigationInfo: FC = () => {
  const location = useLocation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const currentScreen = location.pathname === '/' ? 'Home' : humanize(location.pathname);
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
          <Button type="secondary" containerStyle={styles.button}>
            <Icon name={icons.plus} color={theme.colors.primaryColor} style={styles.buttonIconRight} />
            <Typography variant="label" size="large" style={styles.buttonBlueTitle}>
              Quick Actions
            </Typography>
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '90vw',
    marginTop: 24,
    marginBottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
  containerMobile: {
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
  buttonsGrpMobile: {
    marginTop: 16,
  },
  button: {
    borderColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginLeft: 16,
    maxWidth: 'max-content',
    height: 'max-content',
  },
  countryBtnMobile: {
    marginLeft: 0,
  },
  buttonIconRight: {
    marginRight: 8,
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
