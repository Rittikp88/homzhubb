import React from 'react';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import GroupChat from '@homzhub/common/src/components/molecules/GroupChat';
import { groupChatData } from '@homzhub/common/src/mocks/GroupChatData';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';

export class Messages extends React.PureComponent {
  public render(): React.ReactNode {
    return (
      <UserScreen title="More">
        <GroupChat chatData={ObjectMapper.deserialize(GroupMessage, groupChatData[0])} />
      </UserScreen>
    );
  }
}
