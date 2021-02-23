import React from 'react';
import { FlatList, StyleSheet, ViewStyle, View, TextStyle } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import GroupChat from '@homzhub/common/src/components/molecules/GroupChat';
import { SearchBar } from '@homzhub/common/src/components/molecules/SearchBar';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IScreenState {
  searchValue: string;
}

interface IStateToProps {
  groupMessages: GroupMessage[] | null;
  groupMessagesError: string;
  groupMessagesLoading: boolean;
}

interface IDispatchToProps {
  getGroupMessage: () => void;
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

    return (
      <UserScreen title={t('assetMore:more')} scrollEnabled onBackPress={goBack} pageTitle={t('assetMore:messages')}>
        <View style={styles.container}>
          <SearchBar
            placeholder={t('assetMore:searchByNameOrProperty')}
            value={searchValue}
            updateValue={this.updateSearchValue}
          />
          <Text type="small" textType="semiBold" style={styles.chat}>
            {t('assetMore:chats')}
          </Text>
          <FlatList
            data={groupMessages}
            renderItem={this.renderItem}
            style={styles.chatList}
            ItemSeparatorComponent={this.renderItemSeparator}
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

  private renderItemSeparator = (): React.ReactElement => {
    return <View style={styles.separator} />;
  };

  private keyExtractor = (item: GroupMessage, index: number): string => {
    return `${index}-${item.id}`;
  };

  private updateSearchValue = (value: string): void => {
    this.setState({ searchValue: value });
  };
}

const mapStateToProps = (state: IState): IStateToProps => {
  return {
    groupMessages: CommonSelectors.getGroupMessages(state),
    groupMessagesError: CommonSelectors.getGroupMessagesError(state),
    groupMessagesLoading: CommonSelectors.getGroupMessagesLoading(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  const { getGroupMessage } = CommonActions;
  return bindActionCreators({ getGroupMessage }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Messages));

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
