import React from 'react';
import { StyleSheet, FlatList, View, PickerItemProps } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { Text } from '@homzhub/common/src/components';
import {
  AnimatedProfileHeader,
  AssetMetricsList,
  BottomSheetListView,
  AssetCard,
} from '@homzhub/mobile/src/components';
import { IAssetData, PortfolioAssetData, TenanciesAssetData } from '@homzhub/common/src/mocks/AssetData';
import { AssetFilter, Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';

interface IPortfolioState {
  isBottomSheetVisible: boolean;
  selectedFilter: string;
  metrics: AssetMetrics;
  filters: PickerItemProps[];
}

type Props = WithTranslation & NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.PortfolioLandingScreen>;

export class Portfolio extends React.PureComponent<Props, IPortfolioState> {
  public state = {
    isBottomSheetVisible: false,
    selectedFilter: Filters.ALL,
    metrics: {} as AssetMetrics,
    filters: [],
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getAssetMetrics();
    await this.getAssetFilters();
  };

  public render = (): React.ReactElement => {
    const { t } = this.props;
    const { selectedFilter, isBottomSheetVisible, metrics, filters } = this.state;
    return (
      <AnimatedProfileHeader title={t('portfolio')}>
        <>
          <AssetMetricsList
            showPlusIcon
            title={metrics?.assetMetrics?.assets?.count ?? 0}
            data={metrics?.assetMetrics?.assetGroups ?? []}
            subscription={metrics?.userServicePlan?.label}
            containerStyle={styles.assetCards}
          />
          {this.renderTenancies()}
          {this.renderPortfolio()}
          <BottomSheetListView
            data={filters}
            selectedValue={selectedFilter}
            listTitle="Filter"
            listHeight={500}
            isBottomSheetVisible={isBottomSheetVisible}
            onCloseDropDown={this.closeBottomSheet}
            onSelectItem={this.onSelectFilter}
          />
        </>
      </AnimatedProfileHeader>
    );
  };

  private renderTenancies = (): React.ReactElement => {
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.title}>
          Tenancies
        </Text>
        <FlatList data={TenanciesAssetData} renderItem={this.renderList} />
      </>
    );
  };

  private renderPortfolio = (): React.ReactElement => {
    return (
      <>
        <View style={styles.headingView}>
          <Text type="small" textType="semiBold" style={styles.title}>
            Property Portfolio
          </Text>
          <Icon
            name={icons.verticalDots}
            color={theme.colors.darkTint4}
            size={18}
            onPress={this.handleBottomSheet}
            testID="menu"
          />
        </View>
        <FlatList data={PortfolioAssetData} renderItem={this.renderList} />
      </>
    );
  };

  private renderList = ({ item }: { item: IAssetData }): React.ReactElement => {
    return <AssetCard assetData={item} onViewProperty={this.onViewProperty} />;
  };

  private onSelectFilter = (value: string): void => {
    this.setState({ selectedFilter: value });
    this.closeBottomSheet();
  };

  public onViewProperty = (data: any): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.PropertyDetailScreen, { propertyData: data });
  };

  private getAssetMetrics = async (): Promise<void> => {
    const response: AssetMetrics = await PortfolioRepository.getAssetMetrics();
    this.setState({ metrics: response });
  };

  private getAssetFilters = async (): Promise<void> => {
    const response: AssetFilter[] = await PortfolioRepository.getAssetFilters();
    const filterData: PickerItemProps[] = response.map(
      (item): PickerItemProps => {
        return {
          label: item.title,
          value: item.label,
        };
      }
    );
    this.setState({ filters: filterData });
  };

  private closeBottomSheet = (): void => {
    this.setState({ isBottomSheetVisible: false });
  };

  private handleBottomSheet = (): void => {
    const { isBottomSheetVisible } = this.state;
    this.setState({ isBottomSheetVisible: !isBottomSheetVisible });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetPortfolio)(Portfolio);

const styles = StyleSheet.create({
  assetCards: {
    marginVertical: 12,
  },
  title: {
    color: theme.colors.darkTint1,
    marginBottom: 16,
    marginTop: 4,
  },
  headingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
