import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { ImageSquare } from '@homzhub/common/src/components/atoms/Image';
import InvestmentFooter from './InvestmentFooter';

// TODO (LAKSHIT) - change dummy data with actual api data
interface IProps {
  investType: string;
}

const InvestmentsCard = (props: IProps): React.ReactElement => {
  const { investType } = props;
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
        <Text type="small" textType="semiBold" style={styles.title}>
          How is the real estate market recovering?
        </Text>
        <Label type="regular" textType="regular" numberOfLines={2} ellipsizeMode="tail" style={styles.subTitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed dalskdjfkajsl Lorem ipsum dolor sit amet,
          consectetur adipiscing elit
        </Label>
      </View>
      <View>
        <InvestmentFooter investType={investType} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: 322,
    // width:322,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    marginHorizontal: 4,
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
    flexDirection: 'column',
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

export default InvestmentsCard;
