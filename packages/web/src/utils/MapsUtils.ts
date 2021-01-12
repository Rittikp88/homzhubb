export const getDataFromPlaceID = (
  placeID: string,
  callback: (geocoderResult: google.maps.GeocoderResult) => void
): void => {
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
