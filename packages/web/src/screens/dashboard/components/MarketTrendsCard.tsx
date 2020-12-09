import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { ImageSquare } from '@homzhub/common/src/components/atoms/Image';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { MarketTrendsResults } from '@homzhub/common/src/domain/models/MarketTrends';

interface IProps {
  data: MarketTrendsResults;
}

const MarketTrendsCard: FC<IProps> = ({ data }: IProps) => {
  const { title, postedAtDate, link, imageUrl } = data;
  const onLinkPress = (): void => {
    window.open(link);
  };
  return (
    <TouchableOpacity activeOpacity={1} onPress={onLinkPress} style={styles.card}>
      {imageUrl && !!imageUrl ? (
        <ImageSquare
          style={styles.image}
          size={50}
          source={{
            uri: imageUrl,
          }}
        />
      ) : (
        <ImagePlaceholder height={50} width={50} containerStyle={styles.image} />
      )}
      <View style={styles.info}>
        <Label type="regular" textType="regular">
          Blog
        </Label>
        <Label type="regular" textType="regular">
          {postedAtDate}
        </Label>
      </View>
      <View style={styles.description}>
        <Text type="small" textType="semiBold" style={styles.title}>
          {title}
        </Text>
        <Label type="regular" textType="regular" numberOfLines={2} ellipsizeMode="tail" style={styles.subTitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed dalskdjfkajsl Lorem ipsum dolor sit amet,
          consectetur adipiscing elit
        </Label>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    marginRight: 16,
    marginBottom: 25,
  },
  image: {
    flex: 1,
    minWidth: 'calc(100% - 24px)',
    maxWidth: 298,
    minHeight: 160,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    margin: 12,
  },
  info: {
    height: 'max-content',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  description: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  title: {
    flexBasis: 1,
    marginBottom: 8,
  },
  subTitle: {
    overflow: 'hidden',
    textAlign: 'justify',
    marginBottom: 8,
  },
});

export default MarketTrendsCard;
