import { ActionPayloadTypes, PropertyPaymentActionTypes } from '@homzhub/common/src/modules/propertyPayment/actions';
import { InvoiceId } from '@homzhub/common/src/domain/models/InvoiceSummary';
import { ISociety } from '@homzhub/common/src/domain/models/Society';
import { ISocietyCharge } from '@homzhub/common/src/domain/models/SocietyCharge';
import { IBankInfoPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IPropertyPaymentState, ISocietyFormData } from '@homzhub/common/src/modules/propertyPayment/interfaces';

const initialFormData: ISocietyFormData = {
  propertyName: '',
  projectName: '',
  email: '',
  name: '',
  contactNumber: '',
  societyName: '',
};

export const initialState: IPropertyPaymentState = {
  selectedAssetId: 0,
  selectedSocietyId: 0,
  societyFormData: initialFormData,
  societyBankData: null,
  societies: [],
  societyDetail: null,
  societyCharges: null,
  userInvoice: new InvoiceId(),
  loaders: {
    getSocieties: false,
    society: false,
    societyCharges: false,
    userInvoice: false,
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
    case PropertyPaymentActionTypes.SET.SOCIETY_FORM_DATA:
      return {
        ...state,
        societyFormData: action.payload as ISocietyFormData,
      };
    case PropertyPaymentActionTypes.CLEAR_SOCIETY_FORM_DATA:
      return {
        ...state,
        societyFormData: initialFormData,
        societyBankData: initialState.societyBankData,
      };
    case PropertyPaymentActionTypes.POST.SOCIETY:
    case PropertyPaymentActionTypes.GET.SOCIETY_DETAIL:
    case PropertyPaymentActionTypes.POST.UPDATE_SOCIETY:
    case PropertyPaymentActionTypes.POST.ASSET_SOCIETY:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['society']: true },
      };
    case PropertyPaymentActionTypes.POST.SOCIETY_SUCCESS:
    case PropertyPaymentActionTypes.POST.SOCIETY_FAILURE:
    case PropertyPaymentActionTypes.POST.UPDATE_SOCIETY_SUCCESS:
    case PropertyPaymentActionTypes.POST.UPDATE_SOCIETY_FAILURE:
    case PropertyPaymentActionTypes.GET.SOCIETY_DETAIL_FAILURE:
    case PropertyPaymentActionTypes.POST.ASSET_SOCIETY_FAILURE:
    case PropertyPaymentActionTypes.POST.ASSET_SOCIETY_SUCCESS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['society']: false },
      };
    case PropertyPaymentActionTypes.SET.SOCIETY_BANK_DATA:
      return {
        ...state,
        societyBankData: action.payload as IBankInfoPayload,
      };
    case PropertyPaymentActionTypes.GET.SOCIETY_DETAIL_SUCCESS:
      return {
        ...state,
        societyDetail: action.payload as ISociety,
        ['loaders']: { ...state.loaders, ['society']: false },
      };
    case PropertyPaymentActionTypes.SET.SELECTED_SOCIETY_ID:
      return {
        ...state,
        selectedSocietyId: action.payload as number,
      };
    case PropertyPaymentActionTypes.CLEAR_SOCIETY_DETAIL:
      return {
        ...state,
        societyDetail: initialState.societyDetail,
        selectedSocietyId: initialState.selectedSocietyId,
      };
    case PropertyPaymentActionTypes.GET.SOCIETY_CHARGES:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['societyCharges']: true },
      };
    case PropertyPaymentActionTypes.GET.SOCIETY_CHARGES_SUCCESS:
      return {
        ...state,
        societyCharges: action.payload as ISocietyCharge,
        ['loaders']: { ...state.loaders, ['societyCharges']: false },
      };
    case PropertyPaymentActionTypes.GET.SOCIETY_CHARGES_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['societyCharges']: false },
      };
    case PropertyPaymentActionTypes.POST.USER_INVOICE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['userInvoice']: true },
      };
    case PropertyPaymentActionTypes.POST.USER_INVOICE_SUCCESS:
      return {
        ...state,
        userInvoice: action.payload as InvoiceId,
        ['loaders']: { ...state.loaders, ['userInvoice']: false },
      };
    case PropertyPaymentActionTypes.POST.USER_INVOICE_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['userInvoice']: false },
      };
    default:
      return state;
  }
};
