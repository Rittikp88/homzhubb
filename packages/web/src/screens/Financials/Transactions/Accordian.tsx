import React, { useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';

const Accordian: React.FC = () => {
  const { t } = useTranslation();

  const [setActive, setActiveState] = useState('');
  const [setHeight, setHeightState] = useState('0px');

  const content = useRef(null);

  const toggleAccordion = (): void => {
    setActiveState(setActive === '' ? 'active' : '');
    setHeightState(setActive === 'active' ? '0px' : '300px');
  };
  return (
    <View style={styles.accordianContainer}>
      <Divider containerStyles={styles.divider} />
      <TouchableOpacity onPress={toggleAccordion}>
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
      </TouchableOpacity>
      <View ref={content} style={[styles.accordianContent, { maxHeight: `${setHeight}` }]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  titleContent: { marginTop: 20, color: theme.colors.darkTint5 },
  accordianContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
  },
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
  divider: { borderColor: theme.colors.background },
  contentLeftChild: { flexDirection: 'row', justifyContent: 'space-around' },
  text1: { color: theme.colors.darkTint4 },
  text2: { color: theme.colors.darkTint3 },
  date: { color: theme.colors.darkTint2, marginTop: 10 },
  month: { textAlign: 'center', color: theme.colors.darkTint6 },
  leftChild: { flexDirection: 'row' },
  accordianContent: {
    paddingLeft: 85,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.grey1,
    overflow: 'hidden',
    transition: 'max-height 0.6s ease',
    borderRadius: 4,
  },
  title: { marginRight: 40, marginBottom: 20 },
  iconContainer: { flexDirection: 'row' },
  rightChild: { flexDirection: 'row' },
  icon: { marginLeft: 10 },
  amount: { color: theme.colors.completed },
  name: { marginTop: 25, color: theme.colors.darkTint2 },
  note: { color: theme.colors.darkTint3, marginTop: 25 },
  attachment: { flexDirection: 'row', marginTop: 25 },
  attachmentText: { color: theme.colors.active },
  occupation: { color: theme.colors.darkTint3, margin: 20 },
});
export default Accordian;
