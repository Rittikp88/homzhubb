import React, { useState, useCallback, memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Rating } from '@homzhub/common/src/components/atoms/Rating';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { Pillar } from '@homzhub/common/src/domain/models/Pillar';
import { VisitAssetDetail } from '@homzhub/common/src/domain/models/VisitAssetDetail';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IListingReviewParams } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  saleListingId: number | null;
  leaseListingId: number | null;
  asset: VisitAssetDetail;
  ratingCategories: Pillar[];
  onClose: (reset?: boolean) => void;
  deleted?: () => void;
  editReview?: boolean;
  overallRatings?: number;
  review?: AssetReview;
}

const ReviewForm = (props: IProps): React.ReactElement => {
  const {
    asset,
    onClose = FunctionUtils.noop,
    ratingCategories,
    saleListingId,
    leaseListingId,
    deleted = FunctionUtils.noop,
    editReview,
    review,
  } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);

  const [overallRating, setOverallRating] = useState(0);
  const [description, setDescription] = useState('');
  const [categoryRatings, setCategoryRatings] = useState<Pillar[]>([]);

  useEffect(() => {
    if (review) {
      setOverallRating(review?.rating);
      setDescription(review?.description);
    }
    setCategoryRatings(cloneDeep(ratingCategories));
  }, [ratingCategories, review]);

  const updatePillarRating = useCallback(
    (newRating: number, id: number): void => {
      const stateToUpdate = [...categoryRatings];
      const categoryToUpdate = stateToUpdate.find((pillar) => pillar.id === id);

      if (!categoryToUpdate || categoryToUpdate.rating === newRating) {
        return;
      }

      categoryToUpdate.rating = newRating;
      setCategoryRatings(stateToUpdate);
    },
    [categoryRatings]
  );

  const onSubmit = useCallback(async (): Promise<void> => {
    try {
      await AssetRepository.postListingReview({
        rating: overallRating,
        description,
        pillar_ratings: categoryRatings.map((pillar: Pillar) => ({ pillar: pillar.id, rating: pillar.rating })),
        ...(leaseListingId && { lease_listing: leaseListingId }),
        ...(saleListingId && { sale_listing: saleListingId }),
      });
      onClose(true);
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }
  }, [description, overallRating, categoryRatings, leaseListingId, saleListingId, onClose]);

  const update = useCallback(async (): Promise<void> => {
    if (!review || !categoryRatings) return;

    const payload: IListingReviewParams = {
      rating: overallRating,
      description,
      pillar_ratings: categoryRatings.map((pillar: Pillar) => ({
        pillar: pillar.pillarName?.id ?? 0,
        rating: pillar.rating,
      })),
      ...(leaseListingId && { lease_listing: leaseListingId }),
      ...(saleListingId && { sale_listing: saleListingId }),
    };

    try {
      await AssetRepository.updateReview(review.id, payload);
      onClose(true);
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }
  }, [description, overallRating, categoryRatings, leaseListingId, saleListingId, review, onClose]);

  const onPress = (): void => {
    if (editReview && deleted) {
      deleted();
      return;
    }
    onClose();
  };

  const onClick = (): Promise<void> => (editReview ? update() : onSubmit());
  return (
    <>
      <PropertyAddressCountry
        primaryAddress={asset.projectName}
        subAddress={asset.address}
        countryFlag={asset.country.flag}
        containerStyle={styles.container}
      />
      <Divider containerStyles={styles.dividerStyle} />
      <KeyboardAwareScrollView style={styles.container} showsVerticalScrollIndicator={false} bounces={false}>
        <Label type="large" textType="semiBold" style={styles.overallExperience}>
          {t('overallExperience')}
        </Label>
        <Rating isOverallRating value={overallRating} onChange={setOverallRating} />
        <View style={styles.pillarContainer}>
          {categoryRatings.map((pillarRating) => {
            return (
              <Rating
                key={pillarRating.id}
                title={(pillarRating.name || pillarRating.pillarName?.name) ?? ''}
                value={pillarRating.rating}
                onChange={(newRating): void => updatePillarRating(newRating, pillarRating.id)}
                containerStyle={styles.rating}
              />
            );
          })}
        </View>
        <TextArea
          label={t('assetDescription:description')}
          helpText={t('common:optional')}
          value={description}
          wordCountLimit={500}
          placeholder={t('bestReasons')}
          onMessageChange={setDescription}
          textAreaStyle={styles.textArea}
        />
        <View style={styles.buttonContainer}>
          <Button
            onPress={onPress}
            type="secondary"
            title={editReview ? t('common:delete') : t('common:notNow')}
            titleStyle={editReview ? styles.buttonTitle : styles.buttonTitleText}
            containerStyle={editReview ? styles.deleteButton : undefined}
          />
          <Button
            onPress={onClick}
            disabled={editReview ? false : overallRating === 0}
            type="primary"
            title={editReview ? t('common:update') : t('common:submit')}
            containerStyle={styles.submitButton}
          />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

const memoized = memo(ReviewForm);
export { memoized as ReviewForm };

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
  },
  pillarContainer: {
    marginTop: 20,
    marginBottom: 4,
  },
  overallExperience: {
    textAlign: 'center',
    color: theme.colors.darkTint3,
    marginBottom: 16,
    marginTop: 12,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
    marginBottom: 12,
  },
  submitButton: {
    marginStart: 16,
  },
  dividerStyle: {
    backgroundColor: theme.colors.background,
    marginTop: 16,
  },
  textArea: {
    height: 100,
    borderRadius: 4,
  },
  rating: {
    marginBottom: 16,
  },
  buttonTitle: {
    marginHorizontal: 0,
    color: theme.colors.error,
  },
  buttonTitleText: {
    marginHorizontal: 0,
    color: theme.colors.active,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
});
