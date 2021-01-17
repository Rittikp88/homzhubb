import React, { memo, useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Rating } from '@homzhub/common/src/components/atoms/Rating';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { User } from '@homzhub/common/src/domain/models/User';
import { Pillar } from '@homzhub/common/src/domain/models/Pillar';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IAssetReviewProps {
  description?: string;
  overallRating: number;
  reviewedBy: User;
  reviewedAt: string;
  isReported: boolean;
  pillars: Pillar[];
}

const AssetReviewCard = (props: IAssetReviewProps): React.ReactElement => {
  const { description, reviewedBy, reviewedAt, overallRating, pillars } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  const owner = useSelector(UserSelector.getUserProfile);

  const [showMore, setShowMore] = useState(false);
  const [showMoreReply, setShowMoreReply] = useState(false);
  const [replyMode, setReplyMode] = useState(false);
  const [reply, setReply] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleShowMore = useCallback((): void => {
    setShowMore((oldValue) => !oldValue);
  }, []);

  const toggleShowMoreReply = useCallback((): void => {
    setShowMoreReply((oldValue) => !oldValue);
  }, []);

  const toggleReplyMode = useCallback((): void => {
    setReplyMode((oldValue) => !oldValue);
  }, []);

  const toggleIsSubmitting = useCallback((): void => {
    setIsSubmitted((oldValue) => !oldValue);
  }, []);

  const onSubmit = useCallback(() => {
    setIsSubmitted(true);
  }, []);

  const onDeleteReply = useCallback(() => {
    setReply('');
    setReplyMode(false);
    setIsSubmitted(false);
  }, []);

  return (
    <View style={styles.container}>
      <Avatar
        fullName={reviewedBy.fullName}
        image={reviewedBy.profilePicture}
        designation={t('tenant')}
        rating={reviewedBy.rating}
        date={reviewedAt}
      />
      {description && (
        <Label type="large" numberOfLines={!showMore ? 2 : undefined} style={styles.review}>
          {description}
        </Label>
      )}
      <Rating isOverallRating value={overallRating} />
      {showMore && (
        <View style={styles.pillarContainer}>
          {pillars.map((pillarRating, index) => {
            return (
              <Rating
                key={pillarRating.id}
                title={pillarRating.pillarName?.name ?? ''}
                value={pillarRating.rating}
                containerStyle={index !== pillars.length - 1 && styles.rating}
              />
            );
          })}
        </View>
      )}
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <View style={[styles.buttonContainer, { justifyContent: replyMode ? 'flex-end' : 'space-between' }]}>
        {!replyMode && (
          <TouchableOpacity onPress={toggleReplyMode}>
            <View style={styles.replyContainer}>
              <Icon name={icons.reply} size={12} color={theme.colors.darkTint4} />
              <Label type="large" textType="semiBold" style={styles.reply}>
                {t('common:reply')}
              </Label>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={toggleShowMore}>
          <Label type="large" textType="semiBold" style={styles.showMore}>
            {showMore ? t('showLess') : t('showMore')}
          </Label>
        </TouchableOpacity>
      </View>
      {replyMode && !isSubmitted && (
        <>
          <TextArea
            value={reply}
            placeholder={t('writeComment')}
            onMessageChange={setReply}
            textAreaStyle={styles.textArea}
          />
          <View style={styles.replyButtonContainer}>
            <Button
              onPress={toggleReplyMode}
              type="secondary"
              title={t('common:cancel')}
              containerStyle={styles.replyButton}
              titleStyle={styles.replyButtonTitle}
            />
            <Button
              onPress={onSubmit}
              disabled={reply.length === 0}
              type="primary"
              title={t('common:submit')}
              containerStyle={[styles.replyButton, styles.replySubmit]}
              titleStyle={styles.replyButtonTitle}
            />
          </View>
        </>
      )}
      {replyMode && isSubmitted && (
        <>
          <Divider containerStyles={styles.divider} />
          <Avatar fullName={owner.fullName} designation={t('owner')} rating={owner.rating} />
          <View style={styles.replyContent}>
            <Label type="large" numberOfLines={!showMoreReply ? 2 : undefined} style={styles.review}>
              {reply}
            </Label>
            <View style={styles.replyCRUDButtons}>
              <View style={styles.replyCRUDButtons}>
                <TouchableOpacity onPress={toggleIsSubmitting}>
                  <Icon name={icons.noteBook} size={16} color={theme.colors.darkTint4} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onDeleteReply}>
                  <Icon name={icons.trash} size={16} color={theme.colors.error} style={styles.deleteIcon} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={toggleShowMoreReply}>
                <Label type="large" textType="semiBold" style={styles.showMore}>
                  {showMoreReply ? t('showLess') : t('showMore')}
                </Label>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const memoizedComponent = memo(AssetReviewCard);
export { memoizedComponent as AssetReviewCard };

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  review: {
    color: theme.colors.darkTint5,
    marginVertical: 12,
  },
  replyContent: {
    marginStart: 54,
  },
  replyCRUDButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  replyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  pillarContainer: {
    marginTop: 16,
  },
  showMore: {
    color: theme.colors.primaryColor,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reply: {
    marginStart: 8,
    color: theme.colors.darkTint4,
  },
  replyButton: {
    flex: 0,
    width: 80,
  },
  replyButtonTitle: {
    marginHorizontal: 12,
    marginVertical: 6,
  },
  replySubmit: {
    marginStart: 12,
  },
  rating: {
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    borderRadius: 4,
  },
  divider: {
    borderColor: theme.colors.background,
    marginVertical: 16,
  },
  deleteIcon: {
    marginStart: 16,
  },
});
