import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { IState } from '@homzhub/common/src/modules/interfaces';

const getCountryList = (state: IState): Country[] => {
  const {
    common: { countries },
  } = state;
  return ObjectMapper.deserializeArray(Country, countries);
};

const getDeviceCountry = (state: IState): string => {
  const {
    common: { deviceCountry },
  } = state;
  return deviceCountry;
};

const getDefaultPhoneCode = (state: IState): string => {
  const countries = getCountryList(state);
  const deviceCountry = getDeviceCountry(state);

  for (let i = 0; i < countries.length; i++) {
    if (countries[i].iso2Code === deviceCountry) {
      return countries[i].phoneCodes[0];
    }
  }

  return '';
};

export const CommonSelectors = {
  getCountryList,
  getDefaultPhoneCode,
  getDeviceCountry,
};
