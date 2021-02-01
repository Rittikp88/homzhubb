import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { IFeaturedProperties } from '@homzhub/common/src/domain/repositories/GraphQLRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { ImageSquare } from '@homzhub/common/src/components/atoms/Image';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { PropertyAddress } from '@homzhub/common/src/components/molecules/PropertyAddress';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IUnit } from '@homzhub/common/src/domain/models/Unit';

interface IProps {
  investmentData: IFeaturedProperties;
}

const PropertiesCard = (props: IProps): React.ReactElement => {
  const { investmentData } = props;
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const { address, category, coverImage, priceRange, projectName, possessionDate, typesAvailable } = investmentData;
  const amenitiesGroup: IUnit[] = [
    { id: 1, order: 1, label: 'Type', value: typesAvailable },
    { id: 2, order: 2, label: 'Possession', value: possessionDate },
  ];
  const { t } = useTranslation();
  return (
    <View style={[styles.card, isMobile && styles.cardMobile]}>
      <View>
        <ImageSquare
          style={styles.image}
          size={50}
          source={{
            uri: coverImage.url,
          }}
        />
      </View>
      <View style={styles.mainBody}>
        <View style={styles.propertyRating}>
          <Typography variant="label" size="large" fontWeight="regular" style={styles.propertyType}>
            {category}
          </Typography>
        </View>
        <PropertyAddress
          isIcon={false}
          primaryAddress={projectName}
          primaryAddressStyle={styles.addressTextStyle}
          subAddressStyle={styles.subAddressTextStyle}
          subAddress={address}
          containerStyle={styles.propertyAddress}
        />
        <View>
          <Typography variant="text" size="small" fontWeight="semiBold" style={styles.propertyValue}>
            {t('from')} {priceRange}
          </Typography>
        </View>
        <Divider />
        <View style={styles.amenitiesContainer}>{renderPropertyAmenities(amenitiesGroup)}</View>
      </View>
    </View>
  );
};

const renderPropertyAmenities = (data: IUnit[]): React.ReactElement => {
  return (
    <>
      {data.map((item: IUnit, index: number) => {
        return (
          <View key={index} style={styles.utilityItem}>
            <Label type="large" textType="regular" style={{ color: theme.colors.darkTint4 }}>
              {item.label}
            </Label>
            <Label type="large" textType="semiBold" style={{ color: theme.colors.darkTint2 }}>
              {item.value}
            </Label>
          </View>
        );
      })}
    </>
  );
};

// FIXME subAddress and primaryAddress
const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.landingCardShadow,
    shadowOffset: { width: 0, height: 42 },
    shadowOpacity: 0.8,
    shadowRadius: 120,
    marginBottom: 42,
    marginLeft: 15,
    marginRight: 15,
  },
  cardMobile: {
    marginRight: 0,
    marginLeft: 0,
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
    minHeight: '200',
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
  addressTextStyle: {
    fontSize: 14,
    fontWeight: '600',
  },
  subAddressTextStyle: {
    fontSize: 14,
    fontWeight: '400',
    marginVertical: 0,
    minHeight: 70,
  },
  amenitiesContainer: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  utilityItem: {
    marginRight: 20,
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PropertiesCard;
