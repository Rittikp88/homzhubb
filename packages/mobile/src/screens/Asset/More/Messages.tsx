import React from 'react';
import { FlatList, StyleSheet, ViewStyle, View, TextStyle } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { throttle } from 'lodash';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import GroupChat from '@homzhub/common/src/components/molecules/GroupChat';
import { SearchBar } from '@homzhub/common/src/components/molecules/SearchBar';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IChatPayload } from '@homzhub/common/src/modules/common/interfaces';

interface IScreenState {
  searchValue: string;
}

interface IStateToProps {
  groupMessages: GroupMessage[] | null;
  groupMessagesLoading: boolean;
}

interface IDispatchToProps {
  getGroupMessage: () => void;
  setCurrentChatDetail: (payload: IChatPayload) => void;
}

type NavProps = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.Messages>;

type MessageProps = NavProps & WithTranslation & IStateToProps & IDispatchToProps;

class Messages extends React.PureComponent<MessageProps, IScreenState> {
  constructor(props: MessageProps) {
    super(props);

    this.state = {
      searchValue: '',
    };
  }

  public componentDidMount(): void {
    const { getGroupMessage } = this.props;
    getGroupMessage();
  }

  public render(): React.ReactNode {
    const { searchValue } = this.state;
    const {
      navigation: { goBack },
      t,
      groupMessages,
    } = this.props;

    const filteredMessages = this.getFilteredMessages(groupMessages);
    const sortedMessages = this.getLastSentSortedMessages(filteredMessages);

    const isMessagesPresent = groupMessages && groupMessages.length > 0;
    const isSearchFound = sortedMessages && sortedMessages.length > 0;

    return (
      <UserScreen
        title={t('assetMore:more')}
        scrollEnabled={false}
        onBackPress={goBack}
        pageTitle={t('assetMore:messages')}
      >
        {isMessagesPresent ? (
          <View style={styles.container}>
            <SearchBar
              placeholder={t('assetMore:searchByNameOrProperty')}
              value={searchValue}
              updateValue={throttle(this.updateSearchValue)}
              containerStyle={styles.searchBar}
            />
            {isSearchFound ? (
              <>
                <Text type="small" textType="semiBold" style={styles.chat}>
                  {t('assetMore:chats')}
                </Text>
                <FlatList
                  data={filteredMessages}
                  renderItem={this.renderItem}
                  style={styles.chatList}
                  ItemSeparatorComponent={this.renderItemSeparator}
                  keyExtractor={this.keyExtractor}
                  scrollEnabled
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.chatListContent}
                />
              </>
            ) : (
              this.renderEmptyState()
            )}
          </View>
        ) : (
          this.renderEmptyState()
        )}
      </UserScreen>
    );
  }

  private renderEmptyState = (): React.ReactElement => {
    const { t } = this.props;

    return <EmptyState title={t('assetMore:noChatsFound')} containerStyle={styles.noChat} />;
  };

  private renderItem = ({ item, index }: { item: GroupMessage; index: number }): React.ReactElement => {
    return <GroupChat chatData={item} onChatPress={this.handleChatPress} />;
  };

  private renderItemSeparator = (): React.ReactElement => {
    return <View style={styles.separator} />;
  };

  private keyExtractor = (item: GroupMessage, index: number): string => {
    return `${index}-${item.id}`;
  };

  private updateSearchValue = (value: string): void => {
    this.setState({ searchValue: value });
  };

  private getFilteredMessages = (groupMessages: GroupMessage[] | null): GroupMessage[] | null => {
    const { searchValue } = this.state;

    if (!groupMessages || !searchValue) {
      return groupMessages;
    }

    const filteredMessages = groupMessages.filter((groupMessage: GroupMessage) => {
      const { name, getAlphabeticalSortedUserNames } = groupMessage;
      const lowerCasedSearchValue = searchValue.toLowerCase();
      const isGroupNameIncluded = name.toLowerCase().includes(lowerCasedSearchValue);
      const isUserNameIncluded = getAlphabeticalSortedUserNames.toLowerCase().includes(lowerCasedSearchValue);

      return isGroupNameIncluded || isUserNameIncluded;
    });

    return filteredMessages ?? null;
  };

  private getLastSentSortedMessages = (filteredMessages: GroupMessage[] | null): GroupMessage[] | null => {
    if (!filteredMessages) {
      return filteredMessages;
    }

    const sortedGroupMessages = filteredMessages.sort((message1: GroupMessage, message2: GroupMessage) => {
      const { lastMessage: lastMessage1 } = message1;
      const { lastMessage: lastMessage2 } = message2;

      const value = new Date(lastMessage1).valueOf() - new Date(lastMessage2).valueOf();
      if (value > 0) {
        return -1;
      }
      if (value < 0) {
        return 1;
      }

      return 0;
    });

    return sortedGroupMessages;
  };

  private handleChatPress = (name: string): void => {
    const { navigation, setCurrentChatDetail } = this.props;
    setCurrentChatDetail({
      groupName: name,
      groupId: 16, // TODO: Add proper id
    });
    navigation.navigate(ScreensKeys.ChatScreen);
  };
}

const mapStateToProps = (state: IState): IStateToProps => {
  return {
    groupMessages: CommonSelectors.getGroupMessages(state),
    groupMessagesLoading: CommonSelectors.getGroupMessagesLoading(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  const { getGroupMessage, setCurrentChatDetail } = CommonActions;
  return bindActionCreators({ getGroupMessage, setCurrentChatDetail }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Messages));

interface IScreenStyles {
  container: ViewStyle;
  chatList: ViewStyle;
  chatListContent: ViewStyle;
  separator: ViewStyle;
  noChat: ViewStyle;
  searchBar: ViewStyle;
  chat: TextStyle;
}

const styles: IScreenStyles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    flex: 1,
  },
  chatList: {
    marginTop: 12,
  },
  chatListContent: {
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  chat: {
    marginTop: 16,
    color: theme.colors.darkTint3,
  },
  noChat: {
    flex: 1,
  },
  searchBar: {
    marginTop: 16,
  },
});
