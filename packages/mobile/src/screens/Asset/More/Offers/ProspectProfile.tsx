import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps, FormikValues } from 'formik';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
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

type Props = WithTranslation & NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.ProspectProfile>;

interface IOfferForm {
  jobType: string;
  organization: string;
  emailID: string;
  occupants: string;
}

interface IState {
  offerForm: IOfferForm;
  RadioButtonData: Unit[];
  userType: number;
  categories: IDropdownOption[];
}
class ProspectProfile extends Component<Props, IState> {
  public state = {
    offerForm: {
      jobType: '',
      organization: '',
      emailID: '',
      occupants: '',
    },
    RadioButtonData: tenantType,
    userType: 1,
    categories: offerDropDown,
  };

  public render = (): React.ReactNode => {
    const { t, navigation } = this.props;
    const { offerForm, RadioButtonData, userType, categories } = this.state;

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
          <Formik onSubmit={FunctionUtils.noop} initialValues={offerForm} enableReinitialize>
            {(formProps: FormikProps<FormikValues>): React.ReactNode => {
              const disabledButton =
                !formProps.values.emailID ||
                !formProps.values.occupants ||
                !formProps.values.organization ||
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
                    name="organization"
                    label={t('offers:organizationName')}
                    placeholder={t('offers:enterName')}
                  />
                  <FormTextInput
                    formProps={formProps}
                    isMandatory
                    inputType="email"
                    name="emailID"
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
                    data={RadioButtonData as Unit[]}
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
