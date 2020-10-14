import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { TabBar, TabView } from 'react-native-tab-view';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { AnimatedProfileHeader, FullScreenAssetDetailsCarousel, Loader } from '@homzhub/mobile/src/components';
import AssetCard from '@homzhub/mobile/src/components/organisms/AssetCard';
import SiteVisitTab from '@homzhub/mobile/src/components/organisms/SiteVisitTab';
import NotificationTab from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/NotificationTab';
import DummyView from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/DummyView';
import Documents from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/Documents';
import TenantHistoryScreen from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/TenantHistoryScreen';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { Tabs, Routes } from '@homzhub/common/src/constants/Tabs';

const TAB_LAYOUT = {
  width: theme.viewport.width - theme.layout.screenPadding * 2,
  height: theme.viewport.height,
};

interface IStateProps {
  propertyData: Asset | null;
}

interface IDetailState {
  attachments: Attachment[];
  isFullScreen: boolean;
  activeSlide: number;
  currentIndex: number;
}

interface IRoutes {
  key: string;
  title: string;
  icon: string;
}

type libraryProps = NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.PropertyDetailScreen>;
type Props = WithTranslation & libraryProps & IStateProps;

export class PropertyDetailScreen extends Component<Props, IDetailState> {
  public state = {
    isFullScreen: false,
    activeSlide: 0,
    attachments: [],
    currentIndex: 0,
  };

  public render = (): React.ReactNode => {
    const { t, propertyData } = this.props;
    const { currentIndex } = this.state;
    if (!propertyData) {
      return null;
    }
    return (
      <>
        <AnimatedProfileHeader title={t('portfolio')}>
          <>
            <View style={styles.header}>
              <Icon
                name={icons.leftArrow}
                size={20}
                color={theme.colors.primaryColor}
                onPress={this.handleIconPress}
                testID="icnBack"
              />
              <Text type="small" textType="semiBold" style={styles.headerTitle}>
                {t('propertyDetails')}
              </Text>
            </View>
            <AssetCard assetData={propertyData} isDetailView enterFullScreen={this.onFullScreenToggle} />
            <TabView
              lazy
              renderLazyPlaceholder={(): React.ReactElement => <Loader visible />}
              removeClippedSubviews
              swipeEnabled={false}
              initialLayout={TAB_LAYOUT}
              renderScene={({ route }): React.ReactElement => this.renderTabScene(route)}
              onIndexChange={this.handleIndexChange}
              renderTabBar={(props): React.ReactElement => {
                const {
                  navigationState: { index, routes },
                } = props;
                const currentRoute = routes[index];
                return (
                  <TabBar
                    {...props}
                    scrollEnabled
                    style={{ backgroundColor: theme.colors.white }}
                    indicatorStyle={{ backgroundColor: theme.colors.blue }}
                    renderIcon={({ route }): React.ReactElement => {
                      const isSelected = currentRoute.key === route.key;
                      return (
                        <Icon
                          name={route.icon}
                          color={isSelected ? theme.colors.blue : theme.colors.darkTint3}
                          size={22}
                        />
                      );
                    }}
                    renderLabel={({ route }): React.ReactElement => {
                      const isSelected = currentRoute.key === route.key;
                      return (
                        <Text type="small" style={{ color: isSelected ? theme.colors.blue : theme.colors.darkTint3 }}>
                          {route.title}
                        </Text>
                      );
                    }}
                  />
                );
              }}
              navigationState={{
                index: currentIndex,
                routes: Routes,
              }}
            />
          </>
        </AnimatedProfileHeader>
        {this.renderFullscreenCarousel()}
      </>
    );
  };

  private renderTabScene = (route: IRoutes): React.ReactElement => {
    const { navigation } = this.props;
    switch (route.key) {
      case Tabs.NOTIFICATIONS:
        // TODO: Figure-out something to resolve this error
        // @ts-ignore
        return <NotificationTab />;
      case Tabs.SITE_VISITS:
        return (
          <View style={{ backgroundColor: theme.colors.white }}>
            <SiteVisitTab onReschedule={this.navigateToBookVisit} navigation={navigation} />
          </View>
        );
      case Tabs.DOCUMENTS:
        return <Documents />;
      case Tabs.TENANT_HISTORY:
        return <TenantHistoryScreen />;
      default:
        return <DummyView />;
    }
  };

  private renderFullscreenCarousel = (): React.ReactNode => {
    const { isFullScreen, activeSlide, attachments } = this.state;
    if (!isFullScreen) return null;
    return (
      <FullScreenAssetDetailsCarousel
        onFullScreenToggle={this.onFullScreenToggle}
        activeSlide={activeSlide}
        data={attachments}
        updateSlide={this.updateSlide}
      />
    );
  };

  private onFullScreenToggle = (attachments?: Attachment[]): void => {
    const { isFullScreen } = this.state;
    this.setState({ isFullScreen: !isFullScreen });
    if (attachments) {
      this.setState({ attachments });
    }
  };

  private navigateToBookVisit = (isNew?: boolean): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.SearchStack, {
      screen: ScreensKeys.BookVisit,
      params: { isReschedule: !isNew },
    });
  };

  private handleIndexChange = (index: number): void => {
    this.setState({ currentIndex: index });
  };

  private updateSlide = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  private handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    propertyData: PortfolioSelectors.getAssetById(state),
  };
};

export default connect(
  mapStateToProps,
  null
)(withTranslation(LocaleConstants.namespacesKey.assetPortfolio)(PropertyDetailScreen));

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  headerTitle: {
    color: theme.colors.darkTint1,
    marginLeft: 12,
  },
});
