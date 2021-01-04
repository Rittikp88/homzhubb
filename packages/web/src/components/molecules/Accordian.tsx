import React, { useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';

interface IProps {
  headerComponent?: React.ReactNode;
  accordianContent?: React.ReactNode;
}

const Accordian: React.FC<IProps> = (props: IProps) => {
  const { headerComponent, accordianContent } = props;
  const [setActive, setActiveState] = useState('');
  const [setHeight, setHeightState] = useState('0px');

  const content = useRef(null);

  const toggleAccordion = (): void => {
    setActiveState(setActive === '' ? 'active' : '');
    setHeightState(setActive === 'active' ? '0px' : '1500px');
  };
  return (
    <View style={styles.accordianContainer}>
      <Divider containerStyles={styles.divider} />
      <TouchableOpacity onPress={toggleAccordion}>{headerComponent}</TouchableOpacity>
      <View ref={content} style={[styles.accordianContent, { maxHeight: `${setHeight}` }]}>
        {accordianContent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  accordianContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
  },
  divider: { borderColor: theme.colors.background },
  accordianContent: {
    backgroundColor: theme.colors.grey1,
    overflow: 'hidden',
    transition: 'max-height 0.6s ease',
    borderRadius: 4,
  },
});
export default Accordian;
