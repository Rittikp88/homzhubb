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
  key: string;
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
      transaction: { transactionDate, category, label, assetName, amount, currency, entryType, attachmentDetails },
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
              <Label type="large" textType="bold" style={{ color: theme.colors.darkTint2 }}>
                {DateUtils.getDisplayDate(transactionDate, DateFormats.DD)}
              </Label>
              <Label type="regular" style={{ color: theme.colors.darkTint6 }}>
                {DateUtils.getDisplayDate(transactionDate, DateFormats.MMM)}
              </Label>
            </View>
          </View>
          <View style={styles.textContainer}>
            <View style={styles.commonAlignStyle}>
              <Label type="regular" numberOfLines={1}>
                {category}
              </Label>
              {attachmentDetails.length ? <Icon name={icons.attachment} size={12} /> : null}
            </View>
            <Label maxLength={textLength} type="large" textType="bold" numberOfLines={1}>
              {label}
            </Label>
            <Label maxLength={textLength} type="large" numberOfLines={1}>
              {assetName}
            </Label>
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
      transaction: { entryType, notes, tellerName, attachmentDetails },
    } = this.props;

    const hasAttachments = attachmentDetails.length > 0;

    if (!tellerName && !hasAttachments && !notes) {
      return (
        <Label style={styles.noDescriptionText} type="large">
          {t('noDescriptionText')}
        </Label>
      );
    }

    let nameLabel = t('paidToText');
    if (entryType === LedgerTypes.credit) {
      nameLabel = t('receivedFrom');
    }

    const RenderAttachments = (): React.ReactElement | null => {
      const attachmentName = (name: string, extension: string): string =>
        name.length > 20 ? `${name.slice(0, 20)}...${extension}` : name;
      const { key } = this.props;

      if (hasAttachments) {
        const title = attachmentDetails.length === 1 ? t('invoice') : t('invoices');
        return (
          <>
            <Label type="regular" style={styles.label}>
              {title}
            </Label>
            {attachmentDetails.map((file) => {
              const { fileName, presignedReferenceKey } = file;
              const extension = fileName.split('.').reverse()[0];
              const onDownload = (): void => handleDownload(presignedReferenceKey, fileName);
              const isLast = attachmentDetails.indexOf(file) === attachmentDetails.length - 1;
              const attachmentKey = `${key}:[${attachmentDetails.indexOf(file)}]`;
              return (
                <View style={!isLast ? styles.attachment : styles.commonMarginStyle} key={attachmentKey}>
                  <TouchableOpacity onPress={onDownload} style={styles.commonAlignStyle}>
                    <Label style={styles.attachmentStyles} type="large">
                      {attachmentName(fileName, extension)}
                    </Label>
                    <Icon name={icons.download} size={20} color={theme.colors.primaryColor} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </>
        );
      }
      return null;
    };

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
        <RenderAttachments />
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
    width: 52,
    height: 60,
    borderWidth: 1,
    borderColor: theme.colors.darkTint10,
    borderRadius: 4,
    paddingVertical: 12,
    marginEnd: 12,
  },
  textContainer: {
    flex: 1,
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
  attachment: {
    marginBottom: 20,
  },
});
