import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { SpaceAvailableTypes, ISpaceAvailable } from '@homzhub/common/src/domain/repositories/interfaces';
import { HorizontalPicker, IDropdownOption, Label, Text, Dropdown } from '@homzhub/common/src/components';
import { ButtonGroup } from '@homzhub/mobile/src/components/molecules/ButtonGroup';
import { IPropertyDetailsData, IPropertyTypes } from '@homzhub/common/src/domain/models/Property';

interface IPropertyDetailsItemsProps {
  data: IPropertyDetailsData[];
  areaUnits: IDropdownOption[];
  spaceAvailable: ISpaceAvailable;
  propertyGroupSelectedIndex: number;
  propertyGroupTypeSelectedIndex: number;
  carpetAreaError: boolean;
  onPropertyGroupChange: (index: string | number) => void;
  onPropertyGroupTypeChange: (index: string | number) => void;
  onSpaceAvailableValueChange: (item: IPropertyTypes, index: string | number) => void;
  onCommercialPropertyChange?: (type: string, value: string | number) => void;
}

type Props = IPropertyDetailsItemsProps & WithTranslation;

export class PropertyDetailsItems extends React.PureComponent<Props, {}> {
  public render(): React.ReactNode {
    const { data, propertyGroupSelectedIndex, propertyGroupTypeSelectedIndex } = this.props;
    return (
      <View style={styles.container}>
        <ButtonGroup<number>
          data={this.fetchButtonGroupData<IPropertyDetailsData>(data)}
          onItemSelect={this.onPropertyGroupSelect}
          selectedItem={propertyGroupSelectedIndex}
          textType="text"
          textSize="small"
          fontType="semiBold"
          containerStyle={styles.buttonGroupContainer}
          buttonItemStyle={styles.propertyTypeButton}
          testID="btngrpPropertyGroup"
        />
        <ButtonGroup<number>
          data={this.fetchButtonGroupData<IPropertyTypes>(data[propertyGroupSelectedIndex].asset_types)}
          onItemSelect={this.onPropertyGroupTypeSelect}
          selectedItem={propertyGroupTypeSelectedIndex}
          textType="label"
          textSize="regular"
          fontType="regular"
          containerStyle={styles.buttonGroupContainer}
          buttonItemStyle={styles.assetTypeButton}
          testID="btngrpPropertyGroupType"
        />
        <View style={styles.propertyContainer}>
          {this.renderSpaceAvailable()}
          {this.renderCarpetArea()}
        </View>
      </View>
    );
  }

  public renderSpaceAvailable = (): React.ReactElement => {
    const { t, data, propertyGroupSelectedIndex } = this.props;
    const spaceAvailableElements: Array<React.ReactElement> = [];
    data?.[propertyGroupSelectedIndex]?.space_types.forEach((space: IPropertyTypes, index: number) => {
      const key = data?.[propertyGroupSelectedIndex]?.name;
      const pickerValue = this.findSpaceTypeValue(space);
      const onValueChange = (value: string | number): void => {
        this.onHorizontalPickerValueChange(space, value);
      };
      spaceAvailableElements.push(
        <View style={styles.picker} key={`${key}-${index}`}>
          <Label type="large" textType="regular" style={styles.label}>
            {space.name}
          </Label>
          <HorizontalPicker key={`${key}-${index}`} onValueChange={onValueChange} value={pickerValue} testID="ftlist" />
        </View>
      );
    });
    return (
      <>
        <Text type="regular" textType="semiBold" style={styles.typeProperty}>
          {t('spaceAvailable')}
        </Text>
        {this.renderCommercialPickers()}
        {spaceAvailableElements}
      </>
    );
  };

  public renderCommercialPickers = (): React.ReactNode => {
    const {
      propertyGroupSelectedIndex,
      spaceAvailable: { totalFloors, floorNumber },
    } = this.props;
    if (propertyGroupSelectedIndex !== 1) {
      return null;
    }
    const commercialElements: Array<React.ReactNode> = [];
    const commercialSpaces = [
      {
        id: 1,
        name: SpaceAvailableTypes.FLOOR_NUMBER,
        value: floorNumber,
      },
      {
        id: 2,
        name: SpaceAvailableTypes.TOTAL_FLOORS,
        value: totalFloors,
      },
    ];
    commercialSpaces.forEach((space: any, index: number) => {
      const onValueChange = (value: string | number): void => {
        this.onHorizontalPickerValueChange(space, value);
      };
      commercialElements.push(
        <View style={styles.picker} key={index}>
          <Label type="large" textType="regular" style={styles.label}>
            {space.name}
          </Label>
          <HorizontalPicker key={index} onValueChange={onValueChange} value={space.value} testID="ftlist" />
        </View>
      );
    });
    return commercialElements;
  };

