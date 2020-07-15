import React from 'react';
import { FlatList } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { PropertySearchData } from '@homzhub/common/src/mocks/PropertySearchData';
import { Text } from '@homzhub/common/src/components';
import PropertyListCard from '@homzhub/mobile/src/components/organisms/PropertyListCard';

type Props = WithTranslation;

// TODO: to get the data from props once the redux is set
interface IPropertySearchListState {
  propertyList: any[];
  propertyId: number;
}

class PropertySearchList extends React.PureComponent<Props, IPropertySearchListState> {
  public state = {
    propertyList: PropertySearchData,
    propertyId: 63,
  };

  public render(): React.ReactElement {
    const { propertyList, propertyId } = this.state;
    return (
      <FlatList
        data={propertyList}
        renderItem={({ item }): React.ReactElement => {
          const onFavorite = (): void => console.log('call the onfavorite from props');
          return (
            <PropertyListCard
              property={item}
              propertyId={propertyId}
              isFavorite={false}
              onFavorite={onFavorite}
              key={item.id}
            />
          );
        }}
        keyExtractor={this.renderKeyExtractor}
        ListFooterComponent={this.renderFooter}
        onEndReachedThreshold={0.8}
      />
    );
  }

  private renderFooter = (): React.ReactElement => {
    return (
      <Text type="small" textType="regular">
        Loading ...
      </Text>
    );
  };

  private renderKeyExtractor = (item: any, index: number): string => {
    return `${item.id}-${index}`;
  };
}

export default withTranslation()(PropertySearchList);
