import { groupBy, cloneDeep } from 'lodash';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { Message, Messages, IMessageKeyValue, IMessages } from '@homzhub/common/src/domain/models/Message';
import { IImageSource } from '@homzhub/common/src/services/AttachmentService/interfaces';

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

  public removeAttachment = (key: string, prevData: IImageSource[]): IImageSource[] => {
    const attachments = cloneDeep(prevData);

    const index = attachments.findIndex((item) => item.filename === key);
    attachments.splice(index, 1);
    return attachments;
  };
}

const reducerUtils = new ReducerUtils();
export { reducerUtils as ReducerUtils };
