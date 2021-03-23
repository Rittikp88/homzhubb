import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Formik, FormikProps } from 'formik';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { SearchStackParamList } from '@homzhub/mobile/src/navigation/SearchStack';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { RadioButtonGroup } from '@homzhub/common/src/components/molecules/RadioButtonGroup';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { offerDropDown, sampleData, tenantType } from '@homzhub/common/src/constants/ProspectProfile';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

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
  categories: IDropdownOption[];
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
    userType: 1,
    categories: offerDropDown,
  };

  public componentDidMount(): void {
    const { editData } = this.props;

    if (editData) {
      this.setState({
        offerForm: {
          jobType: sampleData.job_type.id,
          occupants: String(sampleData.number_of_occupants),
          companyName: sampleData.company_name,
          workEmail: sampleData.work_email,
          tenantType: sampleData.tenant_type.id,
        },
        userType: sampleData.tenant_type.id,
      });
    }
  }

  public render = (): React.ReactNode => {
    const { t, navigation } = this.props;
    const { offerForm, userType, categories } = this.state;
    return (
      <Screen
        backgroundColor={theme.colors.white}
        headerProps={{
          type: 'secondary',
          title: t('offers:prospectProfile'),
          onIconPress: navigation.goBack,
        }}
      >
        <View style={styles.container}>
          <Avatar fullName={sampleData.userName} designation={sampleData.designation} />
          <Label type="large" textType="regular" style={styles.radioGroup}>
            {sampleData.description}
          </Label>

          <Formik
            onSubmit={FunctionUtils.noop}
            initialValues={offerForm}
            enableReinitialize
            validate={FormUtils.validate(this.formSchema)}
          >
            {(formProps: FormikProps<IOfferForm>): React.ReactNode => {
              const disabledButton =
                !formProps.values.workEmail ||
                !formProps.values.occupants ||
                !formProps.values.companyName ||
                !formProps.values.jobType;

              return (
                <>
                  <FormDropdown
                    formProps={formProps}
                    isMandatory
                    options={categories}
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
                    inputType="default"
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
