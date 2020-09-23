import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikActions, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, FormDropdown, FormTextInput } from '@homzhub/common/src/components';
import { PropertySpaces } from '@homzhub/mobile/src/components/organisms/PropertySpaces';
import { SpaceType } from '@homzhub/common/src/domain/models/AssetGroup';

interface IDescriptionForm {
  carpetArea?: string;
  areaUnit?: string;
  buildingGrade?: string;
  facing?: string;
  flooringType?: string;
  yearOfConstruction?: string;
  totalFloors?: string;
  onFloorNumber?: string;
}

interface IOwnProps extends WithTranslation {
  spaceTypes: SpaceType[];
  handleNextStep: () => void;
}

interface IOwnState {
  descriptionForm: IDescriptionForm;
}
// Todo (Sriram) Ignore this screen
class AddPropertyDetails extends React.PureComponent<IOwnProps, IOwnState> {
  constructor(props: IOwnProps) {
    super(props);

    this.state = {
      descriptionForm: {},
    };
  }

  public render(): ReactElement {
    const { spaceTypes, handleNextStep, t } = this.props;
    const { descriptionForm } = this.state;

    return (
      <View style={styles.containerStyle}>
        <PropertySpaces spacesTypes={spaceTypes} />
        <Formik onSubmit={this.onSubmit} initialValues={descriptionForm} validate={FormUtils.validate(this.formSchema)}>
          {(formProps: FormikProps<FormikValues>): React.ReactNode => {
            return (
              <>
                <View>
                  <FormTextInput
                    formProps={formProps}
                    inputType="default"
                    name="label"
                    label={t('details')}
                    placeholder={t('detailsPlaceholder')}
                  />
                  <FormDropdown
                    formProps={formProps}
                    name="property"
                    options={[
                      { label: 'blah', value: 'blah' },
                      { label: 'halb', value: 'halb' },
                    ]}
                    placeholder={t('selectProperty')}
                    maxLabelLength={36}
                  />
                </View>
              </>
            );
          }}
        </Formik>
        <Button
          type="primary"
          title={t('common:continue')}
          containerStyle={styles.buttonStyle}
          onPress={handleNextStep}
        />
      </View>
    );
  }

  // private getSpacesFormFields = (): any[] => {
  //   const { data } = this.props;
  //   let spaces: any = {};
  //
  //   return data.reduce((accumulator: any, currentValue) => {
  //   }, {});
  // };

  private onSubmit = (values: FormikValues, formActions: FormikActions<FormikValues>): void => {};

  private formSchema = (): yup.ObjectSchema<IDescriptionForm> => {
    return yup.object().shape({
      carpetArea: yup.string().optional(),
      areaUnit: yup.string().optional(),
      buildingGrade: yup.string().optional(),
      facing: yup.string().optional(),
      flooringType: yup.string().optional(),
      yearOfConstruction: yup.string().optional(),
      totalFloors: yup.string().optional(),
      onFloorNumber: yup.string().optional(),
    });
  };
}

const addPropertyDetails = withTranslation()(AddPropertyDetails);
export { addPropertyDetails as AddPropertyDetails };

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: theme.layout.screenPadding,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
});
