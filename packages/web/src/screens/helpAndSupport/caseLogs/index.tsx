import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { SearchField } from '@homzhub/web/src/components/atoms/SearchField';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import LogsCards from '@homzhub/web/src/screens/helpAndSupport/caseLogs/logsCard';

const CaseLogsCard = (): React.ReactElement => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const onChange = (text: string): void => {
    setSearchText(text);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text type="regular" textType="semiBold" style={styles.headerTitle}>
          {t('assetDashboard:Case Logs(32)')}
        </Text>
        <SearchField
          placeholder={t('property:search')}
          value={searchText}
          updateValue={onChange}
          containerStyle={styles.searchBar}
        />
      </View>
      <LogsCards />
      <LogsCards />
      <LogsCards />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    padding: 20,
    width: 700,
  },
  searchBar: { height: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 28 },
  text: { color: theme.colors.blue },
  headerTitle: { color: theme.colors.darkTint1 },
});
export default CaseLogsCard;
