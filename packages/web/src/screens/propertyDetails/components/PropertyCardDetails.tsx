import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { AssetDetailsImageCarousel } from '@homzhub/common/src/components/molecules/AssetDetailsImageCarousel';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import GalleryView from '@homzhub/web/src/components/molecules/GalleryView';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { ShieldGroup } from '@homzhub/web/src/components/molecules/ShieldGroupHeader';
import TabSections from '@homzhub/web/src/screens/propertyDetails/components/tabSection';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IFilter, IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IStateProps {
  filters: IFilter;
}
interface IProp {
  assetDetails: Asset | null;
  propertyTermId: number;
}

type Props = IProp & IStateProps & WithTranslation & IWithMediaQuery;

export class PropertyCardDetails extends React.PureComponent<Props> {
  public render = (): React.ReactNode => {
    const {
      assetDetails,
      filters: { asset_transaction_type },
      isTablet,
      isMobile,
      isIpadPro,
      t,
      propertyTermId,
    } = this.props;
    if (!assetDetails) {
      return null;
    }
    const {
      projectName,
      unitNumber,
      blockNumber,
      address,
      country: { flag },
      carpetArea,
      carpetAreaUnit,
      furnishing,
      spaces,
      assetType,
      leaseTerm,
      saleTerm,
      postedOn,
      contacts: { fullName, profilePicture },
      country: { currencies },
      assetGroup: { code, name },
    } = assetDetails;

    const propertyType = assetType ? assetDetails.assetType.name : '';
    const propertyTimelineData = PropertyUtils.getPropertyTimelineData(
      name,
      postedOn,
      (leaseTerm?.availableFromDate || saleTerm?.availableFromDate) ?? '',
      asset_transaction_type || 0,
      saleTerm
    );
    const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
      spaces,
      furnishing,
      code,
      carpetArea,
      carpetAreaUnit?.title ?? '',
      true
    );
    const styles = propertyDetailStyle(isMobile, isTablet);

    let currencyData = currencies[0];

    if (leaseTerm && leaseTerm.currency) {
      currencyData = leaseTerm.currency;
    }

    if (saleTerm && saleTerm.currency) {
      currencyData = saleTerm.currency;
    }
    const salePrice = saleTerm && Number(saleTerm.expectedPrice) > 0 ? Number(saleTerm.expectedPrice) : 0;
    const price = leaseTerm && leaseTerm.expectedPrice > 0 ? leaseTerm.expectedPrice : salePrice;
    return (
      <>
        <View style={styles.container}>
          <View style={styles.gallery}>
            {assetDetails?.attachments.length <= 0 && (
              <ImagePlaceholder height="100%" containerStyle={styles.placeholder} />
            )}
            {!isMobile && assetDetails?.attachments.length > 0 && (
              <GalleryView attachments={assetDetails?.attachments ?? []} />
            )}
            {isMobile && <AssetDetailsImageCarousel data={assetDetails.attachments} />}
          </View>
          <View style={styles.cardDetails}>
            <ShieldGroup propertyType={propertyType} isInfoRequired />

            <PropertyAddressCountry
              isIcon
              primaryAddress={projectName}
              countryFlag={flag}
              subAddress={address ?? `${unitNumber} ${blockNumber}`}
              containerStyle={styles.addressStyle}
              primaryAddressTextStyles={{ size: 'regular' }}
            />
            <PricePerUnit
              price={price}
              currency={currencyData}
              unit={asset_transaction_type === 0 ? 'mo' : ''}
              textStyle={styles.pricing}
              textSizeType="large"
            />
            <PropertyAmenities
              data={amenitiesData}
              direction="row"
              containerStyle={styles.amenitiesContainer}
              contentContainerStyle={styles.amenities}
            />
            <Divider />
            <View style={styles.timelineContainer}>{this.renderPropertyTimelines(propertyTimelineData)}</View>
            <Divider />
            <View style={styles.avatar}>
              <Avatar fullName={fullName} imageSize={50} image={profilePicture} designation={t('property:Owner')} />
            </View>
            <Divider />
            <View style={styles.footer}>
              <View style={(isMobile || isTablet || isIpadPro) && styles.enquireContainer}>
                <Button type="primary" containerStyle={styles.enquire} disabled>
                  <Icon name={icons.envelope} size={24} color={theme.colors.primaryColor} />
                  <Typography size="small" variant="text" fontWeight="semiBold" style={styles.textStyleEnquire}>
                    {t('propertySearch:enquire')}
                  </Typography>
                </Button>
              </View>
              <View style={(isMobile || isTablet || isIpadPro) && styles.scheduleContainer}>
                <Button type="primary" containerStyle={[styles.enquire, styles.schedule]} disabled>
                  <Icon name={icons.timer} size={22} color={theme.colors.white} />
                  <Typography size="small" variant="text" fontWeight="semiBold" style={styles.textStyleSchedule}>
                    {t('propertySearch:scheduleVisit')}
                  </Typography>
                </Button>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.dividerContainer}>
          <TabSections assetDetails={assetDetails} propertyTermId={propertyTermId} />
        </View>
      </>
    );
  };

  private renderPropertyTimelines = (data: { label: string; value: string }[]): React.ReactElement => {
    const { isMobile, isTablet } = this.props;
    const styles = propertyDetailStyle(isMobile, isTablet);

    return (
      <>
        {data.map((item: { label: string; value: string }, index: number) => {
          return (
            <View key={index} style={styles.utilityItem}>
              <Label type="large" textType="regular" style={styles.utilityItemText}>
                {item.label}
              </Label>
              <Label type="large" textType="semiBold" style={styles.utilityItemSubText}>
                {item.value}
              </Label>
            </View>
          );
        })}
      </>
    );
  };
}
const propertyCardDetails = withMediaQuery<Props>(PropertyCardDetails);

