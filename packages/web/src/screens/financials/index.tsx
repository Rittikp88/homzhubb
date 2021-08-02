import React, { FC, useRef, useState, useContext, useEffect } from 'react';
import { PickerItemProps, StyleSheet, View } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { PopupActions } from 'reactjs-popup/dist/types';
import { uniqBy } from 'lodash';
import { bindActionCreators, Dispatch } from 'redux';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { AppLayoutContext } from '@homzhub/web/src/screens/appLayout/AppLayoutContext';
import { theme } from '@homzhub/common/src/styles/theme';
import { PropertyVisualsEstimates } from '@homzhub/web/src/screens/dashboard/components/PropertyVisualEstimates';
import DuesContainer from '@homzhub/web/src/screens/financials/Dues';
import Transactions from '@homzhub/web/src/screens/financials/Transactions';
import FinancialsPopover, { FinancialsActions } from '@homzhub/web/src/screens/financials/FinancialsPopover';
import ReminderList from '@homzhub/web/src/screens/financials/Reminders/ReminderList';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { PropertyByCountryDropdown } from '@homzhub/common/src/components/molecules/PropertyByCountryDropdown';

interface IStateToProps {
  currency: Currency;
  assets: Asset[];
  selectedProperty: number;
  selectedCountry: number;
}

interface IDispatchProps {
  setCurrentCountry: (country: number) => void;
  setCurrentProperty: (property: number) => void;
}

type IProps = IStateToProps & IDispatchProps;

const Financials: FC<IProps> = (props: IProps) => {
  const dispatch = useDispatch();
  const { currency, assets, selectedCountry, selectedProperty, setCurrentCountry, setCurrentProperty } = props;
  const { financialsActions, setFinancialsActions } = useContext(AppLayoutContext);
  const [financialsActionType, setFinancialsActionType] = useState<FinancialsActions | null>(null);
  const { isOpen } = financialsActions;
  useEffect(() => {
    if (isOpen) {
      setFinancialsActionType(financialsActions.financialsActionType);
      onOpenModal();
    }
    dispatch(UserActions.getAssets());
  }, [isOpen]);
  const popupRef = useRef<PopupActions>(null);
  const onOpenModal = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };
  const onCloseModal = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
      setFinancialsActions({
        financialsActionType: financialsActions.financialsActionType,
        isOpen: false,
      });
    }
  };
  const onPropertyChange = (propertyId: number): void => {
    if (selectedProperty === propertyId) {
      return;
    }
    setCurrentProperty(propertyId);
  };

  const onCountryChange = (countryId: number): void => {
    if (selectedCountry === countryId) {
      return;
    }
    setCurrentCountry(countryId);
  };

  const getCountryList = (): Country[] => {
    return uniqBy(
      assets.map((asset) => asset.country),
      'id'
    );
  };

  const getPropertyList = (): PickerItemProps[] => {
    // @ts-ignore
    return (selectedCountry === 0 ? assets : assets.filter((asset) => selectedCountry === asset.country.id)).map(
      (asset) => ({
        label: asset.projectName,
        value: asset.id,
      })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerFilters}>
        <PropertyByCountryDropdown
          selectedProperty={selectedProperty}
          selectedCountry={selectedCountry}
          propertyList={getPropertyList()}
          countryList={getCountryList()}
          onPropertyChange={onPropertyChange}
          onCountryChange={onCountryChange}
          containerStyle={styles.dropdownContainerStyle}
          propertyContainerStyle={styles.propertyContainerStyle}
        />
      </View>
      <View style={styles.container}>
        <PropertyVisualsEstimates selectedCountry={selectedCountry} selectedProperty={selectedProperty} />
        <DuesContainer />
        <Transactions />
        <ReminderList />
        <FinancialsPopover
          popupRef={popupRef}
          onCloseModal={onCloseModal}
          financialsActionType={financialsActionType}
          currency={currency}
          assets={assets}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state: IState): IStateToProps => {
  const { getSelectedCountry, getSelectedProperty } = FinancialSelectors;
  return {
    currency: UserSelector.getCurrency(state),
    assets: UserSelector.getUserAssets(state),
    selectedProperty: getSelectedProperty(state),
    selectedCountry: getSelectedCountry(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const {
    getLedgers,
    setCurrentCountry,
    setCurrentProperty,
    setTimeRange,
    getLedgerMetrics,
    resetLedgerFilters,
    setCurrentDueId,
    setCurrentReminderId,
  } = FinancialActions;
  return bindActionCreators(
    {
      getLedgers,
      setCurrentCountry,
      setCurrentProperty,
      setTimeRange,
      getLedgerMetrics,
      resetLedgerFilters,
      setCurrentDueId,
      setCurrentReminderId,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Financials);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  containerFilters: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    paddingBottom: 20,
    minHeight: 40,
  },
  dropdownContainerStyle: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  propertyContainerStyle: {
    flex: 0.2,
    marginLeft: 16,
    minWidth: 180,
  },
});
