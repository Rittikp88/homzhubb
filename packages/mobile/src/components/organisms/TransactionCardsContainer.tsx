import React, { ReactElement } from 'react';
import { View, StyleSheet, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider, Text } from '@homzhub/common/src/components';
import TransactionCard from '@homzhub/mobile/src/components/molecules/TransactionCard';
import { FinancialRecords } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps extends WithTranslation {
  transactionsData: FinancialRecords[];
  shouldEnableOuterScroll: (enable: boolean) => void;
  onEndReachedHandler: () => void;
}

export class TransactionCardsContainer extends React.PureComponent<IProps> {
  public render(): ReactElement {
    const { t, shouldEnableOuterScroll, transactionsData } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.transactionHeader}>
          <Icon style={styles.chequeIconStyle} name={icons.cheque} size={22} />
          <Text type="small" textType="semiBold">
            {t('transactions')}
          </Text>
        </View>
        <Divider />
        <ScrollView
          onScroll={this.onScroll}
          onTouchStart={transactionsData.length > 4 ? (): void => shouldEnableOuterScroll(false) : undefined}
          onMomentumScrollEnd={this.controlScroll}
          onScrollEndDrag={this.controlScroll}
          scrollEventThrottle={1500}
          style={styles.contentContainer}
        >
          {this.renderTransactionCard()}
        </ScrollView>
      </View>
    );
  }

  private renderTransactionCard = (): React.ReactNode => {
    const { transactionsData } = this.props;

    if (transactionsData.length < 1) {
      return null;
    }

    return transactionsData.map((item, index) => (
      <TransactionCard key={`${item.id}-${index}`} transaction={item} handleDownload={this.onDownloadDocument} />
    ));
  };

  private onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const { onEndReachedHandler } = this.props;
    const paddingToBottom = 40;
    const {
      nativeEvent: { layoutMeasurement, contentOffset, contentSize },
    } = event;

    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      onEndReachedHandler();
    }
  };

  private onDownloadDocument = async (key: string, fileName: string): Promise<void> => {
    await AttachmentService.downloadAttachment(key, fileName);
  };

  private controlScroll = (): void => {
    const { shouldEnableOuterScroll } = this.props;
    shouldEnableOuterScroll(true);
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetFinancial)(TransactionCardsContainer);

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: theme.colors.white,
    paddingBottom: 8,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contentContainer: {
    maxHeight: 400,
  },
  chequeIconStyle: {
    marginEnd: 12,
  },
});
