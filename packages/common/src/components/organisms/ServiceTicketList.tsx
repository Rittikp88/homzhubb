import React, { Component, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TabBar, TabView } from 'react-native-tab-view';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { IRoutes, Tabs, TicketRoutes } from '@homzhub/common/src/constants/Tabs';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

enum ListType {
  Open = 1,
  Close = 2,
}

interface IProps {
  onAddTicket: () => void;
  navigateToDetail: () => void;
}

interface IScreenState {
  selectedListType: ListType;
  currentIndex: number;
}

type Props = WithTranslation & IProps;

class ServiceTicketList extends Component<Props, IScreenState> {
  public state = {
    selectedListType: ListType.Open,
    currentIndex: 0,
  };

  public render(): React.ReactNode {
    const { selectedListType } = this.state;
    const { t, onAddTicket } = this.props;
    return (
      <>
        <View style={styles.container}>
          <Button type="secondary" title={t('addNewTicket')} containerStyle={styles.addButton} onPress={onAddTicket} />
          <SelectionPicker
            data={[
              { title: t('common:open'), value: ListType.Open },
              { title: t('common:close'), value: ListType.Close },
            ]}
            selectedItem={[selectedListType]}
            onValueChange={this.onTypeChange}
            containerStyles={styles.picker}
          />
        </View>
        {this.renderTabView()}
      </>
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

  // TODO: Update scene with ticket card
  private renderScene = ({ route }: { route: IRoutes }): ReactElement => {
    const { navigateToDetail } = this.props;
    switch (route.key) {
      case Tabs.ALL:
      case Tabs.HIGH:
      case Tabs.MEDIUM:
      case Tabs.LOW:
      default:
        return (
          <Button
            type="secondary"
            title="Ticket Detail" // TODO: Remove
            containerStyle={styles.detailButton}
            onPress={navigateToDetail}
          />
        );
    }
  };

  private onTypeChange = (value: ListType): void => {
    this.setState({ selectedListType: value });
  };

  private handleIndexChange = (index: number): void => {
    this.setState({ currentIndex: index });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.serviceTickets)(ServiceTicketList);

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  addButton: {
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
  // TODO: Remove
  detailButton: {
    margin: 16,
  },
});
