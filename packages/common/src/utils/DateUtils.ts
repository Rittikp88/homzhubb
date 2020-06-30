import moment from 'moment';

export const MonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const DateFormats = {
  ISO: 'YYYY-MM-DDTHH:mm:ss.sss[Z]',
  ddd: 'ddd',
  DD: 'DD',
  y: 'y',
  years: 'years',
  DDMMYYYY: 'DD-MM-YYYY',
  DDMMMYYYY: 'DD MMM YYYY',
  DoMMMYYYY: 'Do MMM YYYY',
  MMM: 'MMM',
  MMMM: 'MMMM',
  MMMDDYYYYHMMA: 'MMM D YYYY - h:mm A',
  MMMYYYY: 'MMM, YYYY',
  MMYYYY: 'MM/YYYY',
  MMYY: 'MM/YY',
  YYYYMMDD: 'YYYY-MM-DD',
  YYYYMMMDD: 'YYYY-MMM-DD',
  YYYY: 'YYYY',
  MMMMYYYY: 'MMMM YYYY',
  DoMMM_YYYY: 'Do MMM, YYYY',
  MM_YYYY: 'MM-YYYY',
};

class DateUtils {
  public getFullMonthName = (monthIndex: number, format: string): string => {
    return moment().month(monthIndex).format(format);
  };

  public getFormattedDate = (day: string, month: string, year: string, format: string): Date => {
    return moment(`${year}-${month}-${day}`, format).toDate();
  };
}

const dateUtils = new DateUtils();
export { dateUtils as DateUtils };
