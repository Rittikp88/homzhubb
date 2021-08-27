import React, { ReactElement, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Formik, FormikProps } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IUpdateTicketForm {
  updateTitle: string;
  description: string;
}

const initialFormValues: IUpdateTicketForm = {
  updateTitle: '',
  description: '',
};

const UpdateTicketStatus = (): ReactElement => {
  const { goBack } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  const [isLoading, setLoader] = useState(false);

  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);

  // HANDLERS

  const onSubmit = async (values: IUpdateTicketForm): Promise<void> => {
    try {
      setLoader(true);
      // Todo (Praharsh) : Call API here
      await FunctionUtils.noopAsync();
      setLoader(false);
      goBack();
      AlertHelper.success({ message: t('updateSentSuccess') });
    } catch (e) {
      setLoader(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details.message), statusCode: e.details.statusCode });
    }
  };

  const validateForm = (): yup.ObjectSchema => {
    return yup.object().shape({
      updateTitle: yup.string().required(t('moreProfile:fieldRequiredError')),
      description: yup.string().required(t('moreProfile:fieldRequiredError')),
    });
  };
  // HANDLERS

  const UpdateTicketStatusForm = (): React.ReactElement => {
    return (
      <Formik
        onSubmit={onSubmit}
        initialValues={initialFormValues}
        enableReinitialize
        validate={FormUtils.validate(validateForm)}
      >
        {(formProps: FormikProps<IUpdateTicketForm>): React.ReactElement => {
          const {
            values: { updateTitle, description },
          } = formProps;
          const isDisabled = !updateTitle.length || !description.length;
          return (
            <>
              <FormTextInput name="updateTitle" inputType="default" formProps={formProps} label={t('updateTitle')} />
              <FormTextInput
                name="description"
                inputType="default"
                formProps={formProps}
                label={t('assetDescription:description')}
                numberOfLines={4}
                placeholder={t('common:typeComment')}
                placeholderTextColor={theme.colors.darkTint8}
                style={styles.textArea}
                multiline
              />
              <FormButton
                // @ts-ignore
                onPress={formProps.handleSubmit}
                formProps={formProps}
                disabled={isLoading || isDisabled}
                title={t('sendUpdate')}
                containerStyle={styles.button}
              />
            </>
          );
        }}
      </Formik>
    );
  };

  return (
    <UserScreen
      title={selectedTicket?.propertyName ?? ''}
      pageTitle={t('sendUpdates')}
      onBackPress={goBack}
      loading={isLoading}
    >
      <View style={styles.container}>
        <Text type="small" textType="semiBold">
          {t('updates')}
        </Text>
        <Label type="large" style={styles.description}>
          {t('updateWorkProgressInfoText')}
        </Label>
        <UpdateTicketStatusForm />
      </View>
    </UserScreen>
  );
};

export default React.memo(UpdateTicketStatus);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  description: {
    color: theme.colors.darkTint3,
    marginVertical: 12,
  },
  button: {
    marginVertical: 30,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingLeft: 10,
  },
});
