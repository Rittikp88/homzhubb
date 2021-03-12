import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PropertiesView from '@homzhub/web/src/screens/searchProperty/components/PropertiesView';
import { PopupProps } from 'reactjs-popup/dist/types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button, IButtonProps } from '@homzhub/common/src/components/atoms/Button';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import MoreFilters from '@homzhub/web/src//screens/searchProperty/components/MoreFilter';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IState } from '@homzhub/common/src/modules/interfaces';

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

interface IStateProps {
  properties: AssetSearch;
  filters: IFilter;
}

interface IDispatchProps {
  getProperties: () => void;
  getFilterDetails: (payload: IFilter) => void;
}

interface IProps {
  property: Asset[];
}

type SearchPropertyProps = IStateProps & IDispatchProps;

const SearchProperty = (props: SearchPropertyProps): React.ReactElement | null => {
  const [isListView, setIsListView] = useState(false);
  const toggleGridView = (): void => {
    setIsListView(false);
  };
  const toggleListView = (): void => {
    setIsListView(true);
  };
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();
  const { properties } = props;
  const buttonTitle = t('propertySearch:resetFilters');
  const empyStateButtonProps = (): IButtonProps => ({
    title: buttonTitle,
    titleStyle: styles.reset,
    textSize: 'small',
    fontType: 'semiBold',
    type: 'text',
  });
  if (!properties) {
    return null;
  }

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

      {properties.results.length > 0 ? (
        <PropertiesView isListView={isListView} property={properties} />
      ) : (
        <View style={styles.emptyState}>
          <EmptyState
            textType="regular"
            textStyle={styles.emptyStateTextStyle}
            containerStyle={styles.emptyStateContainer}
            iconSize={20}
            title={t('propertySearch:noResultsTitle')}
            subTitle={t('propertySearch:noResultsSubTitle')}
            buttonProps={empyStateButtonProps()}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
  reset: {
    flex: 0,
    borderWidth: 0,
    color: theme.colors.primaryColor,
    alignSelf: 'center',
  },
  emptyState: {
    height: 400,
    marginTop: 20,
  },
  emptyStateContainer: {
    backgroundColor: theme.colors.background,
  },
  emptyStateTextStyle: {
    color: theme.colors.darkTint3,
  },
});

const mapStateToProps = (state: IState): IStateProps => {
  const { getProperties, getFilters } = SearchSelector;
  return {
    properties: getProperties(state),
    filters: getFilters(state),
  };
};

export default connect(mapStateToProps, null)(SearchProperty);
