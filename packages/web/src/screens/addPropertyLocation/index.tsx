import React, { FC } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { GeolocationService } from '@homzhub/common/src/services/Geolocation/GeolocationService';
import { GeolocationError, GeolocationResponse } from '@homzhub/common/src/services/Geolocation/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import GoogleMapView from '@homzhub/web/src/components/atoms/GoogleMapView';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import AutoCompletionSearchBar from '@homzhub/web/src/components/atoms/AutoCompletionSearchBar';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { ILatLng } from '@homzhub/common/src/modules/search/interface';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { AddPropertyStack } from '@homzhub/web/src/screens/addProperty';

interface IProps {
  setUpdatedLatLng: (latLng: ILatLng) => void;
  hasScriptLoaded: boolean;
  navigateScreen: (screen: AddPropertyStack) => void;
}

const AddPropertyLocation: FC<IProps> = (props: IProps) => {
  const { setUpdatedLatLng, hasScriptLoaded, navigateScreen } = props;
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = AddPropertyLocationStyles;
  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      {hasScriptLoaded && <GoogleMapView />}
      <SearchView
        setUpdatedLatLng={setUpdatedLatLng}
        hasScriptLoaded={hasScriptLoaded}
        navigateScreen={navigateScreen}
      />
    </View>
  );
};

const SearchView: FC<IProps> = (props: IProps) => {
  const { setUpdatedLatLng, hasScriptLoaded, navigateScreen } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.propertySearch);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = searchViewStyles();
  const blurBackgroundStyle = {
    position: 'absolute' as 'absolute',
    backgroundColor: theme.colors.carouselCardOpacity,
    backdropFilter: 'blur(8px)',
    width: '100%',
    height: !isMobile ? '100%' : 162,
    marginTop: isMobile ? '20%' : '',
    justifyContent: 'center',
    alignItems: 'center',
  };
  const onPressAutoDetect = (): void => {
    GeolocationService.getCurrentPosition(onFetchSuccess, onFetchError);
  };
  const onFetchSuccess = (response: GeolocationResponse): void => {
    const { latitude, longitude } = response.coords;
    setUpdatedLatLng({ lat: latitude, lng: longitude });
    navigateScreen(AddPropertyStack.PropertyDetailsMapScreen);
  };
  const onFetchError = (error: GeolocationError): void => {
    // empty
  };
  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <div style={blurBackgroundStyle} />
      <View style={[styles.innerContainer, isMobile && styles.innerContainerMobile]}>
        <Typography size="regular" style={styles.title}>
          {t('findProperty')}
        </Typography>
        <AutoCompletionSearchBar
          setUpdatedLatLng={setUpdatedLatLng}
          hasScriptLoaded={hasScriptLoaded}
          navigateAddProperty={navigateScreen}
        />
        <Button type="secondaryOutline" containerStyle={styles.buttonContainer} onPress={onPressAutoDetect}>
          <Icon name={icons.location} size={15} color={theme.colors.white} />
          <Typography variant="label" size="regular" style={styles.buttonTitle}>
            {t('property:autoDetectLocation')}
          </Typography>
        </Button>
      </View>
    </View>
  );
};
interface ISearchViewStyles {
  container: ViewStyle;
  containerMobile: ViewStyle;
  innerContainer: ViewStyle;
  title: ViewStyle;
  buttonTitle: ViewStyle;
  buttonContainer: ViewStyle;
  innerContainerMobile: ViewStyle;
}
const searchViewStyles = (): StyleSheet.NamedStyles<ISearchViewStyles> =>
  StyleSheet.create<ISearchViewStyles>({
    container: {
      position: 'absolute',
      marginTop: '10%',
      width: '60%',
      height: 'fit-content',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    containerMobile: {
      width: '90%',
    },
    innerContainer: {
      marginHorizontal: 24,
      alignSelf: 'stretch',
    },
    innerContainerMobile: {
      marginTop: '20%',
      marginHorizontal: 8,
    },

    title: {
      color: theme.colors.white,
      marginVertical: 24,
      textAlign: 'center',
    },
    buttonTitle: {
      color: theme.colors.white,
      marginLeft: 8,
      paddingVertical: 4,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 12,
      marginBottom: 24,
      borderWidth: 0,
    },
  });

const AddPropertyLocationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    padding: 20,
    marginBottom: 48,
    borderRadius: 4,
    width: '100%',
    minHeight: 908,
    justifyContent: 'center',
  },
  containerMobile: {
    padding: 4,
    minHeight: 680,
  },
});

export default AddPropertyLocation;
