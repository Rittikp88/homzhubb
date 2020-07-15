import React from 'react';
import { FlatList } from 'react-native';
import { IProperties, IPropertiesObject } from '@homzhub/common/src/domain/models/Search';
import { Loader } from '@homzhub/mobile/src/components/atoms/Loader';
import PropertyListCard from '@homzhub/mobile/src/components/organisms/PropertyListCard';

interface IProps {
  properties: IPropertiesObject;
}

type Props = IProps;

class PropertySearchList extends React.PureComponent<Props, {}> {
  public render(): React.ReactElement {
    const { properties } = this.props;
    const propertyList: IProperties[] = Object.values(properties);
    return (
      <FlatList
        data={propertyList}
        renderItem={({ item }: { item: IProperties }): React.ReactElement => {
          const onFavorite = (): void => console.log('call the onfavorite from props');
          return (
            <PropertyListCard
              property={item}
              propertyId={item.id}
              isFavorite={false} // TODO: Get the value of isFavorite from api response
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
    return <Loader />;
  };

  private renderKeyExtractor = (item: IProperties, index: number): string => {
    return `${item.id}-${index}`;
  };
}

export default PropertySearchList;
