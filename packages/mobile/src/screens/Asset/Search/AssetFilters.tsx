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
import { AdvancedFilters } from '@homzhub/common/src/mocks/AssetAdvancedFilters';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { SearchStackParamList } from '@homzhub/mobile/src/navigation/SearchStack';
import {
  Button,
  CheckboxGroup,
  Dropdown,
  ICheckboxGroupData,
  RNSwitch,
  SelectionPicker,
  Text,
  WithShadowView,
} from '@homzhub/common/src/components';
import { BottomSheet, ButtonGroup } from '@homzhub/mobile/src/components';
import { MultipleButtonGroup } from '@homzhub/mobile/src/components/molecules/MultipleButtonGroup';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { FurnishingType } from '@homzhub/common/src/domain/models/LeaseTerms';

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
  isFacingToggled: boolean;
  isFurnishingToggled: boolean;
  isPropertyAmenitiesToggled: boolean;
  data: any; // TODO: to be removed once the data is coming from props
}

type libraryProps = WithTranslation & NavigationScreenProps<SearchStackParamList, ScreensKeys.PropertyFilters>;
type Props = libraryProps & IStateProps & IDispatchProps;

class AssetFilters extends React.PureComponent<Props, IAssetFiltersState> {
  /*eslint-disable */
  private FURNISHING = [
    { title: this.props.t('property:fullyFurnished'), value: FurnishingType.FULL },
    { title: this.props.t('property:semiFurnished'), value: FurnishingType.SEMI },
    { title: this.props.t('property:none'), value: FurnishingType.NONE },
  ];
  /* eslint-enable */

