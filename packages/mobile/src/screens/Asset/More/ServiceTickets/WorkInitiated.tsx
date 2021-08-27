import React, { ReactElement, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const WorkInitiated = (): ReactElement => {
  const { goBack } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  const [comment, setComment] = useState('');
  const [isLoading, setLoader] = useState(false);

  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);

  // HANDLERS

  const onSubmit = async (): Promise<void> => {
    try {
      setLoader(true);
      // Todo (Praharsh) : Call API here
      await FunctionUtils.noopAsync();
      setLoader(false);
      goBack();
      AlertHelper.success({ message: t('workInitiatedSuccess') });
    } catch (e) {
      setLoader(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details.message), statusCode: e.details.statusCode });
    }
  };
  // HANDLERS

  return (
    <UserScreen
      title={selectedTicket?.propertyName ?? ''}
      pageTitle={t('workInitiated')}
      onBackPress={goBack}
      loading={isLoading}
    >
      <View style={styles.container}>
        <Text type="small" textType="semiBold">
          {t('updateYourWorkProgress')}
        </Text>
        <Label type="large" style={styles.description}>
          {t('updateWorkProgressInfoText')}
        </Label>

        <TextArea
          value={comment}
          label={t('common:comment')}
          helpText={t('common:optional')}
          placeholder={t('common:typeComment')}
          wordCountLimit={450}
          onMessageChange={setComment}
          containerStyle={styles.commentBox}
        />
        <Button type="primary" title={t('common:submit')} onPress={onSubmit} />
      </View>
    </UserScreen>
  );
};

export default WorkInitiated;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  description: {
    color: theme.colors.darkTint3,
    marginVertical: 12,
  },
  commentBox: {
    marginVertical: 20,
  },
});
