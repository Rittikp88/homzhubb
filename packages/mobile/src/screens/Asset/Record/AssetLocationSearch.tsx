import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { GeolocationResponse } from '@react-native-community/geolocation';
import { debounce } from 'lodash';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { CurrentLocation, Header } from '@homzhub/mobile/src/components';
import SearchResults from '@homzhub/mobile/src/components/molecules/SearchResults';
import GoogleSearchBar from '@homzhub/mobile/src/components/molecules/GoogleSearchBar';
import {
  GoogleGeocodeData,
  GooglePlaceData,
  GooglePlaceDetail,
} from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { NavigationScreenProps, ScreensKeys, IAssetLocationMapProps } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IScreenState {
  searchString: string;
  suggestions: GooglePlaceData[];
  showAutoDetect: boolean;
}

interface IStateProps {
  isAddPropertyFlow: boolean;
}

interface IDispatchProps {
  resetState: () => void;
}

/* eslint-disable @typescript-eslint/indent */
type Props = WithTranslation &
  IDispatchProps &
  IStateProps &
  NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.AssetLocationSearch>;
/* eslint-enable @typescript-eslint/indent */

export class AssetLocationSearch extends React.PureComponent<Props, IScreenState> {
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
          isBarVisible={false}
          type="primary"
          icon={icons.leftArrow}
          onIconPress={this.onBackPress}
          isHeadingVisible
          title={t('common:location')}
          testID="header"
        />
        <GoogleSearchBar
          placeholder={t('searchProject')}
          value={searchString}
          updateValue={this.onUpdateSearchString}
          onFocusChange={this.onToggleAutoDetect}
          testID="searchBar"
        />
        <View style={styles.bar} />
        {suggestions.length > 0 && searchString.length > 0 && (
          <SearchResults results={suggestions} onResultPress={this.onSuggestionPress} testID="searchResults" />
        )}
        {showAutoDetect && searchString.length <= 0 && (
          <CurrentLocation onGetCurrentPositionSuccess={this.onGetCurrentPositionSuccess} testID="currentLocation" />
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
      navigation: { goBack, navigate },
      resetState,
      isAddPropertyFlow,
    } = this.props;
    resetState();

    if (isAddPropertyFlow) {
      navigate(ScreensKeys.BottomTabs);
    } else {
      goBack();
    }
  };

  private onGetCurrentPositionSuccess = (data: GeolocationResponse): void => {
    const {
      coords: { latitude, longitude },
    } = data;

    GooglePlacesService.getLocationData({ lng: longitude, lat: latitude })
      .then((locData) => {
        this.onSuggestionPress(locData);
      })
      .catch(this.displayError);
  };

  private onSuggestionPress = (place: GooglePlaceData | GoogleGeocodeData): void => {
    GooglePlacesService.getPlaceDetail(place.place_id)
      .then((placeData: GooglePlaceDetail) => {
        this.navigateToMapView({
          placeData,
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

  private navigateToMapView = (options: IAssetLocationMapProps): void => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate(ScreensKeys.AssetLocationMap, options);
  };

  private displayError = (e: Error): void => {
    AlertHelper.error({ message: e.message });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bar: { height: 4, backgroundColor: theme.colors.green },
});

const mapStateToProps = (state: IState): IStateProps => {
  return {
    isAddPropertyFlow: UserSelector.isAddPropertyFlow(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { resetState } = RecordAssetActions;
  return bindActionCreators(
    {
      resetState,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(AssetLocationSearch));
