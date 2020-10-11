import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  icon?: string;
  title?: string;
}

export const EmptyState = (props: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const { icon = icons.search, title = t('common:noResultsFound') } = props;
  return (
    <View style={styles.noDataContainer}>
      <Icon name={icon} size={30} color={theme.colors.disabledSearch} />
      <Text type="small" textType="semiBold" style={styles.noResultsFound}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
    backgroundColor: theme.colors.white,
  },
  noResultsFound: {
    marginVertical: 15,
    color: theme.colors.darkTint6,
  },
});
