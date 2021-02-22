import React from 'react';
import { FlatList, StyleSheet, ViewStyle, View } from 'react-native';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import GroupChat from '@homzhub/common/src/components/molecules/GroupChat';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { groupChatData } from '@homzhub/common/src/mocks/GroupChatData';

export class Messages extends React.PureComponent {
  public render(): React.ReactNode {
    const data: GroupMessage[] = ObjectMapper.deserializeArray(GroupMessage, groupChatData);
    return (
      <UserScreen title={I18nService.t('assetMore:more')} scrollEnabled>
        <FlatList
          data={data}
          renderItem={this.renderItem}
          style={styles.chatList}
          ItemSeparatorComponent={this.renderItemSeparator}
          keyExtractor={this.keyExtractor}
          scrollEnabled={false}
        />
      </UserScreen>
    );
  }

  private renderItem = ({ item, index }: { item: GroupMessage; index: number }): React.ReactElement => {
    return <GroupChat chatData={item} onChatPress={FunctionUtils.noop} />;
  };

  private renderItemSeparator = (): React.ReactElement => {
    return <View style={styles.separator} />;
  };

  private keyExtractor = (item: GroupMessage, index: number): string => {
    return `${index}-${item.id}`;
  };
}

interface IScreenStyles {
  chatList: ViewStyle;
  separator: ViewStyle;
}

const styles: IScreenStyles = StyleSheet.create({
  chatList: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 20,
  },
  separator: {
    height: 12,
  },
});
