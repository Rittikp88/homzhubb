import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, StyleSheet, View } from 'react-native';
import Check from '@homzhub/common/src/assets/images/check.svg';
import Review from '@homzhub/common/src/assets/images/review.svg';
import Refer from '@homzhub/common/src/assets/images/refer.svg';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import ReferralShare from '@homzhub/mobile/src/components/molecules/ReferralShare';

const ReviewAndRefer = (): React.ReactElement => {
  const [isLoading, setLoading] = useState(false);
  const [isReview] = useState(true);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const data = useSelector(CommonSelectors.getReviewReferData);

  const handleReviewPress = (): void => {
    // TODO: (Shikha) - Add Logic for review
    dispatch(CommonActions.setReviewReferData({ message: '' }));
  };

  const renderReviewComponent = (): React.ReactElement => {
    return (
      <>
        <Review width={200} style={styles.icon} />
        <Label type="large" textType="semiBold" style={styles.textAlignment}>
          {t('enjoyExperience')}
        </Label>
        <Button
          type="primary"
          title={t('writReview')}
          onPress={handleReviewPress}
          containerStyle={styles.reviewButton}
          textStyle={styles.buttonText}
        />
      </>
    );
  };
  const renderReferComponent = (): React.ReactElement => {
    return (
      <View style={styles.referContainer}>
        <Refer width={200} style={styles.icon} />
        <Text type="regular" textType="semiBold" style={styles.referText}>
          {t('referFriends')}
        </Text>
        <Text type="regular" textType="semiBold" style={styles.referText}>
          {t('earnRewards')}
        </Text>
        <Label type="large" style={styles.referSubHeading}>
          {t('getCoins')}
        </Label>
        <Label type="large" textType="bold" style={styles.share}>
          {t('shareNow')}
        </Label>
        <ReferralShare setLoading={setLoading} />
      </View>
    );
  };

  return (
    <BottomSheet visible={false} sheetHeight={500} sheetContainerStyle={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Loader visible={isLoading} />
        <Check width={60} height={60} style={styles.check} />
        <Text textType="bold" style={styles.textAlignment}>
          {t('congratulations')}
        </Text>
        <Label type="large" style={styles.textAlignment}>
          {data?.message}
        </Label>
        {isReview ? renderReviewComponent() : renderReferComponent()}
      </ScrollView>
    </BottomSheet>
  );
};

export default ReviewAndRefer;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  check: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  textAlignment: {
    textAlign: 'center',
  },
  icon: {
    alignSelf: 'center',
    marginVertical: 24,
  },
  reviewButton: {
    backgroundColor: theme.colors.completed,
    flex: 0,
    marginVertical: 16,
    height: 48,
  },
  buttonText: {
    marginVertical: 6,
  },
  referContainer: {
    marginBottom: 30,
  },
  referText: {
    textAlign: 'center',
    color: theme.colors.primaryColor,
  },
  referSubHeading: {
    textAlign: 'center',
    marginVertical: 10,
  },
  share: {
    textAlign: 'center',
    marginBottom: 16,
  },
});
