import React, { FC, useCallback, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { uniqBy } from 'lodash';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { useSelector } from 'react-redux';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import BreadCrumbs from '@homzhub/web/src/components/molecules/BreadCrumbs';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import PopupMenuOptions, { IPopupOptions } from '@homzhub/web/src/components/molecules/PopupMenuOptions';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { PopupActions } from 'reactjs-popup/dist/types';
import '@homzhub/web/src/components/molecules/NavigationInfo/NavigationInfo.scss';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Country } from '@homzhub/common/src/domain/models/Country';

const humanize = (str: string): string => {
  return str.replace('/', '').replace(/^[a-z]/, (m) => m.toUpperCase());
};

const quickActionOptions = [
  { icon: icons.stackFilled, label: 'Add Property' },
  { icon: icons.stackFilled, label: 'Add Records' },
  { icon: icons.stackFilled, label: 'Create Support Ticket' },
  { icon: icons.stackFilled, label: 'Create Service Ticket' },
];

const getCountryList = (assets: Asset[]): Country[] => {
  return uniqBy(
    assets.map((asset) => asset.country),
    'id'
  );
};
const defaultDropDownProps = (width: string): any => ({
  position: 'bottom right' as 'bottom right',
  on: ['click' as 'click'],
  arrow: false,
  contentStyle: { minWidth: width, marginTop: '4px', alignItems: 'stretch' },
  closeOnDocumentClick: true,
  children: undefined,
});

const DashBoardActionsGrp: FC = () => {
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const popupRef = useRef<PopupActions>(null);
  const [selectedCountry, setSelectedCountry] = useState(0);
  const assets: Asset[] = useSelector(UserSelector.getUserAssets);
  const countryList = getCountryList(assets);
  const countryOptions = useCallback((): IPopupOptions[] => {
    const options = countryList.map((item) => ({
      label: item.name,
      value: item.id,
    }));
    return [{ label: t('common:all'), value: 0 }, ...options];
  }, [countryList, t]);
  const closePopup = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };
  const onCountryOptionSelect = (option: IPopupOptions): void => {
    setSelectedCountry(option.value as number);
    closePopup();
  };
  const styles = DashBoardActionStyles;
  const selectedCountryIndex = countryList.findIndex((data) => data.id === selectedCountry);
  const countryImage = selectedCountry !== 0 ? countryList[selectedCountryIndex].flag : 'globe';
  const countryName = selectedCountry !== 0 ? countryList[selectedCountryIndex].name : t('common:all');
  return (
    <View style={[styles.buttonsGrp, isMobile && styles.buttonsGrpMobile]}>
      <Popover
        forwardedRef={popupRef}
        content={<PopupMenuOptions options={countryOptions()} onMenuOptionPress={onCountryOptionSelect} />}
        popupProps={defaultDropDownProps('100px')}
      >
        <Button type="secondaryOutline" containerStyle={[styles.button, isMobile && styles.countryBtnMobile]}>
          {countryImage &&
            (countryImage === 'globe' ? (
              <Icon name={icons.earthFilled} size={22} color={theme.colors.white} style={styles.flagStyle} />
            ) : (
              <Image source={{ uri: countryImage }} style={styles.flagStyle} />
            ))}
          {!isMobile && (
            <Typography variant="label" size="large" style={styles.buttonTitle}>
              {countryName}
            </Typography>
          )}
          <Icon name={icons.downArrow} color={theme.colors.white} />
        </Button>
      </Popover>
      <Popover
        forwardedRef={popupRef}
        content={<PopupMenuOptions options={countryOptions()} onMenuOptionPress={onCountryOptionSelect} />}
        popupProps={defaultDropDownProps('88px')}
      >
        <Button type="secondaryOutline" containerStyle={styles.button}>
          <Typography variant="label" size="large" style={styles.buttonTitle}>
            {!isMobile && 'INR'} &#x20B9;
          </Typography>
          <Icon name={icons.downArrow} color={theme.colors.white} />
        </Button>
      </Popover>
      <View style={[styles.addBtnContainer, isMobile && styles.addBtnContainerMobile]}>
        <Popover
          forwardedRef={popupRef}
          content={<PopupMenuOptions options={quickActionOptions} onMenuOptionPress={closePopup} />}
          popupProps={defaultDropDownProps('fitContent')}
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
  );
};

// todo: replace dummy data with actual data
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
        <DashBoardActionsGrp />
      </View>
    </View>
  );
};

const DashBoardActionStyles = StyleSheet.create({
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
});
