import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { TopTabNavigatorParamList } from '@homzhub/mobile/src/navigation/TopTabs';
import { theme } from '@homzhub/common/src/styles/theme';
import SiteVisitTab from '@homzhub/mobile/src/components/organisms/SiteVisitTab';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

type Props = NavigationScreenProps<TopTabNavigatorParamList, ScreensKeys.SiteVisitsTab>;

export class PropertyVisitTab extends Component<Props> {
  public render(): React.ReactNode {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <SiteVisitTab onReschedule={this.navigateToBookVisit} isFromProperty navigation={navigation} />
      </View>
    );
  }

  private navigateToBookVisit = (): void => {
    // TODO: Add navigation for reschedule visit
  };
}

export default PropertyVisitTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
  },
});
