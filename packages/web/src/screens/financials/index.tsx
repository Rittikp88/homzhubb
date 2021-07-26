import React, { FC, useRef, useState, useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { PopupActions } from 'reactjs-popup/dist/types';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { AppLayoutContext } from '@homzhub/web/src/screens/appLayout/AppLayoutContext';
import { theme } from '@homzhub/common/src/styles/theme';
import { PropertyVisualsEstimates } from '@homzhub/web/src/screens/dashboard/components/PropertyVisualEstimates';
import DuesCard from '@homzhub/web/src/screens/financials/DuesCard';
import Transactions from '@homzhub/web/src/screens/financials/Transactions';
import FinancialsPopover, { FinancialsActions } from '@homzhub/web/src/screens/financials/FinancialsPopover';
import ReminderList from '@homzhub/web/src/screens/financials/Reminders/ReminderList';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IStateToProps {
  currency: Currency;
  assets: Asset[];
}

type IProps = IStateToProps;

const Financials: FC<IProps> = (props: IProps) => {
  const dispatch = useDispatch();
  const { currency, assets } = props;
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
  return (
    <View style={styles.container}>
      <PropertyVisualsEstimates />
      <DuesCard />
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
  );
};

const mapStateToProps = (state: IState): IStateToProps => {
  return {
    currency: UserSelector.getCurrency(state),
    assets: UserSelector.getUserAssets(state),
  };
};

export default connect(mapStateToProps, null)(Financials);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.white,
    borderRadius: 4,
  },
});
