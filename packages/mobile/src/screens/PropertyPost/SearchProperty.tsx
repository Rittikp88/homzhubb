import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { GeolocationResponse } from '@react-native-community/geolocation';
import { debounce } from 'lodash';
import { GeolocationService } from '@homzhub/common/src/services/Geolocation/GeolocationService';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { PERMISSION_TYPE, PermissionsService } from '@homzhub/mobile/src/services/Permissions';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components';
import Header from '@homzhub/mobile/src/components/molecules/Header';
import { SearchBar } from '@homzhub/mobile/src/components/molecules/SearchBar';
import { SearchResults } from '@homzhub/mobile/src/components/molecules/SearchResults';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { GooglePlaceData, GooglePlaceDetail } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys, IAddPropertyMapProps } from '@homzhub/mobile/src/navigation/interfaces';

interface IState {
  searchString: string;
  suggestions: GooglePlaceData[];
  showAutoDetect: boolean;
}
type Props = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.SearchPropertyOwner>;

class SearchProperty extends React.PureComponent<Props, IState> {
  public state = {
    searchString: '',
    suggestions: [],
    showAutoDetect: true,
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    const { searchString, suggestions, showAutoDetect } = this.state;

    return (
      <View style={styles.container}>
        <Header
          icon="left-arrow"
          iconColor={theme.colors.white}
          onIconPress={this.onBackPress}
          isHeadingVisible
          title={t('common:location')}
          titleType="small"
          titleFontType="semiBold"
          titleStyle={styles.navTitle}
          backgroundColor={theme.colors.primaryColor}
        />
        <SearchBar
          placeholder={t('searchProject')}
          value={searchString}
          updateValue={this.onUpdateSearchString}
          onFocusChange={this.onToggleAutoDetect}
        />
        {suggestions.length > 0 && searchString.length > 0 && (
          <SearchResults results={suggestions} onResultPress={this.onSuggestionPress} />
        )}
        {showAutoDetect && searchString.length <= 0 && (
          <TouchableOpacity onPress={this.onAutoDetectPress} style={styles.autoDetectTextContainer}>
            <Icon name="location" size={16} color={theme.colors.primaryColor} />
            <Label type="large" textType="semiBold" style={styles.autoDetectText}>
              {t('autoDetect')}
            </Label>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  private onUpdateSearchString = (updatedSearchString: string): void => {
    this.setState({ searchString: updatedSearchString }, () => {
      if (updatedSearchString.length <= 0) {
        return;
      }
      this.getAutocompleteSuggestions();
    });
  };

  private onToggleAutoDetect = (showAutoDetect: boolean): void => {
    this.setState({ showAutoDetect });
  };

  private onBackPress = (): void => {
    const {
      navigation: { goBack },
    } = this.props;
    goBack();
  };

  private onAutoDetectPress = async (): Promise<void> => {
    const isLocationEnabled = await PermissionsService.checkPermission(PERMISSION_TYPE.location);

    if (!isLocationEnabled) {
      AlertHelper.error({ message: 'Please enable location permission' });
      return;
    }

    GeolocationService.getCurrentPosition(this.onGetCurrentPositionSuccess, (error) => {
      AlertHelper.error({ message: 'Error fetching your current location' });
    });
  };

  private onGetCurrentPositionSuccess = (data: GeolocationResponse): void => {
    const {
      coords: { latitude, longitude },
    } = data;

    GooglePlacesService.getLocationData({ lng: longitude, lat: latitude })
      .then((locData) => {})
      .catch(this.displayError);
    this.navigateToMapView({
      initialLatitude: latitude,
      initialLongitude: longitude,
      primaryTitle: '',
      secondaryTitle: '',
    });
  };

  private onSuggestionPress = (place: GooglePlaceData): void => {
    GooglePlacesService.getPlaceDetail(place.place_id)
      .then((placeDetail: GooglePlaceDetail) => {
        this.navigateToMapView({
          initialLatitude: placeDetail.geometry.location.lat,
          initialLongitude: placeDetail.geometry.location.lng,
          primaryTitle: place.structured_formatting.main_text,
          secondaryTitle: place.structured_formatting.secondary_text,
        });
      })
      .catch(this.displayError);
  };

  // eslint-disable-next-line react/sort-comp
  private getAutocompleteSuggestions = debounce((): void => {
    const { searchString } = this.state;
    GooglePlacesService.autoComplete(searchString)
      .then((suggestions: GooglePlaceData[]) => {
        this.setState({ suggestions });
      })
      .catch(this.displayError);
  }, 300);

  private navigateToMapView = (options: IAddPropertyMapProps): void => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate(ScreensKeys.AddProperty, options);
  };

  private displayError = (e: Error): void => {
    AlertHelper.error({ message: e.message });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  autoDetectTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.white,
  },
  navTitle: {
    color: theme.colors.white,
  },
  autoDetectText: {
    marginStart: 8,
    color: theme.colors.primaryColor,
  },
});

const HOC = withTranslation(LocaleConstants.namespacesKey.propertyPost)(SearchProperty);
export { HOC as SearchProperty };
