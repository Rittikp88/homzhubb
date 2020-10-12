import moment from 'moment';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';

export const MonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const DateFormats = {
  ISO: 'YYYY-MM-DDThh:mm:ss.sss[Z]',
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

  public getCurrentMonthStartDate = (format?: string): string => {
    return moment()
      .startOf('months')
      .format(format || 'YYYY-MM-DD');
  };

  public getCurrentMonthLastDate = (format?: string): string => {
    return moment()
      .endOf('months')
      .format(format || 'YYYY-MM-DD');
  };

  public getPreviousMonthStartDate = (format?: string): string => {
    return moment()
      .subtract(1, 'months')
      .startOf('month')
      .format(format || 'YYYY-MM-DD');
  };

  public getPreviousMonthLastDate = (format?: string): string => {
    return moment()
      .subtract(1, 'months')
      .endOf('month')
      .format(format || 'YYYY-MM-DD');
  };

  public getCurrentYearStartDate = (): string => {
    return moment().startOf('year').format('YYYY-MM-DD');
  };

  public getCurrentYearLastDate = (): string => {
    return moment().endOf('year').format('YYYY-MM-DD');
  };

  public getCurrentWeekStartDate = (format?: string): string => {
    return moment()
      .startOf('week')
      .format(format || 'YYYY-MM-DD');
  };

  public getCurrentWeekLastDate = (format?: string): string => {
    return moment()
      .endOf('week')
      .format(format || 'YYYY-MM-DD');
  };

  public getLastWeekStartDate = (format?: string): string => {
    return moment()
      .subtract(1, 'week')
      .startOf('week')
      .format(format || 'YYYY-MM-DD');
  };

  public getLastWeekLastDate = (format?: string): string => {
    return moment()
      .subtract(1, 'week')
      .endOf('week')
      .format(format || 'YYYY-MM-DD');
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

  // TODO: ADD timezone conversion
  public localtimeDifference = (givenTime: string): string => {
    const localTime = moment(givenTime).utcOffset(330).format();
    const day = moment(localTime).date();
    const month = moment(localTime).month();
    const year = moment(localTime).year();
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

  public getNextDate = (dateCount: number, date?: string, format?: string): string => {
    return moment
      .utc(date || new Date())
      .add(dateCount, 'days')
      .format(format || 'YYYY-MM-DD');
  };

  public getPreviousDate = (dateCount: number, date?: string, format?: string): string => {
    return moment
      .utc(date || new Date())
      .subtract(dateCount, 'days')
      .format(format || 'YYYY-MM-DD');
  };

  public convertTimeFormat = (date: string, format: string): string[] => {
    return moment.utc(date).format(format).split(' ');
  };

  public getISOFormat = (date: string, time: number): string => {
    const dateFormat = moment.utc(`${date} ${time}:00`).format('YYYY-MM-DD HH:mm');
    return moment.utc(dateFormat).toISOString();
  };

  public getCurrentDateISO = (): string => {
    return moment(new Date()).format(DateFormats.ISO);
  };

  public getUtcFormattedDate = (date: string, format: string): string => {
    const formattedDate = this.getDisplayDate(date, 'YYYY-MM-DD');
    return moment.utc(formattedDate).format(format);
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

  public getUtcFormatted = (date: string, format1: string, format2?: string): string => {
    return moment.utc(date, format1).format(format2 || 'YYYY-MM-DD');
  };

  public getISOFormattedDate = (date: string, time: number): string => {
    return moment([date, time]).format(DateFormats.ISO);
  };
}

const dateUtils = new DateUtils();
export { dateUtils as DateUtils };
