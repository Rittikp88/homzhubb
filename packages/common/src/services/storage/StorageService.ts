// @ts-ignore
import { Storage } from './index';

class StorageService {
  public get = async <T>(key: string): Promise<T | null> => {
    const value: string | null = await Storage.getItem(key);
    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  };

  public set = async <T>(key: string, data: T): Promise<void> => {
    await Storage.setItem(key, JSON.stringify(data));
  };

  public remove = async (key: string): Promise<void> => {
    await Storage.removeItem(key);
  };

  public reset = async (): Promise<void> => {
    await Storage.clear();
  };

  public clear = async (): Promise<void> => {
    const keysToRemove = [LocalStorageKeys.TOKEN];
    await Storage.multiRemove(keysToRemove);
  };

  public clearUserData = async (): Promise<void> => {
    await Storage.removeItem(LocalStorageKeys.TOKEN);
  };
}

export const LocalStorageKeys = {
  TOKEN: '@token',
};

export type LocalStorageKeysName = keyof typeof LocalStorageKeys;

const storageService = new StorageService();
export { storageService as StorageService };
