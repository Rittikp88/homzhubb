import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';

interface IProps {
  reviews: AssetReview[];
}

const AssetRatings = (props: IProps): React.ReactElement => {
  const { reviews } = props;
  const { t } = useTranslation();

  const renderRating = ({ item, index }: { item: AssetReview; index: number }): React.ReactElement => {
    let backgroundColor = theme.colors.ratingHigh;
    let color = theme.colors.completed;
    let icon = icons.thumbsUp;

    if (item.rating < 50) {
      backgroundColor = theme.colors.ratingLow;
      color = theme.colors.error;
      icon = icons.thumbsDown;
    }

    return (
      <View style={styles.itemContainer} key={`${item.id}-${index}`}>
        <View style={[styles.iconContainer, { backgroundColor }]}>
          <Icon name={icon} size={20} color={color} />
          <Label type="large" textType="semiBold" style={[styles.experienceText, { color }]}>
            {`${item.rating}%`}
          </Label>
        </View>
        <Label type="large" textType="regular" style={styles.experienceText}>
          {item.experienceArea}
        </Label>
      </View>
    );
  };

  const keyExtractor = (item: AssetReview, index: number): string => `${item.id}-${index}`;

  return (
    <>
      <FlatList<AssetReview>
        keyExtractor={keyExtractor}
        data={reviews}
        renderItem={renderRating}
        contentContainerStyle={styles.sectionsContainer}
        testID="reviewsList"
      />
      <Label type="large" textType="semiBold" style={styles.readMore}>
        {t('readMore')}
      </Label>
    </>
  );
};

const styles = StyleSheet.create({
  sectionsContainer: {
    marginTop: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    padding: 8,
    width: 80,
  },
  experienceText: {
    marginStart: 12,
    color: theme.colors.darkTint4,
  },
  readMore: {
    color: theme.colors.active,
  },
});

const memoizedComponent = React.memo(AssetRatings);
export { memoizedComponent as AssetRatings };
