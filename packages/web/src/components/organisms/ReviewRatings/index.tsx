import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import FilterRating from '@homzhub/web/src/components/organisms/ReviewRatings/FilterRating';
import PillarRatings from '@homzhub/web/src/components/organisms/ReviewRatings/PillarRatings';
import ReviewCards from '@homzhub/web/src/components/organisms/ReviewRatings/ReviewCards';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { Pillar } from '@homzhub/common/src/domain/models/Pillar';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  propertyTermId: number;
}

const ReviewRatings: FC<IProps> = (props: IProps) => {
  const { propertyTermId } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetDescription);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const [reviews, setReviews] = useState<AssetReview[]>([]);
  const [pieData, setPieData] = useState<Pillar[]>();

  const [nonFiltered, setNonFiltered] = useState<AssetReview[]>([]);
  useEffect(() => {
    AssetRepository.getListingReviewsSummary({ lease_listing: propertyTermId })
      .then((response) => {
        setPieData(response.pillarRatings);
      })
      .catch((e) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
      });
    AssetRepository.getListingReviews({ lease_listing: propertyTermId })
      .then((response) => {
        setReviews(response);
        setNonFiltered(response);
      })
      .catch((e) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
      });
  }, []);

  const filterRating = (rating: number): void => {
    const reviewData = nonFiltered.filter((item) => item.rating === rating);
    setReviews(reviewData);
  };
  return (
    <>
      {isTablet && pieData && (
        <View style={styles.carouselHeader}>
          <Typography variant="text" size="regular" fontWeight="semiBold" style={styles.heading}>
            {t('common:popularWith')}
          </Typography>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <PillarRatings pieData={pieData} />
          </ScrollView>
        </View>
      )}
      <View style={styles.container}>
        {!isMobile && (
          <View style={styles.seperator}>
            {pieData && !isTablet && (
              <View>
                <Typography variant="text" size="regular" fontWeight="semiBold" style={styles.heading}>
                  {t('common:popularWith')}
                </Typography>
                <PillarRatings pieData={pieData} />
              </View>
            )}
            {nonFiltered.length > 0 && !isMobile && (
              <View>
                <Typography variant="text" size="regular" fontWeight="semiBold" style={styles.heading}>
                  {t('propertySearch:filterByRating')}
                </Typography>
                <FilterRating reviewData={nonFiltered} filterBy={filterRating} />
              </View>
            )}
          </View>
        )}
        <Divider />
        <View style={styles.reviewContainer}>
          <Typography variant="text" size="regular" fontWeight="semiBold">
            {t('reviews')}
          </Typography>
          {reviews.length &&
            reviews.map((review) => {
              return (
                <View style={styles.cardReview} key={review.id}>
                  <ReviewCards reviewData={review} />
                </View>
              );
            })}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
    flexDirection: 'row',
    marginBottom: 24,
    height: '100%',
  },
  seperator: {
    width: '38%',
    left: '3%',
    top: 24,
  },

  cardReview: {
    paddingVertical: 24, // TODO : Mohak -Card review responsiveness in mobile
  },
  reviewContainer: {
    flex: 1,
    padding: 20,
  },
  carouselHeader: {
    backgroundColor: theme.colors.white,
    padding: 20,
  },
  heading: {
    marginBottom: 35,
  },
});

export default ReviewRatings;
