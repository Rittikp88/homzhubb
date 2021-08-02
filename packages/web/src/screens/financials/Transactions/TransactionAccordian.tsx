import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import DisplayDate from '@homzhub/common/src/components/atoms/DisplayDate';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import Accordian from '@homzhub/web/src/components/molecules/Accordian';
import { FinancialRecords } from '@homzhub/common/src/domain/models/FinancialTransactions';

interface IProps {
  transactionItem: FinancialRecords;
}

const Header: React.FC<IProps> = (props: IProps) => {
  const { transactionItem } = props;
  const { label, amount, currency, assetName, transactionDate } = transactionItem;
  const { currencySymbol } = currency;
  return (
    <View style={styles.accordianHeader}>
      <View style={styles.leftChild}>
        <DisplayDate date={transactionDate} containerStyle={styles.dateContainer} />
        <View>
          <View style={styles.iconContainer}>
            <Label type="regular" textType="regular" style={styles.maintenance}>
              {label}
            </Label>
            <Icon name={icons.attachment} size={18} color={theme.colors.darkTint4} />
          </View>
          <Label type="large" textType="semiBold" style={styles.plumbingFees}>
            {label}
          </Label>
          <Label type="large" textType="regular" style={styles.plumbingFees}>
            {assetName}
          </Label>
        </View>
      </View>
      <View style={styles.rightChild}>
        <Text type="small" textType="semiBold" style={styles.amount}>
          {currencySymbol} {amount}
        </Text>
        <Icon style={styles.icon} name={icons.downArrow} size={20} color={theme.colors.darkTint3} />
      </View>
    </View>
  );
};

const AccordianContent: React.FC<IProps> = (props: IProps) => {
  const { transactionItem } = props;
  const { payerName, receiverName, notes } = transactionItem;
  // const { attachmentDetails } = { TODOS: Lakshit - Remove Post Integration of Transactions List
  //   ...transactionItem,
  //   attachmentDetails: transactionItem.attachmentDetails || {},
  // };
  // const { name } = { ...attachmentDetails, name: attachmentDetails.name || '' };
  const { t } = useTranslation();
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const styles = transactionDetailsStyle(isMobile);
  return (
    <View style={styles.content}>
      <View style={styles.contentLeftChild}>
        <View style={styles.detailContainer}>
          <Text type="small" textType="light" style={styles.detailHeading}>
            {t('assetFinancial:paidTo')}
          </Text>
          <Text type="small" textType="regular" style={styles.name}>
            {payerName}
          </Text>
        </View>
        <View style={styles.detailContainer}>
          <Text type="small" textType="light" style={styles.detailHeading}>
            {t('assetFinancial:invoice')}
          </Text>
          <View style={styles.attachment}>
            <Text type="small" textType="regular" style={styles.attachmentText}>
              {t('common:media')}
            </Text>
            <Icon style={styles.icon} name={icons.download} size={20} color={theme.colors.blue} />
          </View>
        </View>
        <View style={styles.detailContainer}>
          <Text type="small" textType="light" style={styles.detailHeading}>
            {t('assetFinancial:notes')}
          </Text>

          <Text type="small" textType="regular" style={styles.note}>
            {notes}
          </Text>
        </View>
      </View>
      <Text type="small" textType="regular" style={styles.occupation}>
        {receiverName}
      </Text>
    </View>
  );
};

const TransactionAccordian: React.FC<IProps> = (props: IProps) => {
  const { transactionItem } = props;
  return (
    <Accordian
      headerComponent={<Header transactionItem={transactionItem} />}
      accordianContent={<AccordianContent transactionItem={transactionItem} />}
    />
  );
};

const styles = StyleSheet.create({
  accordianHeader: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftChild: {
    flexDirection: 'row',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: theme.colors.darkTint2,
    marginTop: 10,
  },
  month: {
    textAlign: 'center',
    color: theme.colors.darkTint6,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  maintenance: {
    color: theme.colors.darkTint4,
  },
  plumbingFees: {
    color: theme.colors.darkTint3,
  },
  rightChild: {
    flexDirection: 'row',
  },
  amount: {
    color: theme.colors.completed,
  },
  icon: {
    marginLeft: 8,
  },
});

interface ITransactionItemStyle {
  content: ViewStyle;
  contentLeftChild: ViewStyle;
  detailHeading: ViewStyle;
  name: ViewStyle;
  attachment: ViewStyle;
  attachmentText: ViewStyle;
  icon: ViewStyle;
  note: ViewStyle;
  occupation: ViewStyle;
  detailContainer: ViewStyle;
}

const transactionDetailsStyle = (isMobile: boolean): StyleSheet.NamedStyles<ITransactionItemStyle> =>
  StyleSheet.create<ITransactionItemStyle>({
    content: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginLeft: isMobile ? 20 : 88,
    },
    contentLeftChild: {
      justifyContent: 'space-around',
      marginVertical: 16,
    },
    detailContainer: {
      flexDirection: isMobile ? 'column' : 'row',
      marginVertical: 12,
    },
    detailHeading: {
      color: theme.colors.darkTint5,
      marginRight: isMobile ? 0 : 60,
      marginBottom: isMobile ? 8 : 0,
    },
    name: {
      color: theme.colors.darkTint2,
    },
    attachment: {
      flexDirection: 'row',
    },
    attachmentText: {
      color: theme.colors.active,
    },
    icon: {
      marginLeft: 8,
    },
    note: {
      color: theme.colors.darkTint3,
    },
    occupation: {
      color: theme.colors.darkTint3,
      margin: 20,
    },
  });
export default TransactionAccordian;
