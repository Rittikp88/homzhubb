import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';
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
      <Divider />
      <View style={styles.formContainer}>
        <Form />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, marginHorizontal: 24 },
  formContainer: { flexDirection: 'row' },
  headerText: { color: theme.colors.darkTint2 },
});
export default AddRecordsForm;
