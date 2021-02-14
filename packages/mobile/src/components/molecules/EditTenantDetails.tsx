import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { IUpdateTenantParam, IUserDetails } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { User } from '@homzhub/common/src/domain/models/User';

interface IProps {
  details: User | null;
  assetId: number;
  leaseTransaction: number;
  leaseTenantId: number;
  onCloseSheet: () => void;
  numberOfTenants: number;
  onHandleActionProp: () => void;
}

interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
}

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phoneCode: '',
  phoneNumber: '',
};

// TODO: Add formik validation
export const EditTenantDetails = (props: IProps): React.ReactElement => {
  const {
    details,
    assetId,
    leaseTransaction,
    leaseTenantId,
    onCloseSheet,
    numberOfTenants,
    onHandleActionProp,
  } = props;
  const [userDetails, setDetails] = useState(initialState);
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation(LocaleConstants.namespacesKey.auth);

  const param: IUpdateTenantParam = {
    assetId,
    leaseTransactionId: leaseTransaction,
    leaseTenantId,
  };

  useEffect(() => {
    if (details) {
      setDetails({
        firstName: details.firstName ?? '',
        lastName: details.lastName ?? '',
        email: details.email,
        phoneCode: details.countryCode,
        phoneNumber: details.phoneNumber,
      });
    }
  }, []);

  const onSubmit = async (values: IFormData, formActions: FormikHelpers<IFormData>): Promise<void> => {
    formActions.setSubmitting(true);
    setLoading(true);
    const payload: IUserDetails = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      phone_code: values.phoneCode,
      phone_number: values.phoneNumber,
    };

    try {
      await AssetRepository.updateTenantDetails(param, payload);
      AlertHelper.success({
        message: t('common:tenantDetailsAreUpdated'),
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }

    onCloseSheet();
  };

  const deleteTenant = async (): Promise<void> => {
    onCloseSheet();
    if (numberOfTenants === 1) {
      onHandleActionProp();
    } else {
      try {
        await AssetRepository.deleteTenant(param);
      } catch (err) {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
      }
    }
  };

  return (
    <>
      <View style={styles.bottomSheet}>
        <Avatar
          isRightIcon
          icon={icons.circularCheckFilled}
          onPressRightIcon={deleteTenant}
          rightIconName={icons.close}
          rightIconColor={theme.colors.error}
          fullName={details?.email ?? ''}
          designation={t('common:invitationSent')}
          customDesignation={styles.designation}
        />
        <Divider containerStyles={styles.divider} />
        <Text type="small" textType="regular">
          {t('property:tenantDetails')}
        </Text>
        <Formik onSubmit={onSubmit} initialValues={{ ...userDetails }} enableReinitialize>
          {(formProps: FormikProps<IFormData>): React.ReactNode => {
            return (
              <>
                <ScrollView>
                  <View style={styles.contentView}>
                    <View style={styles.subContentView}>
                      <FormTextInput
                        name="firstName"
                        label={t('property:firstName')}
                        inputType="default"
                        placeholder={t('auth:enterFirstName')}
                        formProps={formProps}
                        isMandatory
                      />
                    </View>
                    <View style={styles.flexOne}>
                      <FormTextInput
                        name="lastName"
                        label={t('property:lastName')}
                        inputType="default"
                        placeholder={t('auth:enterLastName')}
                        formProps={formProps}
                        isMandatory
                      />
                    </View>
                  </View>
                  <FormTextInput
                    name="email"
                    label={t('common:email')}
                    numberOfLines={1}
                    inputType="email"
                    placeholder={t('auth:enterEmail')}
                    formProps={formProps}
                    isMandatory
                  />
                  <FormTextInput
                    name="phoneNumber"
                    label={t('common:phone')}
                    inputType="phone"
                    placeholder={t('auth:yourNumber')}
                    inputPrefixText={formProps.values.phoneCode}
                    phoneFieldDropdownText={t('auth:countryRegion')}
                    formProps={formProps}
                    isMandatory
                  />
                  <FormButton
                    // @ts-ignore
                    onPress={formProps.handleSubmit}
                    formProps={formProps}
                    type="primary"
                    title={t('common:update')}
                    containerStyle={styles.buttonStyle}
                  />
                </ScrollView>
              </>
            );
          }}
        </Formik>
      </View>
      <Loader visible={isLoading} />
    </>
  );
};

const styles = StyleSheet.create({
  divider: {
    marginVertical: 12,
    borderColor: theme.colors.background,
    borderWidth: 1,
  },

  buttonStyle: {
    flex: 1,
    alignSelf: 'center',
    borderRadius: 2,
    marginTop: 12,
    width: 380,
    backgroundColor: theme.colors.blue,
  },
  contentView: {
    flexDirection: 'row',
  },
  subContentView: {
    flex: 1,
    marginRight: 16,
  },
  flexOne: {
    flex: 1,
  },
  bottomSheet: {
    padding: 20,
  },
  closeIcon: {
    marginLeft: 100,
    marginTop: 5,
  },
  designation: {
    color: theme.colors.green,
  },
  topLeftView: {
    flexDirection: 'row',
  },
});
