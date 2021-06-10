import { IRedirectionDetails } from '@homzhub/mobile/src/services/LinkingService';
import { ICountry } from '@homzhub/common/src/domain/models/Country';
import { IMessages, Messages } from '@homzhub/common/src/domain/models/Message';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { IRedirectionDetailsWeb } from '@homzhub/web/src/services/NavigationService';

export interface ICommonState {
  countries: ICountry[];
  deviceCountry: string;
  messages: IMessages | null;
  attachment: string;
  redirectionDetails: IRedirectionDetails | IRedirectionDetailsWeb;
  currentChatDetail: IChatPayload | null;
  groupMessages: GroupMessage[] | null;
  loaders: {
    groupMessages: boolean;
    messages: boolean;
    whileGetCountries: boolean;
  };
}

export interface IMessageSuccess {
  response: Messages;
  isNew?: boolean;
}

export interface IChatPayload {
  groupName: string;
  groupId: number;
}
