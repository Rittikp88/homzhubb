import React from 'react';
import { Button, I18nManager, Platform, StyleSheet, Text, View } from 'react-native';
import { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';
import RNRestart from 'react-native-restart';
import { I18nService } from '@homzhub/common/src//services/Localization/i18nextService';

const Welcome = ({ t }: { t: TFunction }): React.ReactElement => {
  const onPress = (): void => {
    I18nManager.forceRTL(!I18nService.isRTL());
    if (Platform.OS !== 'web') {
      RNRestart.Restart();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('welcome')}</Text>
      <Button title="Switch Direction" onPress={onPress} />
    </View>
  );
};

const HOC = withTranslation()(Welcome);
export { HOC as Welcome };

const color = '#20b2aa';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color,
    fontFamily: 'OpenSans-Bold',
  },
});
