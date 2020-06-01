// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/extensions,import/no-unresolved
import { Storage, CryptoJS } from './index';

export enum StorageKeys {
  IS_ONBOARDING_COMPLETED = '@is_onBoarding_completed',
  USER = '@user',
}

class StorageService {
  // TODO (Rishabh 31-May-2020): Move this secret out
  private secret = 'secret';

  public get = async <T>(key: string): Promise<T | null> => {
    const value: string | null = await Storage.getItem(key);
    if (!value) {
      return null;
    }

    const bytes = CryptoJS.AES.decrypt(value, this.secret);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData as T;
  };

  public set = async <T>(key: string, data: T): Promise<void> => {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), this.secret).toString();
    await Storage.setItem(key, encryptedData);
  };

  public remove = async (key: string): Promise<void> => {
    await Storage.removeItem(key);
  };

  public reset = async (): Promise<void> => {
    await Storage.clear();
  };
}

const storageService = new StorageService();
export { storageService as StorageService };
