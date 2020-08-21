import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
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

export class Portfolio extends React.PureComponent<{}, IPortfolioState> {
  public state = {
    isBottomSheetVisible: false,
    selectedFilter: 'all',
  };

  public render = (): React.ReactElement => {
    const { selectedFilter, isBottomSheetVisible } = this.state;
    const assetData = ObjectMapper.deserialize(AssetMetrics, AssetPropertyTypeData);
    return (
      <AnimatedProfileHeader title="Portfolio">
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
    return <AssetCard assetData={item} />;
  };

  private onSelectFilter = (value: string): void => {
    this.setState({ selectedFilter: value });
    this.closeBottomSheet();
  };

  private handleBottomSheet = (): void => {
    const { isBottomSheetVisible } = this.state;
    this.setState({ isBottomSheetVisible: !isBottomSheetVisible });
  };

  private closeBottomSheet = (): void => {
    this.setState({ isBottomSheetVisible: false });
  };
}

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
