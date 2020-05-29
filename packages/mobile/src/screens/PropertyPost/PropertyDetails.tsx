import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import Header from '@homzhub/mobile/src/components/molecules/Header';

type Props = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.PropertyDetailsScreen>;

class PropertyDetails extends React.PureComponent<Props, {}> {
  public render(): React.ReactNode {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={theme.colors.primaryColor}
          icon="left-arrow"
          iconColor="white"
          onIconPress={this.handleIconPress}
          isHeadingVisible
          title="Details"
          titleType="small"
          titleFontType="semiBold"
          titleStyle={styles.title}
        />
      </View>
    );
  }

  public handleIconPress = (): void => {};
}

export default withTranslation()(PropertyDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: theme.colors.white,
  },
});
