import { ActionPayloadTypes, PropertyPaymentActionTypes } from '@homzhub/common/src/modules/propertyPayment/actions';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IPropertyPaymentState } from '@homzhub/common/src/modules/propertyPayment/interfaces';

export const initialState: IPropertyPaymentState = {
  selectedAssetId: 0,
};

export const propertyPaymentReducer = (
  state: IPropertyPaymentState = initialState,
  action: IFluxStandardAction<ActionPayloadTypes>
): IPropertyPaymentState => {
  switch (action.type) {
    case PropertyPaymentActionTypes.SET.SELECTED_ASSET_ID:
      return {
        ...state,
        selectedAssetId: action.payload as number,
      };
    default:
      return initialState;
  }
};
