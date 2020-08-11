import React from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { RootStackParamList } from '@homzhub/mobile/src/navigation/SearchStackNavigator';
import { Button, Dropdown, RNSwitch, SelectionPicker, Text, WithShadowView } from '@homzhub/common/src/components';
import { IFilter } from '@homzhub/common/src/domain/models/Search';

interface IStateProps {
  filters: IFilter;
}

// TODO: set the filter arguments type
interface IDispatchProps {
  setFilter: (payload: any) => void;
  setInitialState: () => void;
}

interface IAssetFiltersState {
  agentListed: boolean;
  showVerified: boolean;
}

type libraryProps = WithTranslation & NavigationScreenProps<RootStackParamList, ScreensKeys.PropertyFilters>;
type Props = libraryProps & IStateProps & IDispatchProps;

class AssetFilters extends React.PureComponent<Props, IAssetFiltersState> {
  public state = {
    agentListed: false,
    showVerified: false,
  };

  public render(): React.ReactElement {
    const { t } = this.props;
    return (
      <>
        <StatusBar translucent backgroundColor={theme.colors.white} barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.flexOne}>
            <View style={styles.screen}>
              <View style={styles.header}>
                <Icon name={icons.leftArrow} size={18} color={theme.colors.darkTint3} onPress={this.goBack} />
                <Text type="small" textType="semiBold">
                  {t('filters')}
                </Text>
                <Text type="small" textType="semiBold" onPress={this.onReset} style={styles.reset}>
                  {t('reset')}
                </Text>
              </View>
              {this.renderTransactionType()}
              {this.renderSearchRadius()}
              {this.renderDateAdded()}
              {this.renderPropertyAge()}
              {this.renderMoveInDate()}
              {this.renderShowVerified()}
              {this.renderAgentListed()}
            </View>
          </ScrollView>
          <WithShadowView outerViewStyle={styles.shadowView}>
            <Button
              type="primary"
              title="Show Properties"
              containerStyle={styles.buttonStyle}
              onPress={this.onShowProperties}
            />
          </WithShadowView>
        </SafeAreaView>
      </>
    );
  }

  public renderTransactionType = (): React.ReactElement => {
    const {
      t,
      filters: { asset_transaction_type },
    } = this.props;
    const transactionData = [
      { title: t('rent'), value: 0 },
      { title: t('buy'), value: 1 },
    ];
    return (
      <SelectionPicker
        data={transactionData}
        selectedItem={[asset_transaction_type]}
        onValueChange={this.onToggleTransactionType}
      />
    );
  };

  public renderSearchRadius = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t('searchRadius')}
        </Text>
        <Dropdown
          data={[]}
          value={0}
          listTitle={t('selectSearchRadius')}
          placeholder={t('selectRadius')}
          listHeight={theme.viewport.height / 2}
          onDonePress={this.onSelectSearchRadius}
          iconSize={16}
          iconColor={theme.colors.darkTint7}
          containerStyle={styles.dropdownContainer}
        />
      </>
    );
  };

  public renderDateAdded = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t('dateAdded')}
        </Text>
        <Dropdown
          data={[]}
          value={0}
          listTitle={t('selectDateAdded')}
          placeholder={t('selectDateAdded')}
          listHeight={theme.viewport.height / 2}
          onDonePress={this.onSelectDateAdded}
          iconSize={16}
          iconColor={theme.colors.darkTint7}
          containerStyle={styles.dropdownContainer}
        />
      </>
    );
  };

  public renderPropertyAge = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t('propertyAge')}
        </Text>
        <Dropdown
          data={[]}
          value={0}
          listTitle={t('selectPropertyAge')}
          placeholder={t('selectPropertyAge')}
          listHeight={theme.viewport.height / 2}
          onDonePress={this.onSelectPropertyAge}
          iconSize={16}
          iconColor={theme.colors.darkTint7}
          containerStyle={styles.dropdownContainer}
        />
      </>
    );
  };

  public renderMoveInDate = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t('expectedMoveInDate')}
        </Text>
        <Dropdown
          data={[]}
          value={0}
          listTitle={t('availableFrom')}
          placeholder={t('selectMoveInDate')}
          listHeight={theme.viewport.height / 2}
          onDonePress={this.onSelectPropertyAge}
          iconSize={16}
          iconColor={theme.colors.darkTint7}
          containerStyle={styles.dropdownContainer}
        />
      </>
    );
  };

  public renderShowVerified = (): React.ReactElement => {
    const { t } = this.props;
    const { showVerified } = this.state;
    const updateVerified = (): void => this.setState({ showVerified: !showVerified });
    return (
      <View style={styles.toggleButton}>
        <Text type="small" textType="semiBold">
          {t('showVerified')}
        </Text>
        <RNSwitch selected={showVerified} onToggle={updateVerified} />
      </View>
    );
  };

  public renderAgentListed = (): React.ReactElement => {
    const { t } = this.props;
    const { agentListed } = this.state;
    const updateAgentListed = (): void => this.setState({ agentListed: !agentListed });
    return (
      <View style={styles.toggleButton}>
        <Text type="small" textType="semiBold">
          {t('agentListed')}
        </Text>
        <RNSwitch selected={agentListed} onToggle={updateAgentListed} />
      </View>
    );
  };

  public onReset = (): void => {};

  public onSelectSearchRadius = (value: string | number): void => {};

  public onSelectDateAdded = (value: string | number): void => {};

  public onSelectPropertyAge = (value: string | number): void => {};

  public onShowProperties = (): void => {};

  public onToggleTransactionType = (value: number): void => {
    const { setFilter } = this.props;
    setFilter({ asset_transaction_type: value });
  };

  public goBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getFilters } = SearchSelector;
  return {
    filters: getFilters(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setFilter, setInitialState } = SearchActions;
  return bindActionCreators(
    {
      setFilter,
      setInitialState,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.propertySearch)(AssetFilters));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  flexOne: {
    flex: 1,
  },
  screen: {
    margin: theme.layout.screenPadding,
  },
  header: {
    minHeight: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  reset: {
    flex: 0,
    borderWidth: 0,
    color: theme.colors.primaryColor,
  },
  dropdownContainer: {
    height: 45,
  },
  filterHeader: {
    paddingVertical: 20,
  },
  shadowView: {
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: theme.layout.screenPadding,
  },
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
});
