import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, Text, WithShadowView } from '@homzhub/common/src/components';

interface IHighlightProps {
  handleNextStep: () => void;
}

// TODO: (Shikha) - Refactor for Highlights
export const PropertyHighlights = ({ handleNextStep }: IHighlightProps): React.ReactElement => {
  const onContinue = (): void => handleNextStep();
  return (
    <>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text type="large">ADD</Text>
        </View>
        <View style={styles.content}>
          <Text type="large">ADD</Text>
        </View>
        <View style={styles.content}>
          <Text type="large">ADD</Text>
        </View>
      </View>
      <WithShadowView outerViewStyle={styles.shadowView}>
        <Button type="primary" title="Continue" containerStyle={styles.buttonStyle} onPress={onContinue} />
      </WithShadowView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 50,
    marginBottom: 10,
    backgroundColor: theme.colors.white,
  },
  shadowView: {
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
});
