import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { AmenitiesShieldIconGroup } from '@homzhub/common/src/components/molecules/AmenitiesShieldIconGroup';
import { PropertyAddress } from '@homzhub/common/src/components/molecules/PropertyAddress';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import CardImageCarousel from '@homzhub/web/src/screens/searchProperty/components/CardImageCarousel';
import InvestmentFooter from '@homzhub/web/src/screens/dashboard/components/InvestmentFooter';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

// TODO : Replace Dummy Data with Api Data

interface IProps {
  investmentData: any;
}

const PropertySearchCard = (props: IProps): React.ReactElement => {
  const { investmentData } = props;
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const {
    address,
    asset_type,
    furnishing,
    spaces,
    project_name,
    carpetArea,
    carpetAreaUnit,
    unitNumber,
    blockNumber,
  } = investmentData;
  const primaryAddress = project_name;
  const subAddress = address ?? `${unitNumber ?? ''} ${blockNumber ?? ''}`;
  const propertyType = asset_type?.name;
  const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
    spaces,
    furnishing,
    AssetGroupTypes.RES,
    carpetArea,
    carpetAreaUnit?.title ?? '',
    true
  );

  const badgeInfo = [
    { color: theme.colors.completed },
    { color: theme.colors.completed },
    { color: theme.colors.completed },
  ];
  return (
    <View style={[styles.card, isMobile && styles.cardMobile]}>
      <View style={styles.imageContainer}>
        <CardImageCarousel />
      </View>
      <View style={styles.mainBody}>
        <View style={styles.propertyRating}>
          <Typography variant="label" size="large" fontWeight="regular" style={styles.propertyType}>
            {propertyType}
          </Typography>
          <AmenitiesShieldIconGroup onBadgePress={FunctionUtils.noop} iconSize={21} badgesInfo={badgeInfo} />
        </View>
        <PropertyAddress
          isIcon={false}
          primaryAddress={primaryAddress}
          primaryAddressStyle={styles.addressTextStyle}
          subAddressStyle={styles.subAddressTextStyle}
          subAddress={subAddress}
          containerStyle={styles.propertyAddress}
        />
        <View style={styles.addressContainer}>
          <View style={styles.propertyValueContainer}>
            <Typography variant="text" size="small" fontWeight="semiBold" style={styles.propertyValue}>
              From ₹32.5 Lacs - ₹48 Lacs
            </Typography>
          </View>
          {amenitiesData.length > 0 && (
            <PropertyAmenities
              data={amenitiesData}
              direction="column"
              containerStyle={styles.propertyInfoBox}
              contentContainerStyle={styles.cardIcon}
            />
          )}
        </View>
        <InvestmentFooter investmentData={investmentData} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    marginRight: 16,
    marginBottom: 25,
    width: '100%',
  },

  cardMobile: {
    marginRight: undefined,
  },
  image: {
    flex: 1,
    minWidth: 'calc(100% - 24px)',
    maxWidth: 298,
    minHeight: 160,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    margin: 12,
  },
  propertyAddress: {
    flex: 0,
    marginTop: 8,
    marginBottom: 8,
    minHeight: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  mainBody: {
    flexDirection: 'column',
    marginTop: 16,
    marginHorizontal: 20,
    marginBottom: 0,
    minHeight: '200px',
  },
  propertyRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyValue: {
    color: theme.colors.darkTint2,
    paddingBottom: 15,
  },
  propertyType: {
    color: theme.colors.primaryColor,
  },
  propertyInfo: {
    marginRight: 16,
    color: theme.colors.darkTint3,
  },
  propertyInfoBox: {
    justifyContent: 'space-around',
    marginRight: 16,
  },
  cardIcon: {
    marginRight: 8,
  },
  propertyBadge: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '2px 6px',
    position: 'absolute',
    height: 25,
    marginLeft: 24,
    marginTop: 24,
  },
  addressTextStyle: {
    fontSize: 14,
    fontWeight: '600',
  },
  subAddressTextStyle: {
    fontSize: 14,
    fontWeight: '400',
    marginVertical: 0,
  },
  imageContainer: {
    margin: 12,
  },
  addressContainer: {
    flexDirection: 'row',
  },
  propertyValueContainer: { width: '50%' },
});

export default PropertySearchCard;
