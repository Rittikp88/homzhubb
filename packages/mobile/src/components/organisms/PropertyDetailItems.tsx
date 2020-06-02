import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps, FormikValues } from 'formik';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AreaUnit } from '@homzhub/common/src/mocks/AreaUnit';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormTextInput, FormDropdown, HorizontalPicker, Label, Text } from '@homzhub/common/src/components';
import ItemGroup from '@homzhub/mobile/src/components/molecules/ItemGroup';

interface IPropertyDetailsItemsProps {
  data: any;
  spaceAvailable: any;
  propertyGroupSelectedIndex: number;
  propertyGroupTypeSelectedIndex: number;
  onPropertyGroupChange: (index: string | number) => void;
  onPropertyGroupTypeChange: (index: string | number) => void;
}

type Props = IPropertyDetailsItemsProps & WithTranslation;

interface IPropertyDetailsItemsState {
  carpetArea: string | number;
  areaUnit: string;
  isBottomSheetVisible: boolean;
}

class PropertyDetailsItems extends React.PureComponent<Props, IPropertyDetailsItemsState> {
  public carpetArea: FormTextInput | null = null;
  public areaUnit: FormTextInput | null = null;
  public state = {
    carpetArea: '',
    areaUnit: 'Sq.ft',
    isBottomSheetVisible: false,
  };

  public render(): React.ReactNode {
    const { t, data, spaceAvailable, propertyGroupSelectedIndex, propertyGroupTypeSelectedIndex } = this.props;
    if (!data || !spaceAvailable) {
      return null;
    }
    return (
      <View style={styles.container}>
        <ItemGroup
          data={data}
          onItemSelect={this.onPropertyGroupSelect}
          textStyle={styles.textColor}
          selectedIndex={propertyGroupSelectedIndex}
          textType="text"
          superTitle={t('propertyDetails:propertyType')}
        />
        <ItemGroup
          data={data?.[propertyGroupSelectedIndex]?.property_types ?? []}
          onItemSelect={this.onPropertyGroupTypeSelect}
          textStyle={styles.textColor}
          selectedIndex={propertyGroupTypeSelectedIndex}
          textType="label"
        />
        <View style={styles.propertyContainer}>
          <Text type="regular" textType="semiBold" style={styles.typeProperty}>
            {t('propertyDetails:spaceAvailable')}
          </Text>
          {this.renderSpaceAvailable()}
          {this.renderCarpetArea()}
        </View>
      </View>
    );
  }

  public renderSpaceAvailable = (): React.ReactNode => {
    const { spaceAvailable } = this.props;
    if (!spaceAvailable) {
      return null;
    }
    const spaceAvailableElements: Array<React.ReactNode> = [];
    spaceAvailable.forEach((space: any, index: number) => {
      return spaceAvailableElements.push(
        <View style={styles.picker} key={index}>
          <Label type="large" textType="regular" style={styles.label}>
            {space.name}
          </Label>
          <HorizontalPicker key={index} />
        </View>
      );
    });
    return spaceAvailableElements;
  };

  public renderCarpetArea = (): React.ReactNode => {
    const { t, propertyGroupSelectedIndex } = this.props;
    if (propertyGroupSelectedIndex === 0) {
      return null;
    }
    const formData = { ...this.state };
    return (
      <>
        <Formik onSubmit={this.onSubmit} validate={FormUtils.validate(this.formSchema)} initialValues={formData}>
          {(formProps: FormikProps<FormikValues>): React.ReactElement => (
            <View style={styles.formContainer}>
              <View style={styles.carpetArea}>
                <FormTextInput
                  formProps={formProps}
                  inputType="number"
                  name="carpetArea"
                  label={t('propertyDetails:carpetArea')}
                  placeholder="Enter"
                />
              </View>
              <View style={styles.areaUnit}>
                <FormDropdown
                  label={t('propertyDetails:areaUnit')}
                  name="areaUnit"
                  options={AreaUnit}
                  formProps={formProps}
                />
              </View>
            </View>
          )}
        </Formik>
      </>
    );
  };

  public onPropertyGroupSelect = (index: string | number): void => {
    const { onPropertyGroupChange } = this.props;
    onPropertyGroupChange(index);
  };

  public onPropertyGroupTypeSelect = (index: string | number): void => {
    const { onPropertyGroupTypeChange } = this.props;
    onPropertyGroupTypeChange(index);
  };

  private onSubmit = (formProps: any): void => {};

  private formSchema = (): void => {};
}

export default withTranslation()(PropertyDetailsItems);
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  textColor: {
    color: theme.colors.darkTint5,
  },
  typeProperty: {
    color: theme.colors.darkTint4,
    marginBottom: 15,
  },
  propertyContainer: {
    marginHorizontal: 10,
    marginTop: 20,
    flexDirection: 'column',
  },
  formContainer: {
    flexDirection: 'row',
  },
  carpetArea: {
    flex: 0.5,
    marginRight: 10,
  },
  areaUnit: {
    flex: 0.5,
  },
  picker: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    marginBottom: 10,
    marginTop: 10,
  },
  label: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    color: theme.colors.darkTint4,
  },
});
