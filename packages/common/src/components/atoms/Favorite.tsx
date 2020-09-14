import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';

interface IProps {
  onFavorite: () => void;
  isFavorite: boolean;
  iconColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const Favorite = (props: IProps): React.ReactElement => {
  const { onFavorite, isFavorite, iconColor, containerStyle } = props;

  const onFavoritePress = (): void => {
    onFavorite();
  };

  return (
    <View style={containerStyle}>
      <Icon
        name={isFavorite ? icons.filledHeart : icons.heartOutline}
        size={32}
        color={isFavorite ? theme.colors.favourite : iconColor || theme.colors.darkTint6}
        onPress={onFavoritePress}
        testID="icon"
      />
    </View>
  );
};

export { Favorite };
