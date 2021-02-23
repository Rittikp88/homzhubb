import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { Messages } from '@homzhub/common/src/domain/models/Message';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { IGetMessageParam, IMessagePayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';

const ENDPOINTS = {
  messages: (groupId: number): string => `message-groups/${groupId}/messages/`,
  groupMessage: (): string => 'message-groups',
};

class MessageRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getMessages = async (param: IGetMessageParam): Promise<Messages> => {
    const { groupId, count, cursor } = param;
    const response = await this.apiClient.get(ENDPOINTS.messages(groupId), { count, cursor });
    return ObjectMapper.deserialize(Messages, response);
  };

  public sendMessage = async (payload: IMessagePayload): Promise<void> => {
    const { groupId, message, attachments } = payload;
    return await this.apiClient.post(ENDPOINTS.messages(groupId), { message, attachments });
  };

  // TODO: (shivam: 23/1/21: intergrate api)
  public getGroupMessages = async (): Promise<GroupMessage> => {
    const result = this.apiClient.get(ENDPOINTS.groupMessage());
    return result;
  };
}

const messageRepository = new MessageRepository();
export { messageRepository as MessageRepository };