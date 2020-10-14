import moment from 'moment-timezone';

class TimeUtils {
  public getLocaltimeDifference = (givenTime: string): string => {
    return moment.tz(givenTime, 'Asia/Taipei').fromNow();
  };
}

const timeUtils = new TimeUtils();
export { timeUtils as TimeUtils };
