import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { SearchStackParamList } from '@homzhub/mobile/src/navigation/SearchStack';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { RadioButtonGroup } from '@homzhub/common/src/components/molecules/RadioButtonGroup';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import { User } from '@homzhub/common/src/domain/models/User';
import { sampleData } from '@homzhub/common/src/constants/ProspectProfile';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IUpdateProspectProfile } from '@homzhub/common/src/domain/repositories/interfaces';

interface IOfferForm {
  jobType: number;
  companyName: string;
  workEmail: string;
  occupants: string;
  tenantType: number;
}

interface IState {
  offerForm: IOfferForm;
  userType: number;
  categories: IUnit[];
  tenantType: IUnit[];
  userDetails: User;
  loading: boolean;
}

interface IProp {
  editData: boolean;
}

type libraryProps = WithTranslation & NavigationScreenProps<SearchStackParamList, ScreensKeys.ProspectProfile>;
type Props = libraryProps & IProp;
class ProspectProfile extends Component<Props, IState> {
  public state = {
    offerForm: {
      jobType: 0,
      companyName: '',
      workEmail: '',
      occupants: '',
      tenantType: 0,
    },
    userType: 0,
    categories: [],
    tenantType: [],
    userDetails: new User(),
    loading: false,
  };

  public async componentDidMount(): Promise<void> {
    const { editData } = this.props;
    const prospectsData = await OffersRepository.getProspectsInfo();
    const tenant = await OffersRepository.getTenantTypes();
    const jobType = await OffersRepository.getJobType();
    this.setState({ categories: jobType, tenantType: tenant, userDetails: prospectsData.user });
    const {
      user: { workInfo },
      occupants,
      tenantType,
    } = prospectsData;
    if (editData) {
      this.setState({
        offerForm: {
          jobType: workInfo.jobType.id,
          occupants: String(occupants),
          companyName: workInfo.companyName,
          workEmail: workInfo.workEmail,
          tenantType: tenantType.id,
        },
        userType: tenantType.id,
      });
    }
  }

  public render = (): React.ReactNode => {
    const { t, navigation } = this.props;
    const { offerForm, userType, tenantType, userDetails, loading } = this.state;
    if (!userDetails) return null;
    return (
      <Screen
        backgroundColor={theme.colors.white}
        headerProps={{
          type: 'secondary',
          title: t('offers:prospectProfile'),
          onIconPress: navigation.goBack,
        }}
        isLoading={loading}
      >
        <View style={styles.container}>
          <Avatar fullName={userDetails.name} designation={userDetails.email} image={userDetails.profilePicture} />
          <Label type="large" textType="regular" style={styles.radioGroup}>
            {sampleData.description}
          </Label>

          <Formik
            onSubmit={this.onSubmit}
            initialValues={offerForm}
            enableReinitialize
            validate={FormUtils.validate(this.formSchema)}
          >
            {(formProps: FormikProps<IOfferForm>): React.ReactNode => {
              const disabledButton =
                !formProps.values.workEmail ||
                !formProps.values.occupants ||
                !formProps.values.companyName ||
                !formProps.values.jobType ||
                !userType;

              return (
                <>
                  <FormDropdown
                    formProps={formProps}
                    isMandatory
                    options={this.loadJobTypeCategories()}
                    name="jobType"
                    label={t('offers:jobType')}
                    placeholder={t('offers:selfEmployed')}
                    dropdownContainerStyle={styles.dropdownStyle}
                  />
                  <FormTextInput
                    formProps={formProps}
                    isMandatory
                    inputType="default"
                    name="companyName"
                    label={t('offers:organizationName')}
                    placeholder={t('offers:enterName')}
                  />
                  <FormTextInput
                    formProps={formProps}
                    isMandatory
                    inputType="email"
                    name="workEmail"
                    label={t('offers:workEmail')}
                    placeholder={t('offers:enterEmail')}
                  />
                  <FormTextInput
                    formProps={formProps}
                    isMandatory
                    inputType="number"
                    name="occupants"
                    label={t('offers:occupants')}
                    placeholder={t('offers:enterNumber')}
                  />

                  <Text type="small" textType="semiBold" style={styles.radioGroup}>
                    {t('offers:tenantType')}
                  </Text>
                  <RadioButtonGroup
                    numColumns={3}
                    data={tenantType as Unit[]}
                    onToggle={this.handleUserType}
                    selectedValue={userType}
                  />
                  <FormButton
                    // @ts-ignore
                    onPress={formProps.handleSubmit}
                    formProps={formProps}
                    disabled={disabledButton}
                    type="primary"
                    title={t('common:next')}
                    containerStyle={styles.submitStyle}
                  />
                </>
              );
            }}
          </Formik>
        </View>
      </Screen>
    );
  };

  public onSubmit = async (values: IOfferForm, formActions: FormikHelpers<IOfferForm>): Promise<void> => {
    const { userType } = this.state;
    this.setState({ loading: true });
    formActions.setSubmitting(true);
    const payload: IUpdateProspectProfile = {
      job_type: values.jobType,
      company_name: values.companyName,
      work_email: values.workEmail,
      number_of_occupants: Number(values.occupants),
      tenant_type: userType,
    };

    try {
      await OffersRepository.updateProspects(payload);
      this.setState({ loading: false });
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
      this.setState({ loading: false });
    }
  };

  private formSchema = (): yup.ObjectSchema<IOfferForm> => {
    const { t } = this.props;
    return yup.object().shape({
      jobType: yup.number().required(t('moreProfile:fieldRequiredError')),
      companyName: yup.string().required(t('moreProfile:fieldRequiredError')),
      workEmail: yup.string().required(t('moreProfile:fieldRequiredError')),
      occupants: yup.string().required(t('moreProfile:fieldRequiredError')),
      tenantType: yup.number().required(t('moreProfile:fieldRequiredError')),
    });
  };

  private loadJobTypeCategories = (): IDropdownOption[] => {
    const { categories } = this.state;
    return categories.map((category: IUnit) => {
      return {
        value: category.id,
        label: category.label,
      };
    });
  };

  private handleUserType = (id: number): void => {
    this.setState({ userType: id });
  };
}

export default withTranslation()(ProspectProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  radioGroup: {
    marginVertical: 16,
    color: theme.colors.darkTint3,
  },
  submitStyle: {
    flex: 0,
    marginVertical: 16,
  },
  dropdownStyle: {
    paddingVertical: 12,
  },
});
