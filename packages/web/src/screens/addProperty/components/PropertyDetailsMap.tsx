import React, { FC, useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AddPropertyContext, ILatLng } from '@homzhub/web/src/screens/addProperty/AddPropertyContext';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { theme } from '@homzhub/common/src/styles/theme';
import GoogleMapView from '@homzhub/web/src/components/atoms/GoogleMapView';
import PropertyDetailsForm from '@homzhub/web/src/screens/addProperty/components/PropertyDetailsForm';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const getDataFromPlaceID = (placeID: string, callback: (geocoderResult: google.maps.GeocoderResult) => void): void => {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ placeId: placeID }, (results, status) => {
    if (status === 'OK') {
      if (results[0]) {
        callback(results[0]);
      } else {
        // window.alert('No results found');
      }
    } else {
      // window.alert('Geocoder failed due to: ' + status);
    }
  });
};

const PropertyDetailsMap: FC = () => {
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const { hasScriptLoaded, latLng, selectedPlaceId, setUpdatedLatLng } = useContext(AddPropertyContext);
  useEffect(() => {
    if (hasScriptLoaded) {
      if (selectedPlaceId.length !== 0) {
        getDataFromPlaceID(selectedPlaceId, () => {
          // update location
          // transform data
        });
      } else if (latLng) {
        GooglePlacesService.getLocationData(latLng).then((r) => {
          // update location
          // transform data
        });
      }
    }
  }, [latLng, hasScriptLoaded, selectedPlaceId]);
  const handleMapCenterChange = (newCenter: ILatLng): void => {
    setUpdatedLatLng(newCenter);
  };

  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      {hasScriptLoaded && <GoogleMapView center={latLng} updateCenter={handleMapCenterChange} />}
      <PropertyDetailsForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    padding: 20,
    marginBottom: 48,
    borderRadius: 4,
    width: '100%',
  },
  containerTablet: {
    flexDirection: 'column',
  },
});
export default PropertyDetailsMap;
