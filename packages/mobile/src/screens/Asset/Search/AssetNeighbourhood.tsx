/* eslint-disable react/no-unused-state */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { WithTranslation, withTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { PointOfInterest } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { PlaceTypes } from '@homzhub/common/src/services/GooglePlaces/constants';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { CustomMarker, SelectionPicker } from '@homzhub/common/src/components';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';
import { ExploreSections } from '@homzhub/mobile/src/components/molecules/ExploreSections';
import { Header } from '@homzhub/mobile/src/components/molecules/Header';
import { SearchStackParamList } from '@homzhub/mobile/src/navigation/SearchStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { Asset } from '@homzhub/common/src/domain/models/Asset';

// CONSTANTS & ENUMS
enum Tabs {
  Nearby = 0,
  Commute = 1,
}

const PLACES_DATA = {
  [Tabs.Commute]: {
    [PlaceTypes.Railway]: {
      key: PlaceTypes.Railway,
      label: 'railwayStations',
      icon: icons.train,
      mapMarker: icons.trainMarker,
    },
    [PlaceTypes.BusStation]: {
      key: PlaceTypes.BusStation,
      label: 'busStations',
      icon: icons.bus,
      mapMarker: icons.busMarker,
    },
    [PlaceTypes.Airport]: {
      key: PlaceTypes.Airport,
      label: 'airports',
      icon: icons.airport,
      mapMarker: icons.airportMarker,
    },
  },
  [Tabs.Nearby]: {
    [PlaceTypes.School]: {
      key: PlaceTypes.School,
      label: 'schools',
      icon: icons.school,
      mapMarker: icons.schoolMarker,
    },
    [PlaceTypes.Mall]: { key: PlaceTypes.Mall, label: 'malls', icon: icons.mall, mapMarker: icons.mallMarker },
    [PlaceTypes.Restaurant]: {
      key: PlaceTypes.Restaurant,
      label: 'restaurants',
      icon: icons.restaurant,
      mapMarker: icons.restaurantMarker,
    },
    [PlaceTypes.GasStation]: {
      key: PlaceTypes.GasStation,
      label: 'fuelStations',
      icon: icons.fuel,
      mapMarker: icons.fuelMarker,
    },
    [PlaceTypes.Hospital]: {
      key: PlaceTypes.Hospital,
      label: 'hospitals',
      icon: icons.hospital,
      mapMarker: icons.hospitalMarker,
    },
    [PlaceTypes.Groceries]: {
      key: PlaceTypes.Groceries,
      label: 'groceryStores',
      icon: icons.grocery,
      mapMarker: icons.groceryMarker,
    },
    [PlaceTypes.Park]: { key: PlaceTypes.Park, label: 'parks', icon: icons.park, mapMarker: icons.parkMarker },
    [PlaceTypes.FilmTheater]: {
      key: PlaceTypes.FilmTheater,
      label: 'filmTheaters',
      icon: icons.cinema,
      mapMarker: icons.cinemaMarker,
    },
    [PlaceTypes.Atm]: { key: PlaceTypes.Atm, label: 'atms', icon: icons.bank, mapMarker: icons.bankMarker },
    [PlaceTypes.Chemist]: {
      key: PlaceTypes.Chemist,
      label: 'pharmacies',
      icon: icons.chemist,
      mapMarker: icons.chemistMarker,
    },
    [PlaceTypes.Lodging]: { key: PlaceTypes.Lodging, label: 'hotels', icon: icons.lodge, mapMarker: icons.lodgeMarker },
  },
};

const EXPANDED = theme.viewport.height * 0.45;

// INTERFACES & TYPES
interface IStateProps {
  asset: Asset | null;
}
interface IOwnState {
  selectedTab: Tabs;
  selectedPlaceType: PlaceTypes;
  isBottomSheetVisible: boolean;
  pointsOfInterest: PointOfInterest[];
  selectedPlaceId: string;
  isApiActive: boolean;
}

type libraryProps = WithTranslation & NavigationScreenProps<SearchStackParamList, ScreensKeys.AssetNeighbourhood>;
type Props = IStateProps & libraryProps;

class AssetNeighbourhood extends React.Component<Props, IOwnState> {
  private mapRef: MapView | null = null;

  public state = {
    isBottomSheetVisible: false,
    selectedTab: Tabs.Nearby,
    selectedPlaceType: Object.values(PLACES_DATA[Tabs.Nearby])[0].key,
    pointsOfInterest: [],
    selectedPlaceId: '',
    isApiActive: false,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.fetchPOIs();
    this.setState({ isBottomSheetVisible: true });
  };

  public shouldComponentUpdate = (nextProps: Props, nextState: IOwnState): boolean => {
    const { isApiActive, selectedPlaceType, selectedTab } = nextState;
    const { selectedPlaceType: oldType, selectedTab: oldTab } = this.state;
    return !(isApiActive || selectedTab !== oldTab || selectedPlaceType !== oldType);
  };

  public render = (): React.ReactNode => {
    const { asset, t } = this.props;
    const { selectedTab, selectedPlaceType, isBottomSheetVisible, pointsOfInterest, selectedPlaceId } = this.state;

    if (!asset) return null;
    const {
      assetLocation: { longitude, latitude },
    } = asset;

    return (
      <View style={styles.container}>
        <Header
          type="secondary"
          icon={icons.leftArrow}
          onIconPress={this.onBackPress}
          isHeadingVisible
          title={asset.projectName}
        />
        <MapView
          ref={(mapRef: MapView): void => {
            this.mapRef = mapRef;
          }}
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          <Marker coordinate={{ latitude, longitude }}>
            <CustomMarker selected />
          </Marker>
          {this.renderMarkers()}
        </MapView>
        <View style={styles.floatingTab}>
          <SelectionPicker
            data={[
              { title: t('nearby'), value: Tabs.Nearby },
              { title: t('commute'), value: Tabs.Commute },
            ]}
            selectedItem={[selectedTab]}
            onValueChange={this.onTabChange}
          />
        </View>
        <BottomSheet
          visible={isBottomSheetVisible}
          renderHeader={false}
          sheetHeight={EXPANDED}
          onCloseSheet={this.onBottomSheetClose}
        >
          <ExploreSections
            placeTypes={Object.values(PLACES_DATA[selectedTab])}
            // @ts-ignore
            selectedPlaceType={PLACES_DATA[selectedTab][selectedPlaceType]}
            onPlaceTypePress={this.onPlaceTypeChange}
            selectedPoiId={selectedPlaceId}
            pointsOfInterest={pointsOfInterest}
            onPoiPress={this.onPoiPress}
          />
        </BottomSheet>
      </View>
    );
  };

  private renderMarkers = (): React.ReactNode => {
    const { pointsOfInterest, selectedPlaceId, selectedTab, selectedPlaceType } = this.state;
    // @ts-ignore
    const placeType = PLACES_DATA[selectedTab][selectedPlaceType];

    return pointsOfInterest.map((point: PointOfInterest) => (
      <Marker key={point.placeId} coordinate={{ latitude: point.latitude, longitude: point.longitude }}>
        <Icon
          name={placeType.mapMarker}
          color={selectedPlaceId === point.placeId ? theme.colors.active : theme.colors.darkTint5}
          size={24}
        />
      </Marker>
    ));
  };

  private onTabChange = (selectedTab: Tabs): void => {
    const { selectedTab: oldTab, selectedPlaceType } = this.state;

    let placeTypeToUpdate = selectedPlaceType;
    if (oldTab !== selectedTab) {
      placeTypeToUpdate = Object.values(PLACES_DATA[selectedTab])[0].key;
    }

    this.setState({ selectedTab, selectedPlaceType: placeTypeToUpdate, isBottomSheetVisible: true }, () => {
      this.fetchPOIs().then();
    });
  };

  private onPlaceTypeChange = (selectedPlaceType: PlaceTypes): void => {
    this.setState({ selectedPlaceType }, () => {
      this.fetchPOIs().then();
    });
  };

  private onBottomSheetClose = (): void => {
    this.setState({ isBottomSheetVisible: false });
  };

  private onPoiPress = (poi: PointOfInterest): void => {
    const { latitude, longitude, placeId } = poi;
    this.setState({ selectedPlaceId: placeId });
    this.mapRef?.animateCamera({
      center: {
        latitude,
        longitude,
      },
    });
  };

  private onBackPress = (): void => {
    const {
      navigation: { goBack },
    } = this.props;
    goBack();
  };

  private fetchPOIs = async (): Promise<void> => {
    const { selectedPlaceType } = this.state;
    const { asset } = this.props;

    if (!asset) return;
    this.setState({ isApiActive: true });
    const { assetLocation } = asset;

    try {
      const pointsOfInterest = await GooglePlacesService.getPOIs(assetLocation, selectedPlaceType);
      this.setState({ pointsOfInterest, isApiActive: false });
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
  floatingTab: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: theme.viewport.height * 0.12,
    alignItems: 'center',
  },
});

const mapStateToProps = (state: IState): IStateProps => {
  const { getAsset } = AssetSelectors;
  return {
    asset: getAsset(state),
  };
};

const connectedComponent = connect(
  mapStateToProps,
  null
)(withTranslation(LocaleConstants.namespacesKey.assetDescription)(AssetNeighbourhood));
export { connectedComponent as AssetNeighbourhood };
