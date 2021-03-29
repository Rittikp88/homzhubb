import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useUp, useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import InfiniteScrollView from '@homzhub/web/src/components/hoc/InfiniteScroll';
import PropertyCard from '@homzhub/web/src/screens/searchProperty/components/PropertyCard';
import SearchMapView from '@homzhub/web/src/screens/searchProperty/components/SearchMapView';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  isListView: boolean;
  property: AssetSearch;
  fetchData: (value: number) => void;
  hasMore: boolean;
  limit: number;
  transaction_type: number;
  loader: boolean;
}

const noStyles = {};

const PropertiesView: FC<IProps> = (props: IProps) => {
  const { isListView, property, fetchData, hasMore, limit, transaction_type, loader } = props;
  const isDesktop = useUp(deviceBreakpoint.DESKTOP);
  const isTab = useDown(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);

  return (
    <View style={styles.container}>
      {isListView && isDesktop && <SearchMapView />}
      <View style={[styles.containerGrid, isListView && isMobile ? styles.containerListMobile : styles.containerList]}>
        <View style={styles.subContainerGrid}>
          <InfiniteScrollView
            data={property.results.length}
            fetchMoreData={fetchData}
            height={isDesktop && isListView ? '1200px' : '150vh'}
            style={!isListView ? { display: 'flex', flexWrap: 'wrap', width: '88vw' } : {}}
            hasMore={hasMore}
            limit={limit}
            loader={loader}
          >
            {property.results.map((item: Asset) => (
              <View
                key={item.id}
                style={[
                  isListView ? styles.cardList : styles.cardGrid,
                  isMobile && isListView && styles.cardListMobile,
                  isTab && !isListView && styles.cardGridTab,
                  isMobile && !isListView && styles.cardGridMobile,
                  isTab && isListView && styles.listViewTablet,
                ]}
              >
                <PropertyCard
                  key={item.id}
                  investmentData={item}
                  containerStyle={[styles.propertyCard, isListView && !isMobile ? styles.listView : styles.cardView]}
                  cardImageCarouselStyle={
                    isListView ? styles.cardImageCarouselStyleList : styles.cardImageCarouselStyleGrid
                  }
                  cardImageStyle={isListView ? styles.cardImageStyleList : styles.cardImageStyleGrid}
                  priceUnit={transaction_type === 0 ? 'mo' : ''}
                  propertyTypeAndBadgesStyle={styles.propertyTypeAndBadges}
                  priceAndAmenitiesStyle={isListView ? styles.priceAndAmenitiesList : styles.priceAndAmenitiesGrid}
                  propertyAmenitiesStyle={styles.propertyAmenities}
                  addressStyle={[styles.address, !isListView ? styles.addressGridView : noStyles]}
                  detailsStyle={[
                    styles.details,
                    isListView && isDesktop ? styles.detailsListView : noStyles,
                    isListView && isTab ? styles.detailsListTabView : noStyles,
                    isListView && isMobile ? styles.detailsListMobileView : noStyles,
                  ]}
                />
              </View>
            ))}
          </InfiniteScrollView>
        </View>
      </View>
    </View>
  );
};

export default PropertiesView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
  },
  containerList: {
    width: '55%',
    flexDirection: 'column',
    height: '1200px',
  },
  containerListMobile: {
    width: '100%',
  },
  containerGrid: {
    flex: 1,
    flexDirection: 'row',
  },
  subContainerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  cardList: {
    width: '45vw',
    alignItems: 'stretch',
    paddingHorizontal: 16,
  },
  cardListMobile: {
    width: '85vw',
  },
  cardGrid: {
    display: 'flex',
    width: '31%',
    marginLeft: 18,
    alignItems: 'stretch',
    alignSelf: 'flex-start',
  },
  cardGridTab: {
    width: '47%',
  },
  cardGridMobile: {
    width: '95%',
  },
  cardImageCarouselStyleList: {
    height: 230,
    width: 260,
  },
  cardImageStyleList: {
    height: 230,
    width: 260,
  },
  cardImageCarouselStyleGrid: {
    height: 210,
    width: 340,
    marginHorizontal: 'auto',
  },
  cardImageStyleGrid: {
    height: 210,
    width: 340,
  },
  listView: {
    flexDirection: 'row',
  },
  cardView: {
    flexDirection: 'column',
    minHeight: 450,
  },

  propertyCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    padding: 10,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  priceAndAmenitiesList: {
    justifyContent: 'space-between',
  },
  priceAndAmenitiesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyAmenities: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  propertyTypeAndBadges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  address: {
    marginTop: 5,
    marginBottom: 16,
  },
  addressGridView: {
    minHeight: 125,
  },
  details: {
    marginLeft: 16,
  },
  detailsListTabView: {
    width: '40vw',
  },
  detailsListView: {
    width: '20vw',
  },
  detailsListMobileView: {
    width: '60vw',
  },
  listViewTablet: {
    width: '100%',
  },
});
