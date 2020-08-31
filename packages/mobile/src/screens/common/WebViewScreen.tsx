import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View } from 'react-native';
import { icons } from '@homzhub/common/src/assets/icon';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { Header, Loader } from '@homzhub/mobile/src/components';

type Props = NavigationScreenProps<AuthStackParamList, ScreensKeys.WebViewScreen>;

// TODO: (Shikha) - Need to refactor once webview url ready
export const WebViewScreen = (props: Props): React.ReactElement => {
  const {
    navigation,
    route: {
      params: { url },
    },
  } = props;

  const handleBackPress = (): void => {
    navigation.goBack();
  };

  const ActivityIndicatorLoadingView = (): React.ReactElement => {
    // making a view to show to while loading the webpage
    return <Loader visible />;
  };

  return (
    <View style={styles.container}>
      <Header icon={icons.leftArrow} onIconPress={handleBackPress} />
      <WebView source={{ uri: url }} renderLoading={ActivityIndicatorLoadingView} startInLoadingState />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
