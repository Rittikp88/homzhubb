import { ActionPayloadTypes, PropertyPaymentActionTypes } from '@homzhub/common/src/modules/propertyPayment/actions';
import { ISociety } from '@homzhub/common/src/domain/models/Society';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IPropertyPaymentState } from '@homzhub/common/src/modules/propertyPayment/interfaces';

export const initialState: IPropertyPaymentState = {
  selectedAssetId: 0,
  societies: [],
  loaders: {
    getSocieties: false,
  },
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
    case PropertyPaymentActionTypes.GET.SOCIETIES:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['getSocieties']: true },
      };
    case PropertyPaymentActionTypes.GET.SOCIETIES_SUCCESS:
      return {
        ...state,
        societies: action.payload as ISociety[],
        ['loaders']: { ...state.loaders, ['getSocieties']: false },
      };
    case PropertyPaymentActionTypes.GET.SOCIETIES_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['getSocieties']: false },
      };
    default:
      return initialState;
  }
};
