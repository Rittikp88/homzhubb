import React, { memo, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { PaginationComponent } from '@homzhub/mobile/src/components/atoms/PaginationComponent';
import { Rating } from '@homzhub/common/src/components/atoms/Rating';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { AssetReviewCard } from '@homzhub/mobile/src/components/molecules/AssetReviewCard';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const SLIDER_WIDTH = theme.viewport.width - theme.layout.screenPadding * 4;
const data = [
  { id: 1, rating: 1, name: 'Neighborhood' },
  { id: 2, rating: 2, name: 'Rent' },
  { id: 3, rating: 4, name: 'Security' },
  { id: 4, rating: 5, name: 'Maintain' },
];
const AssetReviews = (): React.ReactElement => {
  const [activeIndex, setActiveIndex] = useState(0);

  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  useEffect(() => {
    // Make APIs here
  });

  const splitData = useCallback((): any => {
    const newArr = [];

    for (let i = 0; i < data.length; i += 3) {
      newArr.push(data.slice(i, i + 3));
    }

    return newArr;
  }, []);

  const renderItem = (item: any): React.ReactElement => {
    return (
      <View style={styles.ratingContainer}>
        {item.map(
          (rat: any): React.ReactElement => (
            <Rating circle key={rat.id} value={rat.rating} title={rat.name} />
          )
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Label type="large" textType="semiBold" style={styles.headerTitle}>
          {t('common:popularWith')}
        </Label>
        <SnapCarousel
          carouselData={splitData()}
          carouselItem={renderItem}
          activeIndex={activeIndex}
          onSnapToItem={setActiveIndex}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={SLIDER_WIDTH}
        />
        <PaginationComponent
          dotsLength={splitData().length}
          activeSlide={activeIndex}
          containerStyle={styles.paginationContainer}
          activeDotStyle={[styles.dot, styles.activeDot]}
          inactiveDotStyle={[styles.dot, styles.inactiveDot]}
        />
      </View>
      <Divider containerStyles={styles.divider} />
      <Label type="large" textType="semiBold" style={styles.popularWith}>
        {t('common:popularWith')}
      </Label>
      <AssetReviewCard review="Natoque auctor et faucibus lobortis sed non pretium. Eros, gravida nulla vitae, molestie, Natoque auctor et faucibus lobortis sed non pretium. Eros, gravida nulla vitae, molestie, Natoque auctor et faucibus lobortis sed non pretium. Eros, gravida nulla vitae, molestie" />
    </View>
  );
};

const memoizedComponent = memo(AssetReviews);
export { memoizedComponent as AssetReviews };

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    minHeight: 150,
  },
  content: {
    marginHorizontal: 16,
  },
  headerTitle: {
    color: theme.colors.darkTint3,
    marginVertical: 16,
  },
  popularWith: {
    color: theme.colors.darkTint3,
    margin: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    borderColor: theme.colors.background,
  },
  paginationContainer: {
    paddingVertical: 16,
  },
  dot: {
    width: 7,
    height: 7,
  },
  activeDot: {
    borderWidth: 1.5,
  },
  inactiveDot: {
    backgroundColor: theme.colors.disabled,
    borderWidth: 0,
  },
});
