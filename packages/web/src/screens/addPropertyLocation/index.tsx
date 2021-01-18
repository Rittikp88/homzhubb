import React, { FC, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AddPropertyContext } from '@homzhub/web/src/screens/addProperty/AddPropertyContext';
import { GeolocationService } from '@homzhub/common/src/services/Geolocation/GeolocationService';
import { GeolocationError, GeolocationResponse } from '@homzhub/common/src/services/Geolocation/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import GoogleMapView from '@homzhub/web/src/components/atoms/GoogleMapView';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import AutoCompletionSearchBar from '@homzhub/web/src/components/atoms/AutoCompletionSearchBar';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { AddPropertyStack } from '@homzhub/web/src/screens/addProperty';

const AddPropertyLocation: FC = () => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = AddPropertyLocationStyles;
  const { hasScriptLoaded } = useContext(AddPropertyContext);
  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      {hasScriptLoaded && <GoogleMapView />}
      <SearchView />
    </View>
  );
};

const SearchView: FC = () => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.propertySearch);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = searchViewStyles;
  const blurBackgroundStyle = {
    position: 'absolute' as 'absolute',
    backgroundColor: theme.colors.carouselCardOpacity,
    backdropFilter: 'blur(8px)',
    width: '100%',
    height: '100%',
  };
  const { setUpdatedLatLng, navigateScreen } = useContext(AddPropertyContext);
  const onPressAutoDetect = (): void => {
    GeolocationService.getCurrentPosition(onFetchSuccess, onFetchError);
  };
  const onFetchSuccess = (response: GeolocationResponse): void => {
    const { latitude, longitude } = response.coords;
    setUpdatedLatLng({ lat: latitude, lng: longitude });
    navigateScreen(AddPropertyStack.PropertyDetailsMapScreen);
  };
  const onFetchError = (error: GeolocationError): void => {
    console.log('Error => ', error);
  };
  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <div style={blurBackgroundStyle} />
      <View style={styles.innerContainer}>
        <Typography size="regular" style={styles.title}>
          {t('findProperty')}
        </Typography>
        <AutoCompletionSearchBar />
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
const searchViewStyles = StyleSheet.create({
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
    alignItems: 'center',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
  },
  title: {
    color: theme.colors.white,
    marginVertical: 24,
  },
  buttonTitle: {
    color: theme.colors.white,
    marginLeft: 8,
    paddingVertical: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
    borderWidth: 0,
  },
  searchBar: {
    alignSelf: 'stretch',
    marginHorizontal: 24,
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
  },
});

export default AddPropertyLocation;
