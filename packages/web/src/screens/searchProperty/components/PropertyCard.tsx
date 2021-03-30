import React, { FC } from 'react';
import { View, StyleSheet, ImageStyle, ViewStyle, TouchableOpacity } from 'react-native';
import { useHistory } from 'react-router';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { AmenitiesShieldIconGroup } from '@homzhub/common/src/components/molecules/AmenitiesShieldIconGroup';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import CardImageCarousel from '@homzhub/web/src/screens/searchProperty/components/CardImageCarousel';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';

interface IProps {
  containerStyle: ViewStyle[];
  cardImageCarouselStyle: ViewStyle;
  cardImageStyle: ImageStyle;
  priceAndAmenitiesStyle: ViewStyle;
  investmentData: Asset;
  priceUnit: string;
  propertyAmenitiesStyle: ViewStyle;
  addressStyle: ViewStyle[];
  propertyTypeAndBadgesStyle: ViewStyle;
  detailsStyle: ViewStyle[];
}
const PropertyCard: FC<IProps> = (props: IProps) => {
  const {
    cardImageCarouselStyle = {},
    cardImageStyle = {},
    investmentData,
    priceUnit,
    containerStyle,
    priceAndAmenitiesStyle,
    propertyAmenitiesStyle,
    addressStyle,
    propertyTypeAndBadgesStyle,
    detailsStyle,
  } = props;
  const history = useHistory();
  const {
    attachments,
    address,
    assetType,
    furnishing,
    spaces,
    projectName,
    carpetArea,
    carpetAreaUnit,
    unitNumber,
    blockNumber,
    leaseTerm,
    saleTerm,
  } = investmentData;
  const primaryAddress = projectName;
  const subAddress = address ?? `${unitNumber ?? ''} ${blockNumber ?? ''}`;
  const propertyType = assetType?.name;
  const badgeInfo = [
    { color: theme.colors.completed },
    { color: theme.colors.completed },
    { color: theme.colors.completed },
  ];
  const navigateToSearchView = (): void => {
    NavigationUtils.navigate(history, {
      path: RouteNames.protectedRoutes.PROPERTY_DETAIL,
      params: { listingId: leaseTerm ? leaseTerm.id : saleTerm?.id ?? 0 },
    });
  };
  const getPrice = (): number => {
    if (leaseTerm) {
      return Number(leaseTerm.expectedPrice);
    }
    if (saleTerm) {
      return Number(saleTerm.expectedPrice);
    }
    return 0;
  };
  const price = getPrice();
  const currencyData = investmentData.country.currencies[0];

  const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
    spaces,
    furnishing,
    AssetGroupTypes.RES,
    carpetArea,
    carpetAreaUnit?.title ?? '',
    true
  );
  return (
    <View style={containerStyle}>
      <CardImageCarousel
        cardImageCarouselStyle={cardImageCarouselStyle}
        cardImageStyle={cardImageStyle}
        imagesArray={attachments}
      />
      <TouchableOpacity onPress={navigateToSearchView}>
        <View style={detailsStyle}>
          <View style={propertyTypeAndBadgesStyle}>
            <Typography variant="label" size="large" fontWeight="regular" style={styles.propertyType}>
              {`${propertyType}`}
            </Typography>
            <AmenitiesShieldIconGroup onBadgePress={FunctionUtils.noop} iconSize={21} badgesInfo={badgeInfo} />
          </View>
          <View style={addressStyle}>
            <Typography variant="text" size="small" fontWeight="semiBold">
              {primaryAddress}
            </Typography>
            <Typography variant="label" size="large">
              {subAddress}
            </Typography>
          </View>
          <View style={priceAndAmenitiesStyle}>
            <PricePerUnit price={price} unit={priceUnit} currency={currencyData} />
            {amenitiesData.length > 0 && (
              <PropertyAmenities
                data={amenitiesData}
                direction="column"
                containerStyle={propertyAmenitiesStyle}
                contentContainerStyle={{}}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PropertyCard;

const styles = StyleSheet.create({
  propertyType: {
    color: theme.colors.primaryColor,
  },
});
