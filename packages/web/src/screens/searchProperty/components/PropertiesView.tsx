import React, { FC } from 'react';
import { View, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import PropertySearchCard from '@homzhub/web/src/screens/searchProperty/components/PropertySearchCard';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  isListView: boolean;
  property: AssetSearch;
}

const PropertiesView: FC<IProps> = ({ isListView, property }: IProps) => {
  const isDesktop = useUp(deviceBreakpoint.DESKTOP);

  return (
    <View style={styles.listViewContainer}>
      {isListView && isDesktop && <View style={{ width: '45%' }} />}
      <View style={isListView ? styles.containerList : styles.containerGrid}>
        <View style={styles.subContainerGrid}>
          {property.results.map((item: Asset) => (
            <View key={item.id} style={isListView ? styles.cardList : styles.cardGrid}>
              <PropertySearchCard
                key={item.id}
                investmentData={item}
                containerStyleProp={isListView ? styles.listView : styles.cardView}
                cardImageCarouselStyle={
                  isListView ? styles.cardImageCarouselStyleList : styles.cardImageCarouselStyleGrid
                }
                cardImageStyle={isListView ? styles.cardImageStyleList : styles.cardImageStyleGrid}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default PropertiesView;

interface IFormStyles {
  listViewContainer: ViewStyle;
  containerList: ViewStyle;
  containerGrid: ViewStyle;
  subContainerList: ViewStyle;
  subContainerGrid: ViewStyle;
  cardList: ViewStyle;
  cardGrid: ViewStyle;
  cardImageCarouselStyleList: ViewStyle;
  cardImageStyleList: ImageStyle;
  cardImageStyleGrid: ImageStyle;
  cardImageCarouselStyleGrid: ViewStyle;
  listView: ViewStyle;
  gridView: ViewStyle;
}

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
