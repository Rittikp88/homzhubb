import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import ComingSoon from '@homzhub/web/src/screens/comingSoon';
import OffersOverview from '@homzhub/web/src/screens/offers/components/OffersOverview';
import PropertyDataCard from '@homzhub/web/src/screens/offers/components/PropertyDataCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { OfferManagement } from '@homzhub/common/src/domain/models/OfferManagement';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { NegotiationOfferType } from '@homzhub/common/src/domain/repositories/interfaces';
// TODO -- saved property metrics integration :Shagun
export enum OfferType {
  OFFER_RECEIVED = 'Offer Received',
  OFFER_MADE = 'Offer Made',
}

const Offers: FC = () => {
  const [offerReceivedInfoRead, setOfferRecievedInfoRead] = useState(false);
  const [offerMadeInfoRead, setOfferMadeInfoRead] = useState(false);
  const [offerType, setOfferType] = useState(OfferType.OFFER_RECEIVED);
  const [offerCountData, setOfferCountData] = useState<OfferManagement>();
  const [propertyListingData, setPropertyListingData] = useState<Asset[]>([]);
  const isTablet = useDown(deviceBreakpoint.LAPTOP);
  const { t } = useTranslation();

  const title = offerType === 'Offer Received' ? t('offers:noOfferReceived') : t('offers:noOfferMade');

  const filters = {}; // maintain state :Shagun
  useEffect(() => {
    getOfferDetails();
  }, []);

  const getOfferDetails = async (): Promise<void> => {
    try {
      const offerCount = await OffersRepository.getOfferData();
      setOfferCountData(offerCount);
      const isOfferReceivedInfoRead: boolean =
        (await StorageService.get(StorageKeys.IS_OFFER_RECEIVED_INFO_READ)) || false;
      const isOfferMadeInfoRead: boolean = (await StorageService.get(StorageKeys.IS_OFFER_MADE_INFO_READ)) || false;
      setOfferRecievedInfoRead(isOfferReceivedInfoRead);
      setOfferMadeInfoRead(isOfferMadeInfoRead);
      getPropertyListData();
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details)
      AlertHelper.error({ message:error, statusCode: e.details.statusCode });
    }
  };

  const getPropertyListData = async (): Promise<void> => {
    let propertyListingDatas: Asset[] = [];
    let currencies: string[] = [];
    const payload = {
      type: offerType === OfferType.OFFER_RECEIVED ? NegotiationOfferType.RECEIVED : NegotiationOfferType.CREATED,
      ...(offerType === OfferType.OFFER_RECEIVED && { params: filters }),
      // ...(offerType === OfferType.OFFER_MADE && { //TODO: for offers made :Shagun
      //   params: {
      //     filter_by: filters.filter_by,
      //   },
      // }),
    };
    try {
      propertyListingDatas = await OffersRepository.getOffers(payload);
      // For hiding sorting during multiple currencies
      propertyListingDatas.forEach((item) => {
        item.country.currencies.forEach((currency) => {
          if (!currencies.includes(currency.currencyCode)) {
            currencies = [...currencies, currency.currencyCode];
          }
        });
      });

      if (offerType === OfferType.OFFER_MADE) {
        // TODO: handle offer made :Shagun
      } else {
        setPropertyListingData(propertyListingDatas);
      }
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details)
      AlertHelper.error({ message:error, statusCode: e.details.statusCode });
    }
  };

  const onMetricsClicked = (name: string): void => {
    setOfferType(name as OfferType);
  };

  const onCloseOfferInfo = (): void => {
    if (offerType === OfferType.OFFER_RECEIVED) {
      setOfferRecievedInfoRead(true);
      StorageService.set(StorageKeys.IS_OFFER_RECEIVED_INFO_READ, true);
    }

    if (offerType === OfferType.OFFER_MADE) {
      setOfferMadeInfoRead(true);
      StorageService.set(StorageKeys.IS_OFFER_MADE_INFO_READ, true);
    }
  };
  const isInfoRead = offerType === OfferType.OFFER_RECEIVED ? offerReceivedInfoRead : offerMadeInfoRead;
  const infoText = offerType === OfferType.OFFER_RECEIVED ? t('offers:offerInfo') : t('offers:offerMadeInfo');
  if (!offerCountData) {
    return null;
  }

  const renderPropertyOffer = (item: Asset, index: number): React.ReactElement => {
    switch (offerType) {
      case OfferType.OFFER_RECEIVED:
        return (
          <PropertyDataCard
            property={item}
            // onViewOffer={FunctionUtils.noop()}---TODO: on click view offers:Shagun
          />
        );
      case OfferType.OFFER_MADE:
      default:
        return <ComingSoon />;
    }
  };
  return (
    <View style={[styles.container, isTablet && styles.containerTab]}>
      <OffersOverview onMetricsClicked={onMetricsClicked} offerCountData={offerCountData} isActive={offerType} />
      {!isInfoRead && propertyListingData && propertyListingData.length > 0 && (
        <View style={styles.infoContainer}>
          <View style={styles.infoSubContainer}>
            <View style={styles.iconTextContainer}>
              <Icon name={icons.circularFilledInfo} size={15} color={theme.colors.darkTint4} />
              <Typography variant="label" size="large" style={styles.infoText}>
                {infoText}
              </Typography>
            </View>
            <Icon name={icons.close} onPress={onCloseOfferInfo} />
          </View>
        </View>
      )}
      {propertyListingData && propertyListingData.length > 0 ? (
        <>
          {propertyListingData.map((property: Asset, index: number) => {
            return (
              <View key={index} style={styles.marginTop}>
                {renderPropertyOffer(property, index)}
              </View>
            );
          })}
        </>
      ) : (
          <EmptyState title={title} containerStyle={styles.emptyView} />
      )}
    </View>
  ); 
};
export default Offers;

const styles = StyleSheet.create({
  container: {
    width: '93%',
  },
  containerTab: {
    width: '100%',
  },
  infoContainer: {
    backgroundColor: theme.colors.white,
    top: 12,
    borderRadius: 4,
  },
  infoSubContainer: {
    marginHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    alignItems: 'center',
  },
  marginTop: { marginTop: 16 },
  infoText: { marginLeft: 8, color: theme.colors.darkTint4 },
  iconTextContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  emptyView: {
    marginTop: 12,
    height: '60vh',
  },
});
