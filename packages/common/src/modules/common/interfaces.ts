import { IRedirectionDetails } from '@homzhub/mobile/src/services/LinkingService';
import { ICountry } from '@homzhub/common/src/domain/models/Country';

export interface ICommonState {
  countries: ICountry[];
  deviceCountry: string;
  redirectionDetails: IRedirectionDetails;
}
