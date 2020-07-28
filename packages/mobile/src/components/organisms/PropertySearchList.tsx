import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text } from '@homzhub/common/src/components';
import PropertyListCard from '@homzhub/mobile/src/components/organisms/PropertyListCard';
import { IFilter, IProperties, IPropertiesObject } from '@homzhub/common/src/domain/models/Search';

interface IProps {
  properties: IPropertiesObject;
  onFavorite: (propertyId: number) => void;
  getPropertiesListView: () => void;
  setFilter: (payload: any) => void;
  filters: IFilter;
}

type Props = IProps & WithTranslation;

class PropertySearchList extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { properties, onFavorite, filters, t } = this.props;
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
          renderItem={({ item }: { item: IProperties }): React.ReactElement => {
            const onUpdateFavoritePropertyId = (propertyId: number): void => onFavorite(propertyId);
            return (
              <PropertyListCard
                property={item}
                onFavorite={onUpdateFavoritePropertyId}
                key={item.id}
                transaction_type={filters.asset_transaction_type}
                isCarousel
              />
            );
          }}
          keyExtractor={this.renderKeyExtractor}
          // @ts-ignore
          ListFooterComponent={this.renderFooter}
          onEndReached={this.loadMoreProperties}
          onEndReachedThreshold={0.8}
        />
      </View>
    );
  }

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

  private renderKeyExtractor = (item: IProperties, index: number): string => {
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
