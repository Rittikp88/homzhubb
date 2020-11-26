import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { SearchField } from '@homzhub/web/src/components/atoms/SearchField';

// todo: (bishal) - fix logo svg
const Navbar = (): React.ReactElement => {
  const { t } = useTranslation();
  const [SearchText, setSearchText] = useState('');

  const onChange = (text: string): void => {
    setSearchText(text);
  };
  return (
    <View style={styles.containerNavbar}>
      <View style={styles.navbarLogo}>LOGO GOES HERE</View>
      <View style={styles.navbarSearch}>
        <SearchField placeholder={t('property:searchInWeb')} value={SearchText} updateValue={onChange} />
      </View>
      <View style={styles.navbarFunctions}>
        <View style={styles.navbarFunctionsInner}>
          <Icon name={icons.headset} size={22} style={styles.Icon} />
          <Text type="small" style={styles.Text} textType="regular" minimumFontScale={0.5}>
            {t('assetMore:support')}
          </Text>
        </View>
        <View style={styles.navbarFunctionsInner}>
          <Icon name={icons.refer} size={22} style={styles.Icon} />

          <Text type="small" textType="regular" style={styles.Text} minimumFontScale={0.5}>
            {t('assetMore:refer')}
          </Text>
        </View>
        <View style={styles.navbarFunctionsInner}>
          {/** TODO: Replace name once login API integrated * */}
          <Avatar fullName={t('User')} isOnlyAvatar />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerNavbar: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: '7%',
    paddingRight: '7%',
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1200,
  },
  navbarLogo: {
    marginRight: 16,
  },

  navbarSearch: {
    flex: 3,
  },
  navbarFunctions: {
    flexDirection: 'row',
    flex: 2,
  },
  navbarFunctionsInner: {
    marginRight: '5px',
    marginLeft: '10px',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Text: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    color: theme.colors.darkTint4,
  },
  Icon: {
    margin: 12,
  },
});

export default Navbar;
