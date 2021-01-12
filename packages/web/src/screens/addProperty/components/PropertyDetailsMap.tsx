import React, { FC, useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AddPropertyContext, ILatLng } from '@homzhub/web/src/screens/addProperty/AddPropertyContext';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { theme } from '@homzhub/common/src/styles/theme';
import GoogleMapView from '@homzhub/web/src/components/atoms/GoogleMapView';
import PropertyDetailsForm from '@homzhub/web/src/screens/addProperty/components/PropertyDetailsForm';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { ResponseHelper } from '@homzhub/common/src/services/GooglePlaces/ResponseHelper';

const PropertyDetailsMap: FC = () => {
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const {
    hasScriptLoaded,
    latLng,
    setUpdatedLatLng,
    setPlacesData,
    placeData,
    setAddressDetails,
    addressDetails,
  } = useContext(AddPropertyContext);
  useEffect(() => {
    if (hasScriptLoaded) {
      GooglePlacesService.getLocationData(latLng).then((response) => {
        console.log('Service Response => ', response);
        setPlacesData(response);
        setAddressDetails(ResponseHelper.getLocationDetails(response));
        // update location
        // transform data
      });
    }
  }, [latLng, hasScriptLoaded]);
  const handleMapCenterChange = (newCenter: ILatLng): void => {
    setUpdatedLatLng(newCenter);
  };

  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      {hasScriptLoaded && <GoogleMapView center={latLng} updateCenter={handleMapCenterChange} />}
      <PropertyDetailsForm placeData={placeData} addressDetails={addressDetails} />
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
