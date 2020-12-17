import React, { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { LeadRepository } from '@homzhub/common/src/domain/repositories/LeadRepository';
import { ILeadPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { AnimatedProfileHeader, AssetDetailsImageCarousel, ShieldGroup } from '@homzhub/mobile/src/components';
import { PropertyAddress } from '@homzhub/common/src/components/molecules/PropertyAddress';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

type NavigationProps = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.SavedPropertiesScreen>;

export const SavedProperties = (props: NavigationProps): React.ReactNode => {
  const { navigation } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetMore);

  // Redux
  const filters = useSelector(SearchSelector.getFilters);
  const wishListedAssets: Asset[] = useSelector(UserSelector.getFavouriteProperties);
  const dispatch = useDispatch();

  // Local States
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Local Const
  const transactionType = filters.asset_transaction_type || 0;

  useEffect(() => {
    dispatch(UserActions.getFavouriteProperties());
    setLoading(false);
  }, []);

  const updateSlide = (currentSlideNumber: number): void => {
    setActiveSlide(currentSlideNumber);
  };

  const onFullScreenToggle = (): void => {
    setIsFullScreen(!isFullScreen);
  };

  const navigateToOffer = (): void => {
    navigation.navigate(ScreensKeys.ComingSoonScreen, {
      // @ts-ignore
      title: t('makeAnOfferText'),
      tabHeader: t('assetMore:more'),
    });
  };

  const navigateToPropertyVisit = (leaseTermId?: number, saleTermId?: number): void => {
    navigation.dispatch(
      CommonActions.navigate({
        name: ScreensKeys.BookVisit,
        params: {
          ...(leaseTermId && { lease_listing_id: leaseTermId }),
          ...(saleTermId && { sale_listing_id: saleTermId }),
        },
      })
    );
  };

  const getPrice = (asset: Asset): number => {
    const { leaseTerm, saleTerm } = asset;

    if (leaseTerm) {
      return Number(leaseTerm.expectedPrice);
    }
    if (saleTerm) {
      return Number(saleTerm.expectedPrice);
    }
    return 0;
  };

  const removeFromWishList = async (propertyTermId: number | undefined): Promise<void> => {
    const { asset_transaction_type } = filters;
    const payload: ILeadPayload = {
      // @ts-ignore
      propertyTermId,
      data: {
        lead_type: 'WISHLIST',
        is_wishlisted: false,
        user_search: null,
      },
    };

    try {
      if (asset_transaction_type === 0) {
        // RENT FLOW
        await LeadRepository.postLeaseLeadDetail(payload);
      } else {
        // SALE FLOW
        await LeadRepository.postSaleLeadDetail(payload);
      }

      dispatch(UserActions.getFavouriteProperties());
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  const renderButtonGroup = (asset: Asset): ReactElement => {
    const { nextVisit, leaseTerm, saleTerm } = asset;
    const onScheduleVisitPress = (): void => {
      navigateToPropertyVisit(leaseTerm?.id, saleTerm?.id);
    };

    return (
      <View style={[nextVisit ? styles.nextVisitContainer : styles.buttonGroup, styles.screenPadding]}>
        <Button
          textType="label"
          textSize="large"
          fontType="semiBold"
          titleStyle={styles.buttonTextStyle}
          containerStyle={styles.commonButtonStyle}
          title={t('makeAnOfferText')}
          type="secondary"
          onPress={navigateToOffer}
        />
        {!nextVisit ? (
          <Button
            textType="label"
            textSize="large"
            fontType="semiBold"
            titleStyle={styles.buttonTextStyle}
            containerStyle={styles.commonButtonStyle}
            title={t('scheduleVisit')}
            type="primary"
            onPress={onScheduleVisitPress}
          />
        ) : (
          <View style={styles.nextVisitText}>
            <Label type="small">Site Visit On</Label>
            <Label type="large" textType="semiBold">
              {DateUtils.getDateFromISO(nextVisit.visitDate, DateFormats.DDMMMYYYY_H)}
            </Label>
          </View>
        )}
      </View>
    );
  };

  const renderImages = (
    attachments: Attachment[] = [],
    leaseTermId?: number,
    saleTermId?: number
  ): React.ReactElement => {
    const onCrossPress = (): void => {
      removeFromWishList(leaseTermId ?? saleTermId).then();
    };

    return (
      <View style={styles.imageContainer}>
        {attachments && attachments.length > 0 ? (
          <AssetDetailsImageCarousel
            enterFullScreen={onFullScreenToggle}
            data={attachments}
            activeSlide={activeSlide}
            updateSlide={updateSlide}
          />
        ) : (
          <EmptyState title={t('noImagesText')} icon={icons.home} containerStyle={styles.emptyContainer} />
        )}
        <Icon
          onPress={onCrossPress}
          style={styles.crossStyle}
          name={icons.circularCrossFilled}
          size={20}
          color={theme.colors.white}
        />
      </View>
    );
  };

  return (
    <AnimatedProfileHeader
      title={t('more')}
      sectionHeader={t('refer')}
      onBackPress={navigation.goBack}
      sectionTitleType="semiBold"
      loading={loading}
      detachedHeaderMode
    >
      <>
        {wishListedAssets && wishListedAssets.length > 0 ? (
          wishListedAssets.map((asset, index) => {
            const {
              assetType: { name },
              projectName,
              address,
              blockNumber,
              unitNumber,
              country: { currencies },
              spaces,
              furnishing,
              carpetArea,
              carpetAreaUnit,
              assetGroup: { code },
            } = asset;
            const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
              spaces,
              furnishing,
              code,
              carpetArea,
              carpetAreaUnit?.title ?? ''
            );

            return (
              <View style={styles.cardView} key={index}>
                {renderImages(asset.attachments, asset.leaseTerm?.id, asset.saleTerm?.id)}
                <View style={styles.screenPadding}>
                  <ShieldGroup propertyType={name} />
                  <PropertyAddress
                    isIcon
                    primaryAddress={projectName}
                    subAddress={address || `${blockNumber ?? ''} ${unitNumber ?? ''}`}
                  />
                  <View style={styles.amenities}>
                    <PricePerUnit
                      price={getPrice(asset)}
                      currency={currencies[0]}
                      unit={transactionType === 0 ? t('common:abbreviatedMonthText') : ''}
                    />
                    <PropertyAmenities data={amenitiesData} direction="row" />
                  </View>
                </View>
                <Divider containerStyles={styles.dividerStyle} />
                {renderButtonGroup(asset)}
              </View>
            );
          })
        ) : (
          <EmptyState title={t('savedPropertiesEmptyText')} icon={icons.filledHeart} />
        )}
      </>
    </AnimatedProfileHeader>
  );
};

const styles = StyleSheet.create({
  cardView: {
    marginBottom: 12,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
  },
  emptyContainer: {
    minHeight: 200,
    backgroundColor: theme.colors.disabled,
  },
  crossStyle: {
    position: 'absolute',
    top: 13,
    right: 22,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nextVisitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextVisitText: {
    marginLeft: 30,
  },
  commonButtonStyle: {
    flex: 0,
  },
  buttonTextStyle: {
    marginHorizontal: 20,
  },
  dividerStyle: {
    marginVertical: 16,
  },
  screenPadding: {
    paddingHorizontal: theme.layout.screenPadding,
  },
});