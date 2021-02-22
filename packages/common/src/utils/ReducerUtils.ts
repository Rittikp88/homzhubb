import { groupBy } from 'lodash';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { Message, Messages, IMessageKeyValue } from '@homzhub/common/src/domain/models/Message';

class ReducerUtils {
  public formatMessages = (data: Messages): IMessageKeyValue[] => {
    const { results } = data;
    const groupedData = groupBy(results, (item: Message) => {
      return DateUtils.getUtcDisplayDate(item.createdAt, 'DD-MMM-YYYY');
    });

    return Object.keys(groupedData).map((date) => {
      const result = groupedData[date];
      return {
        key: DateUtils.getUtcFormattedDate(date, 'DD, MMM YYYY'),
        results: result,
      };
    });
  };
}

const reducerUtils = new ReducerUtils();
export { reducerUtils as ReducerUtils };
