import React from 'react';
// @ts-ignore
import Video from 'react-native-video';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface IProps {
  uri: string;
  containerStyle?: StyleProp<ViewStyle>;
  onBuffer: () => void;
  onVideoError: () => void;
  fullscreen?: boolean;
  pictureInPicture?: boolean;
}

export const RNVideo = (props: IProps): React.ReactElement => {
  const { uri, onBuffer, onVideoError, fullscreen = false, pictureInPicture = false, containerStyle } = props;
  return (
    <View style={styles.container}>
      <Video
        source={{ uri }}
        onBuffer={onBuffer}
        onError={onVideoError}
        fullscreen={fullscreen}
        pictureInPicture={pictureInPicture}
        style={[styles.backgroundVideo, containerStyle]}
        volume={10}
        resizeMode="content"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
