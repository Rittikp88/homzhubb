import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import Form from '@homzhub/web/src/screens/Financials/AddRecords/form';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const AddRecordsForm = (): React.ReactElement => {
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const addRecordStyles = addRecordsStyle(isMobile);

  return (
    <View style={addRecordStyles.container}>
      <View style={addRecordStyles.header}>
        <Text type="small" textType="semiBold" style={addRecordStyles.headerText}>
          Add Records
        </Text>
        <Icon name={icons.close} size={20} color={theme.colors.darkTint3} />
      </View>
      <Divider containerStyles={addRecordStyles.divider} />
      <ScrollView>
        <View style={addRecordStyles.formContainer}>
          <Form />
        </View>
        <Divider containerStyles={addRecordStyles.divider} />
        <View style={addRecordStyles.actionButton}>
          <Button type="secondary" title="Cancel" titleStyle={addRecordStyles.title} />
          <Button
            type="secondary"
            title="Add Now"
            containerStyle={addRecordStyles.button}
            titleStyle={addRecordStyles.titleStyle}
          />
        </View>
      </ScrollView>
    </View>
  );
};

interface IAddRecrdsItemStyle {
  container: ViewStyle;
  formContainer: ViewStyle;
  button: ViewStyle;
  header: ViewStyle;
  divider: ViewStyle;
  headerText: ViewStyle;
  actionButton: ViewStyle;
  titleStyle: ViewStyle;
  title: ViewStyle;
}

const addRecordsStyle = (isMobile: boolean): StyleSheet.NamedStyles<IAddRecrdsItemStyle> =>
  StyleSheet.create<IAddRecrdsItemStyle>({
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
    divider: {
      borderColor: theme.colors.divider,
    },
    actionButton: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      margin: 16,
    },
    button: {
      marginLeft: 16,
      padding: 0,
      backgroundColor: theme.colors.blue,
    },
    title: {
      marginHorizontal: isMobile ? 16 : 36,
    },
    titleStyle: {
      color: theme.colors.white,
      marginHorizontal: isMobile ? 16 : 36,
    },
  });

export default AddRecordsForm;
