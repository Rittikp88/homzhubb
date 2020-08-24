import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';

interface IProps {
  onFavorite: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const Favorite = (props: IProps): React.ReactElement => {
  const { onFavorite, containerStyle } = props;

  const onFavoritePress = (): void => {
    onFavorite();
  };

  return (
    <View style={containerStyle}>
      <Icon name={icons.heartOutline} size={32} color={theme.colors.white} onPress={onFavoritePress} testID="icon" />
    </View>
  );
};

export { Favorite };
