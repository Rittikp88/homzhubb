import React, { PureComponent } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { GeolocationResponse } from '@react-native-community/geolocation';
import { debounce } from 'lodash';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { GooglePlaceData } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button, ButtonType, Divider, FontWeightType, Label, ToggleButton } from '@homzhub/common/src/components';
import { RoomsFilter } from '@homzhub/mobile/src/components/molecules/RoomsFilter';
import { AssetTypeFilter } from '@homzhub/mobile/src/components/organisms/AssetTypeFilter';
import { PropertySearchMap } from '@homzhub/mobile/src/components/organisms/PropertySearchMap';
import { PropertySearchList } from '@homzhub/mobile/src/components/organisms/PropertySearchList';
import { SearchBar } from '@homzhub/mobile/src/components/molecules/SearchBar';
import { CurrentLocation } from '@homzhub/mobile/src/components/molecules/CurrentLocation';
import { SearchResults } from '@homzhub/mobile/src/components/molecules/SearchResults';
import { IFilterDetails, IProperties } from '@homzhub/common/src/domain/models/Search';

export enum OnScreenFilters {
  TYPE = 'TYPE',
  PRICE = 'PRICE',
  ROOMS = 'ROOMS',
  MORE = 'MORE',
}

interface IStateProps {
  properties: IProperties[];
  filterData: IFilterDetails | null;
}

interface IPropertySearchScreenState {
  isMapView: boolean;
  selectedOnScreenFilter: OnScreenFilters | string;
  isMenuTrayCollapsed: boolean;
  searchString: string;
  isSearchBarFocused: boolean;
  suggestions: GooglePlaceData[];
}

type Props = WithTranslation & IStateProps;

class PropertySearchScreen extends PureComponent<Props, IPropertySearchScreenState> {
  private searchBar: typeof SearchBar | null = null;
  public state = {
    isMapView: true,
    selectedOnScreenFilter: '',
    isMenuTrayCollapsed: false,
    suggestions: [],
    searchString: '',
    isSearchBarFocused: false,
  };

  public render(): React.ReactNode {
    return (
      <>
        <View style={styles.statusBar}>
          <StatusBar translucent backgroundColor={theme.colors.white} barStyle="dark-content" />
        </View>
        <SafeAreaView style={styles.container}>
          {this.renderFilterTray()}
          {this.renderContent()}
          {this.renderSearchContainer()}
          {this.renderBar()}
        </SafeAreaView>
      </>
    );
  }

  private renderMenuTray = (): React.ReactNode => {
    const { isMenuTrayCollapsed } = this.state;
    if (!isMenuTrayCollapsed) {
      return null;
    }
    return <View style={styles.trayContainer}>{this.renderCollapsibleTray()}</View>;
  };

  private renderContent = (): React.ReactNode => {
    const { isMapView } = this.state;
    const { properties } = this.props;
    return (
      <View style={styles.flexFour}>
        {isMapView ? (
          <>
            <PropertySearchMap />
            {this.renderMenuTray()}
          </>
        ) : (
          <>
            <PropertySearchList properties={properties} onFavorite={this.onFavoriteProperty} />
            {this.renderMenuTray()}
          </>
        )}
      </View>
    );
  };

  private renderCollapsibleTray = (): React.ReactNode => {
    const { selectedOnScreenFilter } = this.state;
    const { filterData } = this.props;

    if (!filterData) {
      return null;
    }

    switch (selectedOnScreenFilter) {
      case OnScreenFilters.ROOMS:
        return (
          <RoomsFilter
            bedCount={[1, 2]}
            bathroomCount={[3]}
            onSelection={(type: string, value: number): void => console.log(type)}
          />
        );
      case OnScreenFilters.TYPE:
        return <AssetTypeFilter filterData={filterData} />;
      default:
        return null;
    }
  };

  private renderSearchContainer = (): React.ReactNode => {
    const { isSearchBarFocused, searchString } = this.state;
    const { t } = this.props;
    if (!isSearchBarFocused) {
      return null;
    }
    return (
      <View style={styles.searchLocation}>
        <SearchBar
          // @ts-ignore
          onRef={(input: SearchBar): void => {
            this.searchBar = input;
          }}
          placeholder={t('enterLocation')}
          updateValue={this.onSearchStringUpdate}
          value={searchString}
          autoFocus
          containerStyle={styles.searchBarContainer}
          cancelButtonStyle={styles.cancelButtonStyle}
          cancelTextStyle={styles.cancelTextStyle}
          onFocusChange={this.onSearchBarFocusChange}
        />
        {this.renderSearchResults()}
      </View>
    );
  };

