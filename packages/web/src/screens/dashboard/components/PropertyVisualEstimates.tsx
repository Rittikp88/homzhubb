import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { isEqual } from 'lodash';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useSelector } from 'react-redux';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { FinanceUtils } from '@homzhub/common/src/utils/FinanceUtil';
import { LedgerUtils } from '@homzhub/common/src/utils/LedgerUtils';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import ColumnChart from '@homzhub/web/src/components/atoms/ColumnChart';
import DonutChart from '@homzhub/web/src/components/atoms/DonutChart';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import PopupMenuOptions from '@homzhub/web/src/components/molecules/PopupMenuOptions';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { GeneralLedgers, LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { DateFilter, FINANCIAL_DROPDOWN_DATA, IDropdownObject } from '@homzhub/common/src/constants/FinanceOverview';

export interface IGeneralLedgersParams {
  selectedTimeRange: DateFilter;
  financialYear: {
    startDate: string;
    endDate: string;
    startMonthIndex: number;
    endMonthIndex: number;
  };
  selectedCountry?: number | undefined;
  selectedProperty?: number | undefined;
}

interface IProps {
  selectedCountry?: number;
  selectedProperty?: number;
}

interface IPropertyOption {
  icon: string;
  label: string;
  value: number;
}

const popupProps = {
  position: 'bottom left' as 'bottom left',
  on: 'click' as 'click',
  arrow: false,
  contentStyle: { marginTop: '4px' },
  closeOnDocumentClick: true,
  children: undefined,
};

const getPropertyList = (t: TFunction, assets: Asset[], selectedCountry: number): IPropertyOption[] => {
  const properties = (selectedCountry === 0
    ? assets
    : assets.filter((asset) => selectedCountry === asset.country.id)
  ).map((asset) => ({
    label: asset.projectName,
    value: asset.id,
    icon: icons.stackFilled,
  }));
  return [{ label: t('assetFinancial:allProperties'), icon: icons.stackFilled, value: 0 }, ...properties];
};

const renderFilterOptions = (t: TFunction): IDropdownObject[] => {
  const data = Object.values(FINANCIAL_DROPDOWN_DATA);

  return data.map((currentData: IDropdownObject) => {
    return {
      ...currentData,
      label: t(currentData.label),
    };
  });
};

const getGeneralLedgers = async (
  params: IGeneralLedgersParams,
  callback: (response: GeneralLedgers[]) => void
): Promise<void> => {
  const { financialYear, selectedTimeRange, selectedCountry, selectedProperty } = params;
  const { endDate: finEndDate, startDate: finStartDate } = financialYear;

  // @ts-ignore
  let { endDate, startDate } = FINANCIAL_DROPDOWN_DATA[selectedTimeRange];
  // @ts-ignore
  const { value, dataGroupBy } = FINANCIAL_DROPDOWN_DATA[selectedTimeRange];

  if (value === DateFilter.thisFinancialYear) {
    endDate = finEndDate;
    startDate = finStartDate;
  }

  try {
    const response: GeneralLedgers[] = await LedgerRepository.getLedgerPerformances({
      transaction_date__gte: startDate,
      transaction_date__lte: endDate,
      transaction_date_group_by: dataGroupBy,
      asset_id: selectedProperty || undefined,
      country_id: selectedCountry || undefined,
    });
    callback(response);
  } catch (err) {
    // TODO:(bishal) Handle error case here
  }
};

const PropertyVisualsEstimates = ({ selectedCountry }: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const dateFilterOptions = renderFilterOptions(t);
  const defaultFilterOption = dateFilterOptions.find((d: IDropdownOption) => d.value === DateFilter.thisMonth);
  const assets = useSelector(UserSelector.getUserAssets);
  const financialYear = useSelector(UserSelector.getUserFinancialYear);
  const propertyOptions = getPropertyList(t, assets, selectedCountry ?? 0);
  const popupRef = useRef<PopupActions>(null);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const [selectedProperty, setSelectedProperty] = useState(propertyOptions[0]);
  const [selectedDateFilter, setSelectedDateFilter] = useState(defaultFilterOption);
  const [ledgerData, setLedgerData] = useState<GeneralLedgers[]>([]);
  const styles = propertyVisualEstimatesStyle(isMobile);
  const dateFilter = selectedDateFilter?.value ?? DateFilter.thisMonth;
  useEffect(() => {
    getGeneralLedgers(
      {
        selectedTimeRange: dateFilter,
        financialYear,
        selectedProperty: selectedProperty.value,
      },
      (data) => {
        setLedgerData(data);
      }
    ).then();
  }, [dateFilter, financialYear, selectedProperty]);
  const financeUtil = new FinanceUtils(dateFilter, financialYear, ledgerData);
  const columnGraphData = financeUtil.getBarGraphData(dateFilter);
  const closePopup = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };
  const onPropertyOptionPress = (value: IPropertyOption): void => {
    closePopup();
    setSelectedProperty(value);
  };
  const onDateFilterOptionPress = (selectedOption: IDropdownObject): void => {
    closePopup();
    setSelectedDateFilter(selectedOption);
  };

  return (
    <View>
      <View style={styles.header}>
        <Popover
          forwardedRef={popupRef}
          content={<PopupMenuOptions options={propertyOptions} onMenuOptionPress={onPropertyOptionPress} />}
          popupProps={popupProps}
        >
          <TouchableOpacity activeOpacity={1} style={styles.chooseProperty}>
            <Icon name={icons.portfolio} size={18} color={theme.colors.darkTint4} style={styles.optionIcon} />
            <Typography variant="label" size="large" style={styles.optionLabel}>
              {selectedProperty.label}
            </Typography>
            <Icon name={icons.downArrow} size={18} color={theme.colors.darkTint4} style={styles.dropdownIcon} />
          </TouchableOpacity>
        </Popover>
        <View style={styles.columnChartOption}>
          <View style={styles.monthInfo}>
            <Icon name={icons.calendar} size={18} color={theme.colors.darkTint4} style={styles.dropdownIcon} />
            <Typography variant="label" size="large" style={styles.optionLabel}>
              {financeUtil.renderCalenderLabel(selectedDateFilter?.value ?? DateFilter.thisYear)}
            </Typography>
          </View>
          <Popover
            forwardedRef={popupRef}
            content={<PopupMenuOptions options={dateFilterOptions} onMenuOptionPress={onDateFilterOptionPress} />}
            popupProps={{ ...popupProps, position: 'bottom right' }}
          >
            <TouchableOpacity activeOpacity={1} style={styles.chooseTimeRange}>
              <Typography variant="label" size="large" style={[styles.optionLabel, styles.timeRangeLabel]}>
                {selectedDateFilter?.label ?? ''}
              </Typography>
              <Icon name={icons.downArrow} size={18} color={theme.colors.blue} style={styles.dropdownIcon} />
            </TouchableOpacity>
          </Popover>
        </View>
      </View>
      <View style={styles.container}>
        {ledgerData.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <View style={styles.donutChart}>
              <Typography variant="label" size="large" fontWeight="bold">
                Cost Breakdown
              </Typography>
              <DonutChart data={LedgerUtils.filterByType(LedgerTypes.debit, ledgerData)} />
            </View>
            {isMobile && <Divider containerStyles={styles.dividerStyles} />}
            <View style={styles.columnChart}>
              <Typography variant="label" size="large" fontWeight="bold">
                Cash Flow
              </Typography>
              <ColumnChart data={columnGraphData} />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const memoizedComponent = React.memo(PropertyVisualsEstimates, isEqual);
export { memoizedComponent as PropertyVisualsEstimates };

interface IStyle {
  header: ViewStyle;
  container: ViewStyle;
  donutChart: ViewStyle;
  monthInfo: ViewStyle;
  columnChartOption: ViewStyle;
  columnChart: ViewStyle;
  chooseProperty: ViewStyle;
  chooseTimeRange: ViewStyle;
  timeRangeLabel: TextStyle;
  optionIcon: ViewStyle;
  optionLabel: TextStyle;
  dropdownIcon: ViewStyle;
  dividerStyles: ViewStyle;
}

const propertyVisualEstimatesStyle = (isMobile: boolean): StyleSheet.NamedStyles<IStyle> =>
  StyleSheet.create<IStyle>({
    header: {
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 16,
      backgroundColor: theme.colors.white,
    },
    dividerStyles: {
      marginVertical: 20,
    },
    chooseProperty: {
      width: isMobile ? '100%' : 300,
      minWidth: 'max-content',
      marginBottom: isMobile ? 20 : undefined,
      flexDirection: 'row',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderColor: theme.colors.darkTint9,
      borderWidth: 1,
      borderRadius: 4,
      alignItems: 'center',
    },
    chooseTimeRange: {
      minWidth: 'max-content',
      flexDirection: 'row',
      paddingHorizontal: 12,
      paddingVertical: 6,
      alignItems: 'center',
      borderRadius: 4,
      backgroundColor: theme.colors.background,
    },
    timeRangeLabel: {
      marginRight: 4,
      color: theme.colors.blue,
    },
    monthInfo: {
      flexDirection: 'row',
      marginRight: 24,
      alignItems: 'center',
    },
    optionIcon: {},
    optionLabel: {
      flex: 1,
      color: theme.colors.darkTint9,
      marginLeft: 8,
    },
    dropdownIcon: {
      marginRight: 8,
    },
    container: {
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: isMobile ? undefined : 'space-around',
      backgroundColor: theme.colors.white,
      borderTopColor: theme.colors.background,
      borderTopWidth: 1,
      paddingBottom: 15,
      paddingTop: 16,
      paddingHorizontal: 16,
    },
    donutChart: {
      flex: 0.3,
    },
    columnChart: {
      flex: 0.5,
    },
    columnChartOption: {
      flexDirection: 'row',
    },
  });
