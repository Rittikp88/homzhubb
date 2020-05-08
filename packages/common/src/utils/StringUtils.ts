import urlRegex from 'url-regex';

export class StringUtils {
  public static isValidUrl = (url: string): boolean => {
    return urlRegex({ exact: true, strict: true }).test(url);
  };
}
