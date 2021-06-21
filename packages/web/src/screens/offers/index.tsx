import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useDown, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import ComingSoon from '@homzhub/web/src/screens/comingSoon';
import OffersOverview from '@homzhub/web/src/screens/offers/components/OffersOverview';
import PropertyDataCard from '@homzhub/web/src/screens/offers/components/PropertyDataCard';
import OffersDropdown, { OffersDropdownType } from '@homzhub/web/src/screens/offers/components/OffersDropDown';
import { ICurrentOffer } from '@homzhub/common/src/modules/offers/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { OfferFilter } from '@homzhub/common/src/domain/models/OfferFilter';
import { OfferManagement } from '@homzhub/common/src/domain/models/OfferManagement';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { NegotiationOfferType, OfferFilterType, ListingType } from '@homzhub/common/src/domain/repositories/interfaces';

// TODO -- saved property metrics integration :Shagun
export enum OfferType {
  OFFER_RECEIVED = 'Offer Received',
  OFFER_MADE = 'Offer Made',
}

interface IDispatchProps {
  setCurrentOfferPayload: (payload: ICurrentOffer) => void;
  setFilter: (payload: IFilter) => void;
}
interface IStateProps {
  assetCount: number;
}

type IProps = IDispatchProps & IStateProps;

const Offers: FC<IProps> = (props: IProps) => {
  const [offerReceivedInfoRead, setOfferRecievedInfoRead] = useState(false);
  const [offerMadeInfoRead, setOfferMadeInfoRead] = useState(false);
  const [offerType, setOfferType] = useState(OfferType.OFFER_RECEIVED);
  const [offerCountData, setOfferCountData] = useState<OfferManagement>();
  const [propertyListingData, setPropertyListingData] = useState<Asset[]>([]);
  const [offerFilters, setOfferFilters] = useState(new OfferFilter());
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.LAPTOP);
  const [selectedFilters, setSelectedFilters] = useState({
    countary_id: Number(),
    type: '',
    asset_id: Number(),
    filter_by: '',
  });
  const { t } = useTranslation();
  const history = useHistory();

  const title = offerType === 'Offer Received' ? t('offers:noOfferReceived') : t('offers:noOfferMade');

  const filters = {}; // maintain state :Shagun
  useEffect(() => {
    getOfferDetails();
    getOfferFilters();
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
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };

  const getOfferFilters = async (): Promise<void> => {
    try {
      const response: OfferFilter = await OffersRepository.getOfferFilters(OfferFilterType.RECEIVED);
      setOfferFilters(response);
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };
  const getPropertyListData = async (): Promise<void> => {
    let propertyListingDatas: Asset[] = [];
    let currencies: string[] = [];
    const dynamicFilters = {
      ...(selectedFilters.countary_id && { countary_id: selectedFilters.countary_id }),
      ...(selectedFilters.type.length && { type: selectedFilters.type }),
      ...(selectedFilters.asset_id && { asset_id: selectedFilters.asset_id }),
      ...(selectedFilters.filter_by && { filter_by: selectedFilters.filter_by }),
    };
    const payload = {
      type: offerType === OfferType.OFFER_RECEIVED ? NegotiationOfferType.RECEIVED : NegotiationOfferType.CREATED,
      ...(offerType === OfferType.OFFER_RECEIVED && { params: filters }),
      // ...(offerType === OfferType.OFFER_MADE && { //TODO: for offers made :Shagun
      params: {
        ...dynamicFilters,
      },
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
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };

  const onSelectFilter = (selectedFilterType: OffersDropdownType, value: string | number): void => {
    setSelectedFilters((prevState) => {
      return {
        ...prevState,
        [selectedFilterType]: value,
      };
    });
  };

  useEffect(() => {
    getPropertyListData();
  }, [selectedFilters.countary_id, selectedFilters.type, selectedFilters.asset_id, selectedFilters.filter_by]);

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

  const viewOffers = (payload: ICurrentOffer | null, assetId: number, offerCount: number | null): void => {
    const count = offerCount;
    const { setCurrentOfferPayload } = props;
    const isValidListing = payload && payload.listingId > 0;
    if (!isValidListing) {
      AlertHelper.error({ message: t('property:listingNotValid') });
      return;
    }

    if (offerType === OfferType.OFFER_MADE) {
      // TODO : Handle offers made scenarioa - Shagun
    } else {
      if (payload) {
        setCurrentOfferPayload(payload);
      }
      // @ts-ignore
      NavigationService.navigate(history, {
        path: RouteNames.protectedRoutes.OFFERS_LISTED_PROPERTY,
        params: {
          offerCountData,
          offerType,
          count,
        },
      });
    }
  };

  const renderPropertyOffer = (item: Asset, index: number): React.ReactElement => {
    const isCardExpanded = index === 0;
    const { offerCount } = item;
    let payload: ICurrentOffer | null = null;
    const { saleTerm, leaseTerm, id } = item;
    if (saleTerm) {
      payload = {
        type: ListingType.SALE_LISTING,
        listingId: saleTerm.id,
      };
    } else if (leaseTerm) {
      payload = {
        type: ListingType.LEASE_LISTING,
        listingId: leaseTerm.id,
      };
    }
    return (
      <PropertyDataCard
        property={item}
        isCardExpanded={isCardExpanded}
        onViewOffer={(): void => viewOffers(payload, id, offerCount)}
      />
    ); // tODO: handle iffers made flow by switch - Shagun
  };
  return (
    <View style={[styles.container, isTablet && styles.containerTab]}>
      <OffersOverview onMetricsClicked={onMetricsClicked} offerCountData={offerCountData} isActive={offerType} />
      {!isInfoRead && propertyListingData && propertyListingData.length > 0 && (
        <View style={styles.infoContainer}>
          <View style={styles.infoSubContainer}>
            <View style={[styles.iconTextContainer, isTablet && styles.iconTextContainerMobile]}>
              <Icon name={icons.circularFilledInfo} size={15} color={theme.colors.darkTint4} />
              <Typography variant="label" size="large" style={styles.infoText}>
                {infoText}
              </Typography>
            </View>
            <Icon name={icons.close} onPress={onCloseOfferInfo} />
          </View>
        </View>
      )}
      <View style={[styles.filtersContainer, isMobile && styles.filtersContainerMobile]}>
        <OffersDropdown
          filterData={offerFilters.countryDropdownData}
          defaultTitle={t('assetPortfolio:selectCountry')}
          onSelectFilter={onSelectFilter}
          offerType={OffersDropdownType.Country}
        />
        <OffersDropdown
          filterData={offerFilters.listingDropdownData}
          defaultTitle={t('offers:selectType')}
          onSelectFilter={onSelectFilter}
          offerType={OffersDropdownType.Listing}
        />
        <OffersDropdown
          filterData={offerFilters.assetsDropdownData}
          defaultTitle={t('offers:selectProperty')}
          onSelectFilter={onSelectFilter}
          offerType={OffersDropdownType.Assets}
        />
      </View>
      {propertyListingData && propertyListingData.length > 0 ? (
        OfferType.OFFER_MADE !== offerType ? (
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
          <View style={styles.commingSoon}>
            <ComingSoon />
          </View>
        )
      ) : (
        <EmptyState title={title} containerStyle={styles.emptyView} />
      )}
    </View>
  );
};

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserAssetsCount } = UserSelector;
  return {
    assetCount: getUserAssetsCount(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setCurrentOfferPayload } = OfferActions;
  const { setFilter } = SearchActions;
  return bindActionCreators(
    {
      setCurrentOfferPayload,
      setFilter,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(Offers);

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
  iconTextContainerMobile: {
    width: '80%',
  },
  emptyView: {
    marginTop: 12,
    height: '60vh',
  },
  filtersContainer: {
    flexDirection: 'row',
  },
  filtersContainerMobile: {
    overflow: 'scroll',
  },
  commingSoon: {
    marginTop: 24,
  },
});
