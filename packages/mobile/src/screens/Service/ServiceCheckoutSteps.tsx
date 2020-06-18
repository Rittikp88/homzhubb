import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
import { Label, Text } from '@homzhub/common/src/components';
import Header from '@homzhub/mobile/src/components/molecules/Header';
import { StepIndicatorComponent } from '@homzhub/mobile/src/components/molecules/StepIndicator';
import PropertyVerification from '@homzhub/mobile/src/components/organisms/PropertyVerification';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IScreenState {
  currentStep: number;
}

interface IStateProps {
  propertyId: number;
}

type OwnProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.ServiceCheckoutSteps>;
type Props = OwnProps & IStateProps;
const TOTAL_STEPS = 4;

class ServiceCheckoutSteps extends React.PureComponent<Props, IScreenState> {
  public state = {
    currentStep: 0,
  };

  public render = (): React.ReactNode => {
    return (
      <>
        {this.renderHeader()}
        <ScrollView style={styles.scrollView}>
          <View style={styles.screen}>
            {this.renderTitle()}
            {this.renderContent()}
          </View>
        </ScrollView>
      </>
    );
  };

  private renderHeader = (): React.ReactNode => {
    const { currentStep } = this.state;

    return (
      <>
        <Header
          icon={icons.leftArrow}
          iconColor={theme.colors.white}
          isHeadingVisible
          title={this.fetchScreenTitle()}
          titleType="small"
          titleFontType="semiBold"
          titleStyle={styles.textColor}
          backgroundColor={theme.colors.primaryColor}
        />
        <StepIndicatorComponent
          stepCount={TOTAL_STEPS}
          labels={this.fetchStepLabels()}
          currentPosition={currentStep}
          onPress={this.onStepPress}
          containerStyle={styles.containerStyle}
        />
      </>
    );
  };

  private renderTitle = (): React.ReactNode => {
    const { currentStep } = this.state;
    const { t } = this.props;

    return (
      <>
        <View style={styles.headingRow}>
          <Label type="large" textType="semiBold">
            {t('step', { stepNumber: currentStep + 1, totalSteps: TOTAL_STEPS })}
          </Label>
          {(currentStep === 1 || currentStep === 2) && (
            <Text type="small" textType="semiBold" style={styles.skipForNow} onPress={this.onSkipPress}>
              {t('skipForNow')}
            </Text>
          )}
        </View>
        <Text type="regular" textType="semiBold">
          {this.fetchStepTitle()}
        </Text>
      </>
    );
  };

  private renderContent = (): React.ReactNode => {
    const { currentStep } = this.state;
    switch (currentStep) {
      case 0:
        return (
          <Label type="regular" textType="regular">
            1
          </Label>
        );
      case 1:
        return (
          <Label type="regular" textType="regular">
            2
          </Label>
        );
      case 2:
        return <PropertyVerification navigateToPropertyHelper={this.navigateToScreen} />;
      default:
        return (
          <Label type="regular" textType="regular">
            4
          </Label>
        );
    }
  };

  private onStepPress = (currentStep: number): void => {
    this.setState({ currentStep });
  };

  private onSkipPress = (): void => {
    const { currentStep } = this.state;
    this.setState({ currentStep: currentStep + 1 });
  };

  private fetchStepLabels = (): string[] => {
    const { t } = this.props;
    // Maintain Order as Per Steps
    return [t('common:details'), t('common:images'), t('common:verification'), t('common:payment')];
  };

  private fetchStepTitle = (): string => {
    const { t } = this.props;
    const { currentStep } = this.state;
    // Maintain Order as Per Steps
    const titleStep = [
      t('enterLeaseDetails'),
      t('addPropertyImages'),
      t('completePropertyVerification'),
      t('payTokenAmount'),
    ];
    return titleStep[currentStep];
  };

  private fetchScreenTitle = (): string => {
    const { t } = this.props;
    const { currentStep } = this.state;
    // Maintain Order as Per Steps
    const screenTitles = [t('leaseDetails'), t('propertyImages'), t('propertyVerification'), t('tokenPayment')];
    return screenTitles[currentStep];
  };

  public navigateToScreen = (screenKey: any): any => {
    const { navigation } = this.props;
    navigation.navigate(screenKey);
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getCurrentPropertyId } = PropertySelector;
  return {
    propertyId: getCurrentPropertyId(state),
  };
};

const connectedComponent = connect<IStateProps, null, OwnProps, IState>(mapStateToProps, null)(ServiceCheckoutSteps);
const HOC = withTranslation(LocaleConstants.namespacesKey.service)(connectedComponent);
export { HOC as ServiceCheckoutSteps };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.screenBackground,
    paddingHorizontal: theme.layout.screenPadding,
  },
  containerStyle: {
    paddingVertical: 12,
    backgroundColor: theme.colors.primaryColor,
  },
  headingRow: {
    marginTop: 20,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skipForNow: {
    color: theme.colors.active,
  },
  textColor: {
    color: theme.colors.white,
  },
  scrollView: {
    flex: 1,
  },
});
