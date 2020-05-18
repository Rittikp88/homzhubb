import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const SearchOnBoarding = (
  props: NavigationScreenProps<AuthStackParamList, ScreensKeys.SearchOnBoarding>
): React.ReactElement => {
  const { route } = props;
  const onPress = (): void => {
    AlertHelper.error({ message: 'This is a sample text. Trying for 2 sentences. Or maybe 3' });
  };

  return (
    <View style={styles.container}>
      <Text>{route.name}</Text>
      <Button title="Next" onPress={onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignContent: 'center' },
});

const memoizedComponent = React.memo(SearchOnBoarding);
export { memoizedComponent as SearchOnBoarding };
