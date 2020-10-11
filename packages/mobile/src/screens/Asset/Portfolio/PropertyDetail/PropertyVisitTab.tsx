import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TopTabNavigatorParamList } from '@homzhub/mobile/src/navigation/TopTabs';
import { theme } from '@homzhub/common/src/styles/theme';
import SiteVisitTab from '@homzhub/mobile/src/components/organisms/SiteVisitTab';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

type Props = NavigationScreenProps<TopTabNavigatorParamList, ScreensKeys.SiteVisitsTab>;

const PropertyVisitTab = ({ navigation }: Props): React.ReactElement => {
  const navigateToBookVisit = (): void => {
    // TODO: Add navigation for reschedule visit
  };
  return (
    <View style={styles.container}>
      <SiteVisitTab onReschedule={navigateToBookVisit} isFromProperty />
    </View>
  );
};

export default PropertyVisitTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
  },
});
