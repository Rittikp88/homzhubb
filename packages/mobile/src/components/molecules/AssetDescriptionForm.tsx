import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormikProps, FormikValues } from 'formik';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormDropdown, FormTextInput, IDropdownOption, Text } from '@homzhub/common/src/components';
import { FormCounter } from '@homzhub/common/src/components/molecules/FormCounter';
import {
  AssetDescriptionDropdownValues,
  FormUnit,
  AssetDescriptionDropdownTypes,
} from '@homzhub/common/src/domain/models/AssetDescriptionForm';

interface IProps {
  formProps: FormikProps<FormikValues>;
  dropDownOptions: AssetDescriptionDropdownValues;
}

const AssetDescriptionForm = ({ formProps, dropDownOptions }: IProps): React.ReactElement => {
  const [t] = useTranslation(LocaleConstants.namespacesKey.property);
  const { Facing, FurnishingStatus, CarpetUnit, FlooringType } = AssetDescriptionDropdownTypes;

  const transformDropdownTypes = (typeArray: FormUnit[], type: string): IDropdownOption[] => {
    return typeArray.map((item) => {
      if (type === Facing || type === FurnishingStatus) {
        return {
          value: item.name,
          label: item.label,
        };
      }

      if (type === CarpetUnit) {
        return {
          value: item.id,
          label: item.title,
        };
      }

      return {
        value: item.id,
        label: item.label,
      };
    });
  };

  return (
    <>
      <Text type="small" style={styles.headingStyle}>
        {t('assetDescription:description')}
      </Text>
      <View style={styles.formContainer}>
        <View style={styles.contentView}>
          <View style={styles.subContentView}>
            <FormTextInput
              style={styles.inputFieldStyle}
              name="carpetArea"
              label={t('carpetArea')}
              maxLength={10}
              numberOfLines={1}
              inputType="number"
              formProps={formProps}
            />
          </View>
          <View style={styles.flexOne}>
            <FormDropdown
              name="areaUnit"
              label={t('areaUnit')}
              options={transformDropdownTypes(dropDownOptions.carpetAreaUnit, CarpetUnit)}
              placeholder={t('selectAreaUnit')}
              maxLabelLength={8}
              formProps={formProps}
            />
          </View>
        </View>
        <FormDropdown
          label={t('facingText')}
          name="facing"
          options={transformDropdownTypes(dropDownOptions.facing, Facing)}
          placeholder={t('propertySearch:selectFacing')}
          maxLabelLength={36}
          formProps={formProps}
        />
        <FormDropdown
          label={t('flooringType')}
          name="flooringType"
          options={transformDropdownTypes(dropDownOptions.typeOfFlooring, FlooringType)}
          placeholder={t('selectFlooringType')}
          maxLabelLength={36}
          formProps={formProps}
        />
        <FormDropdown
          formProps={formProps}
          name="yearOfConstruction"
          textType="label"
          label={t('yearOfConstruction')}
          options={DateUtils.getYearList(20, 5)}
          placeholder={t('assetFinancial:addDatePlaceholder')}
        />
        <FormCounter
          containerStyles={styles.marginTop}
          name="totalFloors"
          label={t('numberOfFloorsText')}
          formProps={formProps}
        />
        <FormCounter
          containerStyles={styles.marginTop}
          name="onFloorNumber"
          label={t('onFloorText')}
          formProps={formProps}
          maxCount={formProps.values.totalFloors}
        />
      </View>
    </>
  );
};

const memoizedComponent = React.memo(AssetDescriptionForm);
export { memoizedComponent as AssetDescriptionForm };

const styles = StyleSheet.create({
  headingStyle: {
    marginTop: 16,
    paddingVertical: 16,
    paddingLeft: 16,
    backgroundColor: theme.colors.moreSeparator,
  },
  formContainer: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  contentView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subContentView: {
    flex: 1,
    marginRight: 16,
  },
  flexOne: {
    flex: 1,
  },
  marginTop: {
    marginTop: 24,
  },
  inputFieldStyle: {
    height: 40,
  },
});
