import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { SearchBar } from '@homzhub/common/src/components/molecules/SearchBar';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const SocietyList = (): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.propertyPayment);
  const [searchValue, setSearchValue] = useState('');

  return (
    <View style={styles.container}>
      <Label type="large" textType="semiBold">
        {t('chooseSociety')}
      </Label>
      <SearchBar
        placeholder={t('searchSociety')}
        value={searchValue}
        updateValue={setSearchValue}
        containerStyle={styles.searchContainer}
        searchBarStyle={styles.searchBar}
        iconStyle={styles.icon}
      />
      <EmptyState
        containerStyle={styles.emptyContainer}
        fieldType="label"
        textType="large"
        title={t('emptySocietyList')}
      />
    </View>
  );
};

export default SocietyList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  searchContainer: {
    marginVertical: 16,
  },
  searchBar: {
    height: 30,
    paddingHorizontal: 0,
  },
  icon: {
    marginEnd: 0,
  },
  emptyContainer: {
    marginVertical: 80,
  },
});
