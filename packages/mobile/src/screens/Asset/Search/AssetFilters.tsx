import React from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { remove } from 'lodash';
// @ts-ignore
import Markdown from 'react-native-easy-markdown';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { AdvancedFilters, IAdvancedFilters, IFilterData } from '@homzhub/common/src/constants/AssetAdvancedFilters';
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
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';
import { BottomSheet } from '@homzhub/mobile/src/components';
import { MultipleButtonGroup } from '@homzhub/mobile/src/components/molecules/MultipleButtonGroup';
import { IFacing, IFilter, IFilterDetails, IPropertyAmenities } from '@homzhub/common/src/domain/models/Search';
import { FurnishingType } from '@homzhub/common/src/domain/models/LeaseTerms';

interface IStateProps {
  filters: IFilter;
  filterDetails: IFilterDetails | null;
}

// TODO: set the filter arguments type
interface IDispatchProps {
  setFilter: (payload: any) => void;
  setInitialState: () => void;
  getProperties: () => void;
  setInitialMiscellaneous: () => void;
}

interface IAssetFiltersState {
  isFacingToggled: boolean;
  isPropertyAmenitiesToggled: boolean;
  isShowVerifiedHelperToggled: boolean;
  isAgentListedHelperToggled: boolean;
  data: IAdvancedFilters;
}

type libraryProps = WithTranslation & NavigationScreenProps<SearchStackParamList, ScreensKeys.PropertyFilters>;
type Props = libraryProps & IStateProps & IDispatchProps;

export class AssetFilters extends React.PureComponent<Props, IAssetFiltersState> {
  /*eslint-disable */
  private FURNISHING = [
    { title: this.props.t('property:fullyFurnished'), value: FurnishingType.FULL },
    { title: this.props.t('property:semiFurnished'), value: FurnishingType.SEMI },
    { title: this.props.t('property:none'), value: FurnishingType.NONE },
  ];
  /* eslint-enable */

  public state = {
    isFacingToggled: false,
    isPropertyAmenitiesToggled: false,
    isShowVerifiedHelperToggled: false,
    isAgentListedHelperToggled: false,
    data: AdvancedFilters,
  };

