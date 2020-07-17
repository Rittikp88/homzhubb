import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/mobile/src/components/atoms/Loader';
import PropertyListCard from '@homzhub/mobile/src/components/organisms/PropertyListCard';
import { IProperties } from '@homzhub/common/src/domain/models/Search';

interface IProps {
  properties: IProperties[];
  onFavorite: (propertyId: number) => void;
}

type Props = IProps;

export class PropertySearchList extends React.PureComponent<Props, {}> {
  public render(): React.ReactElement {
    const { properties, onFavorite } = this.props;
    return (
      <View style={styles.container}>
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
          ListFooterComponent={this.renderFooter}
          onEndReachedThreshold={0.8}
        />
      </View>
    );
  }

  private renderFooter = (): React.ReactElement => {
    return <Loader />;
  };

  private renderKeyExtractor = (item: IProperties, index: number): string => {
    return `${item.id}-${index}`;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: theme.layout.screenPadding,
  },
});
