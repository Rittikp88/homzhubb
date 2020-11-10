import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import {
  AmenitiesShieldIconGroup,
  Button,
  PropertyAddressCountry,
  PropertyAmenities,
  Typography,
} from '@homzhub/common/src/components';
import { NextPrevBtn, ProgressBar } from '@homzhub/web/src/components';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { ITypographyProps } from '@homzhub/common/src/components/atoms/Typography';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';

interface IProps {
  data: Asset[];
}

export const PendingPropertiesCard: FC<IProps> = ({ data }: IProps) => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetDashboard);
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const {
    address,
    assetType,
    furnishing,
    spaces,
    projectName,
    carpetArea,
    carpetAreaUnit,
    country,
    unitNumber,
    blockNumber,
    lastVisitedStep,
  } = data[currentAssetIndex];
  const primaryAddress = projectName;
  const subAddress = address ?? `${unitNumber ?? ''} ${blockNumber ?? ''}`;
  const total = data?.length ?? 0;
  const detailsCompletionPercentage = lastVisitedStep?.assetCreation?.percentage ?? 0;
  const countryIconUrl = country?.flag;
  const propertyType = assetType?.name ?? '-';
  const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
    spaces,
    furnishing,
    AssetGroupTypes.RES,
    carpetArea,
    carpetAreaUnit?.title ?? '',
    true
  );
  const addressTextStyle: ITypographyProps = {
    size: 'small',
    fontWeight: 'semiBold',
    variant: 'text',
  };
  const subAddressTextStyle: ITypographyProps = {
    size: 'regular',
    fontWeight: 'regular',
    variant: 'label',
  };
  const updateCurrentAssetIndex = (updateIndexBy: number): void => {
    const nextIndex = currentAssetIndex + updateIndexBy;
    if (nextIndex > data.length - 1 || nextIndex < 0) {
      setCurrentAssetIndex(0);
    } else {
      setCurrentAssetIndex(nextIndex);
    }
  };
  const handleInfo = (): void => {
    // empty
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerInfo}>
        <Icon name={icons.warning} color={theme.colors.darkTint3} size={16} style={styles.cardIcon} />
        <Typography variant="text" size="small" fontWeight="semiBold" style={[styles.title, styles.textColor1]}>
          {t('pendingProperties', { total })}
        </Typography>
        <NextPrevBtn onBtnClick={updateCurrentAssetIndex} />
      </View>
      <View style={styles.mainBody}>
        <View style={styles.propertyDetails}>
          <Typography variant="label" size="regular" fontWeight="regular" style={styles.propertyType}>
            {propertyType}
          </Typography>
          <PropertyAddressCountry
            primaryAddress={primaryAddress}
            countryFlag={countryIconUrl}
            primaryAddressTextStyles={addressTextStyle}
            subAddressTextStyles={subAddressTextStyle}
            subAddress={subAddress}
            containerStyle={styles.addressCountry}
          />
          {amenitiesData.length > 0 && (
            <PropertyAmenities
              data={amenitiesData}
              direction="row"
              containerStyle={styles.propertyInfoBox}
              contentContainerStyle={styles.cardIcon}
            />
          )}
        </View>
        <View style={styles.propertyRating}>
          <AmenitiesShieldIconGroup onBadgePress={handleInfo} iconSize={21} />
        </View>
      </View>
      <View style={styles.actionBox}>
        {getPropertyProgressStatus(detailsCompletionPercentage)}
        <Typography variant="label" size="regular" fontWeight="regular" style={styles.actionMsg}>
          {t('completeProperty')}
        </Typography>
        <Button type="primary" title={t('completeDetails')} containerStyle={styles.actionBtn} />
      </View>
    </View>
  );
};

const getPropertyProgressStatus = (progress: number): React.ReactNode => {
  return <ProgressBar progress={progress} width={10} containerStyles={styles.progressBar} />;
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 496,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    marginTop: 24,
  },
  headerInfo: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'baseline',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  addressCountry: {
    marginTop: 8,
    marginBottom: 16,
  },
  mainBody: {
    flexDirection: 'row',
    marginTop: 16,
    marginHorizontal: 20,
    marginBottom: 0,
  },
  propertyDetails: {
    flex: 1,
    width: '100%',
  },
  propertyType: {
    color: theme.colors.primaryColor,
  },
  propertyRating: {
    flexDirection: 'row',
  },
  propertyNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyInfo: {
    marginRight: 16,
    color: theme.colors.darkTint3,
  },
  propertyInfoBox: {
    justifyContent: undefined,
    marginRight: 16,
  },
  progressBar: {
    marginBottom: 20,
  },
  actionBox: {
    marginHorizontal: 20,
    marginVertical: 24,
  },
  actionMsg: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  actionBtn: {
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 8,
  },
  title: {
    flex: 1,
  },
  textColor1: {
    color: theme.colors.dark,
  },
  textColor2: {
    color: theme.colors.darkTint2,
  },
  textColor3: {
    color: theme.colors.darkTint3,
  },
});
