import React, { useRef, useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Clipboard from '@react-native-community/clipboard';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import Whatsapp from '@homzhub/common/src/assets/images/whatsapp.svg';
import ReferEarnIcon from '@homzhub/common/src/assets/images/referEarn.svg';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';
import { AnimatedProfileHeader } from '@homzhub/mobile/src/components';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { DynamicLinkParamKeys, DynamicLinkTypes, RouteTypes } from '@homzhub/mobile/src/services/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';

type Props = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.ReferEarn>;

const ReferEarn = (props: Props): React.ReactElement => {
  const { navigation } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetMore);
  const code = useSelector(UserSelector.getReferralCode);
  const url = useRef('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    LinkingService.buildShortLink(
      DynamicLinkTypes.Referral,
      `${DynamicLinkParamKeys.ReferralCode}=${code}&${DynamicLinkParamKeys.RouteType}=${RouteTypes.Public}`
    ).then((link) => {
      url.current = `${t('shareHomzhub')} ${link}`;
      setLoading(false);
    });
  }, [code, t]);

  const onCopyToClipboard = useCallback((): void => {
    Clipboard.setString(code);
    AlertHelper.info({ message: t('copiedCode') });
  }, [code, t]);

  const onShare = useCallback(async (): Promise<void> => {
    await Share.share({ message: url.current });
  }, []);

  const onMail = useCallback(async (): Promise<void> => {
    await LinkingService.openEmail({ body: url.current, subject: t('shareHomzhubSubject') });
  }, [t]);

  const onSms = useCallback(async (): Promise<void> => {
    await LinkingService.openSMS({ message: url.current });
  }, []);

  const onWhatsapp = useCallback(async (): Promise<void> => {
    await LinkingService.openWhatsapp(url.current);
  }, []);

  const data = useRef([
    {
      title: t('common:whatsapp'),
      icon: 'w',
      onPress: onWhatsapp,
    },
    {
      title: t('common:sms'),
      icon: icons.sms,
      onPress: onSms,
    },
    {
      title: t('common:mail'),
      icon: icons.envelope,
      onPress: onMail,
    },
    {
      title: t('common:share'),
      icon: icons.shareFilled,
      onPress: onShare,
    },
  ]);

  return (
    <AnimatedProfileHeader
      title={t('more')}
      sectionHeader={t('refer')}
      onBackPress={navigation.goBack}
      sectionTitleType="semiBold"
      loading={loading}
    >
      <View style={styles.container}>
        <ReferEarnIcon style={styles.icon} />
        <Text type="small" textType="semiBold" style={styles.refer}>
          {t('referMore')}
        </Text>
        <Text type="large" textType="semiBold" style={styles.reward}>
          {t('getRewarded')}
        </Text>
        <Label type="regular" style={styles.copy}>
          {t('clickCopy')}
        </Label>
        <TouchableOpacity activeOpacity={0.5} onPress={onCopyToClipboard} style={styles.touchContainer}>
          <View style={styles.dashed}>
            <Label type="large" style={styles.codeText}>
              {t('refCode')}
            </Label>
            <Label type="large" textType="semiBold" style={styles.code}>
              {code}
            </Label>
          </View>
        </TouchableOpacity>
        <Label type="large" textType="semiBold" style={styles.friend}>
          {t('refWith')}
        </Label>
        <View style={styles.shareContainer}>
          {data.current.map((item) => (
            <TouchableOpacity key={item.title} style={styles.shareOption} activeOpacity={0.5} onPress={item.onPress}>
              {item.icon === 'w' ? <Whatsapp /> : <Icon name={item.icon} size={24} color={theme.colors.active} />}
              <Label type="regular" style={styles.shareText}>
                {item.title}
              </Label>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </AnimatedProfileHeader>
  );
};

const memoizedComponent = React.memo(ReferEarn);
export { memoizedComponent as ReferEarn };

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: theme.colors.white,
  },
  shareContainer: {
    marginHorizontal: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  shareOption: {
    alignItems: 'center',
  },
  icon: {
    alignSelf: 'center',
  },
  touchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.completed,
  },
  dashed: {
    padding: 8,
    borderRadius: 4,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.white,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  refer: {
    marginTop: 24,
    marginBottom: 12,
    color: theme.colors.referGreen,
    textAlign: 'center',
  },
  reward: {
    marginBottom: 24,
    textAlign: 'center',
    color: theme.colors.active,
  },
  copy: {
    marginBottom: 8,
    textAlign: 'center',
    color: theme.colors.darkTint5,
  },
  friend: {
    marginTop: 40,
    marginBottom: 28,
    textAlign: 'center',
    color: theme.colors.darkTint4,
  },
  codeText: {
    color: theme.colors.white,
  },
  code: {
    marginStart: 24,
    color: theme.colors.white,
  },
  shareText: {
    marginTop: 8,
    textAlign: 'center',
    color: theme.colors.darkTint5,
  },
});
