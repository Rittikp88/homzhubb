import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import Accordian from '@homzhub/web/src/components/molecules/Accordian';

const Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.accordianHeader}>
      <View style={styles.leftChild}>
        <View style={styles.calender}>
          <Label type="large" textType="semiBold" style={styles.date}>
            12
          </Label>
          <Label type="regular" textType="light" style={styles.month}>
            Apr
          </Label>
        </View>
        <View>
          <View style={styles.iconContainer}>
            <Label type="regular" textType="regular" style={styles.text1}>
              {t('property:maintenance')}
            </Label>
            <Icon name={icons.attachment} size={18} color={theme.colors.darkTint4} />
          </View>
          <Label type="large" textType="semiBold" style={styles.text2}>
            {t('assetFinancial:plumbingFees')}
          </Label>
          <Label type="large" textType="regular" style={styles.text2}>
            Godrej Prime
          </Label>
        </View>
      </View>
      <View style={styles.rightChild}>
        <Text type="small" textType="semiBold" style={styles.amount}>
          + $2000
        </Text>
        <Icon style={styles.icon} name={icons.downArrow} size={20} color={theme.colors.darkTint3} />
      </View>
    </View>
  );
};

const AccordianContent: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const transactionDetailsStyles = transactionDetailsStyle(isMobile);
  return (
    <View style={transactionDetailsStyles.content}>
      <View style={transactionDetailsStyles.contentLeftChild}>
        <View style={transactionDetailsStyles.childs}>
          <Text type="small" textType="light" style={transactionDetailsStyles.titleContent}>
            {t('assetFinancial:paidTo')}
          </Text>
          <Text type="small" textType="regular" style={transactionDetailsStyles.name}>
            Rajat Kumar Gupt
          </Text>
        </View>
        <View style={transactionDetailsStyles.childs}>
          <Text type="small" textType="light" style={transactionDetailsStyles.titleContent}>
            {t('assetFinancial:invoice')}
          </Text>
          <View style={transactionDetailsStyles.attachment}>
            <Text type="small" textType="regular" style={transactionDetailsStyles.attachmentText}>
              Attachment Name
            </Text>
            <Icon style={transactionDetailsStyles.icon} name={icons.download} size={20} color={theme.colors.blue} />
          </View>
        </View>
        <View style={transactionDetailsStyles.childs}>
          <Text type="small" textType="light" style={transactionDetailsStyles.titleContent}>
            {t('assetFinancial:notes')}
          </Text>

          <Text type="small" textType="regular" style={transactionDetailsStyles.note}>
            Fixed on the right time
          </Text>
        </View>
      </View>
      <Text type="small" textType="regular" style={transactionDetailsStyles.occupation}>
        Owner
      </Text>
    </View>
  );
};

const TransactionAccordian: React.FC = () => {
  return <Accordian headerComponent={<Header />} accordianContent={<AccordianContent />} />;
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
  calender: {
    borderWidth: 1,
    borderColor: theme.colors.darkTint10,
    borderRadius: 4,
    alignItems: 'center',
    height: 60,
    width: 52,
    marginRight: 12,
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
  text1: {
    color: theme.colors.darkTint4,
  },
  text2: {
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
  titleContent: ViewStyle;
  name: ViewStyle;
  attachment: ViewStyle;
  attachmentText: ViewStyle;
  icon: ViewStyle;
  note: ViewStyle;
  occupation: ViewStyle;
  childs: ViewStyle;
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
    childs: {
      flexDirection: isMobile ? 'column' : 'row',
      marginVertical: 12,
    },
    titleContent: {
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
