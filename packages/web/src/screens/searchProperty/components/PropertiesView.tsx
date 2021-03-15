import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useUp, useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import InfiniteScrollView from '@homzhub/web/src/components/hoc/InfiniteScroll';
import PropertySearchCard from '@homzhub/web/src/screens/searchProperty/components/PropertySearchCard';
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

const PropertiesView: FC<IProps> = (props: IProps) => {
  const { isListView, property, fetchData, hasMore, limit, transaction_type, loader } = props;
  const isDesktop = useUp(deviceBreakpoint.DESKTOP);
  const isTab = useDown(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);

  return (
    <View style={styles.container}>
      {isListView && isDesktop && <SearchMapView />}
      <View style={isListView ? styles.containerList : styles.containerGrid}>
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
                ]}
              >
                <PropertySearchCard
                  key={item.id}
                  investmentData={item}
                  containerStyleProp={isListView && !isMobile ? styles.listView : styles.cardView}
                  cardImageCarouselStyle={
                    isListView ? styles.cardImageCarouselStyleList : styles.cardImageCarouselStyleGrid
                  }
                  cardImageStyle={isListView ? styles.cardImageStyleList : styles.cardImageStyleGrid}
                  priceUnit={transaction_type === 0 ? 'mo' : ''}
                  addressContainerStyleProp={isListView ? styles.addressContainerStyleProp : undefined}
                  subContainerStyleProp={isListView ? styles.subContainerStyleProp : undefined}
                  propertyAddressContainerStyle={isListView ? styles.propertyAddressContainerStyle : undefined}
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
    width: '45vw',
    flexDirection: 'column',
    height: '1200px',
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
  },
  cardListMobile: {
    width: '85vw',
  },
  infiniteGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    width: theme.layout.dashboardWidth,
    backgroundColor: 'red',
  },
  cardGrid: {
    display: 'flex',
    maxWidth: '31%',
    marginLeft: 18,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  cardGridTab: {
    width: '45%',
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
  },
  listViewDetails: {
    height: 230,
  },
  addressContainerStyleProp: {
    flexDirection: 'column',
  },
  subContainerStyleProp: {
    width: '45%',
  },
  propertyAddressContainerStyle: {
    paddingTop: 36,
  },
});
