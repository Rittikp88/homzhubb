import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Property from '@homzhub/common/src/assets/images/property.svg';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  containerStyle?: StyleProp<ViewStyle>;
}

export const PropertyReviewCard = ({ containerStyle }: IProps): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  return (
    <View style={[styles.container, containerStyle]}>
      <Property />
      <Text type="small" textType="semiBold" style={styles.heading}>
        {t('reviewingProperty')}
      </Text>
      <Label type="large" style={styles.subHeading}>
        {t('executivesCall')}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.reviewCardOpacity,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  heading: {
    marginTop: 12,
    color: theme.colors.darkTint3,
  },
  subHeading: {
    textAlign: 'center',
    marginTop: 6,
    color: theme.colors.darkTint3,
  },
});
