import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  phoneCode: string;
}

interface IProps {
  details: IDetails;
}

export const EditTenantDetails = (props: IProps): React.ReactElement => {
  const { details } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.auth);

  return (
    <>
      <View style={styles.bottomSheet}>
        <Avatar
          isRightIcon
          onPressRightIcon={FunctionUtils.noop}
          rightIconName={icons.close}
          rightIconColor={theme.colors.error}
          fullName={details.email}
          designation={t('common:invitationSent')}
          customDesignation={styles.designation}
        />

        <Divider containerStyles={styles.divider} />
        <Text type="small" textType="regular">
          {t('property:tenantDetails')}
        </Text>
        <Formik onSubmit={FunctionUtils.noop} initialValues={details}>
          {(formProps: FormikProps<IDetails>): React.ReactNode => {
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
                    name="phone"
                    label={t('common:phone')}
                    inputType="phone"
                    placeholder={t('auth:yourNumber')}
                    inputPrefixText={formProps.values.phoneCode}
                    phoneFieldDropdownText={t('auth:countryRegion')}
                    formProps={formProps}
                    isMandatory
                  />
                  <FormButton
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
