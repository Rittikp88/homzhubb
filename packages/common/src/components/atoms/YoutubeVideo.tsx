import React from 'react';
import { View, StyleSheet } from 'react-native';
import YouTube from 'react-native-youtube';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { theme } from '@homzhub/common/src/styles/theme';

const YOUTUBE_API_KEY = ConfigHelper.getYoutubeApiKey();

interface IProps {
  isFullScreen?: boolean;
  play?: boolean;
  loop?: boolean;
  url: string;
}

class YoutubeVideo extends React.PureComponent<IProps> {
  public render(): React.ReactElement {
    const { play = true, isFullScreen = false, loop = false, url } = this.props;
    return (
      <View style={styles.container}>
        <YouTube
          // @ts-ignore
          apiKey={YOUTUBE_API_KEY}
          videoId={this.getVideoId(url)}
          play={play}
          fullscreen={isFullScreen}
          loop={loop}
          style={styles.youtube}
          onError={this.onError}
          resumePlayAndroid={false}
          controls={1}
        />
      </View>
    );
  }

  public onError = (e: any): void => {
    // TODO: To put the alert in case of error
  };

  public getVideoId = (url: string): string => {
    let videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }
    return videoId;
  };
}

export { YoutubeVideo };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  youtube: {
    alignSelf: 'stretch',
    height: '100%',
    width: theme.viewport.width,
  },
});
