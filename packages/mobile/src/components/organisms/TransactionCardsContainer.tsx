import React, { ReactElement } from 'react';
import { View, StyleSheet, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { OnFocusCallback } from '@homzhub/common/src/components/atoms/OnFocusCallback';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import TransactionCard from '@homzhub/mobile/src/components/molecules/TransactionCard';
import { FinancialRecords, FinancialTransactions } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps extends WithTranslation {
  selectedCountry?: number;
  selectedProperty?: number;
  shouldEnableOuterScroll: (enable: boolean) => void;
}

interface IOwnState {
  expandedItem: number;
  transactionsData: FinancialRecords[];
}

const PAGE_LIMIT = 10;
export class TransactionCardsContainer extends React.PureComponent<IProps, IOwnState> {
  private scrollRef = React.createRef<ScrollView>();

  public state = {
    transactionsData: [],
    expandedItem: -1,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getGeneralLedgers(true);
  };

  public componentDidUpdate = async (prevProps: IProps): Promise<void> => {
    const { selectedCountry: oldCountry, selectedProperty: oldProperty } = prevProps;
    const { selectedProperty, selectedCountry } = this.props;
    if (selectedProperty !== oldProperty || selectedCountry !== oldCountry) {
      await this.getGeneralLedgers(true);
      this.scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  public render(): ReactElement {
    const { t, shouldEnableOuterScroll } = this.props;
    const { transactionsData } = this.state;

    return (
      <View style={styles.container}>
        <OnFocusCallback isAsync callback={this.onFocus} />
        <View style={styles.transactionHeader}>
          <Icon style={styles.chequeIconStyle} name={icons.cheque} size={22} />
          <Text type="small" textType="semiBold">
            {t('transactions')}
          </Text>
        </View>
        <Divider />
        {transactionsData.length <= 0 ? (
          <EmptyState />
        ) : (
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
        )}
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
    const { expandedItem: prev, transactionsData } = this.state;

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
      if (
        expandedItem > transactionsData.length - 5 &&
        !(transactionsData as FinancialRecords[])[expandedItem].attachment.fileName
      ) {
        setTimeout(() => {
          this.scrollRef.current?.scrollToEnd();
        }, 0);
      }
      this.scrollRef.current?.scrollTo({ y: expandedItem * height, animated: true });
    });
  };

  private onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const paddingToBottom = 40;
    const {
      nativeEvent: { layoutMeasurement, contentOffset, contentSize },
    } = event;

    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      this.onEndReachedHandler().then();
    }
  };

  private onDownloadDocument = async (key: string, fileName: string): Promise<void> => {
    await AttachmentService.downloadAttachment(key, fileName);
  };

  private onEndReachedHandler = async (): Promise<void> => {
    await this.getGeneralLedgers();
  };

  private onFocus = async (): Promise<void> => {
    await this.getGeneralLedgers(true);
  };

  private controlScroll = (): void => {
    const { shouldEnableOuterScroll } = this.props;
    shouldEnableOuterScroll(true);
  };

  private getGeneralLedgers = async (reset = false): Promise<void> => {
    const { transactionsData } = this.state;
    const { selectedCountry, selectedProperty } = this.props;

    try {
      const response: FinancialTransactions = await LedgerRepository.getGeneralLedgers({
        offset: reset ? 0 : transactionsData.length,
        limit: PAGE_LIMIT,
        asset_id: selectedProperty || undefined,
        country_id: selectedCountry || undefined,
      });

      this.setState({
        transactionsData: reset ? [...response.results] : [...transactionsData, ...response.results],
      });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
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
