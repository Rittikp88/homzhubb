import { Coordinate, PointOfInterest } from '@homzhub/common/src/services/GooglePlaces/interfaces';

// Constants
const RADIUS_OF_EARTH_IN_KM = 6371.071;
const KM_TO_MILES_RATE = 1.60934;
const LIMIT = 10;

class ResponseHelper {
  public transformPOIs = (pointsOfInterest: any, originPoint: Coordinate): PointOfInterest[] => {
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
        distanceFromOrigin: this.haversineDistance(originPoint, { latitude, longitude }),
      } as PointOfInterest;
    });
  };

  private haversineDistance = (coordOrigin: Coordinate, coordDest: Coordinate, isMiles = false): number => {
    const { latitude: origLat, longitude: origLng } = coordOrigin;
    const { latitude: destLat, longitude: destLng } = coordDest;

    const latDistance = this.calculateDistance(destLat, origLat);
    const lngDistance = this.calculateDistance(destLng, origLng);

    const origLatInRad = this.toRadian(origLat);
    const destLatInRad = this.toRadian(destLat);

    // Haversine Formula

    const a =
      Math.sin(latDistance / 2) ** 2 + Math.sin(lngDistance / 2) ** 2 * Math.cos(origLatInRad) * Math.cos(destLatInRad);
    const c = 2 * Math.asin(Math.sqrt(a));

    // Final Distance
    let finalDistance = RADIUS_OF_EARTH_IN_KM * c;
    if (isMiles) {
      finalDistance /= KM_TO_MILES_RATE;
    }
    return finalDistance;
  };

  private toRadian = (angle: number): number => (Math.PI / 180) * angle;
  private calculateDistance = (orig: number, dest: number): number => (Math.PI / 180) * (orig - dest);
}

const RH = new ResponseHelper();
export { RH as ResponseHelper };