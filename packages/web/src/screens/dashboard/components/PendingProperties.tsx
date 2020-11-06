import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, ImageSquare, Label, Text } from '@homzhub/common/src/components';
import { ProgressBar } from '@homzhub/web/src/components/atoms/ProgressBar';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  data: Asset[];
}

const PendingProperties: FC<IProps> = ({ data }: IProps) => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetDashboard);
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const { amenityGroup, address, assetType, spaces, carpetArea, country, lastVisitedStep } = data[currentAssetIndex];
  const bedCount = spaces.filter((space) => space.name === 'Bedroom')[0]?.count ?? 0;
  const bathCount = spaces.filter((space) => space.name === 'Bedroom')[0]?.count ?? 0;
  const assetCarpetArea = Math.round(carpetArea || 0);
  const detailsCompletionPercentage = lastVisitedStep.assetCreation.percentage || 0;
  const total = data?.length ?? 0;
  const updateCurrentAssetIndex = (updateIndexBy: number): void => {
    const nextIndex = currentAssetIndex + updateIndexBy;
    if (nextIndex > data.length - 1 || nextIndex < 0) {
      setCurrentAssetIndex(0);
    } else {
      setCurrentAssetIndex(nextIndex);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerInfo}>
        <Icon name={icons.warning} color={theme.colors.darkTint3} size={16} style={styles.cardIcon} />
        <Text type="small" textType="semiBold" style={[styles.title, styles.textColor1]}>
          {t('pendingProperties', { total })}
        </Text>
        {getNextPrevBtnLayout(updateCurrentAssetIndex)}
      </View>
      <View style={styles.mainBody}>
        <View style={styles.propertyDetails}>
          <Label type="regular" textType="regular" style={styles.propertyType}>
            {assetType.name || 'unknown'}
          </Label>
          <View style={{ marginVertical: 21 }}>
            <View style={styles.propertyNameContainer}>
              <ImageSquare
                style={styles.cardIcon}
                size={18}
                source={{
                  uri: country.flag,
                }}
              />
              <Text type="small" textType="semiBold" style={styles.textColor2}>
                {amenityGroup?.name ?? 'unknown'}
              </Text>
            </View>
            <Label type="regular" textType="regular" style={styles.textColor3}>
              {address}
            </Label>
          </View>
          {getPropertyInfo(bedCount, bathCount, assetCarpetArea)}
        </View>
        <View style={styles.propertyRating}>{getAssetBadges()}</View>
      </View>
      <View style={styles.actionBox}>
        {getPropertyProgressStatus(detailsCompletionPercentage)}
        <Label type="regular" textType="regular" style={styles.actionMsg}>
          {t('completeProperty')}
        </Label>
        <Button type="primary" title={t('completeDetails')} containerStyle={styles.actionBtn} />
      </View>
    </View>
  );
};

const getAssetBadges = (): React.ReactNode => {
  return (
    <>
      <Icon name={icons.badge} size={21} style={styles.badge} color={theme.colors.warning} />
      <Icon name={icons.badge} size={21} style={styles.badge} color={theme.colors.warning} />
      <Icon name={icons.badge} size={21} style={styles.badge} color={theme.colors.darkTint8} />
    </>
  );
};

const getPropertyInfo = (noOfBeds: number, noOfBath: number, totalArea: number): React.ReactNode => {
  return (
    <View style={styles.propertyInfoBox}>
      <Icon name={icons.bed} size={18} color={theme.colors.darkTint3} style={styles.cardIcon} />
      <Label type="regular" textType="regular" style={styles.propertyInfo}>
        {noOfBeds} Beds
      </Label>
      <Icon name={icons.bathTub} size={18} color={theme.colors.darkTint3} style={styles.cardIcon} />
      <Label type="regular" textType="regular" style={styles.propertyInfo}>
        {noOfBath} Baths
      </Label>
      <Icon name={icons.area} size={18} color={theme.colors.darkTint3} style={styles.cardIcon} />
      <Label type="regular" textType="regular" style={styles.propertyInfo}>
        {totalArea} Sqft
      </Label>
    </View>
  );
};

const getNextPrevBtnLayout = (callback: (updateIndexBy: number) => void): React.ReactNode => {
  const onPrevBtnClick = (): void => {
    callback(-1);
  };
  const onNextBtnClick = (): void => {
    callback(1);
  };
  return (
    <>
      <Button
        type="secondary"
        icon={icons.leftArrow}
        iconSize={18}
        iconColor={theme.colors.primaryColor}
        containerStyle={styles.nextBtn}
        onPress={onPrevBtnClick}
      />
      <Button
        type="secondary"
        icon={icons.rightArrow}
        iconSize={18}
        iconColor={theme.colors.primaryColor}
        containerStyle={styles.nextBtn}
        onPress={onNextBtnClick}
      />
    </>
  );
};

const getPropertyProgressStatus = (progress: number): React.ReactNode => {
  return <ProgressBar progress={progress} width={10} containerStyles={{ marginBottom: 20 }} />;
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
  nextBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 24,
    border: 'none',
    marginLeft: 8,
    backgroundColor: theme.colors.lightGrayishBlue,
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
  badge: {
    marginLeft: 8,
  },
  propertyNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyInfoBox: {
    flexDirection: 'row',
  },
  propertyInfo: {
    marginRight: 16,
    color: theme.colors.darkTint3,
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

export default PendingProperties;
