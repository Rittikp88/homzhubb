import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const Header = (isOpen: boolean, item: any): React.ReactElement => {
  const { t } = useTranslation();
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const { question } = item;
  return (
    <View style={styles.accordianHeader}>
      <View style={styles.leftChild}>
        <Text
          type="small"
          textType="regular"
          style={[styles.titleContent, isTablet && styles.titleContentTablet, isMobile && styles.titleContentMobile]}
        >
          {t('common:questionSymbol')} {question}
        </Text>
      </View>
      <View style={styles.rightChild}>
        <Icon style={styles.icon} name={isOpen ? icons.minus : icons.plus} size={20} color={theme.colors.darkTint3} />
      </View>
    </View>
  );
};

const accordianContent = (html: any): React.ReactElement => {
  return (
    <View style={styles.content}>
      <Label type="large" textType="regular" style={styles.contentLabel}>
        {html}
      </Label>
    </View>
  );
};

interface IQuestionProps {
  item: any;
}

const QuestionCards: React.FC<IQuestionProps> = (props: IQuestionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [setHeight, setHeightState] = useState('0px');
  const content = useRef(null);
  const toggleAccordion = (): void => {
    setIsOpen(!isOpen);
    setHeightState(isOpen ? '0px' : '1500px');
  };
  const { item } = props;
  const { question, answerRichText } = item;
  return (
    <View style={styles.cardContainer} key={question}>
      <View style={styles.accordianContainer}>
        <TouchableOpacity onPress={toggleAccordion}>{Header(isOpen, item)}</TouchableOpacity>
        <View ref={content} style={[styles.accordianContent, { maxHeight: `${setHeight}` }]}>
          {answerRichText && accordianContent(answerRichText.html)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  accordianHeader: {
    margin: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  leftChild: {
    flexDirection: 'row',
  },
  titleContent: {
    width: 500,
    color: theme.colors.darkTint2,
    padding: 12,
  },
  titleContentTablet: {
    width: 620,
  },
  titleContentMobile: {
    width: 300,
  },
  cardContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    margin: 10,
    borderColor: theme.colors.darkTint10,
    borderWidth: 1,
  },
  rightChild: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
  },
  content: {
    margin: 10,
    marginTop: -10,
    alignContent: 'center',
  },
  contentLabel: {
    color: theme.colors.darkTint4,
    paddingTop: 20,
    margin: 16,
    marginBottom: 0,
  },
  accordianContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
  },
  accordianContent: {
    backgroundColor: theme.colors.grey1,
    overflow: 'hidden',
    transition: 'max-height 0.6s ease',
    borderRadius: 4,
  },
});
export default QuestionCards;
