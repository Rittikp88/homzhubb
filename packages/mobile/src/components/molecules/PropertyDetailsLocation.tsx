import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components';

interface IProps {
  propertyName: string;
  propertyAddress: string;
  onNavigate: () => void;
}

type Props = IProps & WithTranslation;

const PropertyDetailsLocation = (props: Props): React.ReactElement => {
  const { t, propertyName, propertyAddress, onNavigate } = props;
  const navigateToMaps = (): void => {
    onNavigate();
  };

  return (
    <View style={styles.locationContainer}>
      <View style={styles.icon}>
        <Icon name="location" size={30} color={theme.colors.warning} />
      </View>
      <View style={styles.address}>
        <Label type="large" textType="semiBold">
          {propertyName}
        </Label>
        <Label type="regular" textType="regular" style={styles.addressPadding}>
          {propertyAddress}
        </Label>
      </View>
      <View style={styles.navigation}>
        <Label type="large" textType="semiBold" style={styles.label} onPress={navigateToMaps}>
          {t('common:change')}
        </Label>
      </View>
    </View>
  );
};

const HOC = withTranslation()(PropertyDetailsLocation);
export { HOC as PropertyDetailsLocation };

const styles = StyleSheet.create({
  locationContainer: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: theme.colors.white,
    margin: theme.layout.screenPadding,
  },
  icon: {
    flex: 1,
    backgroundColor: theme.colors.darkTint5,
    opacity: 0.1,
    marginRight: 10,
  },
  navigation: {
    flex: 1,
  },
  address: {
    flex: 5,
  },
  addressPadding: {
    paddingTop: 10,
  },
  label: {
    color: theme.colors.primaryColor,
  },
});
