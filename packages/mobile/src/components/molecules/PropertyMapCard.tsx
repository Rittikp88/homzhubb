import React from 'react';
import { View, StyleSheet, ImageSourcePropType } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Favorite, Image, Label, PricePerUnit } from '@homzhub/common/src/components';
import PropertyAmenities from '@homzhub/mobile/src/components/molecules/PropertyAmenities';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';

interface IProps {
  source: ImageSourcePropType;
  name: string;
  price: number;
  currency: string;
  priceUnit: string;
  bedroom: string;
  bathroom: string;
  carpetArea: string;
  isFavorite: boolean;
  onFavorite: () => void;
}

export class PropertyMapCard extends React.PureComponent<IProps> {
  public render(): React.ReactElement {
    const { source, name, isFavorite, onFavorite, currency, price, priceUnit } = this.props;
    const amenitiesData = this.getAmenities();
    return (
      <View style={styles.container}>
        <Image source={source} style={styles.image} borderBottomLeftRadius={4} borderTopLeftRadius={4} />
        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <PricePerUnit price={price} unit={priceUnit} currency={currency} />
            <Favorite onFavorite={onFavorite} containerStyle={isFavorite ? styles.favorite : styles.nonFavorite} />
          </View>
          <Label type="large" textType="semiBold" numberOfLines={1}>
            {name}
          </Label>
          <PropertyAmenities data={amenitiesData} direction="row" />
        </View>
      </View>
    );
  }

  public getAmenities = (): IAmenitiesIcons[] => {
    const { bedroom, bathroom, carpetArea } = this.props;
    return [
      {
        icon: icons.bed,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: bedroom,
      },
      {
        icon: icons.bathTub,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: bathroom,
      },
      {
        icon: icons.direction,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: carpetArea,
      },
    ];
  };
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
  favorite: {
    backgroundColor: theme.colors.primaryColor,
    padding: 3,
    borderRadius: 4,
  },
  nonFavorite: {
    backgroundColor: theme.colors.favoriteBackground,
    padding: 3,
    borderRadius: 4,
  },
});
