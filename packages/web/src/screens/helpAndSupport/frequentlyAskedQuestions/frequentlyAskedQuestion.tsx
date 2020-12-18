import React, { useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';

const FrequentlyAskedQuestionCard: React.FC = () => {
  const [setActive, setActiveState] = useState('');
  const [setHeight, setHeightState] = useState('0px');

  const content = useRef(null);

  const toggleAccordion = (): void => {
    setActiveState(setActive === '' ? 'active' : '');
    setHeightState(setActive === 'active' ? '0px' : '300px');
  };
  return (
    <View style={styles.accordianContainer}>
      <TouchableOpacity onPress={toggleAccordion}>
        <View style={styles.accordianHeader}>
          <View style={styles.leftChild}>
            <Text type="small" textType="regular" style={styles.titleContent}>
              Q. Question Goes Here ?
            </Text>
          </View>
          <View style={styles.rightChild}>
            <Icon style={styles.icon} name={icons.downArrow} size={20} color={theme.colors.darkTint3} />
          </View>
        </View>
      </TouchableOpacity>
      <View ref={content} style={[styles.accordianContent, { maxHeight: `${setHeight}` }]}>
        <Label type="large" textType="regular" style={styles.contentLabel}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et orci vestibulum lectus et etiam consectetur
          posuere pellentesque convallis. posuere pellentesque convallis.
        </Label>
        <View style={styles.videoContainer}>Video Card</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  accordianContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    margin: 10,
    marginLeft: 20,
    borderColor: theme.colors.darkTint10,
    borderWidth: 1,
  },
  accordianHeader: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftChild: { flexDirection: 'row' },
  titleContent: { color: theme.colors.darkTint2 },
  rightChild: { flexDirection: 'row' },
  icon: { marginLeft: 10 },
  accordianContent: {
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
    transition: 'max-height 0.6s ease',
    borderRadius: 4,
    margin: 10,
    marginTop: -10,
  },
  contentLabel: { color: theme.colors.darkTint4, paddingTop: 20, margin: 16, marginBottom: 0 },
  videoContainer: {
    height: 400,
    backgroundColor: theme.colors.background,
    margin: 16,
    alignItems: 'center',
  },
});
export default FrequentlyAskedQuestionCard;
