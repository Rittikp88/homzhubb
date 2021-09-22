import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { SearchBar } from '@homzhub/common/src/components/molecules/SearchBar';
import SocietyInfoCard from '@homzhub/common/src/components/molecules/SocietyInfoCard';
import { Society } from '@homzhub/common/src/domain/models/Society';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface ISocietyListProp {
  onSelectSociety: () => void;
  onUpdateSociety?: (value: boolean) => void; // To handle Add new society flow if there is no existing society
}

const SocietyList = ({ onSelectSociety, onUpdateSociety }: ISocietyListProp): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.propertyPayment);
  const societies = useSelector(PropertyPaymentSelector.getSocieties);
  const [searchValue, setSearchValue] = useState('');

  const getFormattedSocieties = (): Society[] => {
    if (searchValue) {
      const response = societies.filter(
        (item) => item.name.includes(searchValue) || item.societyBankInfo.beneficiaryName.includes(searchValue)
      );
      if (onUpdateSociety) {
        onUpdateSociety(response.length < 1);
      }
      // Sorting in Alphabetical order
      return response.sort();
    }

    if (onUpdateSociety) {
      onUpdateSociety(societies.length < 1);
    }
    // Sorting in Alphabetical order
    return societies.sort();
  };

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
      {getFormattedSocieties().length > 0 ? (
        getFormattedSocieties().map((item, index) => {
          return (
            <TouchableOpacity key={index} onPress={onSelectSociety}>
              <SocietyInfoCard society={item} />
            </TouchableOpacity>
          );
        })
      ) : (
        <EmptyState
          containerStyle={styles.emptyContainer}
          fieldType="label"
          textType="large"
          title={t('emptySocietyList')}
        />
      )}
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
