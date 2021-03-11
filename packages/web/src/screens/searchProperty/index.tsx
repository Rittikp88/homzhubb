import React, { FC, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PropertiesView from '@homzhub/web/src/screens/searchProperty/components/PropertiesView';
import { PopupProps } from 'reactjs-popup/dist/types';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import MoreFilters from '@homzhub/web/src//screens/searchProperty/components/MoreFilter';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

// TODO : Replace Dummy Data with Api Data;

const defaultDropDownProps = (isMobile: boolean): PopupProps => ({
  position: 'bottom left',
  arrow: false,
  contentStyle: {
    minWidth: 10,
    marginTop: '-8px',
    width: '92%',
    height: 536,
    overflow: 'auto',
    marginRight: isMobile ? 10 : undefined,
  },
  closeOnDocumentClick: false,
  children: undefined,
});
const SearchProperty: FC = () => {
  const [isListView, setIsListView] = useState(false);
  const toggleGridView = (): void => {
    setIsListView(false);
  };
  const toggleListView = (): void => {
    setIsListView(true);
  };
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();
  return (
    <View style={styles.mainContainer}>
      <Popover content={<MoreFilters />} popupProps={defaultDropDownProps(isMobile)}>
        <View>
          <Button
            type="secondary"
            title={t('assetMore:more')}
            containerStyle={styles.moreButton}
            titleStyle={styles.moreButtonTitle}
            icon={icons.downArrow}
            iconSize={20}
            iconColor={theme.colors.blue}
          />
        </View>
      </Popover>

      <View style={styles.sortAndToggleButtons}>
        <View>Filters Here</View>
        <View style={styles.toggleButtons}>
          <Icon
            name={icons.grid}
            onPress={toggleGridView}
            size={22}
            color={isListView ? theme.colors.disabled : theme.colors.primaryColor}
            style={styles.toggleIcons}
          />
          <Icon
            name={icons.doubleBar}
            onPress={toggleListView}
            size={22}
            color={!isListView ? theme.colors.disabled : theme.colors.primaryColor}
            style={styles.toggleIcons}
          />
        </View>
      </View>

      <PropertiesView isListView={isListView} />
    </View>
  );
};

export default SearchProperty;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
  },
  sortAndToggleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleButtons: {
    flexDirection: 'row',
  },
  toggleIcons: {
    marginHorizontal: 10,
  },
  cardMobile: {
    width: '100%',
    marginLeft: 0,
  },
  cardTablet: {
    width: '47%',
  },
  moreButton: {
    width: 80,
    height: 31,
    backgroundColor: theme.colors.lightGrayishBlue,
    marginTop: 60,
    flexDirection: 'row',
  },
  moreButtonTitle: {
    alignItems: 'center',
    textAlign: 'center',
    marginVertical: 3,
    marginHorizontal: 6,
  },
});
