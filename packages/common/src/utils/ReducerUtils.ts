import { groupBy } from 'lodash';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { Message, Messages, IMessageKeyValue, IMessages } from '@homzhub/common/src/domain/models/Message';

class ReducerUtils {
  public formatMessages = (data: Messages, prevObj: IMessages | null, isNew?: boolean): IMessageKeyValue => {
    const { results } = data;
    let resultObj = prevObj?.messageResult ?? {};
    let prevDate: string[] = [];

    const groupedData = groupBy(results, (item: Message) => {
      return DateUtils.getUtcDisplayDate(item.createdAt, 'DD, MMM YYYY');
    });
    if (prevObj) {
      prevDate = Object.keys(prevObj.messageResult);
    }

    Object.keys(groupedData).forEach((date) => {
      let result = groupedData[date];
      const isPresent = prevDate.includes(date);
      if (isPresent && prevObj && !isNew) {
        result = [...prevObj.messageResult[date], ...result];
      }
      resultObj = { ...resultObj, [date]: result };
    });

    return resultObj;
  };
}

const reducerUtils = new ReducerUtils();
export { reducerUtils as ReducerUtils };
