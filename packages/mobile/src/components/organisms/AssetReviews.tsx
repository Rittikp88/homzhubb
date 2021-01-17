import React, { memo, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { PaginationComponent } from '@homzhub/mobile/src/components/atoms/PaginationComponent';
import { Rating } from '@homzhub/common/src/components/atoms/Rating';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { AssetReviewCard } from '@homzhub/mobile/src/components/molecules/AssetReviewCard';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  saleListingId: number | null;
  leaseListingId: number | null;
}

const data = [
  { id: 1, rating: 1, name: 'Neighborhood' },
  { id: 2, rating: 2, name: 'Rent' },
  { id: 3, rating: 4, name: 'Security' },
  { id: 4, rating: 5, name: 'Maintain' },
];
const SLIDER_WIDTH = theme.viewport.width - theme.layout.screenPadding * 4;

const AssetReviews = (props: IProps): React.ReactElement => {
  const { saleListingId, leaseListingId } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const [reviews, setReviews] = useState<AssetReview[]>([]);

  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  useEffect(() => {
    try {
      AssetRepository.getListingReviews({
        ...(leaseListingId && { lease_listing: leaseListingId }),
        ...(saleListingId && { sale_listing: saleListingId }),
      }).then((response) => {
        setReviews(response);
      });
    } catch (e) {
      AlertHelper.error({ message: t('common:genericErrorMessage') });
    }
  }, []);

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
      {reviews.map((review: AssetReview) => (
        <AssetReviewCard
          key={review.id}
          description={review.description}
          reviewedAt={review.postedAt}
          reviewedBy={review.reviewedBy}
          isReported={review.isReported}
          overallRating={review.rating}
          pillars={review.pillarRatings}
        />
      ))}
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
