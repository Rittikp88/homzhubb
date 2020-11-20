import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { OffersVisitsSection, OffersVisitsType } from '@homzhub/common/src/components/molecules/OffersVisitsSection';
import { Text } from '@homzhub/common/src/components/atoms/Text';

const LatestUpdates = (): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text type="small" style={styles.text} textType="semiBold" minimumFontScale={0.5}>
          {t('Latest Updates')}
        </Text>
      </View>
      <OffersVisitsSection
        values={{
          [OffersVisitsType.offers]: [3000, 2000, 1200],
          [OffersVisitsType.visits]: [5, 7, 5],
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  textContainer: {
    marginTop: -20,
    marginBottom: 10,
  },
  text: {
    fontWeight: '600',
    color: theme.colors.darkTint4,
  },
});

export default LatestUpdates;
