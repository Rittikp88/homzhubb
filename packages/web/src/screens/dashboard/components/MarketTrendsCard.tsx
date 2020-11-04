import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { ImageSquare, Label, Text } from '@homzhub/common/src/components';

interface IMarketTrendsCard {
  image: string;
  type: string;
  date: string;
  heading: string;
  description: string;
}

interface IProps {
  data: string;
}

// TODO (BISHAL) - change dummy data with actual api data
const MarketTrendsCard: FC<IProps> = (props: IProps) => {
  return (
    <View style={styles.card}>
      <ImageSquare
        style={styles.image}
        size={50}
        source={{
          uri:
            'https://cdn57.androidauthority.net/wp-content/uploads/2020/04/oneplus-8-pro-ultra-wide-sample-twitter-1.jpg',
        }}
      />
      <View style={styles.info}>
        <Label type="regular" textType="regular">
          Blog
        </Label>
        <Label type="regular" textType="regular">
          12/03/88
        </Label>
      </View>
      <View style={styles.description}>
        <Text type="regular" textType="semiBold" style={styles.title}>
          How is the real estate market recovering?
        </Text>
        <Label type="regular" textType="regular" numberOfLines={2} ellipsizeMode="tail" style={styles.subTitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed dalskdjfkajsl Lorem ipsum dolor sit amet,
          consectetur adipiscing elit
        </Label>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: 322,
    height: 377,
    flexDirection: 'column',
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    margin: 20,
  },
  image: {
    flex: 1,
    minWidth: 'calc(100% - 24px)',
    maxWidth: 298,
    height: '50%',
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
    paddingHorizontal: theme.layout.screenPadding,
  },
  description: {
    flex: 1,
    flexDirection: 'column',
    padding: theme.layout.screenPadding,
    paddingTop: 8,
  },
  title: {
    flexBasis: 1,
    marginBottom: theme.layout.screenPadding,
  },
  subTitle: {
    overflow: 'hidden',
    textAlign: 'justify',
  },
});

export default MarketTrendsCard;
