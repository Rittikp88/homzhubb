import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import Form from '@homzhub/web/src/screens/Financials/AddRecords/form';

const AddRecordsForm = (): React.ReactElement => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text type="small" textType="semiBold" style={styles.headerText}>
          Add Records
        </Text>
        <Icon name={icons.close} size={20} color={theme.colors.darkTint3} />
      </View>
      <Divider containerStyles={styles.divider} />
      <ScrollView>
        <View style={styles.formContainer}>
          <Form />
        </View>
        <Divider containerStyles={styles.divider} />
        <View style={styles.actionButton}>
          <Button type="secondary" title="Cancel" />
          <Button type="secondary" title="Add Now" containerStyle={styles.button} titleStyle={styles.titleStyle} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 500,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginHorizontal: 24,
  },
  formContainer: {
    flexDirection: 'row',
  },
  headerText: {
    color: theme.colors.darkTint2,
  },
  divider: { borderColor: theme.colors.divider },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 16,
  },
  button: {
    marginLeft: 16,
    backgroundColor: theme.colors.blue,
  },
  titleStyle: {
    color: theme.colors.white,
  },
});
export default AddRecordsForm;