  public render(): React.ReactElement {
    const {
      t,
      filters: { asset_group },
    } = this.props;
    return (
      <>
        <StatusBar translucent backgroundColor={theme.colors.white} barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          {this.renderHeader()}
          <ScrollView style={styles.flexOne}>
            <View style={styles.screen}>
              <>
                {this.renderTransactionType()}
                {this.renderShowVerified()}
                {this.renderAgentListed()}
                {this.renderSearchRadius()}
                {this.renderDateAdded()}
                {this.renderPropertyAge()}
                {asset_group === 2 && this.renderRentFreePeriod()}
                {this.renderMoveInDate()}
                {this.renderFacing()}
                {this.renderFurnishing()}
                {this.renderPropertyAmenities()}
                <WithShadowView outerViewStyle={styles.shadowView}>
                  <Button
                    type="primary"
                    title={t('showProperties')}
                    containerStyle={styles.buttonStyle}
                    onPress={this.handleSubmit}
                  />
                </WithShadowView>
              </>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }

  public renderHeader = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <View style={styles.header}>
        <Icon name={icons.leftArrow} size={18} color={theme.colors.darkTint3} onPress={this.goBack} />
        <Text type="small" textType="semiBold">
          {t('filters')}
        </Text>
        <Text type="small" textType="semiBold" style={styles.reset} onPress={this.clearForm}>
          {t('reset')}
        </Text>
      </View>
    );
  };

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

  public renderSearchRadius = (): React.ReactNode => {
    const {
      t,
      setFilter,
      filters,
      filters: {
        miscellaneous: { search_radius },
      },
    } = this.props;
    const {
      data: { searchRadius },
    } = this.state;
    const translatedSearchRadius = this.translateData(searchRadius);
    const onSelectSearchRadius = (value: string | number): void => {
      setFilter({ miscellaneous: { ...filters.miscellaneous, search_radius: value } });
    };
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t('searchRadius')}
        </Text>
        <Dropdown
          data={translatedSearchRadius}
          value={search_radius}
          listTitle={t('selectSearchRadius')}
          placeholder={t('selectRadius')}
          listHeight={theme.viewport.height / 2}
          onDonePress={onSelectSearchRadius}
          iconSize={16}
          iconColor={theme.colors.darkTint7}
          containerStyle={styles.dropdownContainer}
          numColumns={2}
          maxLabelLength={36}
        />
      </>
    );
  };

  public renderDateAdded = (): React.ReactElement => {
    const {
      t,
      setFilter,
      filters,
      filters: {
        miscellaneous: { date_added },
      },
    } = this.props;
    const {
      data: { dateAdded },
    } = this.state;
    const translatedDateAdded = this.translateData(dateAdded);
    const onSelectDateAdded = (value: string | number): void => {
      setFilter({ miscellaneous: { ...filters.miscellaneous, date_added: value } });
    };
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t('dateAdded')}
        </Text>
        <Dropdown
          data={translatedDateAdded}
          value={date_added}
          listTitle={t('selectDateAdded')}
          placeholder={t('selectDateAdded')}
          listHeight={theme.viewport.height / 2}
          onDonePress={onSelectDateAdded}
          iconSize={16}
          iconColor={theme.colors.darkTint7}
          containerStyle={styles.dropdownContainer}
          numColumns={2}
          maxLabelLength={36}
        />
      </>
    );
  };

  public renderPropertyAge = (): React.ReactElement => {
    const {
      t,
      setFilter,
      filters,
      filters: {
        miscellaneous: { property_age },
      },
    } = this.props;
    const {
      data: { propertyAge },
    } = this.state;
    const translatedPropertyAge = this.translateData(propertyAge);
    const onSelectPropertyAge = (value: string | number): void => {
      setFilter({ miscellaneous: { ...filters.miscellaneous, property_age: value } });
    };
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t('propertyAge')}
        </Text>
        <Dropdown
          data={translatedPropertyAge}
          value={property_age}
          listTitle={t('selectPropertyAge')}
          placeholder={t('selectPropertyAge')}
          listHeight={theme.viewport.height / 2}
          onDonePress={onSelectPropertyAge}
          iconSize={16}
          iconColor={theme.colors.darkTint7}
          containerStyle={styles.dropdownContainer}
          numColumns={2}
          maxLabelLength={36}
        />
      </>
    );
  };

  public renderRentFreePeriod = (): React.ReactElement => {
    const {
      t,
      setFilter,
      filters,
      filters: {
        miscellaneous: { rent_free_period },
      },
    } = this.props;
    const {
      data: { rentFreePeriod },
    } = this.state;
    const translatedRentFreePeriod = this.translateData(rentFreePeriod);
    const onSelectRentFreePeriod = (value: string | number): void => {
      setFilter({ miscellaneous: { ...filters.miscellaneous, rent_free_period: value } });
    };
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t('rentFreePeriod')}
        </Text>
        <Dropdown
          data={translatedRentFreePeriod}
          value={rent_free_period}
          listTitle={t('selectRentFreePeriod')}
          placeholder={t('selectRentFreePeriod')}
          listHeight={theme.viewport.height / 2}
          onDonePress={onSelectRentFreePeriod}
          iconSize={16}
          iconColor={theme.colors.darkTint7}
          containerStyle={styles.dropdownContainer}
          numColumns={2}
          maxLabelLength={36}
        />
      </>
    );
  };

  public renderMoveInDate = (): React.ReactElement => {
    const {
      t,
      setFilter,
      filters,
      filters: {
        miscellaneous: { expected_move_in_date },
      },
    } = this.props;
    const updateSelectedDate = (day: string): void => {
      setFilter({ miscellaneous: { ...filters.miscellaneous, expected_move_in_date: day } });
    };
    return (
      <FormCalendar
        selectedValue={expected_move_in_date}
        name="expected_move_in_date"
        label={t('expectedMoveInDate')}
        placeHolder={t('selectMoveInDate')}
        textType="text"
        textSize="small"
        fontType="semiBold"
        bubbleSelectedDate={updateSelectedDate}
      />
    );
  };

  public renderFacing = (): React.ReactElement => {
    const {
      t,
      filters: {
        miscellaneous: { facing },
      },
    } = this.props;
    const { isFacingToggled } = this.state;
    const transformedFacing = this.transformFacingData();
    const toggleFacing = (): void => this.setState({ isFacingToggled: !isFacingToggled });
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t('facing', { totalFacing: facing.length })}
        </Text>
        <View style={styles.moreRow}>
          <MultipleButtonGroup<number>
            data={transformedFacing.slice(0, 4) ?? []}
            onItemSelect={this.handleFacingSelection}
            selectedItem={facing}
          />
          {transformedFacing.length > 4 && (
            <Text type="small" textType="semiBold" style={styles.selectAmenity} onPress={toggleFacing}>
              {t('common:more')}
            </Text>
          )}
        </View>
        {isFacingToggled && (
          <BottomSheet
            isShadowView
            sheetHeight={theme.viewport.height / 2}
            headerTitle={t('selectFacing')}
            visible={isFacingToggled}
            onCloseSheet={toggleFacing}
          >
            <ScrollView style={styles.flexOne}>
              <CheckboxGroup
                data={this.facingCheckboxGroupData(facing)}
                onToggle={this.handleFacingSelection}
                containerStyle={styles.checkboxGroupContainer}
              />
            </ScrollView>
          </BottomSheet>
        )}
      </>
    );
  };

  public renderFurnishing = (): React.ReactElement => {
    const {
      t,
      setFilter,
      filters,
      filters: {
        miscellaneous: { furnishing },
      },
    } = this.props;
    const handleFurnishingSelection = (value: FurnishingType): void => {
      if (furnishing.includes(value)) {
        remove(furnishing, (type: FurnishingType) => type === value);
        setFilter({ miscellaneous: { ...filters.miscellaneous, furnishing } });
      } else {
        const newFurnishing = furnishing.concat(value);
        setFilter({ miscellaneous: { ...filters.miscellaneous, furnishing: newFurnishing } });
      }
    };
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t('furnishing', { totalFurnishing: furnishing.length })}
        </Text>
        <View style={styles.moreRow}>
          <MultipleButtonGroup<FurnishingType>
            data={this.FURNISHING}
            onItemSelect={handleFurnishingSelection}
            selectedItem={furnishing}
          />
        </View>
      </>
    );
  };

  public renderPropertyAmenities = (): React.ReactElement => {
    const {
      t,
      filters: {
        miscellaneous: { propertyAmenity },
      },
    } = this.props;
    const { isPropertyAmenitiesToggled } = this.state;
    const toggleAmenities = (): void => this.setState({ isPropertyAmenitiesToggled: !isPropertyAmenitiesToggled });
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.filterHeader}>
          {t('propertyAmenities', { totalAmenities: propertyAmenity.length })}
        </Text>
        {this.renderPropertyAmenitiesGroupData()}
        <Text type="small" textType="semiBold" style={styles.selectAmenity} onPress={toggleAmenities}>
          {propertyAmenity.length > 0 ? t('common:more') : t('common:select')}
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

  public renderPropertyAmenitiesGroupData = (): React.ReactNode => {
    const {
      filterDetails,
      setFilter,
      filters,
      filters: {
        miscellaneous: { propertyAmenity },
      },
    } = this.props;
    const propertyAmenities = filterDetails?.filters?.additional_filters?.property_amenities ?? [];
    const findSelectedAmenities = (): { title: string; value: number }[] => {
      const selectedAmenities: { title: string; value: number }[] = [];
      const filteredArray = propertyAmenities.filter((amenity: IPropertyAmenities) =>
        propertyAmenity.includes(amenity.id)
      );
      filteredArray.forEach((obj: IPropertyAmenities) => {
        selectedAmenities.push({
          title: obj.name,
          value: obj.id,
        });
      });
      return selectedAmenities;
    };

    const handleDeselectAmenities = (value: number): void => {
      const amenityIndex = propertyAmenity.indexOf(value);
      if (amenityIndex !== -1) {
        const updatedAmenities = propertyAmenity.splice(0, amenityIndex);
        setFilter({ miscellaneous: { ...filters.miscellaneous, propertyAmenity: updatedAmenities } });
      }
    };
    if (propertyAmenity.length === 0) {
      return null;
    }
    return (
      <MultipleButtonGroup<number>
        data={propertyAmenity.length > 0 ? findSelectedAmenities() : []}
        onItemSelect={handleDeselectAmenities}
        selectedItem={propertyAmenity}
      />
    );
  };

  public renderAmenitiesData = (): React.ReactElement => {
    const {
      setFilter,
      filters,
      filters: {
        miscellaneous: { propertyAmenity },
      },
    } = this.props;
    const onSelectedAmenities = (value: number): void => {
      const existingAmenity: number[] = propertyAmenity;
      if (existingAmenity.includes(value)) {
        remove(existingAmenity, (count: number) => count === value);
        setFilter({ miscellaneous: { ...filters.miscellaneous, propertyAmenity: existingAmenity } });
      } else {
        const newAmenity = existingAmenity.concat(value);
        setFilter({ miscellaneous: { ...filters.miscellaneous, propertyAmenity: newAmenity } });
      }
    };
    return (
      <CheckboxGroup
        data={this.amenityCheckboxGroupData()}
        onToggle={onSelectedAmenities}
        containerStyle={styles.checkboxGroupContainer}
      />
    );
  };

  public renderShowVerified = (): React.ReactElement => {
    const {
      t,
      setFilter,
      filters,
      filters: {
        miscellaneous: { show_verified: showVerified },
      },
    } = this.props;
    const { isShowVerifiedHelperToggled } = this.state;
    const updateVerified = (): void =>
      setFilter({ miscellaneous: { ...filters.miscellaneous, show_verified: !showVerified } });
    const toggleHelper = (): void => this.setState({ isShowVerifiedHelperToggled: !isShowVerifiedHelperToggled });
    return (
      <>
        <View style={styles.toggleButton}>
          <View style={styles.moreRow}>
            <Text type="small" textType="semiBold" style={styles.agentListed}>
              {t('showVerified')}
            </Text>
            <Icon
              name={icons.tooltip}
              color={theme.colors.blue}
              size={22}
              style={styles.helperIcon}
              onPress={toggleHelper}
            />
          </View>
          <RNSwitch selected={showVerified} onToggle={updateVerified} />
        </View>
        {isShowVerifiedHelperToggled && (
          <BottomSheet
            visible={isShowVerifiedHelperToggled}
            onCloseSheet={toggleHelper}
            headerTitle="Show Verified"
            sheetHeight={500}
            isShadowView
          >
            <Markdown
              markdownStyles={{
                h2: { fontWeight: '600', fontSize: 20, marginVertical: 10 },
                h4: { fontWeight: '300', fontSize: 24, color: theme.colors.darkTint2 },
                strong: { fontWeight: '600', fontSize: 16 },
                text: { fontWeight: 'normal', fontSize: 14 },
              }}
              style={{ margin: theme.layout.screenPadding }}
            >
              Show Verified helper text
            </Markdown>
          </BottomSheet>
        )}
      </>
    );
  };

  public renderAgentListed = (): React.ReactElement => {
    const {
      t,
      setFilter,
      filters,
      filters: {
        miscellaneous: { agent_listed: agentListed },
      },
    } = this.props;
    const { isAgentListedHelperToggled } = this.state;
    const updateAgentListed = (): void =>
      setFilter({ miscellaneous: { ...filters.miscellaneous, agent_listed: !agentListed } });
    const toggleHelper = (): void => this.setState({ isAgentListedHelperToggled: !isAgentListedHelperToggled });
    return (
      <>
        <View style={styles.toggleButton}>
          <View style={styles.moreRow}>
            <Text type="small" textType="semiBold" style={styles.agentListed}>
              {t('agentListed')}
            </Text>
            <Icon
              name={icons.tooltip}
              color={theme.colors.blue}
              size={22}
              style={styles.helperIcon}
              onPress={toggleHelper}
            />
          </View>
          <RNSwitch selected={agentListed} onToggle={updateAgentListed} />
        </View>
        {isAgentListedHelperToggled && (
          <BottomSheet
            visible={isAgentListedHelperToggled}
            onCloseSheet={toggleHelper}
            headerTitle="Agent Listed"
            sheetHeight={500}
            isShadowView
          >
            <Markdown
              markdownStyles={{
                h2: { fontWeight: '600', fontSize: 20, marginVertical: 10 },
                h4: { fontWeight: '300', fontSize: 24, color: theme.colors.darkTint2 },
                strong: { fontWeight: '600', fontSize: 16 },
                text: { fontWeight: 'normal', fontSize: 14 },
              }}
              style={{ margin: theme.layout.screenPadding }}
            >
              Agent Listed helper text
            </Markdown>
          </BottomSheet>
        )}
      </>
    );
  };

  public onToggleTransactionType = (value: number): void => {
    const { setFilter } = this.props;
    setFilter({ asset_transaction_type: value });
  };

  private handleSubmit = (): void => {
    const { getProperties, navigation } = this.props;
    getProperties();
    navigation.goBack();
  };

  public translateData = (data: IFilterData[]): IFilterData[] => {
    const { t } = this.props;
    return data.map((currentData: IFilterData) => {
      return {
        value: currentData.value,
        label: t(currentData.label),
      };
    });
  };

  public transformFacingData = (): { title: string; value: number }[] => {
    const { filterDetails } = this.props;
    const facingData = filterDetails?.filters?.additional_filters?.facing ?? [];
    const transformedFacing: { title: string; value: number }[] = [];
    facingData.forEach((data: IFacing) => {
      transformedFacing.push({
        title: data.name,
        value: data.id,
      });
    });
    return transformedFacing;
  };

  public facingCheckboxGroupData = (facing: number[]): ICheckboxGroupData[] => {
    const { filterDetails } = this.props;
    const facingData = filterDetails?.filters?.additional_filters?.facing ?? [];
    return facingData.map((facingType: { name: string; id: number }) => ({
      id: facingType.id,
      label: facingType.name,
      isSelected: facing.includes(facingType.id),
    }));
  };

  public handleFacingSelection = (value: number): void => {
    const {
      filters,
      setFilter,
      filters: {
        miscellaneous: { facing: existingFacing },
      },
    } = this.props;
    if (existingFacing.includes(value)) {
      remove(existingFacing, (count: number) => count === value);
      setFilter({ miscellaneous: { ...filters.miscellaneous, facing: existingFacing } });
    } else {
      const newFacing = existingFacing.concat(value);
      setFilter({ miscellaneous: { ...filters.miscellaneous, facing: newFacing } });
    }
  };

  public amenityCheckboxGroupData = (): ICheckboxGroupData[] => {
    const {
      filterDetails,
      filters: {
        miscellaneous: { propertyAmenity },
      },
    } = this.props;
    const propertyAmenitiesData = filterDetails?.filters?.additional_filters?.property_amenities ?? [];
    return propertyAmenitiesData.map((amenityType: { name: string; id: number }) => ({
      id: amenityType.id,
      label: amenityType.name,
      isSelected: propertyAmenity.includes(amenityType.id),
    }));
  };

  public clearForm = (): void => {
    const { setInitialMiscellaneous } = this.props;
    setInitialMiscellaneous();
  };

  public goBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getFilters, getFilterDetail } = SearchSelector;
  return {
    filters: getFilters(state),
    filterDetails: getFilterDetail(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setFilter, setInitialState, getProperties, setInitialMiscellaneous } = SearchActions;
  return bindActionCreators(
    {
      setFilter,
      setInitialState,
      getProperties,
      setInitialMiscellaneous,
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
    margin: theme.layout.screenPadding,
    marginTop: 30,
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reset: {
    flex: 0,
    borderWidth: 0,
    color: theme.colors.primaryColor,
  },
  filterHeader: {
    paddingVertical: 10,
    color: theme.colors.darkTint3,
  },
  agentListed: {
    color: theme.colors.darkTint3,
  },
  buttonStyle: {
    flex: 0,
    margin: theme.layout.screenPadding,
  },
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
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
  dropdownContainer: {
    marginVertical: 10,
  },
  shadowView: {
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  helperIcon: {
    marginStart: 8,
  },
});
