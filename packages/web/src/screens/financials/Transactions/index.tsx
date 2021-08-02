import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import TransactionAccordian from '@homzhub/web/src/screens/financials/Transactions/TransactionAccordian';
import { FinancialRecords } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ITransactionParams } from '@homzhub/common/src/domain/repositories/interfaces';

interface IReduxState {
  transactionsData: FinancialRecords[];
  transactionsCount: number;
  selectedProperty: number;
  selectedCountry: number;
}

interface IDispatchProps {
  getTransactions: (payload: ITransactionParams) => void;
  getLedgerMetrics: () => void;
}

interface IProps {
  selectedProperty: number;
  selectedCountry: number;
}

type Props = IReduxState & IDispatchProps & IProps;

const Transactions = (props: Props): React.ReactElement<Props> => {
  const { selectedCountry, selectedProperty } = props;
  useEffect(() => {
    getGeneralLedgers(true);
  }, [selectedCountry, selectedProperty]);

  const getGeneralLedgers = (reset = false): void => {
    const { getTransactions, transactionsData } = props;
    getTransactions({
      offset: reset ? 0 : transactionsData.length,
      limit: 10,
      asset_id: selectedProperty || undefined,
      country_id: selectedCountry || undefined,
    });
  };
  const { t } = useTranslation();
  const { transactionsData } = props;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name={icons.wallet} size={22} color={theme.colors.darkTint3} />
        <Text type="small" textType="semiBold" style={styles.text}>
          {t('assetDashboard:Transaction')}
        </Text>
      </View>
      <ScrollView>
        {transactionsData.length ? (
          transactionsData.map((item) => <TransactionAccordian key={item.id} transactionItem={item} />)
        ) : (
          <EmptyState />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    padding: 15,
    height: 600,
  },
  amount: {
    marginRight: 10,
    color: theme.colors.error,
  },
  header: {
    flexDirection: 'row',
    margin: 10,
  },
  leftChild: {
    flexDirection: 'row',
  },
  text: { marginLeft: 10, color: theme.colors.darkTint1 },
});
const mapStateToProps = (state: IState): IReduxState => {
  const { getTransactionRecords, getTransactionsCount, getSelectedCountry, getSelectedProperty } = FinancialSelectors;
  return {
    transactionsData: getTransactionRecords(state),
    transactionsCount: getTransactionsCount(state),
    selectedCountry: getSelectedCountry(state),
    selectedProperty: getSelectedProperty(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getTransactions, getLedgerMetrics } = FinancialActions;
  return bindActionCreators({ getTransactions, getLedgerMetrics }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
