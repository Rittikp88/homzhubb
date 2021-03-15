import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useUp, useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import PropertySearchCard from '@homzhub/web/src/screens/searchProperty/components/PropertySearchCard';
import SearchMapView from '@homzhub/web/src/screens/searchProperty/components/SearchMapView';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  isListView: boolean;
  property: AssetSearch;
  transaction_type: number;
}

const PropertiesView: FC<IProps> = ({ isListView, property, transaction_type }: IProps) => {
  const isDesktop = useUp(deviceBreakpoint.DESKTOP);
  const isTab = useDown(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);

  return (
    <View style={styles.listViewContainer}>
      {isListView && isDesktop && <SearchMapView />}
      <View style={isListView ? styles.containerList : styles.containerGrid}>
        <View style={styles.subContainerGrid}>
          {property.results.map((item: Asset) => (
            <View
              key={item.id}
              style={[
                isListView ? styles.cardList : styles.cardGrid,
                isTab && styles.cardGridTab,
                isMobile && styles.cardGridMobile,
              ]}
            >
              <PropertySearchCard
                key={item.id}
                investmentData={item}
                containerStyleProp={isListView ? styles.listView : styles.cardView}
                cardImageCarouselStyle={
                  isListView ? styles.cardImageCarouselStyleList : styles.cardImageCarouselStyleGrid
                }
                cardImageStyle={isListView ? styles.cardImageStyleList : styles.cardImageStyleGrid}
                priceUnit={transaction_type === 0 ? 'mo' : ''}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default PropertiesView;

const styles = StyleSheet.create({
  listViewContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  containerList: {
    width: '55%',
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
    width: '100%',
  },
  cardGrid: {
    width: '31%',
    marginLeft: 18,
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
});
