import React, { FC, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PopupActions } from 'reactjs-popup/dist/types';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { theme } from '@homzhub/common/src/styles/theme';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import PopupMenuOptions from '@homzhub/web/src/components/molecules/PopupMenuOptions';
import { DateSelector } from '@homzhub/web/src/components/molecules/DateSelector';

const properties = [{ label: 'rajat1' }, { label: 'rajat2' }, { label: 'rajat3' }, { label: 'rajat4' }];
interface IFormData {
  details: string;
  personName: string;
  amount: number;
  property: string[];
  category: string[];
}
const Form: FC = () => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.auth);
  const [isActiveIncome, setIsActiveIncome] = useState(true);
  const actionButtons = [
    { key: 1, name: 'Income', isActive: isActiveIncome },
    { key: 2, name: 'Expense', isActive: !isActiveIncome },
  ];
  const formData = {
    details: '',
    personName: '',
    amount: 0,
    property: [''],
    category: [''],
  };
  const handleSubmit = (values: IFormData, formActions: FormikHelpers<IFormData>): void => {
    formActions.setSubmitting(true);
    console.log(values);
  };
  const handleChangeColor = (text: string): void => {
    if (text === 'Income') {
      setIsActiveIncome(true);
    }
    if (text === 'Expense') {
      setIsActiveIncome(false);
    }
  };

  const popupRef = useRef<PopupActions>(null);
  const popupOptionStyle = { marginTop: '4px', width: 200 };
  const closePopup = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {actionButtons.map((items, key) => {
          const onActionButtonPress = (): void => handleChangeColor(items.name);
          return (
            <Button
              key={key}
              type="secondary"
              containerStyle={[styles.button, items.isActive && styles.activeButton]}
              onPress={onActionButtonPress}
            >
              <Typography
                variant="text"
                size="small"
                style={[styles.buttonTitle, items.isActive && styles.activeButtonTitle]}
              >
                {items.name}
              </Typography>
            </Button>
          );
        })}
      </View>
      <Formik initialValues={formData} onSubmit={handleSubmit}>
        {(formProps: FormikProps<IFormData>): React.ReactElement => (
          <View style={styles.formContent}>
            <View style={styles.firstChild}>
              <Popover
                forwardedRef={popupRef}
                content={<PopupMenuOptions options={properties} onMenuOptionPress={closePopup} />}
                popupProps={{
                  position: 'bottom center',
                  on: ['click'],
                  arrow: false,
                  contentStyle: popupOptionStyle,
                  closeOnDocumentClick: true,
                  children: undefined,
                }}
              >
                <FormTextInput
                  name="details"
                  label="Details"
                  inputType="default"
                  placeholder={t('Eg. Rent or Plumbing fees')}
                  formProps={formProps}
                />
              </Popover>
              <FormTextInput
                name="details"
                label="Details"
                inputType="default"
                placeholder={t('Eg. Rent or Plumbing fees')}
                formProps={formProps}
              />
              <FormTextInput
                name="personName"
                label="Received From"
                inputType="default"
                placeholder={t('Eg. Rajat Kumar')}
                formProps={formProps}
              />
              <FormTextInput
                name="amount"
                label="Amount"
                inputType="number"
                placeholder={t('Enter Your Money')}
                formProps={formProps}
              />
              <FormTextInput
                name="amount"
                label="Amount"
                inputType="number"
                placeholder={t('Enter Your Money')}
                formProps={formProps}
              />
              <Popover
                forwardedRef={popupRef}
                content={<PopupMenuOptions options={properties} onMenuOptionPress={closePopup} />}
                popupProps={{
                  position: 'bottom center',
                  on: ['click'],
                  arrow: false,
                  contentStyle: popupOptionStyle,
                  closeOnDocumentClick: true,
                  children: undefined,
                }}
              >
                <FormTextInput
                  name="category"
                  label="Category"
                  inputType="default"
                  placeholder={t('Select Your Category')}
                  formProps={formProps}
                />
              </Popover>
              <DateSelector />
            </View>
            <Divider containerStyles={styles.divider} />
            <View style={styles.secondChild}>
              <TextArea
                inputContainerStyle={styles.inputContainerStyle}
                wordCountLimit={200}
                placeholder="Type here..."
                value="123"
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 800,
  },
  formContent: {
    flexDirection: 'row',
    margin: 10,
  },
  firstChild: {
    width: '50%',
    padding: 12,
  },
  secondChild: {
    width: '50%',
    padding: 20,
    marginTop: -60,
  },
  inputContainerStyle: {
    height: 100,
  },
  divider: {
    marginTop: -60,
    borderColor: theme.colors.divider,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginHorizontal: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: 'max-content',
    marginLeft: 24,
    borderRadius: 4,
    borderColor: theme.colors.blue,
    borderWidth: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 48,
    borderWidth: 0,
    borderRadius: 0,
  },
  activeButton: {
    backgroundColor: theme.colors.blue,
  },
  buttonTitle: {
    color: theme.colors.darkTint4,
  },
  activeButtonTitle: {
    color: theme.colors.white,
  },
  formContainer: {
    flexDirection: 'row',
  },
});

export default Form;