import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { ImageRound, ImageSquare } from '@homzhub/common/src/components';

const SearchOnBoarding = (
  props: NavigationScreenProps<AuthStackParamList, ScreensKeys.SearchOnBoarding>
): React.ReactElement => {
  const { route } = props;
  const onPress = (): void => {
    props.navigation.navigate(ScreensKeys.PostOnBoarding);
  };

  return (
    <View style={styles.container}>
      <Text>{route.name}</Text>
      <Button title="Next" onPress={onPress} />
      <ImageRound size={50} source={require('@homzhub/common/src/assets/images/download.jpeg')} />
      <ImageSquare size={100} source={require('@homzhub/common/src/assets/images/download.jpeg')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignContent: 'center' },
});

const memoizedComponent = React.memo(SearchOnBoarding);
export { memoizedComponent as SearchOnBoarding };
