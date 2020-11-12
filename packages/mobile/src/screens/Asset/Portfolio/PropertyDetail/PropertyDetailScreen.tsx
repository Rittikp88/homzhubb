import React, { Component } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { TabBar, TabView } from 'react-native-tab-view';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src//utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import Icon from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { AnimatedProfileHeader, FullScreenAssetDetailsCarousel, Loader } from '@homzhub/mobile/src/components';
import AssetCard from '@homzhub/mobile/src/components/organisms/AssetCard';
import SiteVisitTab from '@homzhub/mobile/src/components/organisms/SiteVisitTab';
import NotificationTab from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/NotificationTab';
import DummyView from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/DummyView';
import Documents from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/Documents';
import TenantHistoryScreen from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/TenantHistoryScreen';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { IPropertyDetailPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Tabs, Routes } from '@homzhub/common/src/constants/Tabs';

const { height } = theme.viewport;

interface IStateProps {
  assetPayload: ISetAssetPayload;
}

interface IDetailState {
  propertyData: Asset;
  attachments: Attachment[];
  isFullScreen: boolean;
  activeSlide: number;
  currentIndex: number;
  heights: number[];
  isLoading: boolean;
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
    propertyData: {} as Asset,
    isFullScreen: false,
    activeSlide: 0,
    attachments: [],
    currentIndex: 0,
    heights: Array(Routes.length).fill(height),
    isLoading: false,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getAssetDetail();
  };

  public render = (): React.ReactNode => {
    const {
      t,
      route: { params },
    } = this.props;
    const { currentIndex, propertyData, heights, isLoading } = this.state;

    if (isLoading) {
      return <Loader visible />;
    }

    if (isEmpty(propertyData)) {
      return null;
    }

    const title = params && params.isFromDashboard ? t('assetDashboard:dashboard') : t('portfolio');
    return (
      <>
        <AnimatedProfileHeader
          title={title}
          onBackPress={this.handleIconPress}
          sectionHeader={t('propertyDetails')}
          sectionTitleType="semiBold"
        >
          <>
            <AssetCard
              assetData={propertyData}
              isDetailView
              enterFullScreen={this.onFullScreenToggle}
              onCompleteDetails={FunctionUtils.noop}
              onOfferVisitPress={FunctionUtils.noop}
              containerStyle={styles.card}
            />
            <TabView
              swipeEnabled={false}
              style={{ height: heights[currentIndex] }}
              initialLayout={theme.viewport}
              renderScene={({ route }): React.ReactElement | null => this.renderTabScene(route)}
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

  private renderTabScene = (route: IRoutes): React.ReactElement | null => {
    const { navigation } = this.props;
    const {
      propertyData: { assetStatusInfo },
    } = this.state;
    switch (route.key) {
      case Tabs.NOTIFICATIONS:
        // TODO: Figure-out something to resolve this error
        return (
          <View onLayout={(e): void => this.onLayout(e, 0)}>
            <NotificationTab assetStatusInfo={assetStatusInfo} />
          </View>
        );
      case Tabs.TICKETS:
        return (
          <View onLayout={(e): void => this.onLayout(e, 1)}>
            <DummyView />
          </View>
        );
      case Tabs.OFFERS:
        return (
          <View onLayout={(e): void => this.onLayout(e, 2)}>
            <DummyView />
          </View>
        );
      case Tabs.REVIEWS:
        return (
          <View onLayout={(e): void => this.onLayout(e, 3)}>
            <DummyView />
          </View>
        );
      case Tabs.SITE_VISITS:
        return (
          <View style={styles.visitTab} onLayout={(e): void => this.onLayout(e, 4)}>
            <SiteVisitTab onReschedule={this.navigateToBookVisit} navigation={navigation} isFromProperty />
          </View>
        );
      case Tabs.FINANCIALS:
        return (
          <View onLayout={(e): void => this.onLayout(e, 5)}>
            <DummyView />
          </View>
        );
      case Tabs.MESSAGES:
        return (
          <View onLayout={(e): void => this.onLayout(e, 6)}>
            <DummyView />
          </View>
        );
      case Tabs.DOCUMENTS:
        return (
          <View onLayout={(e): void => this.onLayout(e, 7)}>
            <Documents />
          </View>
        );
      case Tabs.TENANT_HISTORY:
        return (
          <View onLayout={(e): void => this.onLayout(e, 8)}>
            <TenantHistoryScreen />
          </View>
        );
      case Tabs.DETAILS:
        return (
          <View onLayout={(e): void => this.onLayout(e, 9)}>
            <DummyView />
          </View>
        );
      default:
        return null;
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

  private onLayout = (e: LayoutChangeEvent, index: number): void => {
    const { heights } = this.state;
    const { height: newHeight } = e.nativeEvent.layout;
    const arrayToUpdate = [...heights];
    if (newHeight !== arrayToUpdate[index]) {
      arrayToUpdate[index] = newHeight * 1.5;
      this.setState({ heights: arrayToUpdate });
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

  private getAssetDetail = async (): Promise<void> => {
    const {
      assetPayload: { asset_id, assetType, listing_id },
    } = this.props;
    const payload: IPropertyDetailPayload = {
      asset_id,
      id: listing_id,
      type: assetType,
    };
    this.setState({ isLoading: true });
    try {
      const response = await PortfolioRepository.getPropertyDetail(payload);
      this.setState({
        propertyData: response,
        isLoading: false,
      });
    } catch (e) {
      this.setState({ isLoading: false });
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
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
    assetPayload: PortfolioSelectors.getCurrentAssetPayload(state),
  };
};

export default connect(
  mapStateToProps,
  null
)(withTranslation(LocaleConstants.namespacesKey.assetPortfolio)(PropertyDetailScreen));

const styles = StyleSheet.create({
  visitTab: {
    backgroundColor: theme.colors.white,
  },
  card: {
    borderRadius: 0,
  },
});
