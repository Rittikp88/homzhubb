import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IRedirectionDetails } from '@homzhub/mobile/src/services/LinkingService';
import { Country, ICountry } from '@homzhub/common/src/domain/models/Country';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { Messages } from '@homzhub/common/src/domain/models/Message';
import { IGetMessageParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { IChatPayload, IMessageSuccess } from '@homzhub/common/src/modules/common/interfaces';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';

const actionTypePrefix = 'Common/';
export const CommonActionTypes = {
  GET: {
    COUNTRIES: `${actionTypePrefix}COUNTRIES`,
    COUNTRIES_SUCCESS: `${actionTypePrefix}COUNTRIES_SUCCESS`,
    COUNTRIES_FALIURE: `${actionTypePrefix}COUNTRIES_FALIURE`,
    MESSAGES: `${actionTypePrefix}MESSAGES`,
    MESSAGES_SUCCESS: `${actionTypePrefix}MESSAGES_SUCCESS`,
    GROUP_MESSAGES: `${actionTypePrefix}GROUP_MESSAGES`,
    GROUP_MESSAGES_SUCCESS: `${actionTypePrefix}GROUP_MESSAGES_SUCCESS`,
  },
  SET: {
    DEVICE_COUNTRY: `${actionTypePrefix}DEVICE_COUNTRY`,
    REDIRECTION_DETAILS: `${actionTypePrefix}REDIRECTION_DETAILS`,
    MESSAGE_ATTACHMENT: `${actionTypePrefix}MESSAGE_ATTACHMENT`,
    CURRENT_CHAT: `${actionTypePrefix}CURRENT_CHAT`,
  },
  CLEAR_MESSAGES: `${actionTypePrefix}CLEAR_MESSAGES`,
  CLEAR_ATTACHMENT: `${actionTypePrefix}CLEAR_ATTACHMENT`,
  CLEAR_CHAT_DETAIL: `${actionTypePrefix}CLEAR_CHAT_DETAIL`,
};

const getCountries = (): IFluxStandardAction => ({
  type: CommonActionTypes.GET.COUNTRIES,
});

const getCountriesSuccess = (payload: Country[]): IFluxStandardAction<ICountry[]> => ({
  type: CommonActionTypes.GET.COUNTRIES_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});
const getCountriesFaliure = (error: string): IFluxStandardAction => ({
  type: CommonActionTypes.GET.COUNTRIES_FALIURE,
  error,
});
const setDeviceCountry = (countryCode: string): IFluxStandardAction<string> => ({
  type: CommonActionTypes.SET.DEVICE_COUNTRY,
  payload: countryCode,
});

const setRedirectionDetails = (payload: IRedirectionDetails): IFluxStandardAction<IRedirectionDetails> => ({
  type: CommonActionTypes.SET.REDIRECTION_DETAILS,
  payload,
});

const getMessages = (payload: IGetMessageParam): IFluxStandardAction<IGetMessageParam> => ({
  type: CommonActionTypes.GET.MESSAGES,
  payload,
});

const getMessagesSuccess = (payload: IMessageSuccess): IFluxStandardAction<IMessageSuccess> => ({
  type: CommonActionTypes.GET.MESSAGES_SUCCESS,
  payload,
});

const setAttachment = (payload: string): IFluxStandardAction<string> => ({
  type: CommonActionTypes.SET.MESSAGE_ATTACHMENT,
  payload,
});

const clearMessages = (): IFluxStandardAction => ({
  type: CommonActionTypes.CLEAR_MESSAGES,
});

const clearAttachment = (): IFluxStandardAction => ({
  type: CommonActionTypes.CLEAR_ATTACHMENT,
});

// TODO: (Shivam: 23/2/21: add types)
const getGroupMessage = (): IFluxStandardAction => ({
  type: CommonActionTypes.GET.GROUP_MESSAGES,
});

const getGroupMessageSuccess = (groupMessages: GroupMessage[]): IFluxStandardAction<GroupMessage[]> => ({
  type: CommonActionTypes.GET.GROUP_MESSAGES_SUCCESS,
  payload: ObjectMapper.serializeArray(groupMessages),
});

const setCurrentChatDetail = (payload: IChatPayload): IFluxStandardAction<IChatPayload> => ({
  type: CommonActionTypes.SET.CURRENT_CHAT,
  payload,
});

const clearChatDetail = (): IFluxStandardAction => ({
  type: CommonActionTypes.CLEAR_CHAT_DETAIL,
});

export type CommonActionPayloadTypes =
  | ICountry[]
  | IRedirectionDetails
  | IGetMessageParam
  | IMessageSuccess
  | Messages
  | GroupMessage[]
  | IChatPayload
  | string;

export const CommonActions = {
  getCountries,
  getCountriesSuccess,
  getCountriesFaliure,
  setDeviceCountry,
  setRedirectionDetails,
  getMessages,
  getMessagesSuccess,
  clearMessages,
  setAttachment,
  clearAttachment,
  getGroupMessage,
  getGroupMessageSuccess,
  setCurrentChatDetail,
  clearChatDetail,
};
