import urlRegex from 'url-regex';

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
}
