import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text, Label, TextArea, FormButton, FormTextInput, Button } from '@homzhub/common/src/components';
import {
  DEFAULT_LEASE_PERIOD,
  IFormData,
  LeaseFormSchema,
  LeaseTermForm,
} from '@homzhub/mobile/src/components/molecules/LeaseTermForm';
import { AssetListingSection } from '@homzhub/mobile/src/components/HOC/AssetListingSection';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { PaidByTypes, ScheduleTypes } from '@homzhub/common/src/constants/Terms';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';

interface IOwnState {
  isPropertyOccupied: boolean;
  description: string;
}

interface IProps extends WithTranslation {
  currencyData: Currency;
  assetGroupType: string;
  onNextStep: () => void;
  lastVisitedStep: ILastVisitedStep;
}

interface IFormFields extends IFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const initialFormValues: IFormFields = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  showMore: false,
  monthlyRent: '',
  securityDeposit: '',
  annualIncrement: '',
  minimumLeasePeriod: DEFAULT_LEASE_PERIOD,
  maximumLeasePeriod: DEFAULT_LEASE_PERIOD,
  availableFrom: DateUtils.getCurrentDate(),
  maintenanceAmount: '',
  maintenanceSchedule: ScheduleTypes.MONTHLY,
  maintenanceBy: PaidByTypes.OWNER,
  maintenanceUnit: -1,
  utilityBy: PaidByTypes.TENANT,
  rentFreePeriod: 0,
};
const MAX_DESCRIPTION_LENGTH = 600;

class ManageTermController extends React.PureComponent<IProps, IOwnState> {
  public state = {
    isPropertyOccupied: true,
    description: '',
  };

  public render = (): React.ReactNode => {
    const { isPropertyOccupied } = this.state;
    const { onNextStep, t } = this.props;

    return (
      <>
        {this.renderCard()}
        {isPropertyOccupied && this.renderForm()}
        {!isPropertyOccupied && (
          <Button
            type="primary"
            title={t('common:continue')}
            containerStyle={styles.buttonStyle}
            onPress={onNextStep}
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
    const { description } = this.state;
    return (
      <Formik
        enableReinitialize
        onSubmit={this.onSubmit}
        initialValues={{ ...initialFormValues }}
        validate={FormUtils.validate(this.formSchema)}
      >
        {(formProps: FormikProps<IFormData>): React.ReactElement => {
          return (
            <>
              <AssetListingSection title={t('leaseTerms')}>
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
                    inputPrefixText="+91"
                    formProps={formProps}
                  />
                  <Text type="small" textType="semiBold" style={styles.headerTitle}>
                    {t('rentAndDeposit')}
                  </Text>
                  <LeaseTermForm
                    isFromManage
                    formProps={formProps}
                    currencyData={currencyData}
                    assetGroupType={assetGroupType}
                  />
                </>
              </AssetListingSection>
              <AssetListingSection
                title={t('assetDescription:description')}
                containerStyles={styles.descriptionContainer}
              >
                <TextArea
                  value={description}
                  wordCountLimit={MAX_DESCRIPTION_LENGTH}
                  placeholder={t('common:typeHere')}
                  onMessageChange={this.onDescriptionChange}
                />
              </AssetListingSection>
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
        }}
      </Formik>
    );
  };

  private onOccupancyChanged = (): void => {
    const { isPropertyOccupied } = this.state;
    this.setState({ isPropertyOccupied: !isPropertyOccupied });
  };

  private onDescriptionChange = (description: string): void => {
    this.setState({ description });
  };

  private onSubmit = (values: IFormFields, formActions: FormikHelpers<IFormFields>): void => {
    const { lastVisitedStep } = this.props;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    const last_visited_step = {
      ...lastVisitedStep,
      listing: {
        ...lastVisitedStep.listing,
        type: TypeOfPlan.MANAGE,
        is_listing_created: true,
      },
    };
  };

  private formSchema = (): yup.ObjectSchema => {
    const { t } = this.props;
    return yup.object().shape({
      ...LeaseFormSchema(t),
      firstName: yup
        .string()
        .matches(FormUtils.nameRegex, t('auth:onlyAlphabets'))
        .required(t('auth:firstNameRequired')),
      lastName: yup.string().matches(FormUtils.nameRegex, t('auth:onlyAlphabets')).required(t('auth:lastNameRequired')),
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
  descriptionContainer: {
    marginTop: 16,
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
