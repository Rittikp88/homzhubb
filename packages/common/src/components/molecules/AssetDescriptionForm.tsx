import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormikProps, FormikValues } from 'formik';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormDropdown } from '@homzhub/common/src/components/molecules/FormDropdown';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { FormCounter } from '@homzhub/common/src/components/molecules/FormCounter';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';
import { AssetDescriptionDropdownValues } from '@homzhub/common/src/domain/models/AssetDescriptionForm';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  formProps: FormikProps<FormikValues>;
  dropDownOptions: AssetDescriptionDropdownValues;
}

const AssetDescriptionForm = ({ formProps, dropDownOptions }: IProps): React.ReactElement => {
  const [t] = useTranslation(LocaleConstants.namespacesKey.property);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = formStyles(isMobile);
  return (
    <View style={styles.formFieldsContainer}>
      <View style={styles.formFieldsContainer}>
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
        <View style={styles.formFields}>
          <FormDropdown
            label={t('facingText')}
            name="facing"
            options={dropDownOptions.facing}
            placeholder={t('propertySearch:selectFacing')}
            formProps={formProps}
          />
        </View>
        <View style={styles.formFields}>
          <FormDropdown
            label={t('flooringType')}
            name="flooringType"
            options={dropDownOptions.typeOfFlooring}
            placeholder={t('selectFlooringType')}
            formProps={formProps}
          />
        </View>
        <View style={styles.formFields}>
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
            dateContainerStyle={styles.dateContainerStyle}
            textType="label"
          />
        </View>
      </View>
      <FormCounter
        containerStyles={styles.formCounter}
        name="totalFloors"
        maxCount={1000}
        label={t('numberOfFloorsText')}
        formProps={formProps}
      />
      <FormCounter
        containerStyles={styles.formCounter}
        name="onFloorNumber"
        label={t('onFloorText')}
        formProps={formProps}
        maxCount={formProps.values.totalFloors}
      />
    </View>
  );
};

interface IFormStyles {
  formContainer: ViewStyle;
  contentView: ViewStyle;
  subContentView: ViewStyle;
  formFields: ViewStyle;
  formFieldsContainer: ViewStyle;
  formCounter: ViewStyle;
  flexOne: ViewStyle;
  inputFieldStyle: ViewStyle;
  dateStyle: ViewStyle;
  dateContainerStyle: ViewStyle;
  placeHolderStyle: ViewStyle;
}

const formStyles = (isMobile: boolean): StyleSheet.NamedStyles<IFormStyles> =>
  StyleSheet.create<IFormStyles>({
    formFieldsContainer: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    formContainer: {
      flexDirection: isMobile ? undefined : 'row',
      flexWrap: isMobile ? undefined : 'wrap',
      backgroundColor: theme.colors.white,
      paddingBottom: 24,
    },
    contentView: {
      flexShrink: isMobile ? 1 : undefined,
      flexDirection: 'row',
      alignItems: 'center',
    },
    subContentView: {
      flex: 1,
      marginRight: 16,
    },
    formFields: {
      width: isMobile ? '100%' : undefined,
      marginLeft: isMobile ? 0 : 24,
      justifyContent: 'center',
    },
    formCounter: {
      marginTop: 24,
      marginRight: isMobile ? 0 : 24,
    },
    flexOne: {
      flex: 1,
    },
    inputFieldStyle: {
      height: 40,
    },
    dateStyle: {
      marginLeft: 0,
    },
    dateContainerStyle: {
      paddingVertical: 8,
      marginTop: 0,
    },
    placeHolderStyle: {
      color: theme.colors.darkTint8,
    },
  });

const memoizedComponent = React.memo(AssetDescriptionForm);
export { memoizedComponent as AssetDescriptionForm };
