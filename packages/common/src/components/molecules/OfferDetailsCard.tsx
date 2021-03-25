import React from 'react';
import { View, FlatList, StyleSheet, ImageStyle, ViewStyle, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { RNCheckbox } from '@homzhub/common/src/components/atoms/Checkbox';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { Asset } from '@homzhub/common/src/domain/models/Asset';

interface IFormattedDetails {
  type: string;
  value: string | number | null;
}

interface IDetailsProps {
  onClickCheckBox: () => void;
  checkBox: boolean;
  asset: Asset;
  isRentFlow: boolean;
}

interface IProps {
  onClickCheckBox: () => void;
  checkBox: boolean;
}

const OfferDetails = (props: IDetailsProps): React.ReactElement => {
  const { asset, onClickCheckBox, checkBox, isRentFlow } = props;
  const { t } = useTranslation();
  const styles = getStyles();

  const formatDetails = (assetDetails: Asset): IFormattedDetails[] => {
    const {
      leaseTerm,
      saleTerm,
      country: { currencies },
    } = assetDetails;
    const { currencySymbol } = currencies[0];
    if (isRentFlow && leaseTerm) {
      const {
        expectedPrice,
        securityDeposit,
        minimumLeasePeriod,
        maximumLeasePeriod,
        annualRentIncrementPercentage,
        maintenancePaidBy,
        utilityPaidBy,
      } = leaseTerm;
      const formattedRent = [
        {
          type: t('property:rent'),
          value: `${currencySymbol} ${expectedPrice}`,
        },
        {
          type: t('property:securityDeposit'),
          value: `${currencySymbol} ${securityDeposit}`,
        },
        {
          type: t('offers:lockInPeriod'),
          value: `${minimumLeasePeriod} ${t('common:months')}`,
        },
        {
          type: t('offers:maxLeasePeriod'),
          value: `${maximumLeasePeriod} ${t('common:months')}`,
        },
        {
          type: t('property:maintenanceBy'),
          value: `${StringUtils.toTitleCase(maintenancePaidBy)}`,
        },
        {
          type: t('property:utilityBy'),
          value: `${StringUtils.toTitleCase(utilityPaidBy)}`,
        },
      ];
      if (annualRentIncrementPercentage) {
        formattedRent.splice(4, 0, {
          type: t('property:annualIncrementSuffix'),
          value: `${annualRentIncrementPercentage}%`,
        });
      }
      return formattedRent;
    }
    if (!isRentFlow && saleTerm) {
      const { expectedBookingAmount, expectedPrice } = saleTerm;
      const formattedSale = [
        {
          type: t('offers:sellPrice'),
          value: `${currencySymbol} ${expectedPrice}`,
        },
        {
          type: t('property:bookingAmount'),
          value: `${currencySymbol} ${expectedBookingAmount}`,
        },
      ];
      return formattedSale;
    }
    return [];
  };

  const formattedDetails = formatDetails(asset);
  const onToggleCheckBox = (): void => onClickCheckBox();

  const renderItem = ({ item, index }: { item: IFormattedDetails; index: number }): React.ReactElement => {
    const style = getStyles(index);
    return (
      <View style={style.detailItem}>
        <Label textType="light" type="large">
          {item.type}
        </Label>
        <Label textType="semiBold" type="large">
          {item.value}
        </Label>
      </View>
    );
  };

  const keyExtractor = (item: IFormattedDetails, index: number): string => `${item} [${index}]`;
  return (
    <>
      <FlatList
        data={formattedDetails}
        renderItem={renderItem}
        numColumns={3}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.flatList}
      />
      <RNCheckbox selected={checkBox} label={t('offers:agreeToOwnerOffers')} onToggle={onToggleCheckBox} />
    </>
  );
};

const OfferDetailsCard = (props: IProps): React.ReactElement | null => {
  const { onClickCheckBox, checkBox } = props;
  const isRentFlow = !useSelector(AssetSelectors.getAssetListingType);
  const asset = useSelector(AssetSelectors.getAsset);
  if (asset) {
    const {
      id,
      projectName,
      unitNumber,
      blockNumber,
      city,
      countryIsoCode,
      attachments,
      state,
      country: { flag },
    } = asset;
    const detailedAddress = `${unitNumber} ${blockNumber}, ${city}, ${state}, ${countryIsoCode}`;
    const styles = getStyles();
    const image = (): React.ReactElement => {
      if (attachments.length)
        return (
          <Image
            source={{ uri: attachments[0].link }}
            width={60}
            height={60}
            style={styles.assetImage}
            borderRadius={4}
          />
        );
      return <ImagePlaceholder width={60} height={60} containerStyle={styles.placeholder} />;
    };
    return (
      <>
        <View key={id} style={styles.OfferDetailsCard}>
          <View style={styles.ownerOfferHeader}>
            <View style={styles.flexOne}>{image()}</View>
            <View style={styles.assetAddress}>
              <PropertyAddressCountry
                primaryAddress={projectName}
                countryFlag={flag}
                subAddress={detailedAddress}
                isIcon
                primaryAddressTextStyles={{
                  size: 'small',
                }}
                subAddressTextStyles={{
                  variant: 'label',
                  size: 'large',
                }}
              />
            </View>
          </View>
          <OfferDetails asset={asset} isRentFlow={isRentFlow} checkBox={checkBox} onClickCheckBox={onClickCheckBox} />
        </View>
      </>
    );
  }
  return null;
};

export default React.memo(OfferDetailsCard);

interface IStyles {
  OfferDetailsCard: ViewStyle;
  ownerOfferHeader: ViewStyle;
  assetImage: ImageStyle;
  assetAddress: ViewStyle;
  detailItem: ViewStyle;
  flatList: ViewStyle;
  placeholder: ViewStyle;
  flexOne: ViewStyle;
}

const getStyles = (index = 0): IStyles =>
  StyleSheet.create({
    flexOne: {
      flex: 1,
    },
    OfferDetailsCard: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    ownerOfferHeader: {
      flex: 1,
      flexDirection: 'row',
    },
    assetImage: {
      flex: 1,
      marginEnd: 12,
    },
    placeholder: {
      flex: 4,
      paddingRight: 3,
      alignSelf: 'center',
      backgroundColor: theme.colors.white,
      marginRight: 5,
    },
    assetAddress: {
      flex: 4,
      paddingRight: 3,
    },
    detailItem: {
      flex: 1,
      marginVertical: 10,
      marginLeft: (index + 1) % 3 ? 0 : 24,
    },
    flatList: {
      marginVertical: 10,
    },
  });
