import { ReducerUtils } from '@homzhub/common/src/utils/ReducerUtils';
import { IRedirectionDetails } from '@homzhub/mobile/src/services/LinkingService';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ICommonState } from '@homzhub/common/src/modules/common/interfaces';
import { CommonActionPayloadTypes, CommonActionTypes } from '@homzhub/common/src/modules/common/actions';
import { ICountry } from '@homzhub/common/src/domain/models/Country';
import { Links } from '@homzhub/common/src/domain/models/Links';
import { Messages } from '@homzhub/common/src/domain/models/Message';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';

export const initialCommonState: ICommonState = {
  countries: [],
  deviceCountry: '',
  messages: {
    count: 10,
    links: new Links(),
    messageResult: [],
  },
  redirectionDetails: {
    redirectionLink: '',
    shouldRedirect: false,
  },
  groupMessages: null,
  loaders: {
    groupMessages: false,
  },
  error: {
    groupMessages: '',
  },
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
    case CommonActionTypes.SET.REDIRECTION_DETAILS:
      return {
        ...state,
        ['redirectionDetails']: action.payload as IRedirectionDetails,
      };
    case CommonActionTypes.GET.MESSAGES_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const payload = action.payload as Messages;
      return {
        ...state,
        messages: {
          count: payload.count,
          links: payload.links,
          messageResult: ReducerUtils.formatMessages(action.payload as Messages),
        },
      };
    case CommonActionTypes.GET.GROUP_MESSAGES:
      return {
        ...state,
        ['groupMessages']: null,
        ['error']: { ...state.error, ['groupMessages']: '' },
        ['loaders']: { ...state.loaders, ['groupMessages']: true },
      };
    case CommonActionTypes.GET.GROUP_MESSAGES_SUCCESS:
      return {
        ...state,
        ['groupMessages']: action.payload as GroupMessage[],
        ['loaders']: { ...state.loaders, ['groupMessages']: false },
      };
    case CommonActionTypes.GET.GROUP_MESSAGES_ERROR:
      return {
        ...state,
        ['error']: { ...state.error, ['groupMessages']: action.error as string },
        ['loaders']: { ...state.loaders, ['groupMessages']: false },
      };
    default:
      return {
        ...state,
      };
  }
};
