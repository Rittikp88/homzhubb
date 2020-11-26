import React from 'react';
import { ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';

interface IProps {
  onFavorite: () => void;
  isFavorite: boolean;
  iconColor?: string;
  iconSize?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

const Favorite = (props: IProps): React.ReactElement => {
  const { onFavorite, isFavorite, iconColor = theme.colors.darkTint6, containerStyle, iconSize = 32 } = props;

  const onFavoritePress = (): void => {
    onFavorite();
  };

  return (
    <TouchableOpacity style={containerStyle} onPress={onFavoritePress}>
      <Icon
        name={isFavorite ? icons.filledHeart : icons.heartOutline}
        size={iconSize}
        color={isFavorite ? theme.colors.favourite : iconColor}
        testID="icon"
      />
    </TouchableOpacity>
  );
};

export { Favorite };
