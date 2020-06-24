import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
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
import { ServiceStepTypes } from '@homzhub/common/src/domain/models/Service';
import { MarkdownType, NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IStringForStep {
  title: string;
  screenTitle: string;
  stepLabel: string;
}

interface IScreenState {
  currentStep: number;
  isPaymentSuccess: boolean;
}

interface IStateProps {
  steps: ServiceStepTypes[];
  propertyId: number;
  leaseTermId: number;
  serviceCategoryId: number;
}

interface IDispatchProps {
  setCurrentLeaseTermId: (leaseTermId: number) => void;
}

type OwnProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.ServiceCheckoutSteps>;
type Props = OwnProps & IStateProps & IDispatchProps;

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
    const { steps } = this.props;

    return (
      <>
        <Header
          icon={icons.leftArrow}
          iconColor={theme.colors.white}
          onIconPress={this.handleBackPress}
          isHeadingVisible
          title={this.getTitleStringsForStep(steps[currentStep]).screenTitle}
          titleType="small"
          titleFontType="semiBold"
          backgroundColor={theme.colors.primaryColor}
        />
        <StepIndicatorComponent
          stepCount={steps.length}
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
    const { t, steps } = this.props;

    return (
      <>
        <View style={styles.headingRow}>
          <Label type="large" textType="semiBold" style={styles.textColor}>
            {t('step', { stepNumber: currentStep + 1, totalSteps: steps.length })}
          </Label>
          {(currentStep === 1 || currentStep === 2) && (
            <Text type="small" textType="semiBold" style={styles.skipForNow} onPress={this.onProceedToNextStep}>
              {t('skipForNow')}
            </Text>
          )}
        </View>
        <Text type="regular" textType="semiBold" style={styles.textColor}>
          {this.getTitleStringsForStep(steps[currentStep]).title}
        </Text>
      </>
    );
  };

  private renderContent = (): React.ReactNode => {
    const { currentStep, isPaymentSuccess } = this.state;
    const { propertyId, leaseTermId, setCurrentLeaseTermId, serviceCategoryId, steps } = this.props;

    const currentStepId = steps[currentStep];
    switch (currentStepId) {
      case ServiceStepTypes.LEASE_DETAILS:
        return (
          <CheckoutAssetDetails
            propertyId={propertyId}
            leaseTermId={leaseTermId}
            setLeaseTermId={setCurrentLeaseTermId}
            isLeaseFlow
            onStepSuccess={this.onProceedToNextStep}
          />
        );
      case ServiceStepTypes.PROPERTY_IMAGES:
        return <PropertyImages propertyId={propertyId} updateStep={this.onProceedToNextStep} />;
      case ServiceStepTypes.PROPERTY_VERIFICATIONS:
        return (
          <PropertyVerification
            propertyId={propertyId}
            serviceCategoryId={serviceCategoryId}
            navigateToPropertyHelper={this.navigateToPropertyHelper}
            updateStep={this.onProceedToNextStep}
          />
        );
      case ServiceStepTypes.PAYMENT_TOKEN_AMOUNT:
        return (
          <PropertyPayment
            onPayNow={this.handlePayNow}
            isSuccess={isPaymentSuccess}
            navigateToPropertyHelper={this.navigateToPropertyHelper}
          />
        );
      default:
        return null;
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
    const { steps } = this.props;
    return steps.map((serviceStep) => this.getTitleStringsForStep(serviceStep).stepLabel);
  };

  private getTitleStringsForStep = (serviceStep: ServiceStepTypes): IStringForStep => {
    const { t } = this.props;
    switch (serviceStep) {
      case ServiceStepTypes.LEASE_DETAILS:
        return {
          stepLabel: t('common:details'),
          title: t('enterLeaseDetails'),
          screenTitle: t('leaseDetails'),
        };
      case ServiceStepTypes.PROPERTY_IMAGES:
        return {
          stepLabel: t('common:images'),
          title: t('addPropertyImages'),
          screenTitle: t('propertyImages'),
        };
      case ServiceStepTypes.PROPERTY_VERIFICATIONS:
        return {
          stepLabel: t('common:verification'),
          title: t('completePropertyVerification'),
          screenTitle: t('verification'),
        };
      case ServiceStepTypes.PAYMENT_TOKEN_AMOUNT:
        return {
          stepLabel: t('common:payment'),
          title: t('payTokenAmount'),
          screenTitle: t('tokenPayment'),
        };
      default:
        return {
          stepLabel: '',
          title: '',
          screenTitle: '',
        };
    }
  };

  public navigateToPropertyHelper = (markdownKey: MarkdownType): void => {
    const { navigation } = this.props;
    const title = markdownKey === 'verification' ? 'Property Verification' : '';
    navigation.navigate(ScreensKeys.MarkdownScreen, { title, isFrom: markdownKey });
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
  const {
    getCurrentPropertyId,
    getCurrentLeaseTermId,
    getCurrentServiceCategoryId,
    getServiceStepsDetails,
  } = PropertySelector;
  return {
    propertyId: getCurrentPropertyId(state),
    leaseTermId: getCurrentLeaseTermId(state),
    serviceCategoryId: getCurrentServiceCategoryId(state),
    steps: getServiceStepsDetails(state),
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
