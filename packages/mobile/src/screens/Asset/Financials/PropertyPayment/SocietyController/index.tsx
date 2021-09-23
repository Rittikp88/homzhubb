import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PropertyPaymentActions } from '@homzhub/common/src/modules/propertyPayment/actions';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { RNCheckbox } from '@homzhub/common/src/components/atoms/Checkbox';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import AddSocietyBank from '@homzhub/common/src/components/organisms/Society/AddSocietyBank';
import AddSocietyForm from '@homzhub/common/src/components/organisms/Society/AddSocietyForm';
import SocietyList from '@homzhub/common/src/components/organisms/Society/SocietyList';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const SocietyController = (): React.ReactElement => {
  const { goBack } = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.propertyPayment);
  const { getSocieties } = useSelector(PropertyPaymentSelector.getPropertyPaymentLoaders);
  const asset = useSelector(PropertyPaymentSelector.getSelectedAsset);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAddSociety, setAddSociety] = useState(false);
  const [showConfirmationSheet, setConfirmationSheet] = useState(false);
  const [isCheckboxSelected, toggleCheckbox] = useState(false);
  const [isEmptyList, toggleList] = useState(false);
  const [isTermsAccepted, setTermValue] = useState(false);

  useEffect(() => {
    if (asset.project) {
      dispatch(PropertyPaymentActions.getSocieties({ project_id: asset.project.id }));
    }
  }, []);

  const handleBackPress = (): void => {
    if (currentStep === 0 && isAddSociety) {
      dispatch(PropertyPaymentActions.clearSocietyFormData());
      setAddSociety(false);
    } else if (currentStep === 2 && !isAddSociety) {
      // Skip 2nd step in case of existing societies
      setCurrentStep(currentStep - 2);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      dispatch(PropertyPaymentActions.getSocietiesSuccess([]));
      goBack();
    }
  };

  const onProceed = (): void => {
    // Skip 2nd step in case of existing societies
    if (currentStep === 1) {
      setTermValue(true);
    } else {
      onProceedCallback();
    }
  };

  const onProceedCallback = (): void => {
    setCurrentStep(currentStep < 1 ? currentStep + 2 : currentStep + 1);
    setConfirmationSheet(false);
    if (isTermsAccepted) {
      setTermValue(false);
    }
  };

  const onUpdateSociety = (value: boolean): void => {
    toggleList(value);
  };

  const getStepLabels = (): string[] => {
    return [t('selectSociety'), t('property:selectBankAccount'), t('property:payment')];
  };

  const getPageTitle = (): string => {
    switch (currentStep) {
      case 0:
        return isAddSociety ? t('addSociety') : t('societies');
      case 1:
        return t('assetFinancial:addBankAccount');
      case 2:
        return t('property:payment');
      default:
        return t('propertyPayment');
    }
  };

  const renderIndicator = (args: { position: number; stepStatus: string }): React.ReactElement => {
    const { stepStatus } = args;
    const backgroundColor = stepStatus === 'unfinished' ? theme.colors.white : theme.colors.primaryColor;
    return (
      <>
        {stepStatus === 'finished' ? (
          <Icon name={icons.checkFilled} color={theme.colors.primaryColor} size={16} />
        ) : (
          <View style={[styles.indicatorView, { backgroundColor }]} />
        )}
      </>
    );
  };

  const renderStepLabels = (args: {
    position: number;
    stepStatus: string;
    label: string;
    currentPosition: number;
  }): React.ReactElement => {
    const { position, label, currentPosition } = args;
    return (
      <View style={styles.labelContainer}>
        <Label textType="semiBold" style={styles.textColor}>
          {t('common:stepIndicator', { position: position + 1 })}
        </Label>
        {position <= currentPosition && (
          <Label textType="semiBold" style={styles.textColor}>
            {label}
          </Label>
        )}
      </View>
    );
  };

  const renderStepIndicator = (): React.ReactElement => {
    const customStyles = {
      stepIndicatorCurrentColor: theme.colors.white,
      stepIndicatorUnFinishedColor: theme.colors.blueTint15,
      stepIndicatorFinishedColor: theme.colors.white,
      separatorFinishedColor: theme.colors.white,
      separatorUnFinishedColor: theme.colors.blueTint16,
      stepStrokeCurrentColor: 'transparent',
      currentStepIndicatorSize: 30,
      stepStrokeWidth: 0,
    };
    return (
      <StepIndicator
        stepCount={3}
        labels={getStepLabels()}
        customStyles={customStyles}
        currentPosition={currentStep}
        renderLabel={renderStepLabels}
        renderStepIndicator={renderIndicator}
      />
    );
  };

  const renderSteps = (): React.ReactElement => {
    // TODO: (Shikha) - Add Components for each step
    switch (currentStep) {
      case 0:
        return isAddSociety ? (
          <AddSocietyForm onSubmitForm={(): void => setCurrentStep(currentStep + 1)} />
        ) : (
          <SocietyList onUpdateSociety={onUpdateSociety} onSelectSociety={(): void => setConfirmationSheet(true)} />
        );
      case 1:
        return (
          <AddSocietyBank
            isTermsAccepted={isTermsAccepted}
            onSubmitSuccess={onProceedCallback}
            onSubmit={(): void => setConfirmationSheet(true)}
          />
        );
      default:
        return <EmptyState />;
    }
  };

  const renderConfirmationSheet = (): React.ReactElement => {
    return (
      <BottomSheet visible={showConfirmationSheet} onCloseSheet={(): void => setConfirmationSheet(false)}>
        <View style={styles.sheetContainer}>
          <RNCheckbox
            selected={isCheckboxSelected}
            label={t('verificationMsg')}
            onToggle={(): void => toggleCheckbox(!isCheckboxSelected)}
          />
          <Button
            type="primary"
            title={t('common:proceed')}
            onPress={onProceed}
            disabled={!isCheckboxSelected}
            containerStyle={styles.buttonContainer}
            titleStyle={styles.buttonTitle}
          />
        </View>
      </BottomSheet>
    );
  };

  const isPlusIconVisible = isEmptyList && currentStep === 0 && !isAddSociety;

  return (
    <UserScreen
      isGradient
      loading={getSocieties}
      pageTitle={getPageTitle()}
      onBackPress={handleBackPress}
      headerStyle={styles.pageHeader}
      title={t('propertyPayment')}
      backgroundColor={theme.colors.white}
      renderExtraContent={renderStepIndicator()}
      onPlusIconClicked={isPlusIconVisible ? (): void => setAddSociety(true) : undefined}
    >
      {renderSteps()}
      {renderConfirmationSheet()}
    </UserScreen>
  );
};

export default SocietyController;

const styles = StyleSheet.create({
  pageHeader: {
    backgroundColor: theme.colors.white,
  },
  labelContainer: {
    alignItems: 'center',
    marginBottom: 14,
  },
  textColor: {
    color: theme.colors.white,
  },
  indicatorView: {
    ...(theme.circleCSS(10) as object),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 0,
    height: 50,
    marginVertical: 20,
  },
  buttonTitle: {
    marginVertical: 4,
  },
  sheetContainer: {
    marginHorizontal: 24,
  },
});
