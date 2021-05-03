import { IApiClientError } from '@homzhub/common/src/network/ApiClientError';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';

class ErrorUtils {
  public getErrorMessage = (e: IApiClientError, isFieldRequired?: boolean): string => {
    if (e.original && e.original.error && e.original.error.length > 0) {
      const { error } = e.original;
      if (error[0].message.detail) {
        return error[0].message.detail;
      }
      return error[0].message;
    }
    if (e.original && e.original.data && e.original.data.length > 0) {
      const { data } = e.original;
      if (data[0].field && isFieldRequired) {
        return `${data[0].field} - ${data[0].message}`;
      }
      if (data[0].message.non_field_errors) {
        return `${data[0].message.non_field_errors[0]}`;
      }

      if (typeof data[0].message !== 'string') {
        return I18nService.t('genericErrorMessage');
      }
      return data[0].message;
    }

    return I18nService.t('genericErrorMessage');
  };
}

const errorUtils = new ErrorUtils();
export { errorUtils as ErrorUtils };
