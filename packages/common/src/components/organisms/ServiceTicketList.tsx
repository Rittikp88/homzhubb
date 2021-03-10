import React, { Component, ReactElement } from 'react';
import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TabBar, TabView } from 'react-native-tab-view';
import { theme } from '@homzhub/common/src/styles/theme';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { TicketCard } from '@homzhub/common/src/components/organisms/TicketCard';
import { Ticket, TicketPriority, TicketStatus } from '@homzhub/common/src/domain/models/Ticket';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IRoutes, Tabs, TicketRoutes } from '@homzhub/common/src/constants/Tabs';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ICurrentTicket } from '@homzhub/common/src/modules/tickets/interface';

interface IProps {
  onAddTicket: () => void;
  navigateToDetail: () => void;
  isFromMore?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

interface IDispatchProps {
  getTickets: () => void;
  setCurrentTicket: (payload: ICurrentTicket) => void;
}

interface IStateProps {
  tickets: Ticket[];
}

interface IScreenState {
  selectedListType: TicketStatus;
  currentIndex: number;
}

type Props = WithTranslation & IProps & IDispatchProps & IStateProps;

class ServiceTicketList extends Component<Props, IScreenState> {
  public state = {
    selectedListType: TicketStatus.OPEN,
    currentIndex: 0,
  };

  public componentDidMount = (): void => {
    const { getTickets } = this.props;
    getTickets();
  };

  public render(): React.ReactNode {
    const { selectedListType } = this.state;
    const { t, onAddTicket, containerStyle } = this.props;

    return (
      <View style={containerStyle}>
        <View style={styles.container}>
          <Button type="secondary" title={t('addNewTicket')} containerStyle={styles.addButton} onPress={onAddTicket} />
          <SelectionPicker
            data={[
              { title: t('common:open'), value: TicketStatus.OPEN },
              { title: t('common:closed'), value: TicketStatus.CLOSED },
            ]}
            selectedItem={[selectedListType]}
            onValueChange={this.onTypeChange}
            containerStyles={styles.picker}
          />
        </View>
        {this.renderTabView()}
      </View>
    );
  }

  private renderTabView = (): React.ReactElement => {
    const { currentIndex } = this.state;
    return (
      <TabView
        initialLayout={theme.viewport}
        renderScene={this.renderScene}
        onIndexChange={this.handleIndexChange}
        renderTabBar={(props): React.ReactElement => {
          const {
            navigationState: { index, routes },
          } = props;
          const currentRoute = routes[index];
          return (
            <TabBar
              {...props}
              style={styles.tabBar}
              indicatorStyle={{ backgroundColor: currentRoute.color }}
              renderLabel={({ route }): React.ReactElement => {
                return (
                  <Text type="small" style={styles.tabTitle} numberOfLines={1}>
                    {route.title}
                  </Text>
                );
              }}
            />
          );
        }}
        swipeEnabled={false}
        navigationState={{
          index: currentIndex,
          routes: TicketRoutes,
        }}
      />
    );
  };

  private renderScene = ({ route }: { route: IRoutes }): ReactElement => {
    switch (route.key) {
      case Tabs.ALL:
        return this.renderContent(TicketPriority.ALL);
      case Tabs.HIGH:
        return this.renderContent(TicketPriority.HIGH);
      case Tabs.MEDIUM:
        return this.renderContent(TicketPriority.MEDIUM);
      case Tabs.LOW:
        return this.renderContent(TicketPriority.LOW);
      default:
        return <EmptyState />;
    }
  };

  private renderContent = (priority: TicketPriority): ReactElement => {
    const { t } = this.props;
    const data = this.getFormattedData(priority);
    return (
      <View style={styles.listContainer}>
        {data.length > 0 && (
          <Label type="large" textType="regular" style={styles.count}>
            {data.length} {t('tickets')}
          </Label>
        )}
        <FlatList
          data={data}
          ListEmptyComponent={this.renderEmptyComponent}
          renderItem={this.renderItem}
          extraData={data}
        />
      </View>
    );
  };

  private renderItem = ({ item }: { item: Ticket }): ReactElement => {
    const { isFromMore, getTickets } = this.props;
    return (
      <TicketCard
        cardData={item}
        onCardPress={(): void => this.onTicketPress(item)}
        isFromMore={isFromMore}
        onSubmitReview={getTickets}
      />
    );
  };

  private renderEmptyComponent = (): ReactElement => {
    const { t } = this.props;
    return <EmptyState title={t('serviceTickets:noTickets')} icon={icons.ticket} />;
  };

  // HANDLERS START
  private onTicketPress = ({ id, quoteRequestId, asset }: Ticket): void => {
    const { navigateToDetail, setCurrentTicket } = this.props;
    setCurrentTicket({ ticketId: id, quoteRequestId, propertyName: asset.projectName });
    navigateToDetail();
  };

  private onTypeChange = (value: TicketStatus): void => {
    this.setState({ selectedListType: value });
  };

  private getFormattedData = (priority: TicketPriority): Ticket[] => {
    const { selectedListType } = this.state;
    const { tickets } = this.props;
    const formattedData = tickets.filter((item: Ticket) => item.status === selectedListType);
    return priority === TicketPriority.ALL
      ? formattedData
      : formattedData.filter((item: Ticket) => item.priority === priority);
  };

  private handleIndexChange = (index: number): void => {
    this.setState({ currentIndex: index });
  };
  // HANDLERS END
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getTickets } = TicketSelectors;
  return {
    tickets: getTickets(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getTickets, setCurrentTicket } = TicketActions;
  return bindActionCreators(
    {
      getTickets,
      setCurrentTicket,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.serviceTickets)(ServiceTicketList));

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  addButton: {
    flex: 0,
    borderStyle: 'dashed',
  },
  picker: {
    marginTop: 20,
  },
  tabBar: {
    backgroundColor: theme.colors.white,
  },
  tabTitle: {
    color: theme.colors.darkTint3,
  },
  listContainer: {
    margin: 16,
  },
  count: {
    color: theme.colors.darkTint6,
  },
});
