import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';

const Footer: FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.leftOptionsFooter}>
        <Label type="large" textType="regular" style={styles.copyrightText}>
          {t('copyrightContent')}
        </Label>
        <Label type="large" textType="semiBold" style={styles.linkText}>
          {t('homzhubLink')}
        </Label>
      </View>
      <View style={styles.rightOptionsFooter}>
        <View style={styles.optionTerm}>
          <Label type="large" textType="semiBold" style={styles.linkText}>
            {t('terms')}
          </Label>
        </View>
        <View style={styles.optionPrivacy}>
          <Label type="large" textType="semiBold" style={styles.linkText}>
            {t('privacy')}
          </Label>
        </View>
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    border: `1px solid ${theme.colors.darkTint9}`,
    paddingVertical: '2%',
    paddingHorizontal: '3%',
  },
  leftOptionsFooter: {
    flex: 8,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  copyrightText: {
    color: theme.colors.darkTint6,
  },
  linkText: {
    color: theme.colors.blue,
  },
  rightOptionsFooter: {
    flex: 4,
    flexDirection: 'row',
  },
  optionTerm: {
    flex: 2,
    alignItems: 'flex-end',
    paddingLeft: '20%',
  },
  optionPrivacy: {
    flex: 2,
    alignItems: 'flex-end',
    paddingRight: '20%',
  },
});
