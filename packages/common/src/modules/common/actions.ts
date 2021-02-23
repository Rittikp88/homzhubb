import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IRedirectionDetails } from '@homzhub/mobile/src/services/LinkingService';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { Country, ICountry } from '@homzhub/common/src/domain/models/Country';
import { Messages } from '@homzhub/common/src/domain/models/Message';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { IGetMessageParam } from '@homzhub/common/src/domain/repositories/interfaces';

const actionTypePrefix = 'Common/';
export const CommonActionTypes = {
  GET: {
    COUNTRIES: `${actionTypePrefix}COUNTRIES`,
    COUNTRIES_SUCCESS: `${actionTypePrefix}COUNTRIES_SUCCESS`,
    MESSAGES: `${actionTypePrefix}MESSAGES`,
    MESSAGES_SUCCESS: `${actionTypePrefix}MESSAGES_SUCCESS`,
    GROUP_MESSAGES: `${actionTypePrefix}GROUP_MESSAGES`,
    GROUP_MESSAGES_SUCCESS: `${actionTypePrefix}GROUP_MESSAGES_SUCCESS`,
  },
  SET: {
    DEVICE_COUNTRY: `${actionTypePrefix}DEVICE_COUNTRY`,
    REDIRECTION_DETAILS: `${actionTypePrefix}REDIRECTION_DETAILS`,
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

const setRedirectionDetails = (payload: IRedirectionDetails): IFluxStandardAction<IRedirectionDetails> => ({
  type: CommonActionTypes.SET.REDIRECTION_DETAILS,
  payload,
});

const getMessages = (payload: IGetMessageParam): IFluxStandardAction<IGetMessageParam> => ({
  type: CommonActionTypes.GET.MESSAGES,
  payload,
});

const getMessagesSuccess = (payload: Messages): IFluxStandardAction<Messages> => ({
  type: CommonActionTypes.GET.MESSAGES_SUCCESS,
  payload,
});

// TODO: (Shivam: 23/2/21: add types)
const getGroupMessage = (): IFluxStandardAction => ({
  type: CommonActionTypes.GET.GROUP_MESSAGES,
});

const getGroupMessageSuccess = (groupMessages: GroupMessage[]): IFluxStandardAction<GroupMessage[]> => ({
  type: CommonActionTypes.GET.GROUP_MESSAGES_SUCCESS,
  payload: ObjectMapper.serializeArray(groupMessages),
});

export type CommonActionPayloadTypes =
  | ICountry[]
  | IRedirectionDetails
  | IGetMessageParam
  | Messages
  | string
  | number
  | GroupMessage[];

export const CommonActions = {
  getCountries,
  getCountriesSuccess,
  setDeviceCountry,
  setRedirectionDetails,
  getMessages,
  getMessagesSuccess,
  getGroupMessage,
  getGroupMessageSuccess,
};
