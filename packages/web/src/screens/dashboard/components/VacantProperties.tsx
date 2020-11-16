import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import PropertyDetails from '@homzhub/web/src/screens/dashboard/components/VacantProperties/PeopertyDetails';
import LatestUpdates from '@homzhub/web/src/screens/dashboard/components/VacantProperties/LatestUpdate';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { ImageSquare } from '@homzhub/common/src/components/atoms/Image';

const VacantProperties = (): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <View style={styles.Container}>
      <View style={styles.ContainerHeader}>
        <View style={styles.ContainerHeaderText}>
          <Icon name={icons.vacantProperty} size={30} color={theme.colors.darkTint3} />

          <Text type="small" textType="regular" minimumFontScale={0.5}>
            {t('Vacant Properties')}
          </Text>
        </View>
        <View style={styles.ContainerHeaderIcon}>
          <Icon name={icons.leftArrow} size={20} style={styles.Icon} />
          <Icon name={icons.rightArrow} size={20} style={styles.Icon} />
        </View>
      </View>
      <Divider />
      <View style={styles.MainContent}>
        <ImageSquare
          style={styles.image}
          size={300}
          source={{
            uri:
              'https://cdn57.androidauthority.net/wp-content/uploads/2020/04/oneplus-8-pro-ultra-wide-sample-twitter-1.jpg',
          }}
        />
        <View style={styles.PropertyDetails}>
          <PropertyDetails />
        </View>
        <Divider containerStyles={styles.Divider} />
        <View style={styles.LatestUpdates}>
          <LatestUpdates />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    padding: 20,
    marginLeft: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    maxHeight: 300,
  },
  ContainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ContainerHeaderText: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  ContainerHeaderIcon: {
    flexDirection: 'row',
  },
  Icon: { color: theme.colors.blue },
  MainContent: {
    flexDirection: 'row',
  },
  image: {
    minWidth: 200,
    maxWidth: 300,
    maxHeight: 210,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    margin: 12,
  },
  LatestUpdates: {
    margin: 20,
  },
  PropertyDetails: {
    width: 300,
  },
  Divider: {
    height: 250,
  },
});

export default VacantProperties;
