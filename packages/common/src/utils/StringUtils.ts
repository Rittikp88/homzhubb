import urlRegex from 'url-regex';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';

export class StringUtils {
  public static isValidUrl = (url: string): boolean => {
    return urlRegex({ exact: true, strict: true }).test(url);
  };

  public static toTitleCase = (str: string): string => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  public static getInitials = (fullName: string): string => {
    const initials = fullName.match(/\b\w/g) || [];
    return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  };

  public static isValidEmail = (email: string): boolean => {
    const regex = RegExp(FormUtils.emailRegex, 'g');
    return regex.test(email);
  };
}
