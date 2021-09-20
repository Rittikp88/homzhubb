import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';

const actionTypePrefix = 'PropertyPayment/';
export const PropertyPaymentActionTypes = {
  SET: {
    SELECTED_ASSET_ID: `${actionTypePrefix}SELECTED_ASSET_ID`,
  },
};

const setAssetId = (assetId: number): IFluxStandardAction<number> => ({
  type: PropertyPaymentActionTypes.SET.SELECTED_ASSET_ID,
  payload: assetId,
});

export type ActionPayloadTypes = number;

export const PropertyPaymentActions = {
  setAssetId,
};
