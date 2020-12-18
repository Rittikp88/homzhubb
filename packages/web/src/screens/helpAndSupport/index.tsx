import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import FrequentlyAskedQuestion from './frequentlyAskedQuestions';

const HelpAndSupport: FC = () => {
  return (
    <View style={styles.container}>
      <FrequentlyAskedQuestion />
    </View>
  );
};

export default HelpAndSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
