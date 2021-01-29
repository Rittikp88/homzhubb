import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { SearchField } from '@homzhub/web/src/components/atoms/SearchField';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import FAQCards from '@homzhub/web/src/screens/helpAndSupport/FAQComponent/FAQCards';
import HaveAnyQuestionsForm from '@homzhub/web/src/screens/helpAndSupport/HaveAnyQuestionsForm';

const FAQComponent = (): React.ReactElement => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const styles = FAQComponentStyle(isMobile, isTablet);
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

interface IFAQComponentStyle {
  container: ViewStyle;
  child1: ViewStyle;
  child2: ViewStyle;
  title: ViewStyle;
  searchBar: ViewStyle;
  header: ViewStyle;
  text: ViewStyle;
  headerTitle: ViewStyle;
}

const FAQComponentStyle = (isMobile: boolean, isTablet: boolean): StyleSheet.NamedStyles<IFAQComponentStyle> =>
  StyleSheet.create<IFAQComponentStyle>({
    container: {
      flexDirection: isTablet ? 'column' : 'row',
    },
    child1: {
      borderRadius: 4,
      backgroundColor: theme.colors.white,
      padding: 12,
      flex: 2,
    },
    child2: {
      flex: 1,
    },
    title: {
      flexDirection: 'row',
      margin: 8,
      marginLeft: 20,
      marginTop: 28,
    },
    searchBar: {
      height: 32,
      marginTop: isMobile ? 12 : 0,
    },
    header: {
      flexDirection: isMobile ? 'column' : 'row',
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
