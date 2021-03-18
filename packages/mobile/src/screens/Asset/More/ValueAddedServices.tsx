import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { IBadgeInfo, NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { AssetDetailsImageCarousel } from '@homzhub/mobile/src/components';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { IGetServicesByIds } from '@homzhub/common/src/domain/models/ValueAddedService';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

type IProps = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.ValueAddedServices>;

export const ValueAddedServices = (props: IProps): ReactElement => {
  const { navigation } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetMore);

  // Local States
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    try {
      AssetRepository.getValueServicesAssetList().then((data: Asset[]) => {
        setAssets(data);
        setLoading(false);
      });
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e);
      AlertHelper.error({ message: error });
      setLoading(false);
    }
  }, []);

  const navigateToAddPropertyScreen = (): void => {
    // @ts-ignore
    navigation.navigate(ScreensKeys.PropertyPostStack, {
      screen: ScreensKeys.AssetLocationSearch,
    });
  };

  const render = (): ReactElement => {
    return (
      <UserScreen
        title={t('more')}
        pageTitle={t('valueAddedServices')}
        onBackPress={navigation.goBack}
        loading={loading}
      >
        <>
          {assets && assets.length > 0 ? (
            <>
              <Text style={styles.textStyle} type="small" textType="semiBold">
                {t('chooseAPropertyText')}
              </Text>
              {assets.map((asset: Asset) => {
                const {
                  id,
                  attachments,
                  assetStatusInfo,
                  projectName,
                  address,
                  unitNumber,
                  blockNumber,
                  spaces,
                  furnishing,
                  carpetArea,
                  carpetAreaUnit,
                  assetGroupId,
                  city,
                  assetGroup: { code },
                  assetType: { name: propertyType },
                  country: { flag, id: countryId },
                } = asset;
                const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
                  spaces,
                  furnishing,
                  code,
                  carpetArea,
                  carpetAreaUnit?.title ?? ''
                );
                const badgeTitle = assetStatusInfo?.tag.label ?? '';
                const badgeColor = assetStatusInfo?.tag.color ?? '';
                const navigate = (): void => {
                  navigateToService(
                    id,
                    propertyType,
                    projectName,
                    address,
                    flag,
                    { assetGroupId, countryId, city },
                    { title: badgeTitle, color: badgeColor },
                    amenitiesData
                  );
                };

                return (
                  <View key={id} style={styles.cardView}>
                    <TouchableOpacity onPress={navigate} style={styles.cardContent}>
                      <Badge badgeStyle={styles.badgeStyle} title={badgeTitle} badgeColor={badgeColor} />
                      {renderImages(attachments)}
                      <View style={styles.cardDescription}>
                        <Text type="small" textType="regular" style={styles.propertyTypeText}>
                          {propertyType}
                        </Text>
                        <PropertyAddressCountry
                          primaryAddress={projectName}
                          countryFlag={flag}
                          subAddress={address ?? `${unitNumber} ${blockNumber}`}
                        />
                        <PropertyAmenities
                          containerStyle={styles.amenities}
                          contentContainerStyle={styles.amenitiesContentStyle}
                          data={amenitiesData}
                          direction="row"
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </>
          ) : (
            <EmptyState
              title={t('valueServicesEmptyText')}
              buttonProps={{
                type: 'secondary',
                title: t('property:addProperty'),
                onPress: navigateToAddPropertyScreen,
              }}
              containerStyle={styles.emptyContainer}
            />
          )}
        </>
      </UserScreen>
    );
  };

  const renderImages = useCallback(
    (attachments: Attachment[]): React.ReactElement => {
      return (
        <>
          {attachments && attachments.length > 0 ? (
            <AssetDetailsImageCarousel
              enterFullScreen={onFullScreenToggle}
              data={attachments}
              activeSlide={activeSlide}
              updateSlide={updateSlide}
              containerStyles={styles.carouselStyle}
            />
          ) : (
            <ImagePlaceholder containerStyle={styles.imagePlaceHolder} />
          )}
        </>
      );
    },
    [assets]
  );

  const updateSlide = (currentSlideNumber: number): void => {
    setActiveSlide(currentSlideNumber);
  };

  const onFullScreenToggle = (): void => {
    setIsFullScreen(!isFullScreen);
  };

  const navigateToService = (
    propertyId: number,
    assetType: string,
    projectName: string,
    address: string,
    flag: React.ReactElement,
    serviceByIds: IGetServicesByIds,
    badgeInfo: IBadgeInfo,
    amenities: IAmenitiesIcons[]
  ): void => {
    navigation.navigate(ScreensKeys.ServicesForSelectedAsset, {
      propertyId,
      assetType,
      projectName,
      address,
      flag,
      serviceByIds,
      badgeInfo,
      amenities,
    });
  };

  return render();
};

const styles = StyleSheet.create({
  cardView: {
    backgroundColor: theme.colors.white,
    paddingBottom: 12,
    paddingHorizontal: 10,
  },
  cardContent: {
    borderWidth: 1,
    borderColor: theme.colors.background,
    paddingHorizontal: 10,
    paddingBottom: 16,
    paddingTop: 10,
  },
  cardDescription: {
    paddingHorizontal: 6,
  },
  propertyTypeText: {
    color: theme.colors.primaryColor,
    marginTop: 12,
    marginBottom: 4,
  },
  textStyle: {
    backgroundColor: theme.colors.white,
    padding: 16,
    paddingTop: 8,
  },
  carouselStyle: {
    height: 200,
  },
  imagePlaceHolder: {
    minHeight: 200,
    backgroundColor: theme.colors.disabled,
    paddingHorizontal: 10,
  },
  badgeStyle: {
    minWidth: 75,
    paddingHorizontal: 10,
    paddingVertical: 1,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  amenities: {
    marginTop: 16,
    justifyContent: 'flex-start',
  },
  amenitiesContentStyle: {
    marginRight: 16,
  },
  emptyContainer: {
    paddingVertical: '50%',
  },
});
