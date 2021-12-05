import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import VisitList from '@homzhub/ffm/src/screens/SiteVisits/VisitList';
import { FFMVisit } from '@homzhub/common/src/domain/models/FFMVisit';
import { FFMVisitRoutes, IRoutes, Tabs } from '@homzhub/common/src/constants/Tabs';
import { IFeedbackParam, ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

const SiteVisitDashboard = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const [currentIndex, setIndex] = useState(0);
  const [currentStatus, setStatus] = useState('PENDING');

  useFocusEffect(
    useCallback(() => {
      dispatch(FFMActions.getVisits(currentStatus ? { status__in: currentStatus } : undefined));
      dispatch(FFMActions.clearFeedbackData());
    }, [])
  );

  useEffect(() => {
    const currentRoute = FFMVisitRoutes[currentIndex];
    switch (currentRoute.key) {
      case Tabs.NEW:
        setStatus('PENDING');
        break;
      case Tabs.ONGOING:
      case Tabs.COMPLETED:
        setStatus('ACCEPTED');
        break;
      case Tabs.MISSED:
        setStatus('PENDING,CANCELLED,REJECTED');
        break;
      default:
        setStatus('');
    }
  }, [currentIndex]);

  useEffect(() => {
    dispatch(FFMActions.getVisits(currentStatus ? { status__in: currentStatus } : undefined));
  }, [currentStatus]);

  const onIndexChange = (value: number): void => {
    setIndex(value);
    dispatch(FFMActions.getVisitsSuccess([]));
  };

  const onReschedule = (visit: FFMVisit): void => {
    dispatch(AssetActions.setVisitIds([visit.id]));
    navigate(ScreenKeys.VisitForm, { startDate: visit.startDate, comment: visit.comments });
  };

  const navigateToFeedback = (param: IFeedbackParam): void => {
    navigate(ScreenKeys.FeedbackForm, param);
  };

  const renderScene = ({ route }: { route: IRoutes }): React.ReactElement | null => {
    switch (route.key) {
      case Tabs.NEW:
        return <VisitList tab={Tabs.NEW} onReschedule={onReschedule} navigateToFeedback={navigateToFeedback} />;
      case Tabs.ONGOING:
        return <VisitList tab={Tabs.ONGOING} onReschedule={onReschedule} navigateToFeedback={navigateToFeedback} />;
      case Tabs.MISSED:
        return <VisitList tab={Tabs.MISSED} onReschedule={onReschedule} navigateToFeedback={navigateToFeedback} />;
      case Tabs.COMPLETED:
        return <VisitList tab={Tabs.COMPLETED} onReschedule={onReschedule} navigateToFeedback={navigateToFeedback} />;
      default:
        return null;
    }
  };

  return (
    <GradientScreen screenTitle={t('property:siteVisits')} isUserHeader containerStyle={styles.container}>
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
          routes: FFMVisitRoutes,
        }}
      />
    </GradientScreen>
  );
};

export default SiteVisitDashboard;

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  tabBar: {
    backgroundColor: theme.colors.white,
    marginTop: 10,
  },
  tabLabel: {
    color: theme.colors.darkTint3,
  },
});
