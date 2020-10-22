import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ICommonState } from '@homzhub/common/src/modules/common/interfaces';
import { CommonActionPayloadTypes, CommonActionTypes } from '@homzhub/common/src/modules/common/actions';
import { ICountry } from '@homzhub/common/src/domain/models/Country';

export const initialCommonState: ICommonState = {
  countries: [],
  deviceCountry: '',
};

export const commonReducer = (
  state: ICommonState = initialCommonState,
  action: IFluxStandardAction<CommonActionPayloadTypes>
): ICommonState => {
  switch (action.type) {
    case CommonActionTypes.GET.COUNTRIES:
      return {
        ...state,
        countries: [],
      };
    case CommonActionTypes.GET.COUNTRIES_SUCCESS:
      return {
        ...state,
        countries: action.payload as ICountry[],
      };
    case CommonActionTypes.SET.DEVICE_COUNTRY:
      return {
        ...state,
        ['deviceCountry']: action.payload as string,
      };
    default:
      return {
        ...state,
      };
  }
};
