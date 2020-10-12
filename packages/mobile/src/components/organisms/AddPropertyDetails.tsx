import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, FormTextInput, FurnishingSelection, Text, WithShadowView } from '@homzhub/common/src/components';
import { AssetDescriptionForm } from '@homzhub/mobile/src/components/molecules/AssetDescriptionForm';
import { PropertySpaces } from '@homzhub/mobile/src/components/organisms/PropertySpaces';
import { AssetListingSection } from '@homzhub/mobile/src/components/HOC/AssetListingSection';
import { AssetDescriptionDropdownValues } from '@homzhub/common/src/domain/models/AssetDescriptionForm';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { ISpaceCount, SpaceType } from '@homzhub/common/src/domain/models/AssetGroup';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { IUpdateAssetParams } from '@homzhub/common/src/domain/repositories/interfaces';

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
  handleNextStep: () => void;
  lastVisitedStep: ILastVisitedStep;
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
    const { assetDetails } = this.props;

    this.state = {
      spacesForm: [],
      descriptionForm: {
        carpetArea: (assetDetails && assetDetails.carpetArea) || undefined,
        areaUnit: (assetDetails && assetDetails.carpetAreaUnit && assetDetails.carpetAreaUnit.id) || 1,
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
    const { descriptionForm, furnishingForm, descriptionDropdownValues } = this.state;

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
                    <PropertySpaces onChange={this.handleSpaceFormChange} spacesTypes={spaceTypes} />
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
    const onFurnishingChange = (value: string): void => this.setFurnishingStatus(formProps, value);

    return (
      <AssetListingSection title={t('property:furnishing')} containerStyles={styles.furnishingStyle}>
        <>
          <FurnishingSelection
            titleHidden
            value={formProps.values.furnishingType}
            onFurnishingChange={onFurnishingChange}
          />
          <FormTextInput
            style={styles.furnishingFieldStyle}
            name="furnishingDetails"
            label={t('property:furnishingDetails')}
            maxLength={400}
            inputType="default"
            formProps={formProps}
          />
        </>
      </AssetListingSection>
    );
  };

  private onSubmit = async (values: FormikValues): Promise<void> => {
    const {
      areaUnit,
      carpetArea,
      facing,
      flooringType,
      furnishingDetails,
      onFloorNumber,
      totalFloors,
      yearOfConstruction,
      furnishingType,
    } = values;
    const { spacesForm } = this.state;
    const { handleNextStep, assetId, lastVisitedStep } = this.props;

    const sanitizedSpaces = spacesForm
      .filter((item) => item && item.description !== '')
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
        ...lastVisitedStep,
        asset_creation: {
          ...lastVisitedStep.asset_creation,
          is_details_done: true,
          total_step: 4,
        },
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
    marginTop: 16,
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
});
