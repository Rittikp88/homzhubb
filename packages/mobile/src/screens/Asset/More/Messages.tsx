import React from 'react';
import { FlatList, StyleSheet, ViewStyle, View, TextStyle } from 'react-native';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import GroupChat from '@homzhub/common/src/components/molecules/GroupChat';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { groupChatData } from '@homzhub/common/src/mocks/GroupChatData';

export class Messages extends React.PureComponent {
  public render(): React.ReactNode {
    const data: GroupMessage[] = ObjectMapper.deserializeArray(GroupMessage, groupChatData);
    return (
      <UserScreen title={I18nService.t('assetMore:more')} scrollEnabled>
        <View style={styles.container}>
          <Text type="small" textType="semiBold" style={styles.chat}>
            {I18nService.t('assetMore:chats')}
          </Text>
          <FlatList
            data={data}
            renderItem={this.renderItem}
            style={styles.chatList}
            ItemSeparatorComponent={this.renderItemSeperator}
            keyExtractor={this.keyExtractor}
            scrollEnabled={false}
          />
        </View>
      </UserScreen>
    );
  }

  private renderItem = ({ item, index }: { item: GroupMessage; index: number }): React.ReactElement => {
    return <GroupChat chatData={item} onChatPress={FunctionUtils.noop} />;
  };

  private renderItemSeperator = (): React.ReactElement => {
    return <View style={styles.separator} />;
  };

  private keyExtractor = (item: GroupMessage, index: number): string => {
    return `${index}-${item.id}`;
  };
}

interface IScreenStyles {
  container: ViewStyle;
  chatList: ViewStyle;
  separator: ViewStyle;
  chat: TextStyle;
}

const styles: IScreenStyles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
  },
  chatList: {
    marginTop: 12,
    marginBottom: 20,
  },
  separator: {
    height: 12,
  },
  chat: {
    marginTop: 16,
    color: theme.colors.darkTint3,
  },
});
