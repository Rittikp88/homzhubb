import React, { Component, createRef, ReactElement, RefObject } from 'react';
import { groupBy, isEmpty } from 'lodash';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import MessageCard from '@homzhub/common/src/components/molecules/MessageCard';
import { IMessages, Message } from '@homzhub/common/src/domain/models/Message';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IGetMessageParam } from '@homzhub/common/src/domain/repositories/interfaces';

interface IStateProps {
  messages: IMessages | null;
}

interface IDispatchProps {
  getMessages: (param: IGetMessageParam) => void;
}

interface IScreenState {
  isRefreshing: boolean;
}

type Props = IStateProps & IDispatchProps;

// TODO: Use Text component

class MessagePreview extends Component<Props, IScreenState> {
  public scrollRef: RefObject<ScrollView> = createRef();

  public state = {
    isRefreshing: false,
  };

  public componentDidMount = (): void => {
    const { getMessages } = this.props;
    this.scrollToBottom();
    getMessages({ groupId: 16 });
  };

  public render(): React.ReactNode {
    const { messages } = this.props;
    if (!messages || isEmpty(messages)) return null;
    const { messageResult } = messages;

    return (
      <ScrollView refreshControl={this.renderRefreshControl()} showsVerticalScrollIndicator={false}>
        {messageResult.reverse().map((item) => {
          const { results } = item;
          const formattedByTime = this.getFormattedMessage(results, 'LT');
          return (
            <>
              <View style={styles.separator}>
                <View style={styles.dividerView} />
                <Text>{item.key}</Text>
                <View style={styles.dividerView} />
              </View>
              {Object.keys(formattedByTime)
                .reverse()
                .map((time) => {
                  const user = this.getMessageByUser(formattedByTime[time]);
                  return (
                    <>
                      {user.map((detail, index) => {
                        return <MessageCard key={index} details={detail} />;
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
    const { getMessages, messages } = this.props;
    const link = messages && !!messages.links.next ? messages.links.next : '';
    if (!link) return;
    getMessages({
      groupId: 16,
      cursor: link,
    });
  };

  // TODO: Add type
  private getFormattedMessage = (data: Message[], format: string): any => {
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
  const { getMessages } = CommonSelectors;
  return {
    messages: getMessages(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getMessages } = CommonActions;
  return bindActionCreators({ getMessages }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagePreview);

const styles = StyleSheet.create({
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
