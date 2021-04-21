import React from 'react';
import { StyleSheet, View } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Slider } from '@homzhub/common/src/components/atoms/Slider';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { CheckboxGroup, ICheckboxGroupData } from '@homzhub/common/src/components/molecules/CheckboxGroup';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import OfferDetailsCard from '@homzhub/common/src/components/molecules/OfferDetailsCard';
import { WithFieldError } from '@homzhub/common/src/components/molecules/WithFieldError';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Offer } from '@homzhub/common/src/domain/models/Offer';
import { initialRentFormValues, initialSaleFormValues, OfferFormKeys } from '@homzhub/common/src/mocks/Offers';
import { IState } from '@homzhub/common/src/modules/interfaces';
import {
  ICounterOffer,
  ISubmitOffer,
  ISubmitOfferLease,
  ISubmitOfferSell,
  ListingType,
  NegotiationType,
} from '@homzhub/common/src/domain/repositories/interfaces';
import {
  IExistingProposalsLease,
  IExistingProposalsSale,
  IOfferFormValues,
} from '@homzhub/common/src/modules/offers/interfaces';

// ToDo (Praharsh) : Resolve ts-ignores and see if we could optimise and shorten the code.
interface IProps {
  onPressTerms: () => void;
  onSuccess: () => void;
  offersLeft: number;
}

interface IReduxProps {
  isRentFlow: boolean;
  asset: Asset | null;
  existingLeaseTerms: IExistingProposalsLease | null;
  existingSaleTerms: IExistingProposalsSale | null;
  tenantPreferences: ICheckboxGroupData[];
  currentOffer: Offer | null;
  offerFormValues: IOfferFormValues;
}

interface IDispatchProps {
  setOfferFormValues: (payload: IOfferFormValues) => void;
}

type Props = WithTranslation & IProps & IReduxProps & IDispatchProps;

interface IScreenState {
  preferenceData: [];
  checkBox: boolean;
  formData: FormikValues;
  message: string;
  showLeaseDurationError: boolean;
  loading: boolean;
}

interface IInfoBox {
  icon: string;
  text: string;
  color: string;
}

