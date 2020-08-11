import { IApiClientError } from '@homzhub/common/src/network/ApiClientError';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';

class ErrorUtils {
  public getErrorMessage = (e: IApiClientError): string => {
    if (e.original && e.original.error.length > 0) {
      const { error } = e.original;
      return error[0].message;
    }

    return I18nService.t('genericErrorMessage');
  };
}

const errorUtils = new ErrorUtils();
export { errorUtils as ErrorUtils };
