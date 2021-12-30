import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FFMRepository } from '@homzhub/common/src/domain/repositories/FFMRepository';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { ISelectionPicker, SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import { TicketCard } from '@homzhub/common/src/components/organisms/TicketCard';
import { Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { IGetTicket, IUpdateTicket, StatusCategory } from '@homzhub/common/src/domain/repositories/interfaces';
import { IRoutes, Tabs, TicketRoutes } from '@homzhub/common/src/constants/Tabs';

const picker: ISelectionPicker<string>[] = [
  { title: 'New', value: StatusCategory.NEW.toString() },
  { title: 'Open', value: StatusCategory.OPEN.toString() },
  { title: 'Closed', value: StatusCategory.CLOSED.toString() },
];

const RequestDashboard = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const tickets = useSelector(FFMSelector.getTickets);
  const { tickets: ticketLoader } = useSelector(FFMSelector.getFFMLoaders);
  const [selectedValue, setSelectedValue] = useState<string>(StatusCategory.NEW.toString());
  const [currentIndex, setCurrentIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setCurrentIndex(0);
      setSelectedValue(StatusCategory.NEW);
      dispatch(FFMActions.getTickets({ status_category: StatusCategory.NEW }));
    }, [])
  );

  useEffect(() => {
    getData();
  }, [selectedValue, currentIndex]);

  const getData = (): void => {
    const priority = TicketRoutes[currentIndex].key;
    const payload: IGetTicket = {
      status_category: selectedValue as StatusCategory,
      ...(priority !== Tabs.ALL && { priority: priority.toLocaleUpperCase() }),
    };
    dispatch(FFMActions.getTickets(payload));
  };

  const onIndexChange = (value: number): void => {
    setCurrentIndex(value);
  };

  const handleAction = (payload: IUpdateTicket): void => {
    FFMRepository.updateTicket(payload)
      .then(() => {
        getData();
      })
      .catch((e) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      });
  };

  const renderContent = (): ReactElement => {
    return (
      <View style={styles.listContainer}>
        {tickets.length > 0 && (
          <Label type="large" textType="regular" style={styles.count}>
            {tickets.length} {t('assetMore:tickets')}
          </Label>
        )}
        <FlatList
          data={tickets}
          ListEmptyComponent={renderEmptyComponent}
          renderItem={({ item }): ReactElement => renderItem(item, tickets.length)}
          extraData={tickets}
          key="service-tickets-mobile"
        />
      </View>
    );
  };

  const renderItem = (item: Ticket, totalItems: number): ReactElement => {
    const isOdd = (num: number): boolean => {
      return num % 2 === 1;
    };
    const isOddElement = isOdd(totalItems);
    return (
      <TicketCard
        cardData={item}
        isFromMore
        onCardPress={(): void => {}}
        handleAction={handleAction}
        isOddElement={isOddElement}
      />
    );
  };

  const renderEmptyComponent = (): ReactElement => {
    return <EmptyState title={t('serviceTickets:noTickets')} icon={icons.serviceRequest} />;
  };

  const renderScene = ({ route }: { route: IRoutes }): ReactElement => {
    switch (route.key) {
      case Tabs.HIGH:
      case Tabs.ALL:
      case Tabs.MEDIUM:
      case Tabs.LOW:
        return renderContent();
      default:
        return <EmptyState icon={icons.serviceRequest} />;
    }
  };

  return (
    <GradientScreen isUserHeader loading={ticketLoader} screenTitle={t('assetDashboard:tickets')}>
      <SelectionPicker data={picker} selectedItem={[selectedValue]} onValueChange={setSelectedValue} />
      <TabView
        renderScene={renderScene}
        onIndexChange={onIndexChange}
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
                  <Text type="small" style={styles.tabLabel} numberOfLines={1}>
                    {route.title}
                  </Text>
                );
              }}
            />
          );
        }}
        navigationState={{
          index: currentIndex,
          routes: TicketRoutes,
        }}
      />
    </GradientScreen>
  );
};

export default RequestDashboard;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.white,
    paddingTop: 10,
  },
  tabLabel: {
    color: theme.colors.darkTint3,
  },
  listContainer: {
    margin: 16,
  },
  count: {
    color: theme.colors.darkTint6,
  },
});
