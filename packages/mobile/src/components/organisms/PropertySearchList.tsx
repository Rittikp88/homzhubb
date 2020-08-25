import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text } from '@homzhub/common/src/components';
import PropertyListCard from '@homzhub/mobile/src/components/organisms/PropertyListCard';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';

interface IProps {
  properties: AssetSearch;
  onFavorite: (propertyId: number) => void;
  getPropertiesListView: () => void;
  setFilter: (payload: any) => void;
  filters: IFilter;
  onSelectedProperty: (propertyTermId: number, propertyId: number) => void;
}

type Props = IProps & WithTranslation;

export class PropertySearchList extends React.PureComponent<Props> {
  public componentWillUnmount(): void {
    const { setFilter } = this.props;
    setFilter({ offset: 0 });
  }

  public render(): React.ReactNode {
    const { properties, t } = this.props;
    if (properties.count === 0) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Label type="large" textType="semiBold" style={styles.label}>
          {properties.count ?? 0} {t('propertiesFound')}
        </Label>
        <FlatList
          data={properties.results}
          renderItem={this.renderItem}
          keyExtractor={this.renderKeyExtractor}
          // @ts-ignore
          ListFooterComponent={this.renderFooter}
          onEndReached={this.loadMoreProperties}
          onEndReachedThreshold={0.8}
          testID="resultList"
        />
      </View>
    );
  }

  public renderItem = ({ item }: { item: Asset }): React.ReactElement => {
    const { onFavorite, filters, onSelectedProperty } = this.props;
    const onUpdateFavoritePropertyId = (propertyId: number): void => onFavorite(propertyId);
    const navigateToAssetDescription = (): void => {
      const { leaseTerm, saleTerm, id } = item;
      if (leaseTerm) {
        onSelectedProperty(leaseTerm.id, id);
      }
      if (saleTerm) {
        onSelectedProperty(saleTerm.id, id);
      }
    };
    return (
      <PropertyListCard
        property={item}
        onFavorite={onUpdateFavoritePropertyId}
        key={item.id}
        transaction_type={filters.asset_transaction_type}
        isCarousel
        onSelectedProperty={navigateToAssetDescription}
        testID="listCard"
      />
    );
  };

  public renderFooter = (): React.ReactNode => {
    const { t, properties } = this.props;
    if (properties.count === properties.results.length) {
      return null;
    }
    return (
      <Text type="regular" textType="regular" style={styles.loading}>
        {t('common:loading')}
      </Text>
    );
  };

  private renderKeyExtractor = (item: Asset, index: number): string => {
    return `${item.id}-${index}`;
  };

  public loadMoreProperties = (): void => {
    const {
      setFilter,
      getPropertiesListView,
      filters: { offset, limit },
    } = this.props;
    setFilter({ offset: offset + limit });
    getPropertiesListView();
  };
}

export default withTranslation(LocaleConstants.namespacesKey.propertySearch)(PropertySearchList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: theme.layout.screenPadding,
  },
  label: {
    color: theme.colors.darkTint4,
  },
  loading: {
    textAlign: 'center',
    alignSelf: 'center',
  },
});
