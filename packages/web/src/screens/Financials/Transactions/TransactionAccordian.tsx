import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
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

  return (
    <View style={styles.content}>
      <View style={styles.contentLeftChild}>
        <View style={styles.title}>
          <Text type="small" textType="light" style={styles.titleContent}>
            {t('assetFinancial:paidTo')}
          </Text>
          <Text type="small" textType="light" style={styles.titleContent}>
            {t('assetFinancial:invoice')}
          </Text>
          <Text type="small" textType="light" style={styles.titleContent}>
            {t('assetFinancial:notes')}
          </Text>
        </View>
        <View>
          <Text type="small" textType="regular" style={styles.name}>
            Rajat Kumar Gupt
          </Text>
          <View style={styles.attachment}>
            <Text type="small" textType="regular" style={styles.attachmentText}>
              Attachment Name
            </Text>
            <Icon style={styles.icon} name={icons.download} size={20} color={theme.colors.blue} />
          </View>

          <Text type="small" textType="regular" style={styles.note}>
            Fixed on the right time
          </Text>
        </View>
      </View>
      <Text type="small" textType="regular" style={styles.occupation}>
        Owner
      </Text>
    </View>
  );
};

const TransactionAccordian: React.FC = () => {
  return <Accordian headerComponent={<Header />} accordianContent={<AccordianContent />} />;
};

const styles = StyleSheet.create({
  titleContent: { marginTop: 20, color: theme.colors.darkTint5 },

  accordianHeader: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  contentLeftChild: { flexDirection: 'row', justifyContent: 'space-around' },
  text1: { color: theme.colors.darkTint4 },
  text2: { color: theme.colors.darkTint3 },
  date: { color: theme.colors.darkTint2, marginTop: 10 },
  month: { textAlign: 'center', color: theme.colors.darkTint6 },
  leftChild: { flexDirection: 'row' },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 85,
  },
  title: { marginRight: 40, marginBottom: 20 },
  iconContainer: { flexDirection: 'row' },
  rightChild: { flexDirection: 'row' },
  icon: { marginLeft: 8 },
  amount: { color: theme.colors.completed },
  name: { marginTop: 20, color: theme.colors.darkTint2 },
  note: { color: theme.colors.darkTint3, marginTop: 16 },
  attachment: { flexDirection: 'row', marginTop: 25 },
  attachmentText: { color: theme.colors.active },
  occupation: { color: theme.colors.darkTint3, margin: 20 },
});
export default TransactionAccordian;
