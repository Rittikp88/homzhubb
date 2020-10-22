import axios from 'axios';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { IUser } from '@homzhub/common/src/domain/models/User';

class CommonService {
  public getMarkdownData = async (isFrom: string): Promise<string> => {
    const baseUrl = ConfigHelper.getBaseUrl();
    const urlEndpoint = isFrom === 'verification' ? 'VERIFICATION_DOCUMENT' : 'VISIT_PROPERTY_LOCATION';
    const user: IUser | null = await StorageService.get(StorageKeys.USER);
    const response = await axios.get(`${baseUrl}markdown/${urlEndpoint}/`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${user?.access_token}`,
      },
    });
    return response.data;
  };
}

const commonService = new CommonService();
export { commonService as CommonService };