  public state = {
    agentListed: false,
    showVerified: false,
    isFacingToggled: false,
    isFurnishingToggled: false,
    isPropertyAmenitiesToggled: false,
    data: AdvancedFilters,
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
              {this.renderFacing()}
              {this.renderFurnishing()}
              {this.renderPropertyAmenities()}
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
    const {
      data: { searchRadius },
    } = this.state;
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t('searchRadius')}
        </Text>
        <Dropdown
          data={searchRadius}
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
    const {
      data: { dateAdded },
    } = this.state;
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t('dateAdded')}
        </Text>
        <Dropdown
          data={dateAdded}
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
    const {
      data: { propertyAge },
    } = this.state;
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t('propertyAge')}
        </Text>
        <Dropdown
          data={propertyAge}
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

  public renderFacing = (): React.ReactElement => {
    const { t } = this.props;
    const {
      data: { facing },
      isFacingToggled,
    } = this.state;
    const toggleFacing = (): void => this.setState({ isFacingToggled: !isFacingToggled });
    const handleFacingSelection = (): void => {};
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t('facing', { totalFacing: 2 })}
        </Text>
        <View style={styles.moreRow}>
          <MultipleButtonGroup<number>
            data={facing.slice(0, 4)}
            onItemSelect={handleFacingSelection}
            selectedItem={[1, 2]}
          />
          <Text type="small" textType="semiBold" style={styles.selectAmenity} onPress={toggleFacing}>
            {t('common:more')}
          </Text>
        </View>
        {isFacingToggled && (
          <BottomSheet
            isShadowView
            sheetHeight={theme.viewport.height / 2}
            headerTitle={t('selectFacing')}
            visible={isFacingToggled}
            onCloseSheet={toggleFacing}
          >
            <ScrollView style={styles.flexOne}>{this.renderFacingData()}</ScrollView>
          </BottomSheet>
        )}
      </>
    );
  };

  public renderFacingData = (): React.ReactElement => {
    const {
      data: { facing },
    } = this.state;
    const checkboxGroupData = (): ICheckboxGroupData[] => {
      return facing.map((facingType: { title: string; value: number }) => ({
        id: facingType.value,
        label: facingType.title,
        isSelected: false,
      }));
    };
    return (
      <CheckboxGroup
        data={checkboxGroupData()}
        onToggle={this.onSelectedFacing}
        containerStyle={styles.checkboxGroupContainer}
      />
    );
  };

  public renderFurnishing = (): React.ReactElement => {
    const { t } = this.props;
    const { isFurnishingToggled } = this.state;
    const toggleFurnishing = (): void => this.setState({ isFurnishingToggled: !isFurnishingToggled });
    const handleFurnishingSelection = (): void => {};
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t('furnishing', { totalFurnishing: 2 })}
        </Text>
        <View style={styles.moreRow}>
          <ButtonGroup<FurnishingType>
            data={this.FURNISHING}
            onItemSelect={handleFurnishingSelection}
            selectedItem={FurnishingType.FULL}
          />
          <Text type="small" textType="semiBold" style={styles.selectAmenity} onPress={toggleFurnishing}>
            {t('common:more')}
          </Text>
        </View>
        {isFurnishingToggled && (
          <BottomSheet
            isShadowView
            sheetHeight={theme.viewport.height / 2}
            headerTitle={t('selectFurnishing')}
            visible={isFurnishingToggled}
            onCloseSheet={toggleFurnishing}
          >
            <ScrollView style={styles.flexOne}>{this.renderFurnishingData()}</ScrollView>
          </BottomSheet>
        )}
      </>
    );
  };

  public renderFurnishingData = (): React.ReactElement => {
    const {
      data: { furnishing },
    } = this.state;
    const checkboxGroupData = (): ICheckboxGroupData[] => {
      return furnishing.map((furnishingType: { label: string; value: number }) => ({
        id: furnishingType.value,
        label: furnishingType.label,
        isSelected: false,
      }));
    };
    return (
      <CheckboxGroup
        data={checkboxGroupData()}
        onToggle={this.onSelectedFurnishing}
        containerStyle={styles.checkboxGroupContainer}
      />
    );
  };

  public renderPropertyAmenities = (): React.ReactElement => {
    const { t } = this.props;
    const { isPropertyAmenitiesToggled } = this.state;
    const toggleAmenities = (): void => this.setState({ isPropertyAmenitiesToggled: !isPropertyAmenitiesToggled });
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t('propertyAmenities', { totalAmenities: 2 })}
        </Text>
        <Text type="small" textType="semiBold" style={styles.selectAmenity} onPress={toggleAmenities}>
          {t('common:select')}
        </Text>
        {isPropertyAmenitiesToggled && (
          <BottomSheet
            isShadowView
            sheetHeight={theme.viewport.height / 2}
            headerTitle={t('selectAmenities')}
            visible={isPropertyAmenitiesToggled}
            onCloseSheet={toggleAmenities}
          >
            <ScrollView style={styles.flexOne}>{this.renderAmenitiesData()}</ScrollView>
          </BottomSheet>
        )}
      </>
    );
  };

  public renderAmenitiesData = (): React.ReactElement => {
    const {
      data: { propertyAmenities },
    } = this.state;
    const checkboxGroupData = (): ICheckboxGroupData[] => {
      return propertyAmenities.map((amenityType: { label: string; value: number }) => ({
        id: amenityType.value,
        label: amenityType.label,
        isSelected: false,
      }));
    };
    return (
      <CheckboxGroup
        data={checkboxGroupData()}
        onToggle={this.onSelectedAmenities}
        containerStyle={styles.checkboxGroupContainer}
      />
    );
  };

  public renderShowVerified = (): React.ReactElement => {
    const { t } = this.props;
    const { showVerified } = this.state;
    const updateVerified = (): void => this.setState({ showVerified: !showVerified });
    return (
      <View style={styles.toggleButton}>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
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
        <Text type="small" textType="semiBold" style={styles.agentListed}>
          {t('agentListed')}
        </Text>
        <RNSwitch selected={agentListed} onToggle={updateAgentListed} />
      </View>
    );
  };

  public onReset = (): void => {};

  public onSelectedAmenities = (id: number, isSelected: boolean): void => {};

  public onSelectedFacing = (id: number, isSelected: boolean): void => {};

  public onSelectedFurnishing = (id: number, isSelected: boolean): void => {};

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
    color: theme.colors.darkTint3,
  },
  agentListed: {
    color: theme.colors.darkTint3,
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
  },
  selectAmenity: {
    color: theme.colors.primaryColor,
  },
  moreRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxGroupContainer: {
    margin: theme.layout.screenPadding,
  },
});