class OfferForm extends React.Component<Props, IScreenState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      checkBox: false,
      // Todo : Try including message in selector.
      message: this.getInitialMessage(),
      showLeaseDurationError: false,
      // @ts-ignore
      formData: this.initialValues(),
      loading: false,
    };
  }

  public render = (): React.ReactElement => {
    const { renderForm } = this;
    const { loading } = this.state;
    return (
      <>
        <Loader visible={loading} />
        {renderForm()}
      </>
    );
  };

  private renderBottomFields = (formProps: FormikProps<FormikValues>): React.ReactElement => {
    const { state, props, renderInfoBox, onMessageChange } = this;
    const { setFieldValue, values } = formProps;
    const { message } = state;
    const { t, onPressTerms, isRentFlow, asset, offersLeft, setOfferFormValues } = props;

    const onPressPrivacy = (): void => {
      setOfferFormValues({ ...values, message } as IOfferFormValues);
      onPressTerms();
    };

    const Preferences = (): React.ReactElement | null => {
      if (isRentFlow && asset?.leaseTerm?.tenantPreferences.length && !asset?.isAssetOwner) {
        const onToggleCheckBox = (id: number, isSelected: boolean): void => {
          const prefs: ICheckboxGroupData[] = values[OfferFormKeys.tenantPreferences];
          const updatedPrefs = prefs.map((item) => (item.id === id ? { ...item, isSelected } : item));
          setFieldValue(OfferFormKeys.tenantPreferences, updatedPrefs);
        };
        return (
          <>
            <Label type="large" textType="semiBold">
              {t('offers:preference')}
            </Label>
            <CheckboxGroup data={values.tenantPreferences} onToggle={onToggleCheckBox} />
          </>
        );
      }
      return null;
    };

    return (
      <>
        <Preferences />

        <TextArea
          label={t('offers:sendAMessage')}
          placeholder={t('offers:enterYourMessage')}
          isCountRequired={false}
          onMessageChange={onMessageChange}
          value={message}
        />

        <View style={styles.termsAndConditionsContainer}>
          <Label textType="light" type="regular" style={styles.textBeforeTerms}>
            {t('offers:termsFirstPart')}
            <Label textType="light" type="regular" style={styles.privacyText} onPress={onPressPrivacy}>
              {t('offers:termsLink')}
            </Label>
            <Label textType="light" type="regular" style={styles.textBeforeTerms}>
              {t('offers:termsRestPart')}
            </Label>
          </Label>
        </View>

        {renderInfoBox(offersLeft)}
      </>
    );
  };

  private renderFormHeader = (): React.ReactElement => {
    const { t, offersLeft, asset } = this.props;
    const offersText =
      offersLeft === 1 ? `${t('offers:oneOfferLeft')}` : `${t('offers:offersCount', { count: offersLeft })}`;
    return (
      <View style={styles.formHeader}>
        <Text textType="semiBold" type="small">
          {t('offers:enterFormDetails')}
        </Text>
        {!asset?.isAssetOwner && (
          <Badge
            title={offersText}
            badgeColor={theme.colors.gray11}
            titleStyle={styles.badgeText}
            badgeStyle={styles.badge}
            textType="semiBold"
          />
        )}
      </View>
    );
  };

  private renderForm = (): React.ReactElement => {
    const { t, isRentFlow, offersLeft, currentOffer, asset } = this.props;
    const { formData, loading } = this.state;
    const { renderFormHeader, renderBottomFields } = this;
    return (
      <>
        <Formik
          onSubmit={this.onSubmitForm}
          initialValues={formData}
          validate={FormUtils.validate(this.formSchema)}
          enableReinitialize
          validateOnMount
        >
          {(formProps: FormikProps<FormikValues>): React.ReactElement => {
            const { setFieldValue, values, errors, dirty, handleSubmit } = formProps;
            const { checkBox, showLeaseDurationError } = this.state;
            const onMinDurationChange = (value: number): void => setFieldValue(OfferFormKeys.minimumLeasePeriod, value);
            const onMaxDurationChange = (value: number): void => setFieldValue(OfferFormKeys.maximumLeasePeriod, value);
            const handleCheckBox = (): void => {
              const value = values === this.checkedFormValues() ? this.initialValues() : this.checkedFormValues();
              // @ts-ignore
              this.setState((prevState) => ({
                checkBox: dirty ? false : !prevState.checkBox,
                formData: dirty ? values : value,
              }));
            };
            const maxLength = (field: string): number => (field?.includes('.') ? 13 : 12);
            const rentDisabled = !values?.expectedPrice?.length || !values?.securityDeposit?.length;
            const saleDisabled = !values?.expectedPrice?.length || !values?.expectedBookingAmount?.length;
            const disabled = isRentFlow ? rentDisabled : saleDisabled;
            return (
              <>
                {dirty &&
                  this.setState({
                    checkBox: false,
                    formData: values,
                    showLeaseDurationError: values.minimumLeasePeriod > values.maximumLeasePeriod,
                  })}
                <View style={styles.scrollContainer}>
                  <KeyboardAwareScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <OfferDetailsCard checkBox={checkBox && !dirty} onClickCheckBox={handleCheckBox} />
                    {renderFormHeader()}
                    <View style={styles.formContainer}>
                      {isRentFlow && (
                        <>
                          <FormTextInput
                            name={OfferFormKeys.expectedRent}
                            formProps={formProps}
                            isMandatory
                            inputType="number"
                            label={t('offers:proposedRentalPrice')}
                            placeholder={t('offers:enterPrice')}
                            maxLength={maxLength(formProps.values.expectedPrice)}
                            inputPrefixText={asset?.currencySymbol}
                          />
                          <FormTextInput
                            name={OfferFormKeys.securityDeposit}
                            formProps={formProps}
                            isMandatory
                            inputType="number"
                            label={t('offers:proposedSecurityDeposit')}
                            placeholder={t('offers:enterPrice')}
                            maxLength={maxLength(formProps.values.securityDeposit)}
                            inputPrefixText={asset?.currencySymbol}
                          />
                          <FormTextInput
                            name={OfferFormKeys.annualRentIncrementPercentage}
                            formProps={formProps}
                            inputType="decimal"
                            label={t('offers:proposedAnnualIncrement')}
                            placeholder={t('offers:enterPercentage')}
                            inputGroupSuffixText="%"
                          />
                          <FormCalendar
                            name={OfferFormKeys.availableFromDate}
                            formProps={formProps}
                            label={t('offers:proposedMoveInDate')}
                            textType="label"
                            textSize="regular"
                            placeHolder={t('common:selectDate')}
                            placeHolderStyle={styles.calendarText}
                            minDate={asset?.leaseTerm?.availableFromDate}
                            isMandatory
                            allowPastDates
                          />

                          <View key="min" style={styles.formSliderContainer}>
                            <Label textType="semiBold" type="large" style={styles.sliderLabel}>
                              {t('offers:proposedMinPeriod')}
                            </Label>
                            <WithFieldError error={errors[OfferFormKeys.minimumLeasePeriod]}>
                              <Slider
                                isLabelRequired
                                labelText={t('common:months')}
                                minSliderRange={0}
                                maxSliderRange={12}
                                isDoubleDigited
                                minSliderValue={values[OfferFormKeys.minimumLeasePeriod]}
                                onSliderChange={onMinDurationChange}
                                sliderLength={theme.viewport.width - 32}
                                key="minSlider"
                              />
                            </WithFieldError>
                          </View>

                          <View key="max" style={styles.formSliderContainer}>
                            <Label textType="semiBold" type="large" style={styles.sliderLabel}>
                              {t('offers:proposedTotalPeriod')}
                            </Label>
                            <WithFieldError
                              error={showLeaseDurationError ? t('property:maximumLeaseError') : undefined}
                            >
                              <Slider
                                isLabelRequired
                                labelText={t('common:months')}
                                minSliderRange={0}
                                maxSliderRange={60}
                                isDoubleDigited
                                minSliderValue={values[OfferFormKeys.maximumLeasePeriod]}
                                onSliderChange={onMaxDurationChange}
                                sliderLength={theme.viewport.width - 32}
                                key="maxSlider"
                              />
                            </WithFieldError>
                          </View>
                        </>
                      )}

                      {!isRentFlow && (
                        <>
                          <FormTextInput
                            name={OfferFormKeys.expectedSellPrice}
                            formProps={formProps}
                            isMandatory
                            inputType="number"
                            label={t('offers:proposedSellPrice')}
                            placeholder={t('offers:enterPrice')}
                            maxLength={maxLength(formProps.values.expectedPrice)}
                          />
                          <FormTextInput
                            name={OfferFormKeys.expectedBookingAmount}
                            formProps={formProps}
                            isMandatory
                            inputType="number"
                            label={t('offers:proposedBookingAmount')}
                            placeholder={t('offers:enterPrice')}
                            maxLength={maxLength(formProps.values.expectedPrice)}
                          />
                        </>
                      )}
                      {renderBottomFields(formProps)}
                    </View>
                  </KeyboardAwareScrollView>
                  <View style={styles.formButtonContainer}>
                    <FormButton
                      type="primary"
                      formProps={formProps}
                      disabled={(!currentOffer && offersLeft === 0) || disabled || showLeaseDurationError || loading}
                      // @ts-ignore
                      onPress={handleSubmit}
                      title={t('common:submit')}
                    />
                  </View>
                </View>
              </>
            );
          }}
        </Formik>
      </>
    );
  };

  private renderInfoBox = (countLeft: number): React.ReactElement => {
    const { t, asset } = this.props;
    const getData = (): IInfoBox => {
      if (asset?.isAssetOwner) {
        return {
          icon: icons.circularFilledInfo,
          text: t('offers:ownerInfoText'),
          color: theme.colors.darkTint4,
        };
      }
      if (countLeft === 2) {
        return {
          icon: icons.circularFilledInfo,
          text: t('offers:textWithTwoOffersLeft'),
          color: theme.colors.darkTint4,
        };
      }
      if (countLeft === 1) {
        return {
          icon: icons.filledWarning,
          text: t('offers:textWithOneOfferLeft'),
          color: theme.colors.mediumPriority,
        };
      }
      return {
        icon: icons.filledWarning,
        text: t('offers:textWithZeroOffersLeft'),
        color: theme.colors.error,
      };
    };

    const { icon, text, color } = getData();

    return (
      <View style={styles.infoBoxContainer}>
        <Icon name={icon} style={styles.infoBoxIcon} color={color} size={18} />
        <Label textType="regular" type="regular">
          {text}
        </Label>
      </View>
    );
  };

  // HANDLERS START
  private onSubmitForm = async (values: FormikValues): Promise<void> => {
    try {
      const { onSuccess, currentOffer } = this.props;
      this.setState({ loading: true });

      // Counter Offer
      if (currentOffer) {
        const counterOfferPayload = this.counterOfferHandler(values);
        await OffersRepository.counterOffer(counterOfferPayload);
      }

      // Create Offer
      if (!currentOffer) {
        const createOfferPayload = this.createOfferHandler(values);
        await OffersRepository.postOffer(createOfferPayload);
      }

      this.setState({ loading: false });
      onSuccess();
    } catch (e) {
      this.setState({ loading: false });
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private onMessageChange = (text: string): void => {
    this.setState({
      message: text,
    });
  };

  private getData = (values: FormikValues): ISubmitOfferLease | ISubmitOfferSell | null => {
    const { isRentFlow } = this.props;
    const { message } = this.state;

    if (!isRentFlow) {
      const { expectedPrice, expectedBookingAmount } = values;
      const saleData = {
        proposed_price: parseFloat(expectedPrice),
        proposed_booking_amount: parseFloat(expectedBookingAmount),
        ...(message.length && { comment: message }),
      };
      return saleData;
    }

    if (isRentFlow) {
      const {
        expectedPrice,
        securityDeposit,
        minimumLeasePeriod,
        maximumLeasePeriod,
        annualRentIncrementPercentage,
        availableFromDate,
        tenantPreferences,
      } = values;
      const leaseData = {
        proposed_rent: parseFloat(expectedPrice),
        proposed_security_deposit: parseFloat(securityDeposit),
        proposed_rent_increment_percentage: annualRentIncrementPercentage.length
          ? parseFloat(annualRentIncrementPercentage)
          : null,
        proposed_move_in_date: availableFromDate,
        proposed_lease_period: maximumLeasePeriod,
        proposed_min_lock_in_period: minimumLeasePeriod,
        tenant_preferences: tenantPreferences
          .filter((item: ICheckboxGroupData) => item.isSelected)
          .map((item: ICheckboxGroupData) => item.id),
        ...(message.length && { comment: message }),
      };
      return leaseData;
    }
    return null;
  };

  private checkedFormValues = (): IExistingProposalsSale | IExistingProposalsLease | null => {
    const { isRentFlow, existingLeaseTerms, existingSaleTerms } = this.props;
    return isRentFlow ? existingLeaseTerms : existingSaleTerms;
  };

  private counterOfferHandler = (values: FormikValues): ICounterOffer => {
    const { isRentFlow, currentOffer } = this.props;
    let payload;
    if (!isRentFlow && currentOffer?.id) {
      payload = {
        param: {
          negotiationId: currentOffer.id,
          negotiationType: NegotiationType.SALE_NEGOTIATIONS,
        },
        data: this.getData(values) as ISubmitOfferSell,
      };
    }

    if (isRentFlow && currentOffer?.id) {
      payload = {
        param: {
          negotiationId: currentOffer.id,
          negotiationType: NegotiationType.LEASE_NEGOTIATIONS,
        },
        data: this.getData(values) as ISubmitOfferLease,
      };
    }
    return payload as ICounterOffer;
  };

  private createOfferHandler = (values: FormikValues): ISubmitOffer => {
    const { isRentFlow, asset } = this.props;
    let payload;
    if (!isRentFlow && asset?.saleTerm?.id) {
      payload = {
        param: {
          listingType: ListingType.SALE_LISTING,
          listingId: asset?.saleTerm?.id,
          negotiationType: NegotiationType.SALE_NEGOTIATIONS,
        },
        data: this.getData(values) as ISubmitOfferSell,
      };
    }

    if (isRentFlow && asset?.leaseTerm?.id) {
      payload = {
        param: {
          listingType: ListingType.LEASE_LISTING,
          listingId: asset?.leaseTerm?.id,
          negotiationType: NegotiationType.LEASE_NEGOTIATIONS,
        },
        data: this.getData(values) as ISubmitOfferLease,
      };
    }
    return payload as ISubmitOffer;
  };

  private initialValues = (): IExistingProposalsLease | IExistingProposalsSale | null => {
    const { isRentFlow, tenantPreferences, offerFormValues } = this.props;
    const updatedInitialLease: IExistingProposalsLease = { ...initialRentFormValues, tenantPreferences };
    if (offerFormValues) return offerFormValues;
    return isRentFlow ? updatedInitialLease : initialSaleFormValues;
  };

  private getInitialMessage = (): string => {
    const { offerFormValues } = this.props;
    return offerFormValues?.message ?? '';
  };
  //  HANDLERS END

  // FORM VALIDATIONS START
  private formSchema = (): yup.ObjectSchema => {
    const { t, isRentFlow } = this.props;
    const rentSchema = yup.object().shape({
      [OfferFormKeys.expectedRent]: yup
        .string()
        .matches(FormUtils.decimalRegex, t('common:onlyNumeric'))
        .test({
          name: 'nonZeroTest',
          message: t('common:onlyNonZero'),
          test: FormUtils.validateNonZeroCase,
        })
        .required(t('property:monthlyRentRequired')),
      [OfferFormKeys.securityDeposit]: yup
        .string()
        .matches(FormUtils.decimalRegex, t('common:onlyNumeric'))
        .test({
          name: 'nonZeroTest',
          message: t('common:onlyNonZero'),
          test: FormUtils.validateNonZeroCase,
        })
        .required(t('property:securityDepositRequired')),
      [OfferFormKeys.annualRentIncrementPercentage]: yup.string().test({
        name: 'onlyNonNegativeNumericTest',
        message: t('common:onlyNonNegativeNumeric'),
        test: (value: string) => (value.length ? Boolean(FormUtils.percentageRegex.exec(value)?.length) : true),
      }),
      [OfferFormKeys.availableFromDate]: yup.string(),
      [OfferFormKeys.minimumLeasePeriod]: yup.number(),
      [OfferFormKeys.maximumLeasePeriod]: yup.number(),
    });

    const saleSchema = yup.object().shape({
      [OfferFormKeys.expectedSellPrice]: yup
        .string()
        .matches(FormUtils.decimalRegex, t('common:onlyNumeric'))
        .required(t('offers:sellPriceRequired')),
      [OfferFormKeys.expectedBookingAmount]: yup
        .string()
        .test({
          name: 'bookingAmountLesserThanPriceTest',
          exclusive: true,
          message: t('property:bookingAmountExceeded'),
          test(expectedBookingAmount: string) {
            const { expectedPrice } = this.parent;
            return parseInt(expectedBookingAmount, 10) <= parseInt(expectedPrice, 10);
          },
        })
        .matches(FormUtils.decimalRegex, t('common:onlyNumeric'))
        .required(t('property:bookingAmountRequired')),
    });

    return isRentFlow ? rentSchema : saleSchema;
  };
  // FORM VALIDATIONS END
}

const mapStateToProps = (state: IState): IReduxProps => ({
  isRentFlow: Boolean(OfferSelectors.getListingDetail(state)?.isLeaseListing),
  asset: OfferSelectors.getListingDetail(state),
  existingLeaseTerms: OfferSelectors.getPastProposalsRent(state),
  existingSaleTerms: OfferSelectors.getPastProposalsSale(state),
  tenantPreferences: OfferSelectors.getFormattedTenantPreferences(state, false),
  currentOffer: OfferSelectors.getCurrentOffer(state),
  offerFormValues: OfferSelectors.getOfferFormValues(state),
});

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setOfferFormValues } = OfferActions;
  return bindActionCreators(
    {
      setOfferFormValues,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OfferForm));

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  formHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  badgeText: {
    color: theme.colors.darkTint4,
  },
  badge: {
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  calendarText: {
    fontSize: 14,
  },
  infoBoxContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.background,
    borderRadius: 4,
    justifyContent: 'center',
  },
  infoBoxIcon: {
    marginEnd: 10,
    marginTop: 2,
  },
  formSliderContainer: {
    marginTop: 16,
  },
  formSlider: {
    marginTop: 10,
  },
  termsAndConditionsContainer: {
    marginVertical: 16,
  },
  textBeforeTerms: {
    marginEnd: 5,
  },
  privacyText: {
    color: theme.colors.primaryColor,
  },
  sliderLabel: {
    marginBottom: 5,
  },
  formButtonContainer: {
    flex: 0.1,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: theme.colors.boxShadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    elevation: 7,
  },
  scrollContainer: {
    flex: 3,
  },
  scrollView: {
    flex: 2.9,
  },
});
