import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { GeolocationResponse } from '@react-native-community/geolocation';
import { debounce } from 'lodash';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { CurrentLocation } from '@homzhub/mobile/src/components/molecules/CurrentLocation';
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
type Props = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.PostPropertySearch>;

class PostPropertySearch extends React.PureComponent<Props, IState> {
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
          icon={icons.leftArrow}
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
          <CurrentLocation onGetCurrentPositionSuccess={this.onGetCurrentPositionSuccess} />
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
    this.setState({ showAutoDetect: !showAutoDetect });
  };

  private onBackPress = (): void => {
    const {
      navigation: { goBack },
    } = this.props;
    goBack();
  };

  private onGetCurrentPositionSuccess = (data: GeolocationResponse): void => {
    const {
      coords: { latitude, longitude },
    } = data;

    GooglePlacesService.getLocationData({ lng: longitude, lat: latitude })
      .then((locData) => {
        const { formatted_address } = locData;
        const { primaryAddress, secondaryAddress } = GooglePlacesService.getSplitAddress(formatted_address);
        this.navigateToMapView({
          initialLatitude: latitude,
          initialLongitude: longitude,
          primaryTitle: primaryAddress,
          secondaryTitle: secondaryAddress,
        });
      })
      .catch(this.displayError);
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
    navigate(ScreensKeys.PostPropertyMap, options);
  };

  private displayError = (e: Error): void => {
    AlertHelper.error({ message: e.message });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navTitle: {
    color: theme.colors.white,
  },
});

const HOC = withTranslation(LocaleConstants.namespacesKey.property)(PostPropertySearch);
export { HOC as PostPropertySearch };