  private renderFilterTray = (): React.ReactNode => {
    const { t } = this.props;
    const { selectedOnScreenFilter, isMenuTrayCollapsed } = this.state;
    const onScreenFilters = [
      { type: OnScreenFilters.TYPE, label: t('type') },
      { type: OnScreenFilters.PRICE, label: t('price') },
      { type: OnScreenFilters.ROOMS, label: t('rooms') },
      { type: OnScreenFilters.MORE, label: icons.filter },
    ];
    return (
      <>
        <View style={styles.filterTray}>
          {/* TODO: To be changed to search bar component */}
          <Label
            type="large"
            textType="regular"
            // @ts-ignore
            onPress={this.onSearchBarFocusChange}
          >
            Selected Address
          </Label>
          <View style={styles.menuTrayContainer}>
            {onScreenFilters.map((item: { type: OnScreenFilters; label: string }, index: number) => {
              const { type, label } = item;
              let buttonType: ButtonType = 'secondary';
              let fontWeight: FontWeightType = 'regular';
              let iconColor = theme.colors.primaryColor;
              if (selectedOnScreenFilter === type) {
                buttonType = 'primary';
                fontWeight = 'semiBold';
                iconColor = theme.colors.secondaryColor;
              }

              const onPress = (): void =>
                this.setState({ selectedOnScreenFilter: type, isMenuTrayCollapsed: !isMenuTrayCollapsed });

              const navigateToFilters = (): void => console.log('Navigate to Filters');

              if (index === 3) {
                return (
                  <Button
                    key={type}
                    type={buttonType}
                    icon={label}
                    iconColor={iconColor}
                    iconSize={20}
                    onPress={navigateToFilters}
                    iconStyle={styles.menuButtonText}
                    containerStyle={styles.filterButtons}
                  />
                );
              }
              return (
                <Button
                  key={type}
                  title={label}
                  type={buttonType}
                  textType="label"
                  textSize="regular"
                  fontType={fontWeight}
                  onPress={onPress}
                  containerStyle={styles.filterButtons}
                  titleStyle={styles.menuButtonText}
                />
              );
            })}
          </View>
        </View>
        <Divider />
      </>
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

  private renderBar = (): React.ReactNode => {
    const { isMapView, isMenuTrayCollapsed, isSearchBarFocused } = this.state;
    if (isMenuTrayCollapsed || isSearchBarFocused) {
      return null;
    }
    return (
      <View style={styles.bar}>
        <View style={styles.propertiesFound}>
          <Label type="regular" textType="regular">
            102 Properties found
          </Label>
        </View>
        <ToggleButton
          onToggle={this.handleToggle}
          title={isMapView ? 'List' : 'Map'}
          icon={isMapView ? icons.list : icons.map}
        />
      </View>
    );
  };

  public onFavoriteProperty = (propertyId: number): void => {};

  private onSearchStringUpdate = (searchString: string): void => {
    this.setState({ searchString }, () => {
      if (searchString.length <= 0) {
        return;
      }
      this.getAutocompleteSuggestions();
    });
  };

  private onGetCurrentPositionSuccess = (data: GeolocationResponse): void => {
    const {
      coords: { latitude, longitude },
    } = data;
    console.log(latitude, longitude);
  };

  private onSuggestionPress = (place: GooglePlaceData): void => {
    if (this.searchBar) {
      // @ts-ignore
      this.searchBar.SearchTextInput.blur();
    }
  };

  private onSearchBarFocusChange = (isSearchBarFocused: boolean): void => {
    this.setState({ isSearchBarFocused });
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

  private handleToggle = (): void => {
    const { isMapView } = this.state;
    this.setState({
      isMapView: !isMapView,
    });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getPropertiesArray } = SearchSelector;
  return {
    properties: getPropertiesArray(state),
    filterData: SearchSelector.getFilterDetail(state),
  };
};

export default connect(
  mapStateToProps,
  null
)(withTranslation(LocaleConstants.namespacesKey.propertySearch)(PropertySearchScreen));

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexFour: {
    flex: 4,
  },
  statusBar: {
    height: PlatformUtils.isIOS() ? 30 : StatusBar.currentHeight,
    backgroundColor: theme.colors.background,
  },
  bar: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: theme.viewport.height * 0.2,
    width: theme.viewport.width,
    paddingHorizontal: theme.layout.screenPadding,
  },
  menuTrayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: 12,
  },
  filterButtons: {
    flex: 0,
  },
  menuButtonText: {
    marginVertical: 8,
    marginHorizontal: 24,
  },
  propertiesFound: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  trayContainer: {
    backgroundColor: theme.colors.white,
    padding: 20,
    position: 'absolute',
    top: 0,
    borderRadius: 4,
  },
  searchBarContainer: {
    backgroundColor: theme.colors.white,
  },
  cancelButtonStyle: {
    backgroundColor: theme.colors.white,
  },
  cancelTextStyle: {
    color: theme.colors.primaryColor,
  },
  resultListContainer: {
    backgroundColor: theme.colors.white,
  },
  searchLocation: {
    backgroundColor: theme.colors.white,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  filterTray: {
    flex: 1,
    backgroundColor: theme.colors.white,
    justifyContent: 'space-between',
  },
});
