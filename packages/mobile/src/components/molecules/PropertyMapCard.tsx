import React from 'react';
import { View, StyleSheet, ImageSourcePropType } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Favorite, Image, Label, PricePerUnit } from '@homzhub/common/src/components';
import PropertyAmenities from '@homzhub/mobile/src/components/molecules/PropertyAmenities';

interface IProps {
  source: ImageSourcePropType;
  name: string;
  price: number;
  currency: string;
  priceUnit: string;
  onFavorite: () => void;
}

const amenitiesData = [
  {
    icon: icons.bed,
    iconSize: 20,
    iconColor: theme.colors.darkTint3,
    label: '3',
  },
  {
    icon: icons.bathTub,
    iconSize: 20,
    iconColor: theme.colors.darkTint3,
    label: '2',
  },
  {
    icon: icons.direction,
    iconSize: 20,
    iconColor: theme.colors.darkTint3,
    label: '1200 Sqft',
  },
];

const PropertyMapCard = (props: IProps): React.ReactElement => {
  const { source, name, onFavorite, currency, price, priceUnit } = props;
  return (
    <View style={styles.container}>
      <Image source={source} style={styles.image} borderBottomLeftRadius={4} borderTopLeftRadius={4} />
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <PricePerUnit price={price} unit={priceUnit} currency={currency} />
          <Favorite isFavorite={false} onFavorite={onFavorite} />
        </View>
        <Label type="large" textType="semiBold">
          {name}
        </Label>
        <PropertyAmenities data={amenitiesData} direction="row" />
      </View>
    </View>
  );
};

const memoizedComponent = React.memo(PropertyMapCard);
export { memoizedComponent as PropertyMapCard };

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
