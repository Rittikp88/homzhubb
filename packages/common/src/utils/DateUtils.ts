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

  public getFormattedDate = (day: string, month: number, year: string, format: string): Date => {
    return moment(`${year}-${month}-${day}`, format).toDate();
  };

  public getDisplayDate = (date: string, format: string): string => {
    return moment(date).format(format);
  };

  public getDateFromISO = (selectedDate: string, format: string): string => {
    return moment.utc(new Date(selectedDate)).format(format);
  };

  public getCurrentMonth = (): string => {
    return moment.utc(new Date()).format('MMM YYYY');
  };

  public getLastMonth = (): string => {
    return moment.utc(new Date()).subtract(1, 'months').format('MMM YYYY');
  };

  public getCurrentYear = (): string => {
    return moment.utc(new Date()).format('YYYY');
  };

  public getLastYear = (): string => {
    return moment.utc(new Date()).subtract(1, 'years').format('YYYY');
  };

  public getNextYear = (): string => {
    return moment.utc(new Date()).add(1, 'years').format('YYYY');
  };

  public getCurrentFinancialYear = (): string => {
    const currentYear = this.getCurrentYear();
    const startDate = moment(`04/01/${currentYear}`).format('MMM YY');
    const endDate = moment(`03/31/${this.getNextYear()}`).format('MMM YY');
    return `${startDate} - ${endDate}`;
  };

  public getCurrentMonthStartDate = (): string => {
    return moment().startOf('months').format('YYYY-MM-DD');
  };

  public getCurrentMonthLastDate = (): string => {
    return moment().endOf('months').format('YYYY-MM-DD');
  };

  public getPreviousMonthStartDate = (): string => {
    return moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
  };

  public getPreviousMonthLastDate = (): string => {
    return moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
  };

  public getCurrentYearStartDate = (): string => {
    return moment().startOf('year').format('YYYY-MM-DD');
  };

  public getCurrentYearLastDate = (): string => {
    return moment().endOf('year').format('YYYY-MM-DD');
  };

  public getCurrentDate = (): string => {
    return moment.utc(new Date()).format('YYYY-MM-DD');
  };

  public getPreviousYearStartDate = (): string => {
    return moment().subtract(1, 'years').startOf('year').format('YYYY-MM-DD');
  };

  public getPreviousYearLastDate = (): string => {
    return moment().subtract(1, 'years').endOf('year').format('YYYY-MM-DD');
  };

  public getCurrentMonthIndex = (): number => {
    return moment.utc(new Date()).month();
  };

  public getMonthIndex = (date: string): number => {
    return moment(date).month();
  };

  public timeDifference = (givenTime: string): string => {
    const day = moment(givenTime).date();
    const month = moment(givenTime).month();
    const year = moment(givenTime).year();
    return moment([year, month, day]).fromNow();
  };
}

const dateUtils = new DateUtils();
export { dateUtils as DateUtils };
