import React from 'react';
import { StyleSheet, View, Image, StyleProp, ViewStyle, FlatList, TouchableOpacity } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { ShieldGroup } from '@homzhub/mobile/src/components';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { LeaseTerm } from '@homzhub/common/src/domain/models/LeaseTerm';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { SaleTerm } from '@homzhub/common/src/domain/models/SaleTerm';
import { TenantPreference } from '@homzhub/common/src/domain/models/TenantInfo';

export type OfferType = 'Offer Received' | 'Offer Made';

interface IScreenProps {
  isCardExpanded: boolean;
  propertyOffer: Asset;
  onViewOffer?: () => void;
  isDetailView?: boolean;
  containerStyles?: StyleProp<ViewStyle>;
  offerType?: OfferType;
}

interface IScreenState {
  isExpanded: boolean;
}

interface IExpectation {
  title: string;
  value: string | number | TenantPreference[] | null;
}

type Props = WithTranslation & IScreenProps;

const leaseListingExpectationData = (
  listingData: LeaseTerm | null,
  currencySymbol: string,
  t: TFunction
): IExpectation[] | null => {
  if (!listingData) {
    return null;
  }

  const {
    expectedPrice,
    securityDeposit,
    annualRentIncrementPercentage,
    availableFromDate,
    minimumLeasePeriod,
    maximumLeasePeriod,
    tenantPreferences,
  } = listingData;

  return [
    {
      title: t('offers:rentalPrice'),
      value: `${currencySymbol} ${expectedPrice}`,
    },
    {
      title: t('offers:proposedSecurityDeposit'),
      value: `${currencySymbol} ${securityDeposit}`,
    },
    {
      title: t('property:annualIncrementSuffix'),
      value: `${annualRentIncrementPercentage}%`,
    },
    {
      title: t('property:moveInDate'),
      value: DateUtils.getDisplayDate(availableFromDate, DateFormats.D_MMM_YYYY),
    },
    {
      title: t('property:minimumLeasePeriod'),
      value: `${minimumLeasePeriod} ${t('common:months')}`,
    },
    {
      title: t('property:maximumLeasePeriod'),
      value: `${maximumLeasePeriod} ${t('common:months')}`,
    },
    {
      title: t('moreSettings:preferencesText'),
      value: tenantPreferences,
    },
  ];
};

const saleListingExpectationData = (
  listingData: SaleTerm | null,
  currencySymbol: string,
  t: TFunction
): IExpectation[] | null => {
  if (!listingData) {
    return null;
  }

  const { expectedPrice, expectedBookingAmount } = listingData;

  return [
    {
      title: t('offers:sellPrice'),
      value: `${currencySymbol} ${expectedPrice}`,
    },
    {
      title: t('property:bookingAmount'),
      value: `${currencySymbol} ${expectedBookingAmount}`,
    },
  ];
};

class PropertyOffers extends React.PureComponent<Props, IScreenState> {
  constructor(props: Props) {
    super(props);
    const { isCardExpanded } = this.props;
    this.state = {
      isExpanded: isCardExpanded || false,
    };
  }

  public render(): React.ReactElement {
    const {
      propertyOffer: {
        offerCount,
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
      },
      containerStyles,
      t,
      onViewOffer,
      isDetailView = false,
    } = this.props;
    const { isExpanded } = this.state;

    const offerCountHeading = `${offerCount} ${t('common:offers')}`;
    const isAttechmentPresent = images && images.length > 0;

    const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
      spaces,
      furnishing,
      code,
      carpetArea,
      carpetAreaUnit?.title ?? '',
      true
    );

    const showAmenities = isExpanded && amenitiesData && amenitiesData.length > 0;
    const customStyle = customStyles(isDetailView);

