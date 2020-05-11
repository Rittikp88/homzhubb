/* eslint-disable @typescript-eslint/no-explicit-any */

export class ObjectUtils {
  public static isOfType = (type: string, val: any): boolean => {
    return val.constructor && val.constructor.name.toLowerCase() === type.toLowerCase();
  };

  // This function sorts an array of objects based on a `key` of the object
  public static sort = (arrayOfObjects: any[], key: any): any => {
    return arrayOfObjects.sort((a, b) => {
      let comparison = 0;
      if (a[key] > b[key]) {
        comparison = 1;
      } else if (a[key] < b[key]) {
        comparison = -1;
      }
      return comparison;
    });
  };
}
