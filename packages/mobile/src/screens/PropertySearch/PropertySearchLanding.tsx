import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { GeolocationResponse } from '@react-native-community/geolocation';
import { debounce } from 'lodash';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { GooglePlaceData } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { theme } from '@homzhub/common/src/styles/theme';
import { CurrentLocation } from '@homzhub/mobile/src/components/molecules/CurrentLocation';
import { Button, Text, WithShadowView } from '@homzhub/common/src/components';
import { SearchBar } from '@homzhub/mobile/src/components/molecules/SearchBar';
import { SearchResults } from '@homzhub/mobile/src/components/molecules/SearchResults';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IState {
  searchString: string;
  isSearchBarFocused: boolean;
  suggestions: GooglePlaceData[];
}

class PropertySearchLanding extends React.PureComponent<WithTranslation, IState> {
  private searchBar: typeof SearchBar | null = null;
  public state = {
    searchString: '',
    isSearchBarFocused: false,
    suggestions: [],
  };

  public render(): React.ReactElement {
    const { isSearchBarFocused } = this.state;
    const { t } = this.props;
    return (
      <>
        <View style={styles.statusBar}>
          <StatusBar translucent backgroundColor={theme.colors.background} barStyle="dark-content" />
        </View>
        <View style={styles.screen}>
          {this.renderHeader()}
          {isSearchBarFocused && this.renderSearchResults()}
        </View>
        <WithShadowView outerViewStyle={styles.shadowView}>
          <Button
            type="primary"
            title={t('showProperties')}
            containerStyle={styles.buttonStyle}
            onPress={this.onShowProperties}
          />
        </WithShadowView>
      </>
    );
  }

  private renderHeader = (): React.ReactNode => {
    const { t } = this.props;
    const { searchString } = this.state;
    return (
      <View style={styles.header}>
        <Text type="regular">{t('findingRightProperty')}</Text>
        <Text type="regular" textType="bold" style={styles.madeEasy}>
          {t('madeEasy')}
        </Text>
        <SearchBar
          // @ts-ignore
          onRef={(input: SearchBar): void => {
            this.searchBar = input;
          }}
          placeholder={t('enterLocation')}
          updateValue={this.onSearchStringUpdate}
          value={searchString}
          containerStyle={styles.searchBarContainer}
          cancelButtonStyle={styles.cancelButtonStyle}
          cancelTextStyle={styles.cancelTextStyle}
          onFocusChange={this.onSearchBarFocusChange}
        />
      </View>
    );
  };

  private renderSearchResults = (): React.ReactNode => {
    const { searchString, suggestions } = this.state;
    return (
      <>
        <CurrentLocation onGetCurrentPositionSuccess={this.onGetCurrentPositionSuccess} />
        {suggestions.length > 0 && searchString.length > 0 && (
          <SearchResults
            results={suggestions}
            onResultPress={this.onSuggestionPress}
            listTitleStyle={styles.resultListContainer}
          />
        )}
      </>
    );
  };

  private onSearchBarFocusChange = (isSearchBarFocused: boolean): void => {
    this.setState({ isSearchBarFocused });
  };

  private onSearchStringUpdate = (searchString: string): void => {
    this.setState({ searchString }, () => {
      if (searchString.length <= 0) {
        return;
      }
      this.getAutocompleteSuggestions();
    });
  };

  private onSuggestionPress = (place: GooglePlaceData): void => {
    if (this.searchBar) {
      // @ts-ignore
      this.searchBar.SearchTextInput.blur();
    }
  };

  private onGetCurrentPositionSuccess = (data: GeolocationResponse): void => {
    const {
      coords: { latitude, longitude },
    } = data;
    console.log(latitude, longitude);
  };

  private onShowProperties = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.PropertyTabsScreen);
  };

  // eslint-disable-next-line react/sort-comp
  private getAutocompleteSuggestions = debounce((): void => {
    const { searchString } = this.state;
    GooglePlacesService.autoComplete(searchString)
      .then((suggestions: GooglePlaceData[]) => {
        this.setState({ suggestions });
      })
      .catch((e: Error): void => {
        AlertHelper.error({ message: e.message });
      });
  }, 300);
}

export default withTranslation(LocaleConstants.namespacesKey.propertySearch)(PropertySearchLanding);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  statusBar: {
    marginTop: 16,
    height: PlatformUtils.isIOS() ? 30 : StatusBar.currentHeight,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: 8,
    backgroundColor: theme.colors.background,
  },
  searchBarContainer: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 0,
    paddingBottom: 0,
    paddingTop: 24,
  },
  cancelButtonStyle: {
    backgroundColor: theme.colors.background,
  },
  cancelTextStyle: {
    color: theme.colors.primaryColor,
  },
  resultListContainer: {
    backgroundColor: theme.colors.white,
  },
  madeEasy: {
    marginTop: 6,
  },
  shadowView: {
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
});
