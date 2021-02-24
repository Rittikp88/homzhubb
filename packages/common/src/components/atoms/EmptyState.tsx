import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, IButtonProps } from '@homzhub/common/src/components/atoms/Button';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  icon?: string;
  title?: string;
  iconSize?: number;
  subTitle?: string;
  isIconRequired?: boolean;
  buttonProps?: IButtonProps;
  containerStyle?: StyleProp<ViewStyle>;
}

export const EmptyState = (props: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const {
    isIconRequired = true,
    icon = icons.search,
    iconSize = 30,
    title = t('common:noResultsFound'),
    subTitle,
    buttonProps,
    containerStyle,
  } = props;
  return (
    <View style={[styles.noDataContainer, containerStyle]}>
      {isIconRequired && <Icon name={icon} size={iconSize} color={theme.colors.disabledSearch} />}
      <Text type="small" textType="semiBold" style={styles.noResultsFound}>
        {title}
      </Text>
      {!!subTitle && (
        <Label type="large" textType="semiBold" style={styles.subTitle}>
          {subTitle}
        </Label>
      )}
      {buttonProps && <Button {...buttonProps} />}
    </View>
  );
};

const styles = StyleSheet.create({
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
    backgroundColor: theme.colors.white,
  },
  noResultsFound: {
    marginVertical: 16,
    textAlign: 'center',
    color: theme.colors.darkTint6,
  },
  subTitle: {
    textAlign: 'center',
    color: theme.colors.darkTint8,
  },
});
