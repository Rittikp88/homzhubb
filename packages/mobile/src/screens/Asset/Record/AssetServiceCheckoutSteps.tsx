// import React from 'react';
// import { ScrollView, StyleSheet, View } from 'react-native';
// import { bindActionCreators, Dispatch } from 'redux';
// import { connect } from 'react-redux';
// import { withTranslation, WithTranslation } from 'react-i18next';
// import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
// import { IState } from '@homzhub/common/src/modules/interfaces';
// import { PropertyActions } from '@homzhub/common/src/modules/property/actions';
// import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
// import { theme } from '@homzhub/common/src/styles/theme';
// import { icons } from '@homzhub/common/src/assets/icon';
// import { Label, Text } from '@homzhub/common/src/components';
// import { Header, Loader } from '@homzhub/mobile/src/components';
// import CheckoutAssetDetails from '@homzhub/mobile/src/components/organisms/CheckoutAssetDetails';
// import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
// import { MarkdownType, NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
// import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
// import { User } from '@homzhub/common/src/domain/models/User';
//
// interface IStringForStep {
//   title: string;
//   screenTitle: string;
//   stepLabel: string;
// }
//
// interface IScreenState {
//   currentStep: number;
//   isPaymentSuccess: boolean;
//   isLoading: boolean;
// }
//
// interface IStateProps {
//   propertyId: number;
//   termId: number;
//   userDetails: User | null;
// }
//
// interface IDispatchProps {
//   setTermId: (termId: number) => void;
//   setPropertyInitialState: () => void;
// }
//
// type OwnProps = WithTranslation & NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.ServiceCheckoutSteps>;
// type Props = OwnProps & IStateProps & IDispatchProps;
//
// export class AssetServiceCheckoutSteps extends React.PureComponent<Props, IScreenState> {
//   public state = {
//     currentStep: 0,
//     isPaymentSuccess: false,
//     isLoading: false,
//   };
//
//   public render = (): React.ReactNode => {
//     const { isLoading } = this.state;
//
//     return (
//       <>
//         {this.renderHeader()}
//         <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//           {this.renderTitle()}
//           {this.renderContent()}
//         </ScrollView>
//         <Loader visible={isLoading} />
//       </>
//     );
//   };
//
//   private renderHeader = (): React.ReactNode => {
//     return (
//       <Header
//         type="primary"
//         icon={icons.leftArrow}
//         onIconPress={this.handleBackPress}
//         title="Header"
//         testID="lblNavigate"
//       />
//     );
//   };
//
//   private renderTitle = (): React.ReactNode => {
//     const { currentStep } = this.state;
//     const { t } = this.props;
//
//     return (
//       <>
//         <View style={styles.headingRow}>
//           <Label type="large" textType="semiBold" style={styles.textColor}>
//             {t('step', { stepNumber: currentStep + 1, totalSteps: 1 })}
//           </Label>
//           {(currentStep === 1 || currentStep === 2) && (
//             <Text
//               type="small"
//               textType="semiBold"
//               style={styles.skipForNow}
//               onPress={this.onProceedToNextStep}
//               testID="skip"
//             >
//               {t('skipForNow')}
//             </Text>
//           )}
//         </View>
//         <Text type="regular" textType="semiBold" style={styles.textColor}>
//           Step
//         </Text>
//       </>
//     );
//   };
//
//   private renderContent = (): React.ReactNode => {
//     const { isPaymentSuccess } = this.state;
//     const { propertyId, termId, setTermId } = this.props;
//
//     const currentStepId = 'LEASE';
//     switch (currentStepId) {
//       case 'LEASE':
//         return (
//           <CheckoutAssetDetails
//             propertyId={propertyId}
//             termId={termId}
//             setTermId={setTermId}
//             isLeaseFlow // TODO: To be checked thoroughly
//             stepsLength={1}
//             onStepSuccess={this.onProceedToNextStep}
//             setLoading={this.setLoadingState}
//             isPaymentSuccess={isPaymentSuccess}
//             onPaymentSuccess={this.onPaymentSuccess}
//             navigateToPropertyHelper={this.navigateToPropertyHelper}
//           />
//         );
//       // case 'VERIFICATION':
//       //   return (
//       //     <PropertyVerification
//       //       propertyId={propertyId}
//       //       typeOfFlow={TypeOfPlan.RENT} // TODO: To be checked thoroughly
//       //       navigateToPropertyHelper={this.navigateToPropertyHelper}
//       //       updateStep={this.onProceedToNextStep}
//       //       setLoading={this.setLoadingState}
//       //       testID="verification"
//       //     />
//       //   );
//       // case 'PAYMENT':
//       //   return isPaymentSuccess ? (
//       //     <PaymentSuccess onPreviewPropertyPress={this.previewProperty} onClickLink={this.navigateToPropertyHelper} />
//       //   ) : (
//       //     // Todo (Sriram 2020.09.04) Pass relevant data
//       //     <PropertyPayment onPaymentSuccess={this.onPaymentSuccess} testID="propertyPayment" />
//       //   );
//       default:
//         return null;
//     }
//   };
//
//   private onStepPress = (currentStep: number): void => {
//     this.setState({ currentStep });
//   };
//
//   private onProceedToNextStep = (): void => {
//     const { currentStep } = this.state;
//     this.setState({ currentStep: currentStep + 1 });
//   };
//
//   private onPaymentSuccess = (): void => {
//     const { isPaymentSuccess } = this.state;
//     this.setState({ isPaymentSuccess: !isPaymentSuccess });
//   };
//
//   public previewProperty = (): void => {
//     const { navigation, setPropertyInitialState } = this.props;
//     setPropertyInitialState();
//     // @ts-ignore
//     navigation.navigate(ScreensKeys.BottomTabs, { screen: ScreensKeys.Portfolio });
//   };
//
//   private setLoadingState = (loading: boolean): void => {
//     this.setState({ isLoading: loading });
//   };
//
//   public navigateToPropertyHelper = (markdownKey: MarkdownType): void => {
//     const { navigation } = this.props;
//     const title = markdownKey === 'verification' ? 'Property Verification' : '';
//     navigation.navigate(ScreensKeys.MarkdownScreen, { title, isFrom: markdownKey });
//   };
//
//   public handleBackPress = (): void => {
//     const { navigation } = this.props;
//     navigation.goBack();
//   };
//
//   private getTitleStringsForStep = (serviceStep: string): IStringForStep => {
//     const { t } = this.props;
//     switch (serviceStep) {
//       case 'LEASE':
//         return {
//           stepLabel: t('common:details'),
//           title: t('enterSaleDetails'),
//           screenTitle: t('resaleDetails'),
//         };
//       case 'VERIFICATIONS':
//         return {
//           stepLabel: t('common:verification'),
//           title: t('completePropertyVerification'),
//           screenTitle: t('verification'),
//         };
//       case 'PAYMENT':
//         return {
//           stepLabel: t('common:payment'),
//           title: t('payTokenAmount'),
//           screenTitle: t('tokenPayment'),
//         };
//       default:
//         return {
//           stepLabel: '',
//           title: '',
//           screenTitle: '',
//         };
//     }
//   };
// }
//
// export const mapStateToProps = (state: IState): IStateProps => {
//   const { getCurrentPropertyId, getTermId } = PropertySelector;
//   const { getUserDetails } = UserSelector;
//
//   return {
//     propertyId: getCurrentPropertyId(state),
//     termId: getTermId(state),
//     userDetails: getUserDetails(state),
//   };
// };
//
// export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
//   const { setTermId, setPropertyInitialState } = PropertyActions;
//   return bindActionCreators({ setTermId, setPropertyInitialState }, dispatch);
// };
//
// const connectedComponent = connect<IStateProps, IDispatchProps, OwnProps, IState>(
//   mapStateToProps,
//   mapDispatchToProps
// )(AssetServiceCheckoutSteps);
// export default withTranslation(LocaleConstants.namespacesKey.property)(connectedComponent);
//
// const styles = StyleSheet.create({
//   scrollView: {
//     flex: 1,
//     backgroundColor: theme.colors.screenBackground,
//     paddingHorizontal: theme.layout.screenPadding,
//   },
//   headingRow: {
//     marginTop: 20,
//     marginBottom: 6,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   skipForNow: {
//     color: theme.colors.active,
//   },
//   textColor: {
//     color: theme.colors.darkTint3,
//   },
// });
