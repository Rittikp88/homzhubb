import React from 'react';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import GroupChat from '@homzhub/common/src/components/molecules/GroupChat';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { groupChatData } from '@homzhub/common/src/mocks/GroupChatData';

export class Messages extends React.PureComponent {
  public render(): React.ReactNode {
    return (
      <UserScreen title={I18nService.t('assetMore:more')}>
        <GroupChat
          chatData={ObjectMapper.deserialize(GroupMessage, groupChatData[0])}
          onChatPress={FunctionUtils.noop}
        />
      </UserScreen>
    );
  }
}
