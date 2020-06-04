import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import {
  IApiInterceptor,
  IApiRequestInterceptor,
  IApiResponseInterceptor,
} from '@homzhub/common/src/network/Interfaces';
import { IUserPayload } from '@homzhub/common/src/domain/repositories/interfaces';

class Interceptor implements IApiInterceptor {
  public request = (): IApiRequestInterceptor => {
    const onFulfilled = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
      const user: IUserPayload | null = (await StorageService.get(StorageKeys.USER)) ?? null;
      if (!user) {
        return config;
      }
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${user.access_token}`;
      return config;
    };
    const onRejected = (error: AxiosError): any => error;
    return { onFulfilled, onRejected };
  };

  public response = (): IApiResponseInterceptor => {
    const onFulfilled = (value: AxiosResponse): AxiosResponse => value;
    const onRejected = (error: AxiosError): AxiosError => error;
    return { onFulfilled, onRejected };
  };
}

const interceptor = new Interceptor();
export { interceptor as Interceptor };
