import React, { FC, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector} from 'react-redux';
import { History } from 'history'; 
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import OffersOverview from '@homzhub/web/src/screens/offers/components/OffersOverview';
import OfferView from '@homzhub/web/src/screens/offers/components/OfferView';
import PreferenceDetails from '@homzhub/web/src/screens/offers/components/PreferenceDetails';
import PropertyOfferDetails from '@homzhub/web/src/screens/offers/components/PropertyOfferDetails';
import { OfferManagement } from '@homzhub/common/src/domain/models/OfferManagement';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

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
  useEffect(() => {
    if (offerPayload) {
      dispatch(OfferActions.getListingDetail(offerPayload));
    }
  }, []);
  const onMetricsClicked = (name: string): void => {
    // TODO : Set offer type(handle toggle) - shagun
  };
  return (
    <View style={[styles.container, isTablet && styles.containerTab]}>
      <OffersOverview
        onMetricsClicked={onMetricsClicked}
        offerCountData={location.state.offerCountData}
        isActive={location.state.offerType}
      />
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
      <View>
        <Typography variant="text" size="small" fontWeight="semiBold" style={styles.heading}>
          {`${t('common:offers')} (${location.state.count})`}
        </Typography>
        <OfferView />
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
    marginBottom: 20,
  },
  detailCardMobile: {
    top: 0,
    width: '100%',
  },
});
