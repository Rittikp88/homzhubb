import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label, Text, Button } from '@homzhub/common/src/components';
import PropertyListCard from '@homzhub/mobile/src/components/organisms/PropertyListCard';
import { IFilter, IProperties } from '@homzhub/common/src/domain/models/Search';

interface IProps {
  properties: IProperties[];
  propertyCount: number;
  onFavorite: (propertyId: number) => void;
  resetFilters: () => void;
  getProperties: () => void;
  isSearchBarFocused: () => void;
  setFilter: (payload: any) => void;
  filters: IFilter;
}

type Props = IProps & WithTranslation;

class PropertySearchList extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { properties, propertyCount, onFavorite, resetFilters, getProperties, isSearchBarFocused, t } = this.props;
    const resetFilterAndProperties = (): void => {
      resetFilters();
      getProperties();
    };
    if (propertyCount === 0) {
      return (
        <View style={styles.noResultsContainer}>
          <Icon name={icons.search} size={30} color={theme.colors.disabledSearch} />
          <Text type="small" textType="semiBold" style={styles.noResultText}>
            {t('noResultsFound')}
          </Text>
          <Label type="large" textType="regular" style={styles.helperText}>
            {t('noResultHelper')}
          </Label>
          <Button type="primary" title={t('searchAgain')} containerStyle={styles.button} onPress={isSearchBarFocused} />
          <Label type="large" textType="semiBold" style={styles.resetFilters} onPress={resetFilterAndProperties}>
            {t('resetFilters')}
          </Label>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Label type="large" textType="semiBold" style={styles.label}>
          {propertyCount ?? 0} {t('propertiesFound')}
        </Label>
        <FlatList
          data={properties}
          renderItem={({ item }: { item: IProperties }): React.ReactElement => {
            const onUpdateFavoritePropertyId = (propertyId: number): void => onFavorite(propertyId);
            return (
              <PropertyListCard
                property={item}
                propertyId={item.id}
                isFavorite={false} // TODO: Get the value of isFavorite from api response
                onFavorite={onUpdateFavoritePropertyId}
                key={item.id}
              />
            );
          }}
          keyExtractor={this.renderKeyExtractor}
          // ListFooterComponent={this.renderFooter}
          // onEndReached={this.loadMoreProperties}
          onEndReachedThreshold={0.8}
        />
      </View>
    );
  }

  private renderFooter = (): React.ReactElement => {
    return (
      <Text type="regular" textType="regular">
        Loading...
      </Text>
    );
  };

  private renderKeyExtractor = (item: IProperties, index: number): string => {
    return `${item.id}-${index}`;
  };

  public loadMoreProperties = (): void => {
    const {
      setFilter,
      getProperties,
      filters: { offset, limit },
    } = this.props;
    setFilter({ offset: offset + limit });
    getProperties();
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
  noResultsContainer: {
    flex: 1,
    marginTop: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  noResultText: {
    color: theme.colors.darkTint3,
    marginVertical: 10,
  },
  helperText: {
    color: theme.colors.darkTint6,
    textAlign: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  resetFilters: {
    color: theme.colors.primaryColor,
    marginVertical: 10,
  },
  button: {
    flex: 0,
    marginVertical: 10,
  },
});
