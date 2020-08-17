import axios, { AxiosRequestConfig, AxiosError, AxiosResponse, AxiosInstance } from 'axios';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { store } from '@homzhub/common/src/modules/store';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import {
  IApiInterceptor,
  IApiRequestInterceptor,
  IApiResponseInterceptor,
} from '@homzhub/common/src/network/Interfaces';
import { IRefreshToken, IUserPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { TOKEN_NOT_VALID } from '@homzhub/common/src/network/Constants';

const REFRESH_TOKEN_ENDPOINT = 'token/refresh/';

class Interceptor implements IApiInterceptor {
  private client: AxiosInstance = axios.create({
    baseURL: ConfigHelper.getBaseUrl(),
  });

  public request = (): IApiRequestInterceptor => {
    const onFulfilled = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
      const user: IUserPayload | null = (await StorageService.get(StorageKeys.USER)) ?? null;
      if (!user) {
        return config;
      }
      config.headers.Authorization = `Bearer ${user.access_token}`;
      return config;
    };

    const onRejected = (error: AxiosError): any => error;

    return { onFulfilled, onRejected };
  };

  public response = (): IApiResponseInterceptor => {
    const onFulfilled = (value: AxiosResponse): AxiosResponse => value;

    const onRejected = async (error: AxiosError): Promise<any> => {
      const originalRequest: AxiosRequestConfig = error.config;
      const errorCode = error.response?.data?.error?.error_code || '';
      const user: IUserPayload | null = (await StorageService.get(StorageKeys.USER)) ?? null;

      // If not a token expiry error, proceed as usual, or not a logged in user
      if (errorCode !== TOKEN_NOT_VALID || !user) {
        throw error;
      }

      // eslint-disable-next-line no-useless-catch
      try {
        const response = await this.client.post(REFRESH_TOKEN_ENDPOINT, {
          refresh: user.refresh_token,
        });

        const { data } = response.data;
        const tokens: IRefreshToken = {
          access_token: data.access,
          refresh_token: data.refresh,
        };

        await StorageService.set(StorageKeys.USER, { ...user, ...tokens });
        originalRequest.headers = {
          Authorization: `Bearer ${tokens.access_token}`,
        };

        if (originalRequest.data) {
          originalRequest.data = JSON.parse(originalRequest.data);
        }

        return await this.client.request(originalRequest);
      } catch (e) {
        store.dispatch(UserActions.logoutSuccess());
        await StorageService.remove(StorageKeys.USER);
        throw e;
      }
    };

    return { onFulfilled, onRejected };
  };
}

const interceptor = new Interceptor();
export { interceptor as Interceptor };
