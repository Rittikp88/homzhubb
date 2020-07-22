import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { CountryCode } from '@homzhub/common/src/domain/models/CountryCode';

class CommonService {
  public getCountryWithCode = async (): Promise<IDropdownOption[]> => {
    const response = await CommonRepository.getCountryCodes();
    const countryCodeOptions: IDropdownOption[] = [];
    response.forEach((obj: CountryCode) => {
      const data = {
        label: `${obj.country} (${obj.countryCode})`,
        value: obj.countryCode,
      };
      countryCodeOptions.push(data);
    });

    return countryCodeOptions;
  };
}

const commonService = new CommonService();
export { commonService as CommonService };
