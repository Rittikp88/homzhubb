import React, { Component, createRef, ReactElement, RefObject } from 'react';
import { groupBy } from 'lodash';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import MessageCard from '@homzhub/common/src/components/molecules/MessageCard';
import { IMessageKeyValue, IMessages, Message } from '@homzhub/common/src/domain/models/Message';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IGetMessageParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { IChatPayload } from '@homzhub/common/src/modules/common/interfaces';

interface IStateProps {
  messages: IMessages | null;
  currentChat: IChatPayload | null;
}

interface IDispatchProps {
  getMessages: (param: IGetMessageParam) => void;
}

interface IScreenState {
  isRefreshing: boolean;
}

interface IProps {
  shouldEnableOuterScroll?: (enable: boolean) => void;
  shouldScrollToBottom?: () => void;
  isScrollToBottom?: boolean;
}

type Props = IStateProps & IDispatchProps & IProps;

class MessagePreview extends Component<Props, IScreenState> {
  public scrollRef: RefObject<ScrollView> = createRef();

  public state = {
    isRefreshing: false,
  };

  public componentDidMount = (): void => {
    const { getMessages, currentChat } = this.props;
    if (currentChat) {
      getMessages({ groupId: currentChat.groupId });
    }
  };

  public componentDidUpdate = (): void => {
    const { isScrollToBottom } = this.props;
    if (isScrollToBottom) {
      this.scrollToBottom();
    }
  };

  public render(): React.ReactNode {
    const { messages, shouldEnableOuterScroll } = this.props;
    if (!messages) return <Loader visible />;
    const { messageResult } = messages;
    return (
      <ScrollView
        ref={this.scrollRef}
        refreshControl={this.renderRefreshControl()}
        showsVerticalScrollIndicator={false}
        onTouchStart={shouldEnableOuterScroll ? (): void => shouldEnableOuterScroll(true) : undefined}
        style={styles.container}
      >
        {Object.keys(messageResult)
          .reverse()
          .map((key) => {
            const formattedByTime = this.getFormattedMessage(messageResult[key], 'h:mm:ss');
            return (
              <>
                <View style={styles.separator}>
                  <View style={styles.dividerView} />
                  <Label type="large">{key}</Label>
                  <View style={styles.dividerView} />
                </View>
                {Object.keys(formattedByTime)
                  .reverse()
                  .map((time) => {
                    const user = this.getMessageByUser(formattedByTime[time]);
                    return (
                      <>
                        {user.map((item, index) => {
                          return <MessageCard key={index} details={item} />;
                        })}
                      </>
                    );
                  })}
              </>
            );
          })}
      </ScrollView>
    );
  }

  private renderRefreshControl = (): ReactElement => {
    const { isRefreshing } = this.state;
    return <RefreshControl refreshing={isRefreshing} onRefresh={this.onLoad} />;
  };

  private onLoad = (): void => {
    const { getMessages, messages, shouldScrollToBottom, currentChat } = this.props;
    const link = messages && !!messages.links.next ? messages.links.next : '';
    if (shouldScrollToBottom) {
      shouldScrollToBottom();
    }

    if (!link || !currentChat) return;
    getMessages({
      groupId: currentChat.groupId,
      cursor: link,
    });
  };

  private getFormattedMessage = (data: Message[], format: string): IMessageKeyValue => {
    return groupBy(data, (results: Message) => {
      return DateUtils.getUtcDisplayDate(results.createdAt, format);
    });
  };

  private getMessageByUser = (data: Message[]): Message[][] => {
    const dataObj = groupBy(data, (results: Message) => {
      return results.user.id;
    });
    return Object.keys(dataObj).map((id) => {
      return dataObj[id];
    });
  };

  private scrollToBottom = (): void => {
    setTimeout(() => {
      this.scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getMessages, getCurrentChatDetail } = CommonSelectors;
  return {
    messages: getMessages(state),
    currentChat: getCurrentChatDetail(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getMessages } = CommonActions;
  return bindActionCreators({ getMessages }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagePreview);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  dividerView: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
    width: 100,
  },
});
