import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Script from 'react-load-script';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import GoogleMapView from '@homzhub/web/src/components/atoms/GoogleMapView';
import { CustomMarker } from '@homzhub/web/src/screens/searchProperty/components/CustomMarker';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { ILatLng } from '@homzhub/common/src/modules/search/interface';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IProps {
  searchLocation?: ILatLng;
}

interface IStateProps {
  properties: AssetSearch;
  filters: IFilter;
}

interface IDispatchProps {
  setFilter: (payload: IFilter) => void;
  getProperties: () => void;
}

type Props = IProps & IDispatchProps & IStateProps;

const SearchMapView: React.FC<Props> = (props: Props) => {
  const [hasScriptLoaded, setHasScriptLoaded] = useState(false);
  const { properties, filters } = props;
  const { results } = properties;
  const lat = filters.search_latitude || 0;
  const lng = filters.search_longitude || 0;
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const handleOnMapLoad = (mapInstance: google.maps.Map): void => {
    setMap(mapInstance);
  };
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  const onSelectMarker = (id: number | null): void => {
    setSelectedMarkerId(id);
  };
  const getSelectedMarker = (id: number): boolean => {
    if (selectedMarkerId && id === selectedMarkerId) {
      return true;
    }
    return false;
  };
  return (
    <View style={styles.container}>
      <Script
        url={`https://maps.googleapis.com/maps/api/js?key=${ConfigHelper.getPlacesApiKey()}&libraries=places`}
        onLoad={(): void => setHasScriptLoaded(true)}
      />
      {hasScriptLoaded && (
        <GoogleMapView center={{ lat, lng }} onMapLoadCallBack={handleOnMapLoad} zoom={12}>
          {results.map((property) => {
            if (map) {
              return (
                <CustomMarker
                  position={{ lat: property.latitude, lng: property.longitude }}
                  key={property.id}
                  selected={getSelectedMarker(property.id)}
                  propertyData={property}
                  onSelectMarker={(id: number | null): void => onSelectMarker(id)}
                />
              );
            }
            return [];
          })}
        </GoogleMapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '45vw',
  },
});
export const mapStateToProps = (state: IState): IStateProps => {
  const { getProperties, getFilters } = SearchSelector;
  return {
    properties: getProperties(state),
    filters: getFilters(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setFilter, getProperties } = SearchActions;
  return bindActionCreators(
    {
      setFilter,
      getProperties,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchMapView);
