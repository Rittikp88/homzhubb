import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormikProps, FormikValues } from 'formik';
import { debounce } from 'lodash';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { ResponseHelper } from '@homzhub/common/src/services/GooglePlaces/ResponseHelper';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  formProps: FormikProps<FormikValues>;
  isVerificationDone?: boolean;
  isCityEditable?: boolean;
}

const PostAssetForm = ({ formProps, isVerificationDone, isCityEditable = false }: IProps): React.ReactElement => {
  const [t] = useTranslation(LocaleConstants.namespacesKey.property);
  const [editCity, setEditCity] = useState<boolean>(false);

  useEffect(() => {
    setEditCity(isCityEditable);
  }, [isCityEditable]);

  const onChangePincode = useCallback(async (pincode: string): Promise<void> => {
    formProps.setFieldValue('pincode', pincode);
    await updateValues(pincode);
  }, []);

  const updateValues = useCallback(
    debounce(async (pincode: string): Promise<void> => {
      if (pincode.length === 0) {
        formProps.setFieldValue('city', '');
        formProps.setFieldValue('state', '');
        formProps.setFieldValue('country', '');
        formProps.setFieldValue('countryIsoCode', '');
        return;
      }
      try {
        const response = await GooglePlacesService.getLocationData(undefined, pincode);
        const addressComponents = ResponseHelper.getLocationDetails(response);
        const cityName = addressComponents.city ?? addressComponents.area;
        setEditCity(!cityName);
        formProps.setFieldValue('city', cityName);
        formProps.setFieldValue('state', addressComponents.state);
        formProps.setFieldValue('country', addressComponents.country);
        formProps.setFieldValue('countryIsoCode', addressComponents.countryIsoCode);
      } catch (e) {
        AlertHelper.error({ message: e.message });
      }
    }, 500),
    []
  );

  return (
    <>
      <View style={styles.fieldsView}>
        <FormTextInput
          name="projectName"
          label={t('projectName')}
          inputType="default"
          maxLength={50}
          numberOfLines={1}
          placeholder={t('projectNamePlaceholder')}
          formProps={formProps}
          isMandatory
          editable={!isVerificationDone}
        />
        <View style={styles.contentView}>
          <View style={styles.subContentView}>
            <FormTextInput
              name="unitNo"
              label={t('unitNo')}
              maxLength={10}
              numberOfLines={1}
              inputType="default"
              formProps={formProps}
              isMandatory
              editable={!isVerificationDone}
            />
          </View>
          <View style={styles.flexOne}>
            <FormTextInput
              name="blockNo"
              label={t('blockNo')}
              maxLength={10}
              numberOfLines={1}
              inputType="default"
              formProps={formProps}
              editable={!isVerificationDone}
            />
          </View>
        </View>
        <FormTextInput
          name="address"
          label={t('address')}
          maxLength={100}
          inputType="default"
          multiline
          formProps={formProps}
          style={styles.address}
          isMandatory
        />
        <View style={styles.contentView}>
          <View style={styles.subContentView}>
            <FormTextInput
              name="pincode"
              label={t('pincode')}
              maxLength={10}
              numberOfLines={1}
              inputType="number"
              onChangeText={onChangePincode}
              formProps={formProps}
              isMandatory
            />
          </View>
          <View style={styles.flexOne}>
            <FormTextInput
              name="city"
              label={t('city')}
              maxLength={20}
              numberOfLines={1}
              inputType="default"
              editable={editCity}
              formProps={formProps}
              isMandatory={editCity}
            />
          </View>
        </View>
        <View style={styles.contentView}>
          <View style={styles.subContentView}>
            <FormTextInput
              name="state"
              label={t('state')}
              maxLength={20}
              numberOfLines={1}
              inputType="default"
              editable={false}
              formProps={formProps}
            />
          </View>
          <View style={styles.flexOne}>
            <FormTextInput
              name="country"
              label={t('country')}
              maxLength={20}
              numberOfLines={1}
              editable={false}
              inputType="default"
              formProps={formProps}
            />
          </View>
        </View>
      </View>
      <Divider />
    </>
  );
};

const memoizedComponent = React.memo(PostAssetForm);
export { memoizedComponent as PostAssetForm };

const styles = StyleSheet.create({
  fieldsView: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  contentView: {
    flexDirection: 'row',
  },
  subContentView: {
    flex: 1,
    marginRight: 16,
  },
  address: {
    height: 80,
    paddingTop: 16,
    paddingBottom: 16,
  },
  flexOne: {
    flex: 1,
  },
});
