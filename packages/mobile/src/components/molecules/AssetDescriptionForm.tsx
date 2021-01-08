import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormikProps, FormikValues } from 'formik';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormDropdown } from '@homzhub/common/src/components/molecules/FormDropdown';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { FormCounter } from '@homzhub/common/src/components/molecules/FormCounter';
import { FormCalendar } from '@homzhub/mobile/src/components/molecules/FormCalendar';
import { AssetDescriptionDropdownValues } from '@homzhub/common/src/domain/models/AssetDescriptionForm';

interface IProps {
  formProps: FormikProps<FormikValues>;
  dropDownOptions: AssetDescriptionDropdownValues;
}

const AssetDescriptionForm = ({ formProps, dropDownOptions }: IProps): React.ReactElement => {
  const [t] = useTranslation(LocaleConstants.namespacesKey.property);

  return (
    <>
      <View style={styles.formContainer}>
        <View style={styles.contentView}>
          <View style={styles.subContentView}>
            <FormTextInput
              style={styles.inputFieldStyle}
              name="carpetArea"
              label={t('propertySearch:carpetArea')}
              maxLength={10}
              numberOfLines={1}
              inputType="number"
              placeholder={t('propertySearch:carpetAreaPlaceholder')}
              formProps={formProps}
            />
          </View>
          <View style={styles.flexOne}>
            <FormDropdown
              name="areaUnit"
              label={t('areaUnit')}
              options={dropDownOptions.areaUnitDropdownValues}
              placeholder={t('selectAreaUnit')}
              formProps={formProps}
            />
          </View>
        </View>
        <FormDropdown
          label={t('facingText')}
          name="facing"
          options={dropDownOptions.facing}
          placeholder={t('propertySearch:selectFacing')}
          formProps={formProps}
        />
        <FormDropdown
          label={t('flooringType')}
          name="flooringType"
          options={dropDownOptions.typeOfFlooring}
          placeholder={t('selectFlooringType')}
          formProps={formProps}
        />
        <FormCalendar
          formProps={formProps}
          label={t('yearOfPossession')}
          name="yearOfConstruction"
          allowPastDates
          isYearView
          calendarTitle={t('yearOfPossession')}
          placeHolder={t('assetFinancial:addDatePlaceholder')}
          placeHolderStyle={styles.placeHolderStyle}
          dateStyle={styles.dateStyle}
          textType="label"
        />
        <FormCounter
          containerStyles={styles.marginTop}
          name="totalFloors"
          maxCount={1000}
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
  formContainer: {
    backgroundColor: theme.colors.white,
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
  dateStyle: {
    marginLeft: 0,
  },
  placeHolderStyle: {
    color: theme.colors.darkTint8,
  },
});
