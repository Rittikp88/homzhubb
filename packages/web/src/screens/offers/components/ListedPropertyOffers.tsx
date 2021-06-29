import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { History } from 'history';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub//common/src/utils/ErrorUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { OffersRepository } from '@homzhub//common/src/domain/repositories/OffersRepository';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import OffersDropdown, { OffersDropdownType } from '@homzhub/web/src/screens/offers/components/OffersDropDown';
import OffersOverview from '@homzhub/web/src/screens/offers/components/OffersOverview';
import { OfferType } from '@homzhub/web/src/screens/offers';
import OfferView from '@homzhub/web/src/screens/offers/components/OfferView';
import PreferenceDetails from '@homzhub/web/src/screens/offers/components/PreferenceDetails';
import PropertyOfferDetails from '@homzhub/web/src/screens/offers/components/PropertyOfferDetails';
import { OfferFilter } from '@homzhub/common/src/domain/models/OfferFilter';
import { OfferManagement } from '@homzhub/common/src/domain/models/OfferManagement';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { MadeSort, offerMadeSortBy } from '@homzhub/common/src/constants/Offers';
import { OfferFilterType } from '@homzhub/common/src/domain/repositories/interfaces';

interface IRouteProps {
  offerCountData: OfferManagement;
  offerType: string;
  count: number | null;
}
interface IProps {
  history: History<IRouteProps>;
}
const ListedPropertyOffers: FC<IProps> = (props: IProps) => {
  const { history } = props;
  const { location } = history;
  const dispatch = useDispatch();
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const offerPayload = useSelector(OfferSelectors.getOfferPayload);
  const { t } = useTranslation();
  const listingDetail = useSelector(OfferSelectors.getListingDetail);
  const [offerFilters, setOfferFilters] = useState(new OfferFilter());
  const [offerType, setOfferType] = useState(OfferType.OFFER_RECEIVED);

  const [selectedFilters, setSelectedFilters] = useState({
    filter_by: '',
    sort_by: MadeSort.NEWEST,
  });
  useEffect(() => {
    if (offerPayload) {
      dispatch(OfferActions.getListingDetail(offerPayload));
    }
    getFilters();
  }, [offerType]);
  const onMetricsClicked = (name: string): void => {
    // TODO : Set offer type(handle toggle) - shagun
    setOfferType(name as OfferType);
    NavigationService.navigate(history, {
      path: RouteNames.protectedRoutes.OFFERS,
      params: {
        offerType,
      },
    });
  };
  const getFilters = async (): Promise<void> => {
    try {
      const detailFilter = await OffersRepository.getOfferFilters(OfferFilterType.DETAIL);
      setOfferFilters(detailFilter);
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
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

  return (
    <View style={[styles.container, isTablet && styles.containerTab]}>
      <OffersOverview
        onMetricsClicked={onMetricsClicked}
        offerCountData={location.state.offerCountData}
        isActive={location.state.offerType}
      />
      <View style={[styles.filter, styles.heading]}>
        <Typography variant="text" size="small" fontWeight="semiBold">
          {`${t('common:offers')} (${location.state.count})`}
        </Typography>
        <View style={[styles.filtersContainer, isMobile && styles.filtersContainerMobile]}>
          <OffersDropdown // TODO: Replace this with map function- Shagun
            filterData={offerMadeSortBy}
            defaultTitle={t('offers:sort')}
            onSelectFilter={onSelectFilter}
            offerType={OffersDropdownType.Sort}
          />
          <OffersDropdown
            filterData={offerFilters.filterDropdownData}
            defaultTitle={t('offers:filterBy')}
            onSelectFilter={onSelectFilter}
            offerType={OffersDropdownType.Filter}
          />
        </View>
      </View>
      {listingDetail && (
        <View style={[styles.cardDetails, isTablet && styles.cardAlignment]}>
          <View style={[styles.background, isTablet && styles.detailCard]}>
            <PropertyOfferDetails property={listingDetail} isExpanded containerStyles={styles.innerContainer} />
          </View>
          {isMobile && <Divider />}
          <View
            style={[
              styles.background,
              !isTablet && styles.card,
              isTablet && !isMobile && styles.detailCard,
              isMobile && styles.detailCardMobile,
            ]}
          >
            <PreferenceDetails
              property={listingDetail}
              containerStyles={[styles.innerContainer, isTablet && styles.innerContainerTab]}
            />
          </View>
        </View>
      )}
      <View style={styles.offerViewAlignment}>
        <OfferView selectedFilters={selectedFilters} />
      </View>
    </View>
  );
};
export default ListedPropertyOffers;
const styles = StyleSheet.create({
  container: {
    width: '93%',
  },
  containerTab: {
    width: '100%',
  },

  cardDetails: {
    width: '100%',
    flexDirection: 'row',
    paddingTop: 24,
  },
  cardAlignment: {
    flexDirection: 'column',
  },
  card: {
    left: 12,
  },
  background: {
    backgroundColor: theme.colors.white,
    width: 560,
  },
  innerContainer: {
    marginHorizontal: 12,
    top: 12,
    paddingBottom: 8,
  },
  innerContainerTab: {
    paddingBottom: 20,
  },
  preferenceContainer: {
    top: 12,
  },
  detailCard: {
    width: '100%',
    marginTop: 12,
  },
  heading: {
    marginTop: 25,
  },
  detailCardMobile: {
    top: 0,
    width: '100%',
  },
  offerViewAlignment: {
    marginTop: 40,
  },
  filtersContainer: {
    flexDirection: 'row',
  },
  filtersContainerMobile: {
    overflow: 'scroll',
  },
  filter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
