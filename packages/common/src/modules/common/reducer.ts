import { ReducerUtils } from '@homzhub/common/src/utils/ReducerUtils';
import { IRedirectionDetails } from '@homzhub/mobile/src/services/LinkingService';
import { CommonActionPayloadTypes, CommonActionTypes } from '@homzhub/common/src/modules/common/actions';
import { ICountry } from '@homzhub/common/src/domain/models/Country';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IChatPayload, ICommonState, IMessageSuccess } from '@homzhub/common/src/modules/common/interfaces';

export const initialCommonState: ICommonState = {
  countries: [],
  deviceCountry: '',
  attachment: '',
  messages: null,
  currentChatDetail: null,
  redirectionDetails: {
    redirectionLink: '',
    shouldRedirect: false,
  },
  groupMessages: null,
  loaders: {
    groupMessages: false,
    messages: false,
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
    case CommonActionTypes.GET.MESSAGES:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['messages']: true },
      };
    case CommonActionTypes.GET.MESSAGES_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const { response, isNew } = action.payload as IMessageSuccess;
      // eslint-disable-next-line no-case-declarations
      const messageResult = ReducerUtils.formatMessages(response, state.messages, isNew);
      return {
        ...state,
        messages: {
          count: response.count,
          links: response.links,
          messageResult,
        },
        ['loaders']: { ...state.loaders, ['messages']: false },
      };
    case CommonActionTypes.SET.MESSAGE_ATTACHMENT:
      return {
        ...state,
        ['attachment']: action.payload as string,
      };
    case CommonActionTypes.CLEAR_MESSAGES:
      return {
        ...state,
        messages: initialCommonState.messages,
      };
    case CommonActionTypes.CLEAR_ATTACHMENT:
      return {
        ...state,
        attachment: initialCommonState.attachment,
      };
    case CommonActionTypes.GET.GROUP_MESSAGES:
      return {
        ...state,
        ['groupMessages']: null,
        ['loaders']: { ...state.loaders, ['groupMessages']: true },
      };
    case CommonActionTypes.GET.GROUP_MESSAGES_SUCCESS:
      return {
        ...state,
        ['groupMessages']: action.payload as GroupMessage[],
        ['loaders']: { ...state.loaders, ['groupMessages']: false },
      };
    case CommonActionTypes.SET.CURRENT_CHAT:
      return {
        ...state,
        currentChatDetail: action.payload as IChatPayload,
      };
    case CommonActionTypes.CLEAR_CHAT_DETAIL:
      return {
        ...state,
        currentChatDetail: initialCommonState.currentChatDetail,
      };
    default:
      return {
        ...state,
      };
  }
};
