import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
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

const getDefaultCurrency = (state: IState): Currency => {
  const countries = getCountryList(state);
  const deviceCountry = getDeviceCountry(state);

  for (let i = 0; i < countries.length; i++) {
    if (countries[i].iso2Code === deviceCountry) {
      return countries[i].currencies[0];
    }
  }

  return new Currency();
};

export const CommonSelectors = {
  getCountryList,
  getDefaultPhoneCode,
  getDeviceCountry,
  getDefaultCurrency,
};
