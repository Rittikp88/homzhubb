import React, { ReactElement } from 'react';
import { View, StyleSheet, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { OnFocusCallback } from '@homzhub/common/src/components/atoms/OnFocusCallback';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import TransactionCard from '@homzhub/mobile/src/components/molecules/TransactionCard';
import { FinancialRecords, FinancialTransactions } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps extends WithTranslation {
  selectedCountry?: number;
  selectedProperty?: number;
  shouldEnableOuterScroll?: (enable: boolean) => void;
  isFromPortfolio?: boolean;
  onEditRecord: (id: number) => void;
  toggleLoading: (loading: boolean) => void;
}

interface IOwnState {
  expandedItem: number;
  transactionsData: FinancialRecords[];
  showBottomSheet: boolean;
  currentTransactionId: number;
}

const PAGE_LIMIT = 10;
export class TransactionCardsContainer extends React.PureComponent<IProps, IOwnState> {
  private scrollRef = React.createRef<ScrollView>();

  public state = {
    transactionsData: [],
    expandedItem: -1,
    showBottomSheet: false,
    currentTransactionId: -1,
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
    const { transactionsData, expandedItem } = this.state;

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
            onTouchStart={
              transactionsData.length > 4 && shouldEnableOuterScroll
                ? (): void => shouldEnableOuterScroll(false)
                : undefined
            }
            onMomentumScrollEnd={this.controlScroll}
            onScrollEndDrag={this.controlScroll}
            scrollEventThrottle={1500}
            // Increase container's height if any item is expanded to fit things in.
            style={expandedItem === -1 ? styles.contentContainer : styles.contentContainerExpanded}
          >
            {transactionsData.map(this.renderTransactionCard)}
          </ScrollView>
        )}
        {this.renderBottomSheet()}
      </View>
    );
  }

  private renderBottomSheet = (): React.ReactElement => {
    const { showBottomSheet } = this.state;
    const { t } = this.props;
    const onPressDelete = (): Promise<void> => this.onConfirmDelete().then();
    return (
      <BottomSheet
        visible={showBottomSheet}
        headerTitle={t('common:confirm')}
        sheetHeight={theme.viewport.height / 3}
        onCloseSheet={this.closeBottomSheet}
      >
        <View style={styles.bottomSheet}>
          <Text type="small" style={styles.message}>
            {t('assetFinancial:deleteRecordConfirmation')}
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              type="secondary"
              title={t('common:cancel')}
              onPress={this.closeBottomSheet}
              titleStyle={styles.buttonTitle}
              containerStyle={styles.editButton}
            />
            <Button
              type="primary"
              title={t('common:delete')}
              titleStyle={styles.buttonTitle}
              onPress={onPressDelete}
              containerStyle={styles.deleteButton}
            />
          </View>
        </View>
      </BottomSheet>
    );
  };

  private renderTransactionCard = (item: FinancialRecords, index: number): React.ReactNode => {
    const { expandedItem } = this.state;
    const { onEditRecord } = this.props;
    const onCardPress = (height: number): void => this.onCardPress(index, height);

    const handleEdit = (): void => {
      onEditRecord(item.id);
    };

    const handleDelete = (): void => {
      this.openBottomSheet(item.id);
    };

    return (
      <TransactionCard
        key={`${item.id}-${index}`}
        isExpanded={expandedItem === index}
        transaction={item}
        onCardPress={onCardPress}
        handleDownload={this.onDownloadDocument}
        onPressEdit={handleEdit}
        onPressDelete={handleDelete}
      />
    );
  };

  private onConfirmDelete = async (): Promise<void> => {
    const { toggleLoading, t } = this.props;
    const { currentTransactionId } = this.state;
    if (currentTransactionId > -1) {
      try {
        toggleLoading(true);
        await LedgerRepository.deleteLedger(currentTransactionId);
        this.getGeneralLedgers(true);
        this.setState({ expandedItem: -1 });
        toggleLoading(false);
        this.closeBottomSheet();
        AlertHelper.success({ message: t('assetFinancial:deletedSuccessfullyMessage') });
      } catch (e) {
        toggleLoading(false);
        this.closeBottomSheet();
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      }
    }
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
        !(transactionsData as FinancialRecords[])[expandedItem].attachmentDetails.length
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
    if (shouldEnableOuterScroll) {
      shouldEnableOuterScroll(true);
    }
  };

  private openBottomSheet = (id: number): void => {
    this.setState({ showBottomSheet: true, currentTransactionId: id });
  };

  private closeBottomSheet = (): void => {
    this.setState({ showBottomSheet: false, currentTransactionId: -1 });
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
  contentContainerExpanded: {
    maxHeight: theme.viewport.height / 1.7,
  },
  chequeIconStyle: {
    marginEnd: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  editButton: {
    marginLeft: 10,
    flexDirection: 'row-reverse',
    height: 50,
  },
  deleteButton: {
    flexDirection: 'row-reverse',
    height: 50,
    backgroundColor: theme.colors.error,
  },
  buttonTitle: {
    marginHorizontal: 4,
  },
  bottomSheet: {
    paddingHorizontal: theme.layout.screenPadding,
  },
  message: {
    textAlign: 'center',
    marginVertical: 10,
  },
});
