import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IUpdateAssetParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import {
  Button,
  FormTextInput,
  ISelectionPicker,
  SelectionPicker,
  Text,
  WithShadowView,
} from '@homzhub/common/src/components';
import { AssetDescriptionForm } from '@homzhub/mobile/src/components';
import { PropertySpaces } from '@homzhub/mobile/src/components/organisms/PropertySpaces';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { Asset, LastVisitedStep } from '@homzhub/common/src/domain/models/Asset';
import { AssetDescriptionDropdownValues } from '@homzhub/common/src/domain/models/AssetDescriptionForm';
import { ISpaceCount, SpaceType } from '@homzhub/common/src/domain/models/AssetGroup';

interface IDescriptionForm {
  carpetArea?: number;
  areaUnit?: number;
  buildingGrade?: string;
  facing?: string;
  flooringType?: number;
  yearOfConstruction?: number;
  totalFloors?: number;
  onFloorNumber?: number;
}

interface IFurnishingForm {
  furnishingDetails?: string;
  furnishingType?: string;
}

interface IOwnProps extends WithTranslation {
  assetId: number;
  assetDetails: Asset | null;
  spaceTypes: SpaceType[];
  spaceValues: ISpaceCount[];
  handleNextStep: () => void;
}

interface IOwnState {
  spacesForm: ISpaceCount[];
  descriptionForm: IDescriptionForm;
  furnishingForm: IFurnishingForm;
  descriptionDropdownValues: AssetDescriptionDropdownValues | null;
}

class AddPropertyDetails extends React.PureComponent<IOwnProps, IOwnState> {
  constructor(props: IOwnProps) {
    super(props);
    const { assetDetails, spaceValues } = this.props;

    this.state = {
      spacesForm: spaceValues,
      descriptionForm: {
        carpetArea: (assetDetails && assetDetails.carpetArea) || undefined,
        areaUnit: (assetDetails && assetDetails.carpetAreaUnit && assetDetails.carpetAreaUnit.id) || undefined,
        buildingGrade: '',
        facing: (assetDetails && assetDetails.facing) || undefined,
        flooringType: (assetDetails && assetDetails.floorType) || undefined,
        yearOfConstruction: (assetDetails && assetDetails.construction_Year) || undefined,
        totalFloors: (assetDetails && assetDetails.totalFloors) || 0,
        onFloorNumber: (assetDetails && assetDetails.floorNumber) || 0,
      },
      furnishingForm: {
        furnishingDetails: (assetDetails && assetDetails.furnishingDescription) || undefined,
        furnishingType: (assetDetails && assetDetails.furnishing) || undefined,
      },
      descriptionDropdownValues: null,
    };
  }

  public async componentDidMount(): Promise<void> {
    await this.getDescriptionDropdownValues();
  }

  public render(): ReactElement {
    const { spaceTypes, t } = this.props;
    const { descriptionForm, furnishingForm, descriptionDropdownValues, spacesForm } = this.state;

    return (
      <>
        <Formik
          onSubmit={this.onSubmit}
          initialValues={{ ...descriptionForm, ...furnishingForm }}
          validate={FormUtils.validate(this.formSchema)}
        >
          {(formProps: FormikProps<FormikValues>): React.ReactNode => {
            return (
              <>
                <View style={styles.containerStyle}>
                  <>
                    <Text style={styles.headingStyle} type="small">
                      {t('property:spacesText')}
                    </Text>
                    <PropertySpaces
                      spacesFormValues={spacesForm}
                      onChange={this.handleSpaceFormChange}
                      spacesTypes={spaceTypes}
                    />
                  </>

                  {descriptionDropdownValues && (
                    <AssetDescriptionForm dropDownOptions={descriptionDropdownValues} formProps={formProps} />
                  )}

                  {descriptionDropdownValues && this.renderFurnishingFields(formProps)}
                </View>

                <WithShadowView>
                  <Button
                    type="primary"
                    title={t('common:continue')}
                    containerStyle={styles.buttonStyle}
                    onPress={(): Promise<void> => this.onSubmit(formProps.values)}
                  />
                </WithShadowView>
              </>
            );
          }}
        </Formik>
      </>
    );
  }

