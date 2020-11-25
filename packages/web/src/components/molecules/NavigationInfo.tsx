import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useLocation } from 'react-router-dom';
import { theme } from '@homzhub/common/src/styles/theme';
import NavigationBreadCrumbBg from '@homzhub/common/src/assets/images/navigationBreadCrumbBg.svg';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import BreadCrumbs from '@homzhub/web/src/components/molecules/BreadCrumbs';

const humanize = (str: string): string => {
  return str.replace('/', '').replace(/^[a-z]/, (m) => m.toUpperCase());
};

export const NavigationInfo: FC = () => {
  const location = useLocation();
  const currentScreen = location.pathname === '/' ? 'Home' : humanize(location.pathname);
  return (
    <>
      <View style={styles.bgContainer}>
        <NavigationBreadCrumbBg width="100%" height="15ew" />
      </View>
      <View style={styles.container}>
        <View>
          <Typography variant="text" size="regular" style={styles.link}>
            {currentScreen}
          </Typography>
          <View style={styles.breadCrumbs}>
            <BreadCrumbs />
          </View>
        </View>
        <View style={styles.buttonsGrp}>
          <Button type="secondaryOutline" containerStyle={styles.button}>
            <Image source={{ uri: 'https://www.countryflags.io/IN/flat/48.png' }} style={styles.flagStyle} />
            <Typography variant="label" size="large" style={styles.buttonTitle}>
              India
            </Typography>
            <Icon name={icons.downArrow} color={theme.colors.white} />
          </Button>
          <Button type="secondaryOutline" containerStyle={styles.button}>
            <Typography variant="label" size="large" style={styles.buttonTitle}>
              INR &#x20B9;
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
    </>
  );
};

const styles = StyleSheet.create({
  bgContainer: {
    width: '100%',
    position: 'absolute',
  },
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'relative',
    width: '90vw',
    marginTop: 24,
    marginBottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
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
  button: {
    borderColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 16,
    maxWidth: 'max-content',
    height: 'max-content',
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
