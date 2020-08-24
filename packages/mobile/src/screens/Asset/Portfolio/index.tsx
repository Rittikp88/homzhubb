import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components';
import {
  AnimatedProfileHeader,
  AssetMetricsList,
  BottomSheetListView,
  AssetCard,
} from '@homzhub/mobile/src/components';
import { AssetFilter, IAssetData, PortfolioAssetData, TenanciesAssetData } from '@homzhub/common/src/mocks/AssetData';
import { AssetPropertyTypeData } from '@homzhub/common/src/mocks/AssetMetrics';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';

interface IPortfolioState {
  isBottomSheetVisible: boolean;
  selectedFilter: string;
}

type Props = WithTranslation & NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.PortfolioLandingScreen>;

export class Portfolio extends React.PureComponent<Props, IPortfolioState> {
  public state = {
    isBottomSheetVisible: false,
    selectedFilter: 'all',
  };

  public render = (): React.ReactElement => {
    const { t } = this.props;
    const { selectedFilter, isBottomSheetVisible } = this.state;
    const assetData = ObjectMapper.deserialize(AssetMetrics, AssetPropertyTypeData);
    return (
      <AnimatedProfileHeader title={t('portfolio')}>
        <>
          <AssetMetricsList
            showPlusIcon
            title={10}
            data={assetData?.assetMetrics?.miscellaneous}
            subscription="HomzHub Pro"
            containerStyle={styles.assetCards}
          />
          {this.renderTenancies()}
          {this.renderPortfolio()}
          <BottomSheetListView
            data={AssetFilter}
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
