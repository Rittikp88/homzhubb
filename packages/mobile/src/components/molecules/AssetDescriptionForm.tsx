import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormikProps, FormikValues } from 'formik';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormCalendar, FormDropdown, FormTextInput, Text } from '@homzhub/common/src/components';
import { FormCounter } from '@homzhub/common/src/components/molecules/FormCounter';
import { AssetDescriptionDropdownValues } from '@homzhub/common/src/domain/models/AssetDescriptionForm';

interface IProps {
  formProps: FormikProps<FormikValues>;
  dropDownOptions: AssetDescriptionDropdownValues;
}

const AssetDescriptionForm = ({ formProps, dropDownOptions }: IProps): React.ReactElement => {
  const [t] = useTranslation(LocaleConstants.namespacesKey.property);
  // Todo (Sriram: Look into this prefill issue of carpetArea)

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
              placeholder={t('common:enter')}
              formProps={formProps}
            />
          </View>
          <View style={styles.flexOne}>
            <FormDropdown
              name="areaUnit"
              label={t('areaUnit')}
              options={dropDownOptions.areaUnitDropdownValues}
              placeholder={t('selectAreaUnit')}
              maxLabelLength={8}
              formProps={formProps}
            />
          </View>
        </View>
        <FormDropdown
          label={t('facingText')}
          name="facing"
          options={dropDownOptions.facing}
          placeholder={t('propertySearch:selectFacing')}
          maxLabelLength={36}
          formProps={formProps}
        />
        <FormDropdown
          label={t('flooringType')}
          name="flooringType"
          options={dropDownOptions.typeOfFlooring}
          placeholder={t('selectFlooringType')}
          maxLabelLength={36}
          formProps={formProps}
        />
        <FormCalendar
          formProps={formProps}
          label={t('yearOfConstruction')}
          name="yearOfConstruction"
          allowPastDates
          isYearView
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
  dateStyle: {
    marginLeft: 0,
  },
  placeHolderStyle: {
    color: theme.colors.darkTint8,
  },
});
