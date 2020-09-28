import moment from 'moment';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';

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
    return moment(new Date()).format('YYYY-MM-DD');
  };

  public getCurrentTime = (): string => {
    const current = moment().format('YYYY-MM-DD HH').split(' ');
    return current[1];
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

  public getFutureDate = (dateCount: number): string => {
    return moment().add(dateCount, 'days').calendar();
  };

  public getYear = (yearCount: number): string => {
    return moment.utc(new Date()).subtract(yearCount, 'years').format('YYYY');
  };

  public getDate = (dateCount: number): string => {
    return moment.utc(new Date()).subtract(dateCount, 'days').format('YYYY-MM-DD');
  };

  public convertTimeFormat = (date: string, format: string): string[] => {
    return moment.utc(date).format(format).split(' ');
  };

  public getISOFormat = (date: string, time: number): string => {
    const dateFormat = moment.utc(`${date} ${time}:00`).format('YYYY-MM-DD HH:mm');
    return moment.utc(dateFormat).toISOString();
  };

  public getDateWithWeekDay = (date: string, format: string): string => {
    return moment.utc(date).format(format);
  };

  public getDateString = (date: string): string => {
    if (date === moment().format('YYYY-MM-DD')) {
      return I18nService.t('today');
    }
    if (date === moment().add(1, 'days').format('YYYY-MM-DD')) {
      return I18nService.t('tomorrow');
    }
    return date;
  };

  public isPastTime = (time: number, date: string): boolean => {
    const current = moment().format('YYYY-MM-DD HH').split(' ');
    if (moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
      return Number(current[1]) >= time;
    }
    return false;
  };

  public getYearList = (startYear: number, endYear: number): { value: number; label: string }[] => {
    const years = [];
    const dateStart = moment().subtract(startYear, 'y');
    const dateEnd = moment().add(endYear, 'y');
    while (dateEnd.diff(dateStart, 'years') >= 0) {
      years.push(dateStart.format('YYYY'));
      dateStart.add(1, 'year');
    }
    return years.map((year) => ({
      label: year,
      value: parseInt(year, 10),
    }));
  };
}

const dateUtils = new DateUtils();
export { dateUtils as DateUtils };