  public renderCarpetArea = (): React.ReactNode => {
    const {
      t,
      propertyGroupSelectedIndex,
      areaUnits,
      carpetAreaError,
      spaceAvailable: { carpetArea, areaUnit },
    } = this.props;
    if (propertyGroupSelectedIndex === 0 || areaUnits.length === 0) {
      return null;
    }
    const labelStyles = { ...theme.form.formLabel };
    const errorLabelStyles = { ...theme.form.formLabel, color: theme.colors.error };
    return (
      <View style={styles.formContainer}>
        <View style={styles.carpetArea}>
          <Label type="regular" textType="regular" style={carpetAreaError ? errorLabelStyles : labelStyles}>
            {t('carpetArea')}
          </Label>
          <TextInput
            key="carpetArea"
            value={carpetArea}
            keyboardType="number-pad"
            style={carpetAreaError ? styles.errorTextInput : styles.textInput}
            placeholder={t('enterCarpetArea')}
            onChangeText={this.onCarpetAreaChange}
            maxLength={5}
            testID="txtipCarpetArea"
          />
          {carpetAreaError && (
            <Label type="regular" style={styles.error}>
              {t('enterCarpetArea')}
            </Label>
          )}
        </View>
        <View style={styles.areaUnit}>
          <Label type="regular" textType="regular" style={labelStyles}>
            {t('areaUnit')}
          </Label>
          <Dropdown
            data={areaUnits}
            value={areaUnit}
            listTitle={t('selectAreaUnit')}
            onDonePress={this.onAreaUnitChange}
            iconSize={16}
            iconColor={theme.colors.darkTint7}
            containerStyle={styles.dropdownContainer}
            testID="dpnAreaUnit"
          />
        </View>
      </View>
    );
  };

  public onCarpetAreaChange = (value: string | number): void => {
    const { onCommercialPropertyChange } = this.props;
    if (onCommercialPropertyChange) {
      onCommercialPropertyChange('carpetArea', value);
    }
  };

  public onHorizontalPickerValueChange = (item: IPropertyTypes, index: string | number): void => {
    const { onSpaceAvailableValueChange } = this.props;
    onSpaceAvailableValueChange(item, index);
  };

  public onPropertyGroupSelect = (index: string | number): void => {
    const { onPropertyGroupChange } = this.props;
    onPropertyGroupChange(index);
  };

  public onPropertyGroupTypeSelect = (index: string | number): void => {
    const { onPropertyGroupTypeChange } = this.props;
    onPropertyGroupTypeChange(index);
  };

  public onAreaUnitChange = (value: string | number): void => {
    const { onCommercialPropertyChange } = this.props;
    if (onCommercialPropertyChange) {
      onCommercialPropertyChange('areaUnit', value);
    }
  };

  public findSpaceTypeValue = (space: IPropertyTypes): number => {
    const {
      spaceAvailable: { bedroom, bathroom, balcony },
    } = this.props;
    switch (space.name) {
      case SpaceAvailableTypes.BATHROOM:
        return bathroom;
      case SpaceAvailableTypes.BALCONY:
        return balcony;
      case SpaceAvailableTypes.BEDROOM:
        return bedroom;
      default:
        return 0;
    }
  };

  private fetchButtonGroupData = <T extends { name: string }>(data: T[]): { title: string; value: number }[] => {
    return data.map((item, index) => ({
      title: item.name,
      value: index,
    }));
  };
}

export default withTranslation(LocaleConstants.namespacesKey.property)(PropertyDetailsItems);
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    maxWidth: theme.viewport.width,
  },
  typeProperty: {
    color: theme.colors.darkTint4,
    marginBottom: 15,
  },
  propertyContainer: {
    marginHorizontal: 10,
    marginTop: 0,
    flexDirection: 'column',
  },
  textInput: {
    textAlign: 'left',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderColor: theme.colors.disabled,
  },
  errorTextInput: {
    textAlign: 'left',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...theme.form.fieldError,
  },
  formContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  carpetArea: {
    flex: 0.5,
    marginRight: 20,
  },
  areaUnit: {
    flex: 0.5,
  },
  picker: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10,
  },
  label: {
    flex: 0.8,
    alignSelf: 'center',
    color: theme.colors.darkTint4,
  },
  error: {
    color: theme.form.formErrorColor,
    marginTop: 3,
  },
  buttonGroupContainer: {
    marginBottom: 28,
  },
  propertyTypeButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  assetTypeButton: {
    marginBottom: 12,
  },
  dropdownContainer: {
    height: 54,
  },
});
