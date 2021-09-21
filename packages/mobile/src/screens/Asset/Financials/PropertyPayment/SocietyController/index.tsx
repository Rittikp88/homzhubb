import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import SocietyList from '@homzhub/mobile/src/screens/Asset/Financials/PropertyPayment/SocietyController/SocietyList';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const SocietyController = (): React.ReactElement => {
  const { goBack } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.propertyPayment);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAddSociety, setAddSociety] = useState(false);

  const handleBackPress = (): void => {
    if (currentStep === 0 && isAddSociety) {
      setAddSociety(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      goBack();
    }
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
        return isAddSociety ? <EmptyState /> : <SocietyList />;
      default:
        return <EmptyState />;
    }
  };
  return (
    <UserScreen
      isGradient
      pageTitle={getPageTitle()}
      onBackPress={handleBackPress}
      headerStyle={styles.pageHeader}
      title={t('propertyPayment')}
      backgroundColor={theme.colors.white}
      renderExtraContent={renderStepIndicator()}
      onPlusIconClicked={(): void => setAddSociety(true)}
    >
      {renderSteps()}
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
});
