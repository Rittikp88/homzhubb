import React from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { ShieldGroup } from '@homzhub/mobile/src/components';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';

interface IProps {
  asset: Asset;
  isExpanded?: boolean;
  isPriceVisible?: boolean;
  isShieldVisible?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const PropertyCard = (props: IProps): React.ReactElement => {
  const {
    asset: {
      images,
      assetType: { name: assetType },
      projectName,
      address,
      unitNumber,
      blockNumber,
      country: { flag },
      verifications: { description },
      currencyData,
      pricePerUnit,
      maintenancePaymentSchedule,
      carpetArea,
      carpetAreaUnit,
      furnishing,
      spaces,
      assetGroup: { code },
      isAssetOwner,
      formattedProjectName,
    },
    isExpanded,
    containerStyle,
    isPriceVisible = true,
    isShieldVisible = true,
  } = props;

  const isAttachmentPresent = images && images.length > 0;

  const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
    spaces,
    furnishing,
    code,
    carpetArea,
    carpetAreaUnit?.title ?? '',
    true
  );
  const showAmenities = isExpanded && amenitiesData && amenitiesData.length > 0;

  return (
    <View style={containerStyle}>
      {isExpanded && (
        <View style={styles.imageContainer}>
          {isAttachmentPresent ? (
            <Image
              source={{
                uri: images[0].link,
              }}
              style={styles.carouselImage}
            />
          ) : (
            <ImagePlaceholder containerStyle={styles.placeholder} />
          )}
        </View>
      )}
      {isExpanded && (
        <ShieldGroup propertyType={assetType} text={description} isInfoRequired isShieldVisible={isShieldVisible} />
      )}
      <PropertyAddressCountry
        primaryAddress={isAssetOwner ? formattedProjectName : projectName}
        countryFlag={flag}
        subAddress={address ?? `${unitNumber} ${blockNumber}`}
        isIcon
      />
      {isExpanded && isPriceVisible && (
        <PricePerUnit price={pricePerUnit} currency={currencyData} unit={maintenancePaymentSchedule} />
      )}
      {showAmenities && (
        <>
          <PropertyAmenities
            data={amenitiesData}
            direction="row"
            containerStyle={styles.amenitiesContainer}
            contentContainerStyle={styles.amenities}
          />
        </>
      )}
    </View>
  );
};

export default PropertyCard;

const styles = StyleSheet.create({
  imageContainer: {
    marginBottom: 8,
  },
  placeholder: {
    backgroundColor: theme.colors.darkTint5,
  },
  carouselImage: {
    height: 200,
    width: '100%',
  },
  amenitiesContainer: {
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  amenities: {
    marginEnd: 16,
  },
});
