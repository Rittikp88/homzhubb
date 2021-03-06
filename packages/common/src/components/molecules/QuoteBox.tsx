import React, { ReactElement, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { TextInputSuffix } from '@homzhub/common/src/components/atoms/TextInputSuffix';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  document?: string;
  onSetPrice: (price: string) => void;
  onUploadAttachment: () => void;
  onRemoveAttachment: () => void;
}

const QuoteBox = (props: IProps): ReactElement => {
  const { document, onSetPrice, onUploadAttachment, onRemoveAttachment } = props;

  // TODO: (Shikha) - Use currency from selected asset
  const { currencySymbol, currencyCode } = useSelector(CommonSelectors.getDefaultCurrency);
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const [price, setPrice] = useState('');

  // HANDLERS
  const handlePrice = (value: string): void => {
    setPrice(value);
    onSetPrice(value);
  };
  // HANDLERS

  return (
    <View style={styles.container}>
      <Label type="regular" style={styles.heading}>
        {t('enterQuoteAmount')}
      </Label>
      <View style={styles.inputView}>
        <Label type="small" style={styles.heading}>
          {t('quotePrice')}
        </Label>
        <View style={styles.inputBox}>
          <TextInput value={price} keyboardType="number-pad" onChangeText={handlePrice} style={styles.input} />
          {!!currencySymbol && (
            <View style={styles.prefix}>
              <Label type="large">{currencySymbol}</Label>
            </View>
          )}
          {!!currencyCode && <TextInputSuffix text={currencyCode} />}
        </View>
      </View>
      <View style={[styles.documentContainer, !!document && styles.filledDocument]}>
        <View style={styles.row}>
          <Icon name={!document ? icons.attachDoc : icons.docFilled} color={theme.colors.darkTint5} size={20} />
          <TouchableOpacity
            activeOpacity={!document ? 0 : 0.8}
            onPress={!document ? onUploadAttachment : FunctionUtils.noop}
          >
            <Label type="regular" style={styles.document}>
              {document || t('common:noFileChosen')}
            </Label>
          </TouchableOpacity>
        </View>
        {!!document && (
          <Icon
            name={icons.circularCrossFilled}
            color={theme.colors.darkTint9}
            size={20}
            onPress={onRemoveAttachment}
          />
        )}
      </View>
    </View>
  );
};

export default QuoteBox;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  container: {
    marginVertical: 12,
  },
  heading: {
    color: theme.colors.darkTint3,
  },
  prefix: {
    position: 'absolute',
    left: 0,
    width: 24,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  filledDocument: {
    backgroundColor: theme.colors.gray9,
    padding: 7,
    borderRadius: 4,
  },
  inputView: {
    marginVertical: 16,
  },
  inputBox: {
    ...theme.form.input,
    justifyContent: 'center',
    marginTop: 6,
    backgroundColor: theme.colors.white,
  },
  document: {
    color: theme.colors.darkTint7,
    marginLeft: 6,
  },
  input: {
    marginLeft: 6,
  },
});
