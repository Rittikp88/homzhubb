import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HandleBack from '@homzhub/mobile/src/navigation/HandleBack';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  children: React.ReactNode;
  screenTitle?: string;
  isScrollable?: boolean;
  onGoBack?: () => void;
}

const GradientScreen = (props: IProps): React.ReactElement => {
  const { screenTitle, children, isScrollable, onGoBack } = props;
  return (
    <HandleBack onBack={onGoBack}>
      <ImageBackground
        source={require('../../../../common/src/assets/images/background.png')}
        style={styles.background}
      >
        {!!screenTitle && (
          <Text type="small" textType="semiBold" style={styles.title}>
            {screenTitle}
          </Text>
        )}
      </ImageBackground>
      <View style={styles.childrenContainer}>
        {onGoBack && (
          <View style={styles.header}>
            <Icon name={icons.leftArrow} size={16} onPress={onGoBack} />
          </View>
        )}
        {isScrollable ? (
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {children}
          </KeyboardAwareScrollView>
        ) : (
          children
        )}
      </View>
    </HandleBack>
  );
};

export default GradientScreen;

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.colors.white,
    marginBottom: 16,
  },
  childrenContainer: {
    flex: 1,
    marginTop: -80,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    marginHorizontal: 16,
    padding: 16,
  },
  header: {
    marginTop: 10,
    marginBottom: 30,
  },
});
