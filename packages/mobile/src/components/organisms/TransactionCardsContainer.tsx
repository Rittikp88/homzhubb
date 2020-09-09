import React, { ReactElement } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider, Text } from '@homzhub/common/src/components';
import { Loader } from '@homzhub/mobile/src/components';
import TransactionCard from '@homzhub/mobile/src/components/molecules/TransactionCard';
import { FinancialRecords } from '@homzhub/common/src/domain/models/FinancialTransactions';

interface IProps extends WithTranslation {
  transactionsData: FinancialRecords[];
  shouldEnableOuterScroll: (enable: boolean) => void;
  onEndReachedHandler: () => void;
  isLoading: boolean;
}

export class TransactionCardsContainer extends React.PureComponent<IProps> {
  public render(): ReactElement {
    const { t } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.transactionHeader}>
          <Icon style={styles.chequeIconStyle} name={icons.cheque} size={22} />
          <Text type="small" textType="semiBold">
            {t('transactions')}
          </Text>
        </View>
        <Divider />
        {this.renderTransactionCard()}
      </View>
    );
  }

  private renderTransactionCard = (): ReactElement | null => {
    const { transactionsData, shouldEnableOuterScroll, onEndReachedHandler } = this.props;
    const keyExtractor = (item: FinancialRecords, index: number): string => index.toString();

    if (transactionsData.length < 1) {
      return null;
    }

    return (
      <FlatList
        // @ts-ignore
        renderItem={this.renderItem}
        onTouchStart={(): void => {
          shouldEnableOuterScroll(false);
        }}
        onMomentumScrollEnd={this.controlScroll}
        onScrollEndDrag={this.controlScroll}
        style={styles.transactionContainer}
        data={transactionsData}
        keyExtractor={keyExtractor}
        ListFooterComponent={this.showFootLoader()}
        onEndReached={onEndReachedHandler}
        onEndReachedThreshold={0.1}
      />
    );
  };

  private renderItem = ({ item }: { item: FinancialRecords; index: number }): React.ReactElement => {
    return <TransactionCard transaction={item} />;
  };

  private controlScroll = (): void => {
    const { shouldEnableOuterScroll } = this.props;
    shouldEnableOuterScroll(true);
  };

  private showFootLoader = (): ReactElement | null => {
    const { transactionsData, isLoading } = this.props;

    if (transactionsData.length < 1 && isLoading) {
      return <Loader visible />;
    }
    return null;
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetFinancial)(TransactionCardsContainer);

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: theme.colors.white,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  transactionContainer: {
    height: 400,
  },
  chequeIconStyle: {
    marginRight: 10,
  },
});
