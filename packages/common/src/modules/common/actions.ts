import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { Country, ICountry } from '@homzhub/common/src/domain/models/Country';

const actionTypePrefix = 'Common/';
export const CommonActionTypes = {
  GET: {
    COUNTRIES: `${actionTypePrefix}COUNTRIES`,
    COUNTRIES_SUCCESS: `${actionTypePrefix}COUNTRIES_SUCCESS`,
  },
  SET: {
    DEVICE_COUNTRY: `${actionTypePrefix}DEVICE_COUNTRY`,
  },
};

const getCountries = (): IFluxStandardAction => ({
  type: CommonActionTypes.GET.COUNTRIES,
});

const getCountriesSuccess = (payload: Country[]): IFluxStandardAction<ICountry[]> => ({
  type: CommonActionTypes.GET.COUNTRIES_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const setDeviceCountry = (countryCode: string): IFluxStandardAction<string> => ({
  type: CommonActionTypes.SET.DEVICE_COUNTRY,
  payload: countryCode,
});

export type CommonActionPayloadTypes = ICountry[] | string;
export const CommonActions = {
  getCountries,
  getCountriesSuccess,
  setDeviceCountry,
};
