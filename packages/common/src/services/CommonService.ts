import axios from 'axios';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { Country } from '@homzhub/common/src/domain/models/CountryCode';
import { IUser } from '@homzhub/common/src/domain/models/User';

class CommonService {
  public getCountryWithCode = async (): Promise<IDropdownOption[]> => {
    const response = await CommonRepository.getCountryCodes();
    const countryCodeOptions: IDropdownOption[] = [];
    response.forEach((country: Country) => {
      country.phoneCodes.forEach((code) => {
        const data = {
          label: `${country.name} (${code})`,
          value: code,
        };
        countryCodeOptions.push(data);
      });
    });

    return countryCodeOptions;
  };

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
