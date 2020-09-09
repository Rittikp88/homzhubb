import React, { ReactElement } from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, TextStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { PricePerUnit, Label } from '@homzhub/common/src/components';
import { LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { FinancialRecords } from '@homzhub/common/src/domain/models/FinancialTransactions';

interface IState {
  shouldExpand: boolean;
}

interface IProps extends WithTranslation {
  transaction: FinancialRecords;
}

class TransactionCard extends React.PureComponent<IProps, IState> {
  public state = {
    shouldExpand: false,
  };

  public render(): ReactElement {
    const { shouldExpand } = this.state;
    const {
      transaction: { transactionDate, category, label, assetName, amount, currencyCode, entryType, attachmentName },
    } = this.props;

    let textStyle: StyleProp<TextStyle> = { color: theme.colors.completed };
    let pricePrefixText = '+';

    if (entryType === LedgerTypes.debit) {
      textStyle = { color: theme.colors.highPriority };
      pricePrefixText = '-';
    }

    return (
      <>
        <TouchableOpacity onPress={this.toggleAccordion} style={styles.transactionCardContainer}>
          <View style={styles.commonAlignStyle}>
            <View style={styles.dateStyle}>
              <Label type="regular" textType="bold">
                {DateUtils.getDisplayDate(transactionDate, DateFormats.DD)}
              </Label>
              <Label type="large">{DateUtils.getDisplayDate(transactionDate, DateFormats.MMM)}</Label>
            </View>
            <View>
              <View style={styles.commonAlignStyle}>
                <Label type="regular">{category}</Label>
                {attachmentName ? <Icon name={icons.attachment} size={12} /> : null}
              </View>
              <Label maxLength={21} type="large" textType="bold">
                {label}
              </Label>
              <Label maxLength={21} type="large">
                {assetName}
              </Label>
            </View>
          </View>
          <View style={styles.commonAlignStyle}>
            <PricePerUnit
              textSizeType="small"
              textStyle={textStyle}
              priceTransformation={false}
              currency={currencyCode}
              prefixText={pricePrefixText}
              price={amount}
            />
            <Icon name={shouldExpand ? icons.upArrow : icons.downArrow} size={24} style={styles.iconStyle} />
          </View>
        </TouchableOpacity>
        {shouldExpand && this.renderTransactionDetails()}
      </>
    );
  }

  private renderTransactionDetails = (): ReactElement => {
    const {
      t,
      transaction: { entryType, notes, tellerName, attachmentName },
    } = this.props;

    return (
      <View style={styles.transactionDetailContainer}>
        {tellerName ? (
          <View style={styles.commonMarginStyle}>
            <Label type="regular">{entryType === LedgerTypes.credit ? t('receivedFrom') : t('paidToText')}</Label>
            <View style={styles.paidToStyles}>
              <Label type="large">{tellerName}</Label>
            </View>
          </View>
        ) : null}
        {attachmentName ? (
          <View style={styles.commonMarginStyle}>
            <Label type="regular">{t('invoice')}</Label>
            <TouchableOpacity style={styles.commonAlignStyle}>
              <Label style={styles.attachmentStyles} type="large">
                {attachmentName}
              </Label>
              <Icon name={icons.download} size={20} color={theme.colors.primaryColor} />
            </TouchableOpacity>
          </View>
        ) : null}
        {notes ? (
          <View>
            <Label type="regular">{t('notes')}</Label>
            <Label type="large">{notes}</Label>
          </View>
        ) : null}
      </View>
    );
  };

  private toggleAccordion = (): void => {
    this.setState((prev) => ({
      shouldExpand: !prev.shouldExpand,
    }));
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetFinancial)(TransactionCard);

const styles = StyleSheet.create({
  transactionCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  commonAlignStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateStyle: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.shadow,
    borderRadius: 4,
    padding: 10,
    marginRight: 12,
  },
  iconStyle: {
    marginLeft: 10,
  },
  transactionDetailContainer: {
    padding: 16,
    backgroundColor: theme.colors.grey1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  paidToStyles: {
    flexDirection: 'row',
  },
  attachmentStyles: {
    color: theme.colors.primaryColor,
    marginRight: 6,
  },
  commonMarginStyle: {
    marginBottom: 24,
  },
});
