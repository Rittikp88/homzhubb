import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { Messages } from '@homzhub/common/src/domain/models/Message';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { IGetMessageParam, IMessagePayload } from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  groupMessage: (): string => 'message-groups/',
  messages: (groupId: number): string => `message-groups/${groupId}/messages/`,
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

  public getGroupMessages = async (): Promise<GroupMessage[]> => {
    const result = await this.apiClient.get(ENDPOINTS.groupMessage());
    return ObjectMapper.deserializeArray(GroupMessage, result);
  };
}

const messageRepository = new MessageRepository();
export { messageRepository as MessageRepository };
