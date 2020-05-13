import React from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';

const PostOnBoarding = (
  props: NavigationScreenProps<AuthStackParamList, ScreensKeys.SearchOnBoarding>
): React.ReactElement => {
  const { route } = props;
  const onPress = (): void => {
    props.navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text>{route.name}</Text>
      <Button title="Go Back" onPress={onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignContent: 'center' },
});

const memoizedComponent = React.memo(PostOnBoarding);
export { memoizedComponent as PostOnBoarding };
