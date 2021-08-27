import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { RNSwitch } from '@homzhub/common/src/components/atoms/Switch';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import ChipField from '@homzhub/common/src/components/molecules/ChipField';
import InputGroup from '@homzhub/common/src/components/molecules/InputGroup';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const RequestQuote = (): React.ReactElement => {
  const { goBack } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);

  const [emails, setEmails] = useState<string[]>([]);
  const [invite, setInvite] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');

  const onUpdateEmails = (values: string[]): void => {
    setEmails(values);
  };

  return (
    <UserScreen title={selectedTicket?.propertyName ?? ''} pageTitle={t('approveQuote')} onBackPress={goBack}>
      <View style={styles.container}>
        <Text type="small" textType="semiBold">
          {t('requestQuote')}
        </Text>
        <Label type="large">{t('requestDescription')}</Label>
        <ChipField
          label={t('assetFinancial:category')}
          placeholder={t('ticketCategory')}
          chipColor={theme.colors.primaryColor}
          onSetValue={FunctionUtils.noop}
        />
        <View style={styles.switchContainer}>
          <Text type="small" textType="semiBold">
            {t('invitePartner')}
          </Text>
          <RNSwitch selected={invite} onToggle={setInvite} />
        </View>
        <InputGroup
          data={emails}
          label={t('auth:emails')}
          placeholder={t('auth:enterEmailText')}
          buttonLabel={t('vendorEmail')}
          updateData={onUpdateEmails}
          addButtonDeviceStyle={styles.verticalStyle}
          inputContainer={styles.inputContainer}
        />
        <TextArea
          value={comment}
          label={t('common:comments')}
          helpText={t('common:optional')}
          placeholder={t('common:typeComment')}
          onMessageChange={setComment}
          containerStyle={styles.verticalStyle}
        />
        <Button type="primary" title={t('sendRequest')} />
      </View>
    </UserScreen>
  );
};

export default RequestQuote;

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verticalStyle: {
    marginVertical: 10,
  },
  inputContainer: {
    marginTop: 10,
  },
});
