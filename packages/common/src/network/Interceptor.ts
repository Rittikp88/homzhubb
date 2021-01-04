import axios, { AxiosRequestConfig, AxiosError, AxiosResponse, AxiosInstance } from 'axios';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import {
  IApiInterceptor,
  IApiRequestInterceptor,
  IApiResponseInterceptor,
} from '@homzhub/common/src/network/Interfaces';
import { IRefreshToken } from '@homzhub/common/src/domain/repositories/interfaces';
import { TOKEN_NOT_VALID } from '@homzhub/common/src/network/Constants';

const REFRESH_TOKEN_ENDPOINT = 'users/token/refresh/';

class Interceptor implements IApiInterceptor {
  private client: AxiosInstance = axios.create({
    baseURL: ConfigHelper.getBaseUrl(),
  });

  public request = (): IApiRequestInterceptor => {
    const onFulfilled = (config: AxiosRequestConfig): AxiosRequestConfig => {
      const token = StoreProviderService.getUserToken();
      if (!token) {
        return config;
      }
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    };

    const onRejected = (error: AxiosError): any => error;

    return { onFulfilled, onRejected };
  };

  public response = (): IApiResponseInterceptor => {
    const onFulfilled = (value: AxiosResponse): AxiosResponse => value;

    const onRejected = async (error: AxiosError): Promise<any> => {
      const originalRequest: AxiosRequestConfig = error.config;
      const errorCode = error.response?.data?.error[0]?.error_code || '';

      const token = StoreProviderService.getUserRefreshToken();

      // If not a token expiry error, proceed as usual, or not a logged in user
      if (errorCode !== TOKEN_NOT_VALID || !token) {
        throw error;
      }

      // eslint-disable-next-line no-useless-catch
      try {
        const response = await this.client.post(REFRESH_TOKEN_ENDPOINT, {
          refresh: token,
        });

        const { data } = response.data;
        const tokens: IRefreshToken = {
          access_token: data.access,
          refresh_token: data.refresh,
        };

        StoreProviderService.loginSuccess(tokens);
        await StorageService.set(StorageKeys.USER, tokens);

        originalRequest.headers = {
          Authorization: `Bearer ${tokens.access_token}`,
        };

        if (originalRequest.data) {
          originalRequest.data = JSON.parse(originalRequest.data);
        }

        return await this.client.request(originalRequest);
      } catch (e) {
        StoreProviderService.logoutUser();
        await StorageService.remove(StorageKeys.USER);
        throw e;
      }
    };

    return { onFulfilled, onRejected };
  };
}

const interceptor = new Interceptor();
export { interceptor as Interceptor };