    return (
      <TouchableOpacity
        style={[styles.container, containerStyles]}
        activeOpacity={!isDetailView ? 0.7 : 1}
        onPress={onViewOffer}
      >
        {!isDetailView && (
          <View style={[styles.justifyContent, styles.countWithIcon]}>
            {offerCount && (
              <View style={styles.offerCount}>
                <Icon name={icons.offers} color={theme.colors.blue} />
                <Label textType="semiBold" type="large" style={styles.offerText}>
                  {offerCountHeading}
                </Label>
              </View>
            )}
            <>
              {isExpanded ? (
                <Icon
                  name={icons.upArrow}
                  size={15}
                  color={theme.colors.blue}
                  onPress={(): void => this.setState({ isExpanded: false })}
                />
              ) : (
                <Icon
                  name={icons.downArrow}
                  size={15}
                  color={theme.colors.blue}
                  onPress={(): void => this.setState({ isExpanded: true })}
                />
              )}
            </>
          </View>
        )}
        <>
          {isExpanded && (
            <View style={customStyle.imageContainer}>
              {isAttechmentPresent ? (
                <Image
                  source={{
                    uri: images[0].link,
                  }}
                  style={styles.carouselImage}
                  resizeMode="contain"
                />
              ) : (
                <ImagePlaceholder containerStyle={styles.placeholder} />
              )}
            </View>
          )}
          {isExpanded && <ShieldGroup propertyType={assetType} text={description} isInfoRequired />}
          <PropertyAddressCountry
            primaryAddress={projectName}
            countryFlag={flag}
            subAddress={address ?? `${unitNumber} ${blockNumber}`}
            isIcon
          />
          {isExpanded && (
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
          {this.renderExpectation()}
        </>
      </TouchableOpacity>
    );
  }

  private renderExpectation = (): React.ReactNode => {
    const { isExpanded } = this.state;
    if (!isExpanded) {
      return null;
    }

    const {
      propertyOffer: { isLeaseListing, leaseTerm, saleTerm, currencySymbol, projectName },
      t,
    } = this.props;

    const expectationData = isLeaseListing
      ? leaseListingExpectationData(leaseTerm, currencySymbol, t)
      : saleListingExpectationData(saleTerm, currencySymbol, t);

    return (
      <>
        <Divider containerStyles={styles.divider} />
        <Label textType="semiBold" type="large" style={[styles.expectationHeading, styles.tintColor]}>
          {`${t('offers:yourExpectationFor')} ${projectName}`}
        </Label>
        {expectationData && (
          <FlatList
            data={expectationData}
            renderItem={this.renderExpectedItem}
            keyExtractor={this.renderKeyExtractor}
            numColumns={2}
            ItemSeparatorComponent={this.renderItemSeparator}
          />
        )}
      </>
    );
  };

  private renderExpectedItem = ({ item, index }: { item: IExpectation; index: number }): React.ReactElement | null => {
    const { title, value } = item;
    const { t } = this.props;

    if (!value) {
      return null;
    }

    if (title === t('moreSettings:preferencesText')) {
      // TODO: add preference component
      return null;
    }
    return (
      <View key={index} style={styles.expectedItem}>
        <Label textType="regular" type="small" style={styles.tintColor}>
          {title}
        </Label>
        <Label textType="semiBold" type="large" style={styles.tintColor}>
          {value}
        </Label>
      </View>
    );
  };

  private renderKeyExtractor = (item: IExpectation, index: number): string => `${item.title}-${index}`;

  private renderItemSeparator = (): React.ReactElement => <View style={styles.separator} />;
}

export default withTranslation()(PropertyOffers);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
  },
  justifyContent: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  placeholder: {
    backgroundColor: theme.colors.darkTint5,
  },
  carouselImage: {
    height: '100%',
    width: '100%',
  },
  offerCount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amenitiesContainer: {
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  amenities: {
    marginEnd: 16,
  },
  divider: {
    marginVertical: 16,
    borderColor: theme.colors.darkTint10,
  },
  expectationHeading: {
    marginBottom: 20,
  },
  offerText: {
    color: theme.colors.blue,
    marginLeft: 6,
  },
  tintColor: {
    color: theme.colors.darkTint3,
  },
  preferenceContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  separator: {
    width: 60,
    height: 24,
  },
  viewOfferButton: {
    marginTop: 24,
  },
  expectedItem: {
    flex: 2,
  },
  countWithIcon: {
    marginBottom: 15,
  },
});

const customStyles = (isDetailView: boolean): { imageContainer: ViewStyle } => {
  return StyleSheet.create({
    imageContainer: {
      marginTop: isDetailView ? 0 : 15,
      marginBottom: 8,
    },
  });
};
