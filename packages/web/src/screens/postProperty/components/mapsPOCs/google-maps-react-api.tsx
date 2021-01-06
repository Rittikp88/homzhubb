import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '1200px',
  height: '600px',
};

const center = {
  lat: 12.930993354465738,
  lng: 77.63309735316916,
};
const markerPosition = {
  lat: 12.930993354465738,
  lng: 77.63309735316916,
};
const MapsPOC = () => {
  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);
  const onLoadMarker = (marker) => {
    console.log('marker: ', marker);
  };
  const onDragStart = (event) => {
    console.log('Start => ', event);
  };
  const onDragEnd = (event) => {
    console.log('End => ', event);
    const { lat, lng } = event.latLng;
    console.log('Lat : Lng => ', lat(), ' : ', lng());
  };
  return (
    <LoadScript googleMapsApiKey="AIzaSyByRBRQOqRY-QFHeWZwPcOl1PLAXPNhzmc">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} onLoad={onLoad} onUnmount={onUnmount}>
        {/* Child components, such as markers, info windows, etc. */}
        <Marker
          onLoad={onLoadMarker}
          position={markerPosition}
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapsPOC;
