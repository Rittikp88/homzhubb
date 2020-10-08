import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components';
import { Loader } from '@homzhub/mobile/src/components';
import PropertyVisitList, { VisitType } from '@homzhub/mobile/src/components/organisms/PropertyVisitList';

interface IRoutes {
  key: string;
  title: VisitType;
  color: string;
}

const Routes: IRoutes[] = [
  { key: 'upcoming', title: VisitType.UPCOMING, color: theme.colors.mediumPriority },
  { key: 'missed', title: VisitType.MISSED, color: theme.colors.error },
  { key: 'completed', title: VisitType.COMPLETED, color: theme.colors.green },
];

interface IScreenState {
  currentIndex: number;
}

class SiteVisitTab extends Component<any, IScreenState> {
  public state = {
    currentIndex: 0,
  };

  public render(): React.ReactNode {
    const { currentIndex } = this.state;
    return (
      <>
        <TabView
          lazy
          renderLazyPlaceholder={(): React.ReactElement => <Loader visible />}
          removeClippedSubviews
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
                    <Text type="small" style={styles.tabLabel}>
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
            routes: Routes,
          }}
        />
      </>
    );
  }

  private renderScene = ({ route }: { route: IRoutes }): React.ReactElement | null => {
    switch (route.key) {
      case 'upcoming':
        return <PropertyVisitList routeKey={VisitType.UPCOMING} />;
      case 'missed':
        return <PropertyVisitList routeKey={VisitType.MISSED} />;
      case 'completed':
        return <PropertyVisitList routeKey={VisitType.COMPLETED} />;
      default:
        return null;
    }
  };

  private handleIndexChange = (index: number): void => {
    this.setState({ currentIndex: index });
  };
}

export default SiteVisitTab;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.white,
    marginTop: 10,
  },
  tabLabel: {
    color: theme.colors.darkTint3,
  },
});
