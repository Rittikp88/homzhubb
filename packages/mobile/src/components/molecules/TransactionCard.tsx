import React, { ReactElement } from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, TextStyle, LayoutChangeEvent } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { FinancialRecords } from '@homzhub/common/src/domain/models/FinancialTransactions';

interface IProps extends WithTranslation {
  transaction: FinancialRecords;
  isExpanded: boolean;
  handleDownload: (refKey: string, fileName: string) => void;
  onCardPress: (height: number) => void;
}

interface IOwnState {
  height: number;
}

class TransactionCard extends React.PureComponent<IProps, IOwnState> {
  public state = {
    height: 100,
  };

  public render(): ReactElement {
    const { height } = this.state;
    const {
      isExpanded,
      transaction: {
        transactionDate,
        category,
        label,
        assetName,
        amount,
        currency,
        entryType,
        attachmentDetails: { fileName },
      },
      onCardPress,
    } = this.props;
    const textLength = theme.viewport.width / 20;

    let textStyle: StyleProp<TextStyle> = { color: theme.colors.completed };
    let pricePrefixText = '+';

    if (entryType === LedgerTypes.debit) {
      textStyle = { color: theme.colors.highPriority };
      pricePrefixText = '-';
    }
    const onPress = (): void => onCardPress(height);

    return (
      <View onLayout={this.onLayout}>
        <TouchableOpacity onPress={onPress} style={styles.transactionCardContainer}>
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
                {fileName ? <Icon name={icons.attachment} size={12} /> : null}
              </View>
              <Label maxLength={textLength} type="large" textType="bold">
                {label}
              </Label>
              <Label maxLength={textLength} type="large">
                {assetName}
              </Label>
            </View>
          </View>
          <View style={styles.commonAlignStyle}>
            <PricePerUnit
              textSizeType="small"
              textStyle={textStyle}
              currency={currency}
              prefixText={pricePrefixText}
              price={amount}
            />
            <Icon name={isExpanded ? icons.upArrow : icons.downArrow} size={24} style={styles.iconStyle} />
          </View>
        </TouchableOpacity>
        {isExpanded && this.renderTransactionDetails()}
        <Divider />
      </View>
    );
  }

  private renderTransactionDetails = (): ReactElement => {
    const {
      t,
      handleDownload,
      transaction: {
        entryType,
        notes,
        tellerName,
        attachmentDetails: { fileName, presignedReferenceKey },
      },
    } = this.props;

    if (!tellerName && !fileName && !notes) {
      return (
        <Label style={styles.noDescriptionText} type="large">
          {t('noDescriptionText')}
        </Label>
      );
    }

    const onDownload = (): void => handleDownload(presignedReferenceKey, fileName);
    let nameLabel = t('paidToText');
    if (entryType === LedgerTypes.credit) {
      nameLabel = t('receivedFrom');
    }

    return (
      <View style={styles.transactionDetailContainer}>
        <View style={styles.commonMarginStyle}>
          <Label type="regular" style={styles.label}>
            {nameLabel}
          </Label>
          <View style={styles.paidToStyles}>
            <Label type="large">{tellerName}</Label>
          </View>
        </View>
        {!!fileName && (
          <View style={styles.commonMarginStyle}>
            <Label type="regular" style={styles.label}>
              {t('invoice')}
            </Label>
            <TouchableOpacity onPress={onDownload} style={styles.commonAlignStyle}>
              <Label style={styles.attachmentStyles} type="large">
                {fileName}
              </Label>
              <Icon name={icons.download} size={20} color={theme.colors.primaryColor} />
            </TouchableOpacity>
          </View>
        )}
        {!!notes && (
          <View>
            <Label type="regular" style={styles.label}>
              {t('notes')}
            </Label>
            <Label type="large">{notes}</Label>
          </View>
        )}
      </View>
    );
  };

  private onLayout = (e: LayoutChangeEvent): void => {
    const { height: newHeight } = e.nativeEvent.layout;
    const { height } = this.state;
    if (newHeight === height) {
      return;
    }
    this.setState({ height: newHeight });
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
    width: 51,
    height: 60,
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
  noDescriptionText: {
    textAlign: 'center',
  },
  label: {
    color: theme.colors.darkTint5,
  },
});
