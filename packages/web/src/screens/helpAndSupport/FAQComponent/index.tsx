import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { SearchField } from '@homzhub/web/src/components/atoms/SearchField';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import FAQCards from '@homzhub/web/src/screens/helpAndSupport/FAQComponent/FAQCards';
import HaveAnyQuestionsForm from '@homzhub/web/src/screens/HelpAndSupportForm/HaveAnyQuestionsForm';

const FAQComponent = (): React.ReactElement => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const onChange = (text: string): void => {
    setSearchText(text);
  };
  return (
    <View style={styles.container}>
      <View style={styles.child1}>
        <View style={styles.header}>
          <Text type="regular" textType="semiBold" style={styles.headerTitle}>
            {t('helpAndSupport:FAQ')}
          </Text>
          <SearchField
            placeholder={t('property:search')}
            value={searchText}
            updateValue={onChange}
            containerStyle={styles.searchBar}
          />
        </View>
        <View style={styles.title}>
          <Text type="small" textType="semiBold" style={styles.text}>
            {t('helpAndSupport:general')}
          </Text>
        </View>
        <FAQCards />
        <FAQCards />
        <FAQCards />
        <View style={styles.title}>
          <Text type="small" textType="semiBold" style={styles.text}>
            {t('property:payment')}
          </Text>
        </View>
        <FAQCards />
        <FAQCards />
        <FAQCards />
        <View style={styles.title}>
          <Text type="small" textType="semiBold" style={styles.text}>
            {t('helpAndSupport:categoryName')}
          </Text>
        </View>
        <FAQCards />
        <FAQCards />
        <FAQCards />
      </View>
      <View style={styles.child2}>
        <HaveAnyQuestionsForm />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  child1: {
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    padding: 20,
    flex: 2,
  },
  child2: {
    flex: 1,
  },
  title: {
    flexDirection: 'row',
    margin: 8,
    marginLeft: 20,
    marginTop: 40,
  },
  searchBar: {
    height: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  text: {
    color: theme.colors.blueTint6,
  },
  headerTitle: {
    color: theme.colors.darkTint1,
  },
});
export default FAQComponent;
