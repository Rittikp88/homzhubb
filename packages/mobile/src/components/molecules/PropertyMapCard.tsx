import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Favorite } from '@homzhub/common/src/components/atoms/Favorite';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';

interface IProps {
  amenitiesData: IAmenitiesIcons[];
  source: string | null;
  name: string;
  price: number;
  currency: Currency;
  priceUnit: string;
  isFavorite: boolean;
  onFavorite: () => void;
  onSelectedProperty: () => void;
}

export class PropertyMapCard extends React.PureComponent<IProps> {
  public render(): React.ReactElement {
    const {
      source,
      name,
      isFavorite,
      onFavorite,
      currency,
      price,
      priceUnit,
      amenitiesData,
      onSelectedProperty,
    } = this.props;
    return (
      <TouchableOpacity onPress={onSelectedProperty}>
        <View style={styles.container}>
          {source ? (
            <Image source={{ uri: source }} style={styles.image} borderBottomLeftRadius={4} borderTopLeftRadius={4} />
          ) : (
            <ImagePlaceholder width={120} height={120} />
          )}
          <View style={styles.detailsContainer}>
            <View style={styles.row}>
              <PricePerUnit price={price} unit={priceUnit} currency={currency} />
              <Favorite onFavorite={onFavorite} isFavorite={isFavorite} />
            </View>
            <Label type="large" textType="semiBold" numberOfLines={1}>
              {name}
            </Label>
            <PropertyAmenities data={amenitiesData} direction="row" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  detailsContainer: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    height: 120,
    width: 120,
  },
});
