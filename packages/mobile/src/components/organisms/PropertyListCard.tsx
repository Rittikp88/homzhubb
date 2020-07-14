import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider, PricePerUnit, Text, PropertyAddress } from '@homzhub/common/src/components';
import PropertyListImageCarousel from '@homzhub/mobile/src/components/molecules/PropertyListImageCarousel';
import PropertyAmenities from '@homzhub/mobile/src/components/molecules/PropertyAmenities';

interface IProps {
  data: any[];
  propertyId: number;
  isFavorite: boolean;
  onFavorite: (index: number) => void;
}

type Props = IProps;

class PropertyListCard extends React.Component<Props, {}> {
  public render(): React.ReactElement {
    const { data, isFavorite } = this.props;
    return (
      <View style={styles.container}>
        <PropertyListImageCarousel data={data} isFavorite={isFavorite} onFavorite={this.onFavorite} />
        {this.renderPropertyTypeAndBadges()}
        <PropertyAddress primaryAddress="Selway Apartments" subAddress="2972 Westheimer Rd. Sanata Ana, NY" />
        <Divider containerStyles={styles.divider} />
        {this.renderPriceAndAmenities()}
      </View>
    );
  }

  public renderPropertyTypeAndBadges = (): React.ReactElement => {
    return (
      <View style={styles.apartmentContainer}>
        <Text type="small" textType="regular" style={styles.propertyTypeText}>
          Apartment
        </Text>
        <View style={styles.badges}>
          <Icon name={icons.biometric} size={33} color={theme.colors.warning} />
          <Icon name={icons.biometric} size={33} color={theme.colors.warning} />
          <Icon name={icons.biometric} size={33} color={theme.colors.darkTint5} />
        </View>
      </View>
    );
  };

  public renderPriceAndAmenities = (): React.ReactElement => {
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
        icon: icons.star,
        iconSize: 30,
        iconColor: theme.colors.darkTint3,
        label: '1200 Sqft',
      },
    ];
    return (
      <>
        <View style={styles.amenities}>
          <PricePerUnit price={32000} currency="₹" unit="mo" />
          <PropertyAmenities data={amenitiesData} direction="row" />
        </View>
      </>
    );
  };

  public onFavorite = (): void => {
    const { onFavorite, propertyId } = this.props;
    onFavorite(propertyId);
  };
}

export default PropertyListCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 10,
    justifyContent: 'space-between',
    borderRadius: 4,
    marginVertical: 10,
  },
  apartmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  propertyTypeText: {
    color: theme.colors.primaryColor,
  },
  divider: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.disabled,
  },
  amenities: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
});