const mapStateToProps = (state: IState): IStateProps => {
  return {
    filters: SearchSelector.getFilters(state),
  };
};

export default connect(mapStateToProps)(withTranslation()(propertyCardDetails));

interface IPropertyDetailStyles {
  parentContainer: ViewStyle;
  dividerContainer: ViewStyle;
  container: ViewStyle;
  gallery: ViewStyle;
  cardDetails: ViewStyle;
  addressStyle: ViewStyle;
  pricing: ViewStyle;
  amenitiesContainer: ViewStyle;
  amenities: ViewStyle;
  timelineContainer: ViewStyle;
  utilityItem: ViewStyle;
  avatar: ViewStyle;
  footer: ViewStyle;
  enquire: ViewStyle;
  schedule: ViewStyle;
  textStyleEnquire: ViewStyle;
  textStyleSchedule: ViewStyle;
  utilityItemText: ViewStyle;
  utilityItemSubText: ViewStyle;
  placeholder: ViewStyle;
  scheduleContainer: ViewStyle;
  enquireContainer: ViewStyle;
}
const propertyDetailStyle = (
  isMobile?: boolean,
  isTablet?: boolean,
  isIpadPro?: boolean
): StyleSheet.NamedStyles<IPropertyDetailStyles> =>
  StyleSheet.create<IPropertyDetailStyles>({
    parentContainer: {
      flex: 1,
    },
    dividerContainer: {
      marginTop: 24,
      height: 'auto',
    },
    container: {
      backgroundColor: theme.colors.white,
      height: !isMobile ? 482 : 'fit-content',
      flexDirection: isMobile ? 'column' : 'row',
    },
    gallery: {
      margin: isMobile ? 12 : 20,
      width: !isMobile ? (isTablet ? '47%' : '55%') : '',
      height: isMobile ? 244 : '',
    },
    cardDetails: {
      marginVertical: !isMobile ? 20 : '',
      marginEnd: isMobile ? 12 : 20,
      marginStart: isMobile ? 12 : '',
      width: !isMobile ? (isTablet ? '45%' : '40%') : '',
    },
    addressStyle: {
      width: '100%',
    },
    pricing: {
      marginTop: 20,
    },
    amenitiesContainer: {
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
      marginVertical: 14,
    },
    amenities: {
      marginEnd: 16,
    },
    timelineContainer: {
      paddingVertical: 16,
      flexDirection: 'row',
    },
    utilityItem: {
      marginEnd: '35%',
    },
    avatar: {
      marginVertical: 16,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 20,
      width: '100%',
    },
    enquire: {
      height: 44,
      width: !isMobile ? (isTablet || isIpadPro ? '100%' : 216) : '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.darkTint10,
      flexDirection: 'row',
    },
    enquireContainer: {
      width: '38%',
    },
    scheduleContainer: {
      width: '60%',
      left: 'auto',
    },
    schedule: {
      width: !isMobile ? (isTablet || isIpadPro ? '100%' : 216) : '100%',
      backgroundColor: theme.colors.darkTint10,
    },

    textStyleEnquire: {
      color: theme.colors.primaryColor,
      marginStart: '5%',
    },
    textStyleSchedule: {
      color: theme.colors.white,
      marginStart: '5%',
    },

    utilityItemText: {
      color: theme.colors.darkTint4,
    },
    utilityItemSubText: {
      color: theme.colors.darkTint2,
    },
    placeholder: {
      backgroundColor: theme.colors.darkTint9,
      height: !isMobile ? 442 : '100%',
    },
  });
