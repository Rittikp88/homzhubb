import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, StyleProp, ViewStyle, ImageStyle } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';

export interface IProps {
  imageUrl: null | string;
  onIconPress?: () => void;
  dataLength?: number;
  iconSize?: number;
  iconColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  imageContainerStyle?: StyleProp<ImageStyle>;
  imageWrapperStyle?: StyleProp<ImageStyle>;
  isIconVisible?: boolean;
  isCoverPhotoContainer?: boolean;
  coverPhotoTitle?: string;
  isLastThumbnail?: boolean;
  onPressLastThumbnail?: () => void;
  isFavorite?: boolean;
  markFavorite?: () => void;
}

export class ImageThumbnail extends React.PureComponent<IProps, {}> {
  public render(): React.ReactElement {
    const {
      imageUrl,
      iconSize,
      iconColor,
      imageContainerStyle,
      imageWrapperStyle,
      containerStyle,
      isIconVisible = true,
      isCoverPhotoContainer = false,
      isLastThumbnail = false,
      onPressLastThumbnail,
      dataLength,
      isFavorite = false,
      coverPhotoTitle = 'Cover Photo',
      markFavorite,
    } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        {imageUrl && (
          <ImageBackground
            source={{ uri: imageUrl }}
            imageStyle={[styles.imageStyle, imageContainerStyle]}
            style={[styles.imageWrapper, imageWrapperStyle]}
          >
            {isIconVisible && (
              <TouchableOpacity style={styles.iconContainer} onPress={this.handleIconPress}>
                <Icon name={icons.close} size={iconSize || 22} color={iconColor || theme.colors.white} />
              </TouchableOpacity>
            )}
            {isCoverPhotoContainer && (
              <View style={styles.coverPhotoContainer}>
                <Text type="small" textType="regular" style={styles.coverPhoto}>
                  {coverPhotoTitle}
                </Text>
                <Icon
                  name={isFavorite ? icons.starFilled : icons.starUnfilled}
                  size={20}
                  color={theme.colors.white}
                  style={styles.starIcon}
                  onPress={markFavorite}
                />
              </View>
            )}
            {isLastThumbnail && (
              <View style={styles.lastThumbnailContainer}>
                <TouchableOpacity onPress={onPressLastThumbnail}>
                  <Text type="regular" textType="semiBold" style={styles.numberOfImages}>
                    + {dataLength}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ImageBackground>
        )}
      </View>
    );
  }

  public handleIconPress = (): void => {
    const { onIconPress } = this.props;
    if (onIconPress) {
      onIconPress();
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  imageStyle: {
    borderRadius: 4,
  },
  imageWrapper: {
    height: 200,
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
  coverPhotoContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.imageThumbnailBackground,
    opacity: 0.5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 35,
    alignItems: 'center',
    paddingLeft: 10,
    borderRadius: 4,
  },
  coverPhoto: { color: theme.colors.white, opacity: 1, flex: 7 },
  lastThumbnailContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.darkTint1,
    opacity: 0.75,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    alignItems: 'center',
    paddingLeft: 10,
    borderRadius: 4,
  },
  numberOfImages: {
    color: theme.colors.white,
    opacity: 1,
    justifyContent: 'center',
    padding: 30,
  },
  starIcon: {
    flex: 1,
  },
});