  private renderFurnishingFields = (formProps: FormikProps<FormikValues>): ReactElement => {
    const { t } = this.props;
    const handlePickerChange = (value: string): void => this.setFurnishingStatus(formProps, value);

    return (
      <>
        <Text style={styles.headingStyle} type="small">
          {t('property:furnishing')}
        </Text>
        <View style={styles.furnishingStyle}>
          <SelectionPicker<string>
            containerStyles={styles.marginTop}
            data={this.loadFurnishingStatus()}
            selectedItem={formProps.values.furnishingType}
            onValueChange={handlePickerChange}
          />
          <FormTextInput
            style={styles.furnishingFieldStyle}
            name="furnishingDetails"
            label={t('property:furnishingDetails')}
            maxLength={400}
            inputType="default"
            formProps={formProps}
          />
        </View>
      </>
    );
  };

  private onSubmit = async (values: FormikValues, formActions: FormikHelpers<FormikValues>): Promise<void> => {
    const {
      areaUnit,
      carpetArea,
      facing,
      flooringType,
      furnishingDetails,
      onFloorNumber,
      totalFloors,
      yearOfConstruction,
    } = values;
    const {
      furnishingForm: { furnishingType },
      spacesForm,
    } = this.state;
    const { handleNextStep, assetId, assetDetails } = this.props;
    const serializedObj: LastVisitedStep = ObjectMapper.serialize(assetDetails?.lastVisitedStep);

    const sanitizedSpaces = spacesForm
      .filter((item) => item && item.description !== '' && item.count)
      .map((space) => {
        return {
          space_type: space.space_type,
          count: space.count,
          ...(space.description && { description: space.description }),
        };
      });

    const payload: IUpdateAssetParams = {
      carpet_area: carpetArea,
      carpet_area_unit: areaUnit,
      facing,
      floor_type: flooringType,
      furnishing_description: furnishingDetails,
      floor_number: onFloorNumber,
      total_floors: totalFloors,
      construction_year: yearOfConstruction,
      furnishing: furnishingType,
      spaces: sanitizedSpaces,
      last_visited_step: {
        ...serializedObj,
        is_details_done: true,
        current_step: 2,
        total_step: 4,
      },
    };

    try {
      await AssetRepository.updateAsset(assetId, payload);
      handleNextStep();
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private setFurnishingStatus = (formProps: FormikProps<FormikValues>, furnishingType: string): void => {
    formProps.setFieldValue('furnishingType', furnishingType);
  };

  private loadFurnishingStatus = (): ISelectionPicker<string>[] | [] => {
    const { descriptionDropdownValues } = this.state;
    if (descriptionDropdownValues) {
      return descriptionDropdownValues.furnishingStatus.map((item) => {
        return {
          value: item.name,
          title: item.label,
        };
      });
    }
    return [];
  };

  private handleSpaceFormChange = (id: number, count: number, description?: string): void => {
    const { spacesForm } = this.state;

    spacesForm[id] = { space_type: id, count, description };
  };

  private formSchema = (): yup.ObjectSchema<IDescriptionForm & IFurnishingForm> => {
    return yup.object().shape({
      carpetArea: yup.number().optional(),
      areaUnit: yup.number().optional(),
      buildingGrade: yup.string().optional(),
      facing: yup.string().optional(),
      flooringType: yup.number().optional(),
      yearOfConstruction: yup.number().optional(),
      totalFloors: yup.number().optional(),
      onFloorNumber: yup.number().optional(),
      furnishingType: yup.string().optional(),
      furnishingDetails: yup.string().optional(),
    });
  };

  private getDescriptionDropdownValues = async (): Promise<void> => {
    try {
      const response: AssetDescriptionDropdownValues = await AssetRepository.getAssetDescriptionDropdownValues();

      this.setState({
        descriptionDropdownValues: response,
        furnishingForm: {
          furnishingType: response.furnishingStatus[0].name,
        },
      });
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
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
  furnishingStyle: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headingStyle: {
    marginTop: 16,
    paddingVertical: 16,
    paddingLeft: 16,
    backgroundColor: theme.colors.moreSeparator,
  },
  furnishingFieldStyle: {
    height: 85,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  marginTop: {
    marginTop: 20,
  },
});
