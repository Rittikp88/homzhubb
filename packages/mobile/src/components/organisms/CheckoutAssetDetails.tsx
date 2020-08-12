import React from 'react';
import { View, StyleSheet, PickerItemProps } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Dropdown, Text } from '@homzhub/common/src/components';
import { LeaseDetailsForm } from '@homzhub/mobile/src/components/molecules/LeaseDetailsForm';
import { ResaleDetailsForm } from '@homzhub/mobile/src/components/molecules/ResaleDetailsForm';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import {
  ICreateLeaseTermDetails,
  ILeaseTermDetails,
  IUpdateLeaseTermDetails,
} from '@homzhub/common/src/domain/models/LeaseTerms';
import {
  ICreateSaleTermDetails,
  ISaleDetails,
  IUpdateSaleTermDetails,
} from '@homzhub/common/src/domain/models/SaleTerms';

interface IState {
  currency: string;
  currencyData: PickerItemProps[];
  initialLeaseTerms: ILeaseTermDetails | null;
  initialResaleTerms: ISaleDetails | null;
}

interface IOwnProps extends WithTranslation {
  propertyId: number;
  termId: number;
  isLeaseFlow: boolean;
  setTermId: (leaseTermId: number) => void;
  onStepSuccess: () => void;
  setLoading: (loading: boolean) => void;
}
class CheckoutAssetDetails extends React.PureComponent<IOwnProps, IState> {
  public state = {
    currencyData: [],
    currency: 'INR',
    initialLeaseTerms: null,
    initialResaleTerms: null,
  };

  public componentDidMount = async (): Promise<void> => {
    const { isLeaseFlow } = this.props;
    await this.getCurrencyCodes();
    if (isLeaseFlow) {
      await this.getLeaseDetails();
    } else {
      await this.getResaleDetails();
    }
  };

  public render = (): React.ReactNode => {
    const { t, isLeaseFlow } = this.props;
    const { currency, currencyData, initialLeaseTerms, initialResaleTerms } = this.state;

    const selectedCurrency: PickerItemProps | undefined = currencyData.find(
      (item: PickerItemProps) => item.value === currency
    );

    return (
      <>
        <View style={styles.titleRow}>
          <Text type="small" textType="semiBold" style={styles.title}>
            {isLeaseFlow ? t('rentAndDeposit') : t('resaleDetails')}
          </Text>
          <Dropdown
            data={currencyData}
            icon={icons.downArrow}
            iconColor={theme.colors.darkTint5}
            iconSize={8}
            textStyle={styles.dropdownTextStyle}
            value={currency}
            onDonePress={this.onCurrencyChange}
            containerStyle={styles.dropdownContainer}
          />
        </View>
        {isLeaseFlow ? (
          <LeaseDetailsForm
            initialValues={initialLeaseTerms}
            // @ts-ignore
            currency={selectedCurrency?.label ?? currency}
            onSubmit={this.onLeaseFormSubmit}
          />
        ) : (
          <ResaleDetailsForm
            // @ts-ignore
            currency={selectedCurrency?.label ?? currency}
            onSubmit={this.onResaleSubmit}
            initialValues={initialResaleTerms}
          />
        )}
      </>
    );
  };

  private onCurrencyChange = (value: string | number): void => {
    this.setState({ currency: value as string });
  };

  private onLeaseFormSubmit = async (data: ICreateLeaseTermDetails): Promise<void> => {
    const { propertyId, termId, setTermId, onStepSuccess, setLoading } = this.props;
    const { currency } = this.state;
    data = { ...data, currency_code: currency };
    setLoading(true);

    if (termId) {
      await this.updateLeaseTerms(data);
      return;
    }

    try {
      const response = await AssetRepository.createLeaseTerms(propertyId, data);
      setTermId(response.id);
      setLoading(false);
      onStepSuccess();
    } catch (e) {
      setLoading(false);
      AlertHelper.error({ message: e.message });
    }
  };

  private onResaleSubmit = async (data: ICreateSaleTermDetails): Promise<void> => {
    const { propertyId, termId, setTermId, onStepSuccess, setLoading } = this.props;
    const { currency } = this.state;
    data = { ...data, currency_code: currency };
    setLoading(true);

    if (termId) {
      await this.updateResaleTerms(data);
      return;
    }

    try {
      const response = await AssetRepository.createSaleTerms(propertyId, data);
      setTermId(response.id);
      setLoading(false);
      onStepSuccess();
    } catch (e) {
      setLoading(false);
      AlertHelper.error({ message: e.message });
    }
  };

  // LEASE APIs
  private getLeaseDetails = async (): Promise<void> => {
    const { propertyId, termId } = this.props;
    try {
      const response = await AssetRepository.getLeaseTerms(propertyId);
      if (response.length > 0) {
        const details = response.find((term: ILeaseTermDetails) => term.id === termId) ?? response[0];
        this.setState({
          initialLeaseTerms: termId ? details : response[0],
        });
      }
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  private updateLeaseTerms = async (data: IUpdateLeaseTermDetails): Promise<void> => {
    const { propertyId, termId, onStepSuccess, setLoading } = this.props;
    setLoading(true);
    try {
      await AssetRepository.updateLeaseTerms(propertyId, termId, data);
      setLoading(false);
      onStepSuccess();
    } catch (e) {
      setLoading(false);
      AlertHelper.error({ message: e.message });
    }
  };

  // RESALE APIs

  private getResaleDetails = async (): Promise<void> => {
    const { propertyId, termId, setLoading } = this.props;
    setLoading(true);
    try {
      const response = await AssetRepository.getSaleTerms(propertyId);
      if (response.length > 0) {
        const details = response.find((term: ISaleDetails) => term.id === termId) ?? response[0];
        this.setState({
          initialResaleTerms: termId ? details : response[0],
        });
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      AlertHelper.error({ message: e.message });
    }
  };

  private updateResaleTerms = async (data: IUpdateSaleTermDetails): Promise<void> => {
    const { propertyId, termId, onStepSuccess, setLoading } = this.props;
    setLoading(true);
    try {
      await AssetRepository.updateSaleTerms(propertyId, termId, data);
      setLoading(false);
      onStepSuccess();
    } catch (e) {
      setLoading(false);
      AlertHelper.error({ message: e.message });
    }
  };

  private getCurrencyCodes = async (): Promise<void> => {
    try {
      const response = await CommonRepository.getCurrencyCodes();
      this.setState({
        currencyData: response.map(
          (currency: Currency): PickerItemProps => ({
            label: `${currency.currencyCode} ${currency.currencySymbol}`,
            value: currency.currencyCode,
          })
        ),
      });
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };
}

const HOC = withTranslation(LocaleConstants.namespacesKey.property)(CheckoutAssetDetails);
export { HOC as CheckoutAssetDetails };

const styles = StyleSheet.create({
  titleRow: {
    flex: 1,
    marginTop: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    borderWidth: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  title: {
    color: theme.colors.darkTint3,
  },
  dropdownTextStyle: {
    color: theme.colors.darkTint5,
    marginEnd: 6,
  },
});
