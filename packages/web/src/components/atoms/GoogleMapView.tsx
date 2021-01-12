import React, { FC, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const centerDefault = {
  lat: 12.930993354465738,
  lng: 77.63309735316916,
};
const markerPosition = {
  lat: 12.930993354465738,
  lng: 77.63309735316916,
};

interface IProps {
  center?: { lat: number; lng: number };
}

const GoogleMapView: FC<IProps> = (props: IProps) => {
  const { center } = props;
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback((mapInstance: google.maps.Map) => {
    setMap(null);
  }, []);
  const onLoadMarker = (marker: google.maps.Marker): void => {
    // todos empty
  };
  const onDragStart = (event: google.maps.MapMouseEvent): void => {
    // todos empty
  };
  const onDragEnd = (event: google.maps.MapMouseEvent): void => {
    // todos empty
  };
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
        <Marker
          onLoad={onLoadMarker}
          position={center || markerPosition}
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
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
