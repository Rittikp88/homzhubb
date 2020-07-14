import React, { useState } from 'react';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';

interface IProps {
  isFavorite: boolean;
  onFavorite: () => void;
}

const Favorite = (props: IProps): React.ReactElement => {
  const { isFavorite, onFavorite } = props;
  const [favorite, setIsFavorite] = useState(isFavorite);

  const onFavoritePress = (): void => {
    setIsFavorite(!favorite);
    onFavorite();
  };

  return (
    <Icon
      name={favorite ? icons.bed : icons.info}
      size={32}
      color={theme.colors.primaryColor}
      onPress={onFavoritePress}
    />
  );
};

export { Favorite };
