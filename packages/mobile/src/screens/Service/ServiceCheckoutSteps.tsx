import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { PropertyActions } from '@homzhub/common/src/modules/property/actions';
import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
import { Button, Label, Text, WithShadowView } from '@homzhub/common/src/components';
import Header from '@homzhub/mobile/src/components/molecules/Header';
import { StepIndicatorComponent } from '@homzhub/mobile/src/components/molecules/StepIndicator';
import PropertyImages from '@homzhub/mobile/src/components/organisms/PropertyImages';
import { CheckoutAssetDetails } from '@homzhub/mobile/src/components/organisms/CheckoutAssetDetails';
import { PropertyPayment } from '@homzhub/mobile/src/components/organisms/PropertyPayment';
import PropertyVerification from '@homzhub/mobile/src/components/organisms/PropertyVerification';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IScreenState {
  currentStep: number;
  isPaymentSuccess: boolean;
}

interface IStateProps {
  propertyId: number;
  leaseTermId: number;
}

interface IDispatchProps {
  setCurrentLeaseTermId: (leaseTermId: number) => void;
}

type OwnProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.ServiceCheckoutSteps>;
type Props = OwnProps & IStateProps & IDispatchProps;
const TOTAL_STEPS = 4;

class ServiceCheckoutSteps extends React.PureComponent<Props, IScreenState> {
  public state = {
    currentStep: 0,
    isPaymentSuccess: false,
  };

  public render = (): React.ReactNode => {
    const { t } = this.props;
    const { isPaymentSuccess } = this.state;
    return (
      <>
        {this.renderHeader()}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {this.renderTitle()}
          {this.renderContent()}
        </ScrollView>
        {isPaymentSuccess && (
          <WithShadowView outerViewStyle={styles.shadowView}>
            <Button type="primary" title={t('previewProperty')} containerStyle={styles.buttonStyle} />
          </WithShadowView>
        )}
      </>
    );
  };

  private renderHeader = (): React.ReactNode => {
    const { currentStep, isPaymentSuccess } = this.state;

    return (
      <>
        <Header
          icon={icons.leftArrow}
          iconColor={theme.colors.white}
          onIconPress={this.handleBackPress}
          isHeadingVisible
          title={this.fetchScreenTitle()}
          titleType="small"
          titleFontType="semiBold"
          backgroundColor={theme.colors.primaryColor}
        />
        <StepIndicatorComponent
          stepCount={TOTAL_STEPS}
          labels={this.fetchStepLabels()}
          currentPosition={currentStep}
          onPress={this.onStepPress}
          containerStyle={styles.containerStyle}
          isPaymentSuccess={isPaymentSuccess}
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
          <Label type="large" textType="semiBold" style={styles.textColor}>
            {t('step', { stepNumber: currentStep + 1, totalSteps: TOTAL_STEPS })}
          </Label>
          {(currentStep === 1 || currentStep === 2) && (
            <Text type="small" textType="semiBold" style={styles.skipForNow} onPress={this.onProceedToNextStep}>
              {t('skipForNow')}
            </Text>
          )}
        </View>
        <Text type="regular" textType="semiBold" style={styles.textColor}>
          {this.fetchStepTitle()}
        </Text>
      </>
    );
  };

  private renderContent = (): React.ReactNode => {
    // const { propertyId } = this.props;
    const { currentStep, isPaymentSuccess } = this.state;
    const { propertyId, leaseTermId, setCurrentLeaseTermId } = this.props;
    switch (currentStep) {
      case 0:
        return (
          <CheckoutAssetDetails
            propertyId={propertyId}
            leaseTermId={leaseTermId}
            setLeaseTermId={setCurrentLeaseTermId}
            isLeaseFlow
            onStepSuccess={this.onProceedToNextStep}
          />
        );
      case 1:
        // TODO: Remove the hardcode propertyId
        return <PropertyImages propertyId={63} updateStep={this.onProceedToNextStep} />;
      case 2:
        // TODO: Remove the hardcode propertyId
        return <PropertyVerification propertyId={63} navigateToPropertyHelper={this.navigateToPropertyHelper} />;
      default:
        return (
          <PropertyPayment
            onPayNow={this.handlePayNow}
            isSuccess={isPaymentSuccess}
            navigateToPropertyHelper={this.navigateToPropertyHelper}
          />
        );
    }
  };

  private onStepPress = (currentStep: number): void => {
    this.setState({ currentStep });
  };

  private onProceedToNextStep = (): void => {
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

  public navigateToPropertyHelper = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.PropertyVerificationHelper);
  };

  public handleBackPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private handlePayNow = (): void => {
    const { isPaymentSuccess } = this.state;
    this.setState({ isPaymentSuccess: !isPaymentSuccess });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getCurrentPropertyId, getCurrentLeaseTermId } = PropertySelector;
  return {
    propertyId: getCurrentPropertyId(state),
    leaseTermId: getCurrentLeaseTermId(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setCurrentLeaseTermId } = PropertyActions;
  return bindActionCreators({ setCurrentLeaseTermId }, dispatch);
};

const connectedComponent = connect<IStateProps, IDispatchProps, OwnProps, IState>(
  mapStateToProps,
  mapDispatchToProps
)(ServiceCheckoutSteps);
const HOC = withTranslation(LocaleConstants.namespacesKey.property)(connectedComponent);
export { HOC as ServiceCheckoutSteps };

const styles = StyleSheet.create({
  scrollView: {
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
    color: theme.colors.darkTint3,
  },
  shadowView: {
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
});
