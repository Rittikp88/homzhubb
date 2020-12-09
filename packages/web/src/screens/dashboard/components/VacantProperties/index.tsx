import React from 'react';
import { ImageStyle, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { ImageSquare } from '@homzhub/common/src/components/atoms/Image';
import { NextPrevBtn } from '@homzhub/web/src/components';
import PropertyDetails from '@homzhub/web/src/screens/dashboard/components/VacantProperties/PropertyDetails';
import LatestUpdates from '@homzhub/web/src/screens/dashboard/components/VacantProperties/LatestUpdate';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

// todo : fix styling
const VacantProperties = (): React.ReactElement => {
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const styles = vacantPropertyStyle(isMobile, isTablet);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Icon name={icons.vacantProperty} size={30} color={theme.colors.darkTint3} style={styles.headerIcon} />
          <Text type="small" textType="regular" minimumFontScale={0.5}>
            {t('Vacant Properties')}
          </Text>
        </View>
        <View style={styles.nextPrevBtn}>
          <NextPrevBtn onBtnClick={FunctionUtils.noop} />
        </View>
      </View>
      {!isMobile && <Divider />}
      <View style={styles.mainContent}>
        <View style={styles.propertyInfo}>
          <ImageSquare
            style={styles.image}
            size={150}
            source={{
              uri:
                'https://cdn57.androidauthority.net/wp-content/uploads/2020/04/oneplus-8-pro-ultra-wide-sample-twitter-1.jpg',
            }}
          />
          <View style={styles.propertyDetails}>
            <PropertyDetails />
          </View>
        </View>
        {!isTablet && <Divider containerStyles={styles.divider} />}
        <View style={styles.latestUpdates}>
          <LatestUpdates />
        </View>
      </View>
    </View>
  );
};

interface IStyle {
  container: ViewStyle;
  header: ViewStyle;
  headerText: ViewStyle;
  headerIcon: ViewStyle;
  icon: ViewStyle;
  mainContent: ViewStyle;
  propertyInfo: ViewStyle;
  nextPrevBtn: ViewStyle;
  image: ImageStyle;
  latestUpdates: ViewStyle;
  propertyDetails: ViewStyle;
  divider: ViewStyle;
}

const vacantPropertyStyle = (isMobile: boolean, isTablet: boolean): IStyle =>
  StyleSheet.create<IStyle>({
    container: {
      padding: 20,
      marginTop: 24,
      backgroundColor: theme.colors.white,
      borderRadius: 4,
      maxHeight: isTablet ? undefined : 300,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headerText: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    headerIcon: {
      marginRight: 8,
    },
    nextPrevBtn: {
      flexDirection: 'row',
    },
    icon: { color: theme.colors.blue },
    mainContent: {
      flex: 1,
      flexDirection: isTablet ? 'column' : 'row',
    },
    propertyInfo: {
      flexDirection: isMobile ? 'column' : 'row',
    },
    image: {
      minWidth: 200,
      maxWidth: isMobile ? 250 : 330,
      maxHeight: isTablet ? undefined : isMobile ? 110 : 150,
      alignSelf: 'flex-start',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      margin: isMobile ? 0 : 12,
    },
    latestUpdates: {
      margin: 20,
    },
    propertyDetails: {
      width: 300,
    },
    divider: {
      height: 250,
    },
  });

export default VacantProperties;
