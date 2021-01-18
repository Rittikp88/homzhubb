import React, { memo, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { AssetReviewCard } from '@homzhub/mobile/src/components/molecules/AssetReviewCard';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { AssetReviewsSummary } from '@homzhub/mobile/src/components/molecules/AssetReviewsSummary';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { icons } from '@homzhub/common/src/assets/icon';

interface IProps {
  saleListingId: number | null;
  leaseListingId: number | null;
}

const AssetReviews = (props: IProps): React.ReactElement => {
  const { saleListingId, leaseListingId } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  const [reviews, setReviews] = useState<AssetReview[]>([]);
  const [reportCategories, setReportCategories] = useState<Unit[]>([]);
  const [reviewSummary, setReviewSummary] = useState<AssetReview | null>(null);
  useEffect(() => {
    // Make APIs here
    getReportCategories().then();
  }, []);
  useEffect(() => {
    if (!saleListingId && !leaseListingId) {
      return;
    }

    try {
      AssetRepository.getListingReviews({
        ...(leaseListingId && { lease_listing: leaseListingId }),
        ...(saleListingId && { sale_listing: saleListingId }),
      }).then((response) => {
        setReviews(response);
      });
      AssetRepository.getListingReviewsSummary({
        ...(leaseListingId && { lease_listing: leaseListingId }),
        ...(saleListingId && { sale_listing: saleListingId }),
      }).then((response) => {
        setReviewSummary(response);
      });
    } catch (e) {
      AlertHelper.error({ message: t('common:genericErrorMessage') });
    }
  }, []);

  const getReportCategories = async (): Promise<void> => {
    const response = await AssetRepository.getReviewReportCategories();
    setReportCategories(response);
  };

  if (reviews.length <= 0 && !reviewSummary) {
    return <EmptyState title={t('property:noReview')} icon={icons.reviews} />;
  }

  return (
    <View style={styles.container}>
      {reviewSummary && <AssetReviewsSummary reviewSummary={reviewSummary} containerStyle={styles.content} />}
      {reviews.length > 0 && (
        <Label type="large" textType="semiBold" style={styles.popularWith}>
          {t('common:popularWith')}
        </Label>
      )}
      {reviews.map((review: AssetReview) => (
        <AssetReviewCard key={review.id} review={review} reportCategories={reportCategories} />
      ))}
    </View>
  );
};

const memoizedComponent = memo(AssetReviews);
export { memoizedComponent as AssetReviews };

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    minHeight: 200,
  },
  content: {
    marginHorizontal: 16,
  },
  popularWith: {
    color: theme.colors.darkTint3,
    margin: 16,
  },
});
