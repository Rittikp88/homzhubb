import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import MapsPOC from '@homzhub/web/src/components/atoms/GoogleMapView';
import PropertyDetailsForm from '@homzhub/web/src/screens/addProperty/components/PropertyDetailsForm';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  navigateScreen: Function;
}
interface IMapProps {
  coords: { lat: number; lng: number };
}
type Props = IProps & IMapProps;
const PropertyDetailsMap: FC<Props> = (props: Props) => {
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const { coords } = props;
  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      <MapsPOC center={coords} />
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
