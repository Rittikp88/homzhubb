import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { ISociety, Society } from '@homzhub/common/src/domain/models/Society';
import { IBankInfoPayload, ISocietyParam, ISocietyPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ISocietyFormData } from '@homzhub/common/src/modules/propertyPayment/interfaces';

const actionTypePrefix = 'PropertyPayment/';
export const PropertyPaymentActionTypes = {
  SET: {
    SELECTED_ASSET_ID: `${actionTypePrefix}SELECTED_ASSET_ID`,
    SOCIETY_FORM_DATA: `${actionTypePrefix}SOCIETY_FORM_DATA`,
    SOCIETY_BANK_DATA: `${actionTypePrefix}SOCIETY_BANK_DATA`,
  },
  GET: {
    SOCIETIES: `${actionTypePrefix}SOCIETIES`,
    SOCIETIES_SUCCESS: `${actionTypePrefix}SOCIETIES_SUCCESS`,
    SOCIETIES_FAILURE: `${actionTypePrefix}SOCIETIES_FAILURE`,
  },
  POST: {
    SOCIETY: `${actionTypePrefix}SOCIETY`,
    SOCIETY_SUCCESS: `${actionTypePrefix}SOCIETY_SUCCESS`,
    SOCIETY_FAILURE: `${actionTypePrefix}SOCIETY_FAILURE`,
  },
  CLEAR: {
    SOCIETY_FORM_DATA: `${actionTypePrefix}SOCIETY_FORM_DATA`,
  },
};

const setAssetId = (assetId: number): IFluxStandardAction<number> => ({
  type: PropertyPaymentActionTypes.SET.SELECTED_ASSET_ID,
  payload: assetId,
});

const getSocieties = (payload?: ISocietyParam): IFluxStandardAction<ISocietyParam> => ({
  type: PropertyPaymentActionTypes.GET.SOCIETIES,
  payload,
});

const getSocietiesSuccess = (payload: Society[]): IFluxStandardAction<ISociety[]> => ({
  type: PropertyPaymentActionTypes.GET.SOCIETIES_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getSocietiesFailure = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.GET.SOCIETIES_FAILURE,
});

const setSocietyFormData = (payload: ISocietyFormData): IFluxStandardAction<ISocietyFormData> => ({
  type: PropertyPaymentActionTypes.SET.SOCIETY_FORM_DATA,
  payload,
});

const clearSocietyFormData = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.CLEAR.SOCIETY_FORM_DATA,
});

const createSociety = (payload: ISocietyPayload): IFluxStandardAction<ISocietyPayload> => ({
  type: PropertyPaymentActionTypes.POST.SOCIETY,
  payload,
});

const createSocietySuccess = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.POST.SOCIETY_SUCCESS,
});

const createSocietyFailure = (): IFluxStandardAction => ({
  type: PropertyPaymentActionTypes.POST.SOCIETY_FAILURE,
});

const setSocietyBankData = (payload: IBankInfoPayload): IFluxStandardAction<IBankInfoPayload> => ({
  type: PropertyPaymentActionTypes.SET.SOCIETY_BANK_DATA,
  payload,
});

export type ActionPayloadTypes =
  | number
  | ISocietyParam
  | ISociety[]
  | ISocietyFormData
  | ISocietyPayload
  | IBankInfoPayload;

export const PropertyPaymentActions = {
  setAssetId,
  getSocieties,
  getSocietiesSuccess,
  getSocietiesFailure,
  setSocietyFormData,
  clearSocietyFormData,
  createSociety,
  createSocietySuccess,
  createSocietyFailure,
  setSocietyBankData,
};
