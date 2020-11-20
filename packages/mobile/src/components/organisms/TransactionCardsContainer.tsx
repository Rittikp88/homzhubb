import React, { ReactElement } from 'react';
import { View, StyleSheet, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import TransactionCard from '@homzhub/mobile/src/components/molecules/TransactionCard';
import { FinancialRecords } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps extends WithTranslation {
  transactionsData: FinancialRecords[];
  shouldEnableOuterScroll: (enable: boolean) => void;
  onEndReachedHandler: () => void;
}

interface IOwnState {
  expandedItem: number;
}

export class TransactionCardsContainer extends React.PureComponent<IProps, IOwnState> {
  private scrollRef = React.createRef<ScrollView>();

  public state = {
    expandedItem: -1,
  };

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
          ref={this.scrollRef}
          onScroll={this.onScroll}
          onTouchStart={transactionsData.length > 4 ? (): void => shouldEnableOuterScroll(false) : undefined}
          onMomentumScrollEnd={this.controlScroll}
          onScrollEndDrag={this.controlScroll}
          scrollEventThrottle={1500}
          style={styles.contentContainer}
        >
          {transactionsData.map(this.renderTransactionCard)}
        </ScrollView>
      </View>
    );
  }

  private renderTransactionCard = (item: FinancialRecords, index: number): React.ReactNode => {
    const { expandedItem } = this.state;
    const onCardPress = (height: number): void => this.onCardPress(index, height);

    return (
      <TransactionCard
        key={`${item.id}-${index}`}
        isExpanded={expandedItem === index}
        transaction={item}
        onCardPress={onCardPress}
        handleDownload={this.onDownloadDocument}
      />
    );
  };

  private onCardPress = (expandedItem: number, height: number): void => {
    const { expandedItem: prev } = this.state;
    const { transactionsData } = this.props;

    if (prev === expandedItem) {
      this.setState({ expandedItem: -1 });
      if (expandedItem > transactionsData.length - 5) {
        setTimeout(() => {
          this.scrollRef.current?.scrollToEnd();
        }, 0);
      }
      return;
    }

    this.setState({ expandedItem }, () => {
      if (expandedItem > transactionsData.length - 5 && !transactionsData[expandedItem].attachment.fileName) {
        setTimeout(() => {
          this.scrollRef.current?.scrollToEnd();
        }, 0);
      }
      this.scrollRef.current?.scrollTo({ y: expandedItem * height, animated: true });
    });
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
