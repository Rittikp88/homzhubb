import React, { FC } from 'react';
import { View, ViewStyle, StyleSheet, Image } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';

interface IProps {
  cardImage: string;
  cardTitle: string;
  cardDescription: string;
  cardStyle: ViewStyle;
}
const CardWithIcon: FC<IProps> = (props: IProps) => {
  const { cardTitle, cardDescription, cardImage, cardStyle } = props;

  return (
    <View style={[styles.card, cardStyle]}>
      <Image source={{ uri: cardImage }} style={styles.imageStyle} />
      <Typography size="regular" style={styles.cardTitle} fontWeight="semiBold">
        {cardTitle}
      </Typography>
      <Typography size="small" style={styles.cardDescription} fontWeight="regular">
        {cardDescription}
      </Typography>
    </View>
  );
};

export default CardWithIcon;

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    marginLeft: 40,
    marginBottom: 40,
    padding: 24,
    shadowColor: theme.colors.landingCardShadow,
    shadowOffset: { width: 0, height: 42 },
    shadowOpacity: 0.2,
    shadowRadius: 120,
  },
  imageStyle: {
    width: 40,
    height: 40,
  },
  cardTitle: {
    marginTop: 24,
    color: theme.colors.darkTint1,
  },
  cardDescription: {
    marginTop: 8,
    color: theme.colors.darkTint3,
  },
});
