import React, { FC, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { GoogleMap } from '@react-google-maps/api';
import { ILatLng } from '@homzhub/web/src/screens/addProperty/AddPropertyContext';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const centerDefault = {
  lat: 12.930993354465738,
  lng: 77.63309735316916,
};

interface IProps {
  center?: ILatLng;
  updateCenter?: (center: ILatLng) => void;
  onMapLoadCallBack?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
}

const GoogleMapView: FC<IProps> = (props: IProps) => {
  const { center, onMapLoadCallBack, children } = props;
  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    if (onMapLoadCallBack) {
      onMapLoadCallBack(mapInstance);
    }
  }, []);

  const onUnmount = useCallback((mapInstance: google.maps.Map) => {}, []);
  return (
    <View style={styles.container}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center || centerDefault}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Child components, such as markers, info windows, etc. */}
        {children}
      </GoogleMap>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GoogleMapView;
