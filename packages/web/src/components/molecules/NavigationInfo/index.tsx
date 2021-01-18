import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { uniqBy } from 'lodash';
import { PopupActions, PopupProps } from 'reactjs-popup/dist/types';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { useDispatch, useSelector } from 'react-redux';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import BreadCrumbs from '@homzhub/web/src/components/molecules/BreadCrumbs';
import PopupMenuOptions, { IPopupOptions } from '@homzhub/web/src/components/molecules/PopupMenuOptions';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import '@homzhub/web/src/components/molecules/NavigationInfo/NavigationInfo.scss';
import { AddPropertyActionsGrp } from '@homzhub/web/src/screens/addProperty';

const humanize = (str: string): string => {
  const splicedStr = str.split('/');
  const lastIndex = splicedStr.length - 1;
  return splicedStr[lastIndex].replace('/', '').replace(/^[a-z]/, (m) => m.toUpperCase());
};

interface IQuickActions extends IPopupOptions {
  route: string;
}

interface ICurrencyOption extends IPopupOptions {
  currency: Currency;
}

const quickActionOptions: IQuickActions[] = [
  { icon: icons.stackFilled, label: 'Add Property', route: RouteNames.protectedRoutes.ADD_PROPERTY },
  { icon: icons.stackFilled, label: 'Add Records', route: RouteNames.protectedRoutes.DASHBOARD },
  { icon: icons.stackFilled, label: 'Create Support Ticket', route: RouteNames.protectedRoutes.DASHBOARD },
  { icon: icons.stackFilled, label: 'Create Service Ticket', route: RouteNames.protectedRoutes.DASHBOARD },
];

const getCountryList = (assets: Asset[]): Country[] => {
  return uniqBy(
    assets.map((asset) => asset.country),
    'id'
  );
};

const defaultDropDownProps = (width: string): PopupProps => ({
  position: 'bottom right' as 'bottom right',
  on: ['click' as 'click'],
  arrow: false,
  contentStyle: { minWidth: width, marginTop: '4px', alignItems: 'stretch' },
  closeOnDocumentClick: true,
  children: undefined,
});

const DashBoardActionsGrp: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const popupRef = useRef<PopupActions>(null);
  const history = useHistory();
  const selectedCountry = useSelector(UserSelector.getUserCountryCode);
  const [selectedCurrency, setSelectedCurrency] = useState<ICurrencyOption>();
  const assets: Asset[] = useSelector(UserSelector.getUserAssets);
  const userCurrency: Currency = useSelector(UserSelector.getCurrency);
  const countriesList: Country[] = useSelector(CommonSelectors.getCountryList);
  useEffect(() => {
    const defaultCurrencyOption = {
      label: `${userCurrency.currencyCode} ${userCurrency.currencySymbol}`,
      currency: userCurrency,
    };
    setSelectedCurrency(defaultCurrencyOption);
  }, [userCurrency]);
  const currencyOptions = useCallback((): ICurrencyOption[] => {
    return countriesList.map((item) => {
      const { currencyCode, currencySymbol } = item.currencies[0];
      return {
        label: `${currencyCode} ${currencySymbol}`,
        currency: item.currencies[0],
      };
    });
  }, [countriesList]);
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
  const onMenuItemClick = (option: IQuickActions): void => {
    closePopup();
    NavigationUtils.navigate(history, { path: option.route });
  };
  const onCurrencyOptionSelect = (option: ICurrencyOption): void => {
    setSelectedCurrency(option);
    dispatch(UserActions.updateUserPreferences({ currency: option.currency.currencyCode }));
    closePopup();
  };
  const onCountryOptionSelect = (option: IPopupOptions): void => {
    dispatch(UserActions.setUserCountryCode(option.value as number));
    closePopup();
  };
  const styles = dashBoardActionStyles;
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
        content={<PopupMenuOptions options={currencyOptions()} onMenuOptionPress={onCurrencyOptionSelect} />}
        popupProps={defaultDropDownProps('88px')}
      >
        <Button type="secondaryOutline" containerStyle={styles.button}>
          <Typography variant="label" size="large" style={styles.buttonTitle}>
            {!isMobile ? selectedCurrency?.label : selectedCurrency?.currency.currencySymbol}
          </Typography>
          <Icon name={icons.downArrow} color={theme.colors.white} />
        </Button>
      </Popover>
      <View style={[styles.addBtnContainer, isMobile && styles.addBtnContainerMobile]}>
        <Popover
          forwardedRef={popupRef}
          content={<PopupMenuOptions options={quickActionOptions} onMenuOptionPress={onMenuItemClick} />}
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
  const renderNavInfo = (): React.ReactElement => {
    const { protectedRoutes } = RouteNames;
    switch (location.pathname) {
      case protectedRoutes.ADD_PROPERTY:
        return <AddPropertyActionsGrp />;
      case protectedRoutes.DASHBOARD:
        return <DashBoardActionsGrp />;
      default:
        return <></>;
    }
  };
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
        {renderNavInfo()}
      </View>
    </View>
  );
};

const dashBoardActionStyles = StyleSheet.create({
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
