import React, { FC, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import GoogleMapView from '@homzhub/web/src/components/atoms/GoogleMapView';
import PropertyDetailsForm from '@homzhub/web/src/screens/addProperty/components/PropertyDetailsForm';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { AddPropertyContext } from '../AddPropertyContext';

const PropertyDetailsMap: FC = () => {
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const { hasScriptLoaded, latLng } = useContext(AddPropertyContext);
  // todo => getDetails from location or place id whatever is available and display data accordingly currently getPlacedetails is not working
  // GooglePlacesService.getPlaceDetail(selectedPlaceId).then((r) => console.log(`placeid-----------------------${r}`));
  // GooglePlacesService.getLocationData(latLng).then((r) => console.log(r));
  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      {hasScriptLoaded && <GoogleMapView center={latLng} />}
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
