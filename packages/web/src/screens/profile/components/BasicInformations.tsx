import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { IProp } from '@homzhub/web/src/screens/profile/components/ProfilePhoto';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const BasicInformations: FC<IProp> = (props: IProp) => {
  const { t } = useTranslation();
  const { userProfileInfo } = props;
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  if (!userProfileInfo) {
    return null;
  }
  const { basicDetailsArray } = userProfileInfo;
  // TODO :  Email verification - Shagun
  const details = (): React.ReactNode => {
    return basicDetailsArray?.map((item, index) => {
      return (
        <View key={index}>
          <View style={styles.userContent}>
            <View style={styles.rowStyle}>
              <Icon size={20} name={item.icon} color={theme.colors.darkTint4} />
              <Label type="large" style={styles.text}>
                {item.text || item.helperText}
              </Label>
            </View>
            {item.type === 'EMAIL' &&
              (item.emailVerified ? (
                <Icon size={20} name={icons.doubleCheck} color={theme.colors.completed} />
              ) : (
                <Icon size={20} name={icons.filledWarning} color={theme.colors.error} />
              ))}
          </View>

          {item.type === 'EMAIL' && !item.emailVerified && (
            <Label type="large" style={styles.verifyMail}>
              {t('moreProfile:verifyYourEmailText')}
            </Label>
          )}
        </View>
      );
    });
  };
  return (
    <View style={[styles.container, isTablet && styles.tabContainer]}>
      <View style={[styles.innerContainer, isMobile && styles.innerContainerMob, isTablet && styles.innerContainerTab]}>
        <View style={styles.heading}>
          <Text type="small" textType="semiBold">
            {t('moreProfile:basicDetails')}
          </Text>

          <Icon size={20} name={icons.noteBook} color={theme.colors.primaryColor} />
        </View>
        <View>{details()}</View>
        {!isTablet && <Divider containerStyles={styles.divider} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
  },
  tabContainer: {
    height: 353,
  },
  innerContainer: {
    marginHorizontal: 24,
  },
  innerContainerMob: {
    marginHorizontal: 16,
  },
  innerContainerTab: {
    top: 16,
  },
  divider: {
    marginVertical: 24,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verifyMail: {
    marginLeft: 30,
    color: theme.colors.primaryColor,
  },
  userContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  rowStyle: {
    flexDirection: 'row',
  },
  text: {
    marginLeft: 10,
  },
});
export default BasicInformations;
