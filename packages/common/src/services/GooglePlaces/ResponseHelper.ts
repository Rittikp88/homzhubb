import { PointOfInterest } from '@homzhub/common/src/services/GooglePlaces/interfaces';

const LIMIT = 10;
class ResponseHelper {
  public transformPOIs = (pointsOfInterest: any): PointOfInterest[] => {
    return pointsOfInterest.slice(0, LIMIT).map((POI: any) => {
      const {
        place_id,
        name,
        geometry: {
          location: { lat: latitude, lng: longitude },
        },
      } = POI;
      return {
        name,
        placeId: place_id,
        latitude,
        longitude,
      };
    });
  };
}

const RH = new ResponseHelper();
export { RH as ResponseHelper };
