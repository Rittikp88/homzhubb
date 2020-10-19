import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AssetService } from '@homzhub/common/src/services/AssetService';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button, FormButton, FormTextInput, Label, Text } from '@homzhub/common/src/components';
import {
  IFormData,
  initialLeaseFormValues,
  LeaseFormSchema,
  LeaseTermForm,
} from '@homzhub/mobile/src/components/molecules/LeaseTermForm';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';
import { IManageTerm } from '@homzhub/common/src/domain/models/ManageTerm';

interface IFormFields extends IFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface IOwnState {
  currentTermId: number;
  isPropertyOccupied: boolean;
  phoneCode: string;
  formData: IFormFields;
}

interface IProps extends WithTranslation {
  currencyData: Currency;
  assetGroupType: AssetGroupTypes;
  currentAssetId: number;
  onNextStep: (type: TypeOfPlan) => Promise<void>;
}

class ManageTermController extends React.PureComponent<IProps, IOwnState> {
  public state = {
    isPropertyOccupied: false,
    phoneCode: '+91',
    currentTermId: -1,
    formData: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      ...initialLeaseFormValues,
    },
  };

  public render = (): React.ReactNode => {
    const { isPropertyOccupied } = this.state;
    const { t } = this.props;

    return (
      <>
        {this.renderCard()}
        {this.renderForm()}
        {!isPropertyOccupied && (
          <Button
            type="primary"
            title={t('common:continue')}
            containerStyle={styles.buttonStyle}
            onPress={this.onNextStep}
          />
        )}
      </>
    );
  };

  private renderCard = (): React.ReactNode => {
    const { t } = this.props;
    const { isPropertyOccupied } = this.state;
    return (
      <View style={styles.card}>
        <Text type="small" textType="semiBold" style={styles.textColor}>
          {t('propertyOccupied')}
        </Text>
        <Label type="large" textType="regular" style={[styles.textColor, styles.descriptionText]}>
          {t('propertyOccupiedDescription')}
        </Label>
        <View style={styles.optionContainer}>
          {[
            { title: t('common:yes'), isSelected: isPropertyOccupied },
            { title: t('common:no'), isSelected: !isPropertyOccupied },
          ].map(({ title, isSelected }) => (
            <View style={styles.option} key={title}>
              <TouchableOpacity onPress={this.onOccupancyChanged}>
                <Icon
                  name={isSelected ? icons.circleFilled : icons.circleOutline}
                  color={isSelected ? theme.colors.primaryColor : theme.colors.disabled}
                  size={20}
                />
              </TouchableOpacity>
              <Label type="large" textType="regular" style={[styles.textColor, styles.optionText]}>
                {title}
              </Label>
            </View>
          ))}
        </View>
      </View>
    );
  };

  private renderForm = (): React.ReactNode => {
    const { t, currencyData, assetGroupType } = this.props;
    const { isPropertyOccupied, formData } = this.state;
    return (
      <Formik
        enableReinitialize
        onSubmit={this.onSubmit}
        initialValues={{ ...formData }}
        validate={FormUtils.validate(this.formSchema)}
      >
        {isPropertyOccupied ? (
          (formProps: FormikProps<IFormFields>): React.ReactElement => {
            return (
              <>
                <LeaseTermForm
                  isFromManage
                  formProps={formProps}
                  currencyData={currencyData}
                  assetGroupType={assetGroupType}
                >
                  {this.renderTenantForm(formProps)}
                </LeaseTermForm>
                <FormButton
                  title={t('common:continue')}
                  type="primary"
                  formProps={formProps}
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  containerStyle={styles.continue}
                />
              </>
            );
          }
        ) : (
          <></>
        )}
      </Formik>
    );
  };

  private renderTenantForm = (formProps: FormikProps<IFormFields>): React.ReactNode => {
    const { t } = this.props;
    const { phoneCode } = this.state;

    return (
      <>
        <Text type="small" textType="semiBold" style={styles.headerTitle}>
          {t('tenantDetails')}
        </Text>
        <View style={styles.optionContainer}>
          <View style={styles.firstName}>
            <FormTextInput
              name="firstName"
              inputType="name"
              label={t('firstName')}
              placeholder={t('firstName')}
              formProps={formProps}
            />
          </View>
          <View style={styles.lastName}>
            <FormTextInput
              name="lastName"
              inputType="name"
              label={t('lastName')}
              placeholder={t('lastName')}
              formProps={formProps}
            />
          </View>
        </View>
        <FormTextInput
          name="email"
          label={t('common:email')}
          placeholder={t('tenantEmail')}
          inputType="email"
          formProps={formProps}
        />
        <FormTextInput
          name="phone"
          label={t('common:phone')}
          placeholder={t('tenantPhone')}
          inputType="phone"
          maxLength={10}
          inputPrefixText={phoneCode}
          onPhoneCodeChange={this.handlePhoneCodeChange}
          phoneFieldDropdownText={t('auth:countryRegion')}
          formProps={formProps}
        />
        <Text type="small" textType="semiBold" style={styles.headerTitle}>
          {t('rentAndDeposit')}
        </Text>
      </>
    );
  };

  private onOccupancyChanged = (): void => {
    const { isPropertyOccupied } = this.state;
    this.setState({ isPropertyOccupied: !isPropertyOccupied });
  };

  private onSubmit = async (values: IFormFields, formActions: FormikHelpers<IFormFields>): Promise<void> => {
    formActions.setSubmitting(true);
    const { onNextStep, currentAssetId, assetGroupType } = this.props;
    const { currentTermId, phoneCode } = this.state;

    const params: IManageTerm = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      phone_code: phoneCode,
      phone_number: values.phone,
      ...AssetService.extractLeaseParams(values, assetGroupType),
    };

    try {
      if (currentTermId <= -1) {
        const id = await AssetRepository.createManageTerm(currentAssetId, params);
        this.setState({ currentTermId: id });
      } else {
        await AssetRepository.updateManageTerm(currentAssetId, currentTermId, params);
      }
      await onNextStep(TypeOfPlan.MANAGE);
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }

    formActions.setSubmitting(false);
  };

  private onNextStep = async (): Promise<void> => {
    const { onNextStep } = this.props;
    try {
      await onNextStep(TypeOfPlan.MANAGE);
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }
  };

  private handlePhoneCodeChange = (phoneCode: string): void => {
    this.setState({ phoneCode });
  };

  private formSchema = (): yup.ObjectSchema => {
    const { t } = this.props;
    return yup.object().shape({
      ...LeaseFormSchema(t),
      firstName: yup
        .string()
        .matches(FormUtils.nameRegex, t('auth:onlyAlphabets'))
        .required(t('auth:firstNameRequired')),
      lastName: yup.string().matches(FormUtils.nameRegex, t('auth:onlyAlphabets')),
      email: yup.string().email(t('auth:emailValidation')).required(t('auth:emailRequired')),
      phone: yup.string().required(t('auth:numberRequired')),
    });
  };
}

const HOC = withTranslation(LocaleConstants.namespacesKey.property)(ManageTermController);
export { HOC as ManageTermController };

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
  },
  textColor: {
    color: theme.colors.darkTint3,
  },
  descriptionText: {
    marginVertical: 12,
  },
  option: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginStart: 12,
  },
  continue: {
    flex: 0,
    marginTop: 20,
    marginBottom: 50,
  },
  firstName: {
    flex: 0.5,
  },
  lastName: {
    flex: 0.5,
    marginStart: 16,
  },
  buttonStyle: {
    flex: 0,
  },
  headerTitle: {
    marginTop: 20,
    marginBottom: 8,
    color: theme.colors.darkTint3,
  },
});
