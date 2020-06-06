import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { IPropertyDetailsData, IPropertyTypes } from '@homzhub/common/src/domain/models/Property';
import {
  SpaceAvailableTypes,
  ISpaceAvailable,
  ISpaceAvailablePayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { HorizontalPicker, Label, Text, Dropdown } from '@homzhub/common/src/components';
import ItemGroup from '@homzhub/mobile/src/components/molecules/ItemGroup';

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

class PropertyDetailsItems extends React.PureComponent<Props, {}> {
  public render(): React.ReactNode {
    const { t, data, propertyGroupSelectedIndex, propertyGroupTypeSelectedIndex } = this.props;
    if (!data) {
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
          data={data?.[propertyGroupSelectedIndex]?.asset_types ?? []}
          onItemSelect={this.onPropertyGroupTypeSelect}
          textStyle={styles.textColor}
          selectedIndex={propertyGroupTypeSelectedIndex}
          textType="label"
        />
        <View style={styles.propertyContainer}>
          {this.renderSpaceAvailable()}
          {this.renderCarpetArea()}
        </View>
      </View>
    );
  }

  public renderSpaceAvailable = (): React.ReactNode => {
    const { t, data, propertyGroupSelectedIndex } = this.props;
    if (!data) {
      return null;
    }
    const spaceAvailableElements: Array<React.ReactNode> = [];
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
          <HorizontalPicker key={`${key}-${index}`} onValueChange={onValueChange} value={pickerValue} />
        </View>
      );
    });
    return (
      <>
        <Text type="regular" textType="semiBold" style={styles.typeProperty}>
          {t('propertyDetails:spaceAvailable')}
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
          <HorizontalPicker key={index} onValueChange={onValueChange} value={space.value} />
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
    return (
      <View style={styles.formContainer}>
        <View style={styles.carpetArea}>
          <Label type="regular" textType="regular" style={labelStyles}>
            {t('propertyDetails:carpetArea')}
          </Label>
          <TextInput
            key="carpetArea"
            value={carpetArea}
            keyboardType="number-pad"
            style={styles.textInput}
            placeholder={t('propertyDetails:enterCarpetArea')}
            onChangeText={this.onCarpetAreaChange}
            maxLength={5}
          />
          {carpetAreaError && (
            <Label type="regular" style={styles.error}>
              {t('propertyDetails:enterCarpetArea')}
            </Label>
          )}
        </View>
        <View style={styles.areaUnit}>
          <Label type="regular" textType="regular" style={labelStyles}>
            {t('propertyDetails:areaUnit')}
          </Label>
          <Dropdown
            data={areaUnits}
            value={areaUnit}
            listTitle={t('propertyDetails:selectAreaUnit')}
            onDonePress={this.onAreaUnitChange}
            iconSize={16}
            iconColor={theme.colors.darkTint7}
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

  public findSpaceTypeValue = (space: ISpaceAvailablePayload): number => {
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
}

export default withTranslation()(PropertyDetailsItems);
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    maxWidth: theme.viewport.width,
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
  textInput: {
    textAlign: 'left',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderColor: theme.colors.disabled,
  },
  formContainer: {
    flexDirection: 'row',
    marginBottom: 80,
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
});
