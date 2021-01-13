import React, { FC, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { getPlaceDetailsFromPlaceID } from '@homzhub/web/src/utils/MapsUtils';
import { AddPropertyContext, ILatLng } from '@homzhub/web/src/screens/addProperty/AddPropertyContext';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { theme } from '@homzhub/common/src/styles/theme';
import GoogleMapView from '@homzhub/web/src/components/atoms/GoogleMapView';
import PropertyDetailsForm from '@homzhub/web/src/screens/addProperty/components/PropertyDetailsForm';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const PropertyDetailsMap: FC = () => {
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [placeDetails, setPlaceDetails] = useState<google.maps.places.PlaceResult | undefined>(undefined);
  const { hasScriptLoaded, latLng, setUpdatedLatLng } = useContext(AddPropertyContext);
  useEffect(() => {
    if (hasScriptLoaded && map !== null) {
      GooglePlacesService.getLocationData(latLng).then((r) => {
        getPlaceDetailsFromPlaceID(r.place_id, map, (result) => {
          setPlaceDetails(result);
        });
      });
    }
  }, [map, latLng, hasScriptLoaded]);
  const handleMapCenterChange = (newCenter: ILatLng): void => {
    setUpdatedLatLng(newCenter);
  };

  const handleOnMapLoad = (mapInstance: google.maps.Map): void => {
    setMap(mapInstance);
  };

  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      {hasScriptLoaded && (
        <GoogleMapView center={latLng} updateCenter={handleMapCenterChange} onMapLoadCallBack={handleOnMapLoad} />
      )}
      <PropertyDetailsForm data={placeDetails} />
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
