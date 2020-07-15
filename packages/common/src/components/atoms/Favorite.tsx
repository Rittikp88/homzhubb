import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';

interface IProps {
  isFavorite: boolean;
  onFavorite: () => void;
}

const Favorite = (props: IProps): React.ReactElement => {
  const { isFavorite, onFavorite } = props;

  const onFavoritePress = (): void => {
    onFavorite();
  };

  return (
    <View style={isFavorite ? styles.favorite : styles.nonFavorite}>
      <Icon name={icons.heartOutline} size={32} color={theme.colors.white} onPress={onFavoritePress} />
    </View>
  );
};

export { Favorite };

const styles = StyleSheet.create({
  favorite: {
    backgroundColor: theme.colors.primaryColor,
    padding: 5,
    borderRadius: 4,
  },
  nonFavorite: {
    backgroundColor: theme.colors.transparent,
  },
});
