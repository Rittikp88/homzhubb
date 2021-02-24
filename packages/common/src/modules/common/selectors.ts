import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IRedirectionDetails } from '@homzhub/mobile/src/services/LinkingService';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { IMessages } from '@homzhub/common/src/domain/models/Message';
import { IChatPayload } from '@homzhub/common/src/modules/common/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';

const getCountryList = (state: IState): Country[] => {
  const {
    common: { countries },
  } = state;
  return ObjectMapper.deserializeArray(Country, countries);
};

const getDeviceCountry = (state: IState): string => {
  const {
    common: { deviceCountry },
  } = state;
  return deviceCountry;
};

const getDefaultPhoneCode = (state: IState): string => {
  const countries = getCountryList(state);
  const deviceCountry = getDeviceCountry(state);

  for (let i = 0; i < countries.length; i++) {
    if (countries[i].iso2Code === deviceCountry) {
      return countries[i].phoneCodes[0].phoneCode;
    }
  }

  return deviceCountry;
};

const getDefaultCurrency = (state: IState): Currency => {
  const countries = getCountryList(state);
  const deviceCountry = getDeviceCountry(state);

  for (let i = 0; i < countries.length; i++) {
    if (countries[i].iso2Code === deviceCountry) {
      return countries[i].currencies[0];
    }
  }

  return new Currency();
};

const getRedirectionDetails = (state: IState): IRedirectionDetails => {
  const {
    common: { redirectionDetails },
  } = state;

  return redirectionDetails;
};

const getMessages = (state: IState): IMessages | null => {
  const {
    common: { messages },
  } = state;
  return messages;
};

const getMessagesLoading = (state: IState): boolean => {
  const {
    common: {
      loaders: { messages },
    },
  } = state;

  return messages;
};

const getMessageAttachment = (state: IState): string => {
  const {
    common: { attachment },
  } = state;
  return attachment;
};

const getGroupMessages = (state: IState): GroupMessage[] | null => {
  const {
    common: { groupMessages },
  } = state;
  if (!groupMessages) {
    return groupMessages;
  }

  return ObjectMapper.deserializeArray(GroupMessage, groupMessages);
};

const getGroupMessagesLoading = (state: IState): boolean => {
  const {
    common: {
      loaders: { groupMessages },
    },
  } = state;

  return groupMessages;
};

const getCurrentChatDetail = (state: IState): IChatPayload | null => {
  const {
    common: { currentChatDetail },
  } = state;

  return currentChatDetail;
};

export const CommonSelectors = {
  getCountryList,
  getDefaultPhoneCode,
  getDeviceCountry,
  getDefaultCurrency,
  getRedirectionDetails,
  getMessages,
  getMessageAttachment,
  getGroupMessages,
  getGroupMessagesLoading,
  getCurrentChatDetail,
  getMessagesLoading,
};
