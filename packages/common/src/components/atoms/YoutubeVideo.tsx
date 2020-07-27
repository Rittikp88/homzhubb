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

interface IYoutubeVideoState {
  height: number;
}

class YoutubeVideo extends React.PureComponent<IProps, IYoutubeVideoState> {
  public state = {
    height: 185,
  };

  public render(): React.ReactElement {
    const { height } = this.state;
    const { play = true, isFullScreen = false, loop = false, url } = this.props;
    const conditionalStyle = createConditionalStyles(height);
    return (
      <View style={styles.container}>
        <YouTube
          // @ts-ignore
          apiKey={YOUTUBE_API_KEY}
          videoId={this.getVideoId(url)}
          play={play}
          fullscreen={isFullScreen}
          loop={loop}
          style={[styles.youtube, conditionalStyle.video]}
          onError={this.onError}
          resumePlayAndroid={false}
          controls={1}
          onReady={this.handleReady}
        />
      </View>
    );
  }

  public onError = (e: any): void => {
    console.log(e);
  };

  public handleReady = (): void => {
    setTimeout(() => this.setState({ height: 186 }), 500);
  };

  public getVideoId = (url: string): string => {
    let video_id = url.split('v=')[1];
    const ampersandPosition = video_id.indexOf('&');
    if (ampersandPosition !== -1) {
      video_id = video_id.substring(0, ampersandPosition);
    }
    return video_id;
  };
}

export { YoutubeVideo };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  youtube: {
    alignSelf: 'stretch',
    width: theme.viewport.width,
  },
});

const createConditionalStyles = (height: number): any => ({
  video: {
    height,
  },
});
