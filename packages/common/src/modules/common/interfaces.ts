import { IRedirectionDetails } from '@homzhub/mobile/src/services/LinkingService';
import { ICountry } from '@homzhub/common/src/domain/models/Country';
import { IMessages } from '@homzhub/common/src/domain/models/Message';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';

export interface ICommonState {
  countries: ICountry[];
  deviceCountry: string;
  messages: IMessages;
  redirectionDetails: IRedirectionDetails;
  groupMessages: GroupMessage[] | null;
  loaders: {
    groupMessages: boolean;
  };
  error: {
    groupMessages: string;
  };
}
