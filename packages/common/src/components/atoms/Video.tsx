import React from 'react';
import { View, StyleSheet } from 'react-native';
import Video, { OnProgressData, OnLoadData } from 'react-native-video';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
import { theme } from '@homzhub/common/src/styles/theme';

interface IProps {
  uri: string;
  volume?: number;
}

interface IRNVideoState {
  currentTime: number;
  duration: number;
  isFullScreen: boolean;
  isLoading: boolean;
  paused: boolean;
  playerState: number;
  screenType: string;
}

class RNVideo extends React.Component<IProps, IRNVideoState> {
  private videoPlayer: any;
  public state = {
    currentTime: 0,
    duration: 0,
    isFullScreen: false,
    isLoading: true,
    paused: false,
    playerState: PLAYER_STATES.PLAYING,
    screenType: 'content',
  };

  public render(): React.ReactElement {
    const { uri, volume = 1 } = this.props;
    const { currentTime, duration, isFullScreen, isLoading, paused, playerState, screenType } = this.state;
    return (
      <View style={styles.container}>
        <Video
          onEnd={this.onEnd}
          onLoad={this.onLoad}
          onLoadStart={this.onLoadStart}
          onProgress={this.onProgress}
          paused={paused}
          ref={(c: any): void => {
            this.videoPlayer = c;
          }}
          // @ts-ignore
          resizeMode={screenType}
          onFullScreen={isFullScreen}
          source={{ uri }}
          style={styles.mediaPlayer}
          volume={volume}
        />
        <MediaControls
          duration={duration}
          isLoading={isLoading}
          mainColor={theme.colors.shadow}
          isFullScreen={isFullScreen}
          onFullScreen={this.onFullScreen}
          onPaused={this.onPaused}
          onReplay={this.onReplay}
          onSeek={this.onSeek}
          onSeeking={this.onSeeking}
          playerState={playerState}
          progress={currentTime}
        />
      </View>
    );
  }

  public onSeek = (seek: number): void => {
    // Handler for change in seekbar
    this.videoPlayer.seek(seek);
  };

  public onPaused = (playerState: number): void => {
    const { paused } = this.state;
    // Handler for Video Pause
    this.setState({
      paused: !paused,
      playerState,
    });
  };

  public onReplay = (): void => {
    // Handler for Replay
    this.setState({ playerState: PLAYER_STATES.PLAYING });
    this.videoPlayer.seek(0);
  };

  public onProgress = (data: OnProgressData): void => {
    const { isLoading, playerState } = this.state;
    // Video Player will continue progress even if the video already ended
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      this.setState({ currentTime: data.currentTime });
    }
  };

  public onLoad = (data: OnLoadData): void => this.setState({ duration: data.duration, isLoading: false });

  public onLoadStart = (): void => this.setState({ isLoading: true });

  public onEnd = (): void => this.setState({ playerState: PLAYER_STATES.ENDED });

  public onFullScreen = (): void => {
    const { screenType } = this.state;
    if (screenType === 'content') this.setState({ screenType: 'cover' });
    else this.setState({ screenType: 'content' });
  };

  public onSeeking = (currentTime: number): void => this.setState({ currentTime });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.shadow,
  },
});
export { RNVideo };
