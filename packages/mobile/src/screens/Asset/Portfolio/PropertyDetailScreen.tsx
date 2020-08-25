import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text } from '@homzhub/common/src/components';
import { AnimatedProfileHeader, AssetCard } from '@homzhub/mobile/src/components';
import { tabName, Tabs } from '@homzhub/common/src/domain/models/Tabs';

type libraryProps = NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.PropertyDetailScreen>;
type Props = WithTranslation & libraryProps;

export class PropertyDetailScreen extends Component<Props> {
  public render = (): React.ReactNode => {
    const {
      t,
      route: {
        params: { propertyData },
      },
    } = this.props;
    return (
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
              Property Details
            </Text>
          </View>
          <AssetCard assetData={propertyData} isDetailView />
          {this.renderTabView()}
        </>
      </AnimatedProfileHeader>
    );
  };

  private renderTabView = (): React.ReactElement => {
    return (
      <ScrollableTabView
        style={styles.tabContentContainer}
        renderTabBar={(): React.ReactElement => (
          <ScrollableTabBar
            // @ts-ignore
            renderTab={this.renderTabs}
            underlineStyle={styles.tabUnderLine}
            style={styles.tabs}
          />
        )}
      >
        {tabName.map((tab, index) => {
          return (
            // @ts-ignore
            <View tabLabel={tab} key={index} style={styles.tabContentView}>
              {this.renderTabData(tab)}
            </View>
          );
        })}
      </ScrollableTabView>
    );
  };

  private renderTabs = (
    name: string,
    page: number,
    isTabActive: boolean,
    onPressHandler: (page: number) => void,
    onLayoutHandler: () => JSX.Element
  ): React.ReactElement => {
    const onPressTab = (): void => onPressHandler(page);
    const tabIcon = PropertyUtils.getTabIcons(name);
    return (
      <TouchableOpacity key={`${name}_${page}`} onPress={onPressTab} onLayout={onLayoutHandler} style={styles.tab}>
        <>
          <Icon name={tabIcon} size={22} color={isTabActive ? theme.colors.blue : theme.colors.darkTint3} />
          <Label
            type="large"
            textType={isTabActive ? 'semiBold' : 'regular'}
            style={isTabActive ? styles.selectedTabTitle : styles.tabTitle}
          >
            {name}
          </Label>
        </>
      </TouchableOpacity>
    );
  };

  // TODO: Add tab data here
  private renderTabData = (name: Tabs): React.ReactElement => {
    switch (name) {
      case Tabs.NOTIFICATIONS:
        return (
          <View style={styles.contentContainer}>
            <Text type="large">Notifications</Text>
          </View>
        );
      case Tabs.TICKETS:
        return (
          <View style={styles.contentContainer}>
            <Text type="large">Tickets</Text>
          </View>
        );
      case Tabs.OFFERS:
        return (
          <View style={styles.contentContainer}>
            <Text type="large">Offers</Text>
          </View>
        );
      case Tabs.REVIEWS:
        return (
          <View style={styles.contentContainer}>
            <Text type="large">Reviews</Text>
          </View>
        );
      case Tabs.SITE_VISITS:
        return (
          <View style={styles.contentContainer}>
            <Text type="large">Site Visits</Text>
          </View>
        );
      case Tabs.FINANCIALS:
        return (
          <View style={styles.contentContainer}>
            <Text type="large">Financials</Text>
          </View>
        );
      case Tabs.MESSAGES:
        return (
          <View style={styles.contentContainer}>
            <Text type="large">Messages</Text>
          </View>
        );
      case Tabs.DOCUMENTS:
        return (
          <View style={styles.contentContainer}>
            <Text type="large">Documents</Text>
          </View>
        );
      case Tabs.TENANT_HISTORY:
        return (
          <View style={styles.contentContainer}>
            <Text type="large">Tenant History</Text>
          </View>
        );
      case Tabs.DETAILS:
        return (
          <View style={styles.contentContainer}>
            <Text type="large">Details</Text>
          </View>
        );
      default:
        return (
          <View style={styles.contentContainer}>
            <Text type="large">Default</Text>
          </View>
        );
    }
  };

  private handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetPortfolio)(PropertyDetailScreen);

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerTitle: {
    color: theme.colors.darkTint1,
    marginLeft: 12,
  },
  tab: {
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabs: {
    marginLeft: 16,
    height: 75,
    borderWidth: 2,
    borderColor: theme.colors.background,
    paddingTop: 10,
  },
  tabTitle: {
    color: theme.colors.darkTint3,
    paddingBottom: 5,
    paddingHorizontal: 5,
  },
  selectedTabTitle: {
    color: theme.colors.blue,
    paddingBottom: 5,
    paddingHorizontal: 5,
  },
  tabUnderLine: {
    borderRadius: 2,
    height: 2.8,
    backgroundColor: theme.colors.blue,
  },
  tabContentContainer: {
    marginTop: 16,
    backgroundColor: theme.colors.white,
  },
  tabContentView: {
    padding: 16,
  },
  contentContainer: {
    paddingVertical: 10,
    minHeight: 300,
    alignItems: 'center',
  },
});
