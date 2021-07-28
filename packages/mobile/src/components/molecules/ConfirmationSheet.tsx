import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';

interface IProps {
  isVisible: boolean;
  onCloseSheet: () => void;
  onPressDelete: () => void;
  sheetTitle?: string;
  sheetHeight?: number;
  message?: string;
}

const ConfirmationSheet = (props: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const {
    isVisible,
    onCloseSheet,
    onPressDelete,
    sheetTitle = t('common:confirm'),
    sheetHeight = theme.viewport.height / 3,
    message = t('property:deleteConfirmation'),
  } = props;

  return (
    <BottomSheet visible={isVisible} headerTitle={sheetTitle} sheetHeight={sheetHeight} onCloseSheet={onCloseSheet}>
      <View style={styles.bottomSheet}>
        <Text type="small" style={styles.message}>
          {message}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            type="secondary"
            title={t('common:cancel')}
            onPress={onCloseSheet}
            titleStyle={styles.buttonTitle}
            containerStyle={styles.cancelButton}
          />
          <Button
            type="primary"
            title={t('common:delete')}
            titleStyle={styles.buttonTitle}
            onPress={onPressDelete}
            containerStyle={styles.deleteButton}
          />
        </View>
      </View>
    </BottomSheet>
  );
};

export default ConfirmationSheet;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  cancelButton: {
    marginLeft: 10,
    flexDirection: 'row-reverse',
    height: 50,
  },
  deleteButton: {
    flexDirection: 'row-reverse',
    height: 50,
    backgroundColor: theme.colors.error,
  },
  buttonTitle: {
    marginHorizontal: 4,
  },
  bottomSheet: {
    paddingHorizontal: theme.layout.screenPadding,
  },
  message: {
    textAlign: 'center',
    marginVertical: 10,
  },
});
