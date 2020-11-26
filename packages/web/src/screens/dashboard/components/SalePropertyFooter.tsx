import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { ContactPerson } from '@homzhub/common/src/components/molecules/ContactPerson';

// TODO (LAKSHIT) - change dummy data with actual api data

const SalePropertyFooter = (): React.ReactElement => {
  const onContactTypeClicked = (): void => {
    //  TODOS LAKSHIT
  };
  const contactData = {
    fullName: 'Jane Cooper',
    designation: 'Property Agent',
    phoneNumber: '',
    onContactTypeClicked,
  };
  return (
    <View style={styles.card}>
      <ContactPerson {...contactData} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: 322,
    backgroundColor: theme.colors.white,
    marginHorizontal: 4,
    borderTopColor: theme.colors.background,
    borderTopWidth: 1,
    paddingBottom: 15,
    paddingTop: 12,
    paddingHorizontal: 16,
    minHeight: '70px',
  },
});

export default SalePropertyFooter;