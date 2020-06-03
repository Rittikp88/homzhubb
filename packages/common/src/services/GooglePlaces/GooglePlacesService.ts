import axios from 'axios';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { GooglePlaceData, GooglePlaceDetail, Point } from '@homzhub/common/src/services/GooglePlaces/interfaces';

const ENDPOINTS = {
  autoComplete: (): string => 'place/autocomplete/json',
  getPlaceDetail: (): string => 'place/details/json',
  getLocationData: (): string => 'geocode/json',
};

class GooglePlacesService {
  private axiosInstance = axios.create({
    baseURL: ConfigHelper.getPlacesBaseUrl(),
  });

  private apiKey: string = ConfigHelper.getPlacesApiKey();

  public autoComplete = async (input: string): Promise<GooglePlaceData[]> => {
    const response = await this.axiosInstance.get(ENDPOINTS.autoComplete(), {
      params: {
        key: this.apiKey,
        input,
        inputtype: 'textquery',
      },
    });

    this.checkError(response.data);

    return response.data.predictions;
  };

  public getPlaceDetail = async (placeId: string): Promise<GooglePlaceDetail> => {
    const response = await this.axiosInstance.get(ENDPOINTS.getPlaceDetail(), {
      params: {
        key: this.apiKey,
        place_id: placeId,
      },
    });

    this.checkError(response.data);

    return response.data.result;
  };

  public getLocationData = async (point: Point): Promise<void> => {
    const response = await this.axiosInstance.get(ENDPOINTS.getLocationData(), {
      params: {
        key: this.apiKey,
        latlng: `${point.lat},${point.lng}`,
      },
    });

    this.checkError(response.data);
  };

  private checkError = (object: Record<string, any>): void => {
    if (object.hasOwnProperty('error_message')) {
      throw new Error(object.error_message);
    }
  };
}

const gps = new GooglePlacesService();
export { gps as GooglePlacesService };
