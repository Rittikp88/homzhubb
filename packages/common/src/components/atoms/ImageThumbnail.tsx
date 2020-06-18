import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';

interface IProps {
  imageUrl: string;
  onIconPress: () => void;
  iconSize?: number;
  iconColor?: string;
}

export class ImageThumbnail extends React.PureComponent<IProps, {}> {
  public render(): React.ReactElement {
    const { imageUrl, iconSize, iconColor } = this.props;
    return (
      <View style={styles.container}>
        <ImageBackground source={{ uri: imageUrl }} style={styles.imageWrapper}>
          <TouchableOpacity style={styles.iconContainer} onPress={this.handleIconPress}>
            <Icon name={icons.close} size={iconSize || 22} color={iconColor || theme.colors.white} />
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  }

  public handleIconPress = (): void => {
    const { onIconPress } = this.props;
    onIconPress();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
    borderRadius: 4,
    backgroundColor: theme.colors.darkTint9,
  },
  imageWrapper: {
    height: 200,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
    bottom: 0,
    backgroundColor: theme.colors.crossIconContainer,
  },
});
