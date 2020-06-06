import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { ICountryCode } from '@homzhub/common/src/domain/models/CountryCode';

class CommonService {
  public getCountryWithCode = async (): Promise<IDropdownOption[]> => {
    const response = await CommonRepository.getCountryCodes();
    const countryCodeOptions: IDropdownOption[] = [];
    response.forEach((obj: ICountryCode) => {
      const data = {
        label: `${obj.country} (${obj.country_code})`,
        value: obj.country_code,
      };
      countryCodeOptions.push(data);
    });

    return countryCodeOptions;
  };

  public getCarpetAreaUnits = async (): Promise<IDropdownOption[]> => {
    return await CommonRepository.getCarpetAreaUnits();
  };
}

const commonService = new CommonService();
export { commonService as CommonService };
