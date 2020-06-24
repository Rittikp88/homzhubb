import React from 'react';
import { View, StyleSheet, PickerItemProps } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { PropertyRepository } from '@homzhub/common/src/domain/repositories/PropertyRepository';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Dropdown, Text } from '@homzhub/common/src/components';
import { LeaseDetailsForm } from '@homzhub/mobile/src/components/molecules/LeaseDetailsForm';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { ICurrency } from '@homzhub/common/src/domain/models/Currency';
import {
  ICreateLeaseTermDetails,
  ILeaseTermDetails,
  IUpdateLeaseTermDetails,
} from '@homzhub/common/src/domain/models/LeaseTerms';

interface IState {
  currency: string;
  currencyData: PickerItemProps[];
  initialLeaseTerms: ILeaseTermDetails | null;
}

interface IOwnProps extends WithTranslation {
  propertyId: number;
  leaseTermId: number;
  isLeaseFlow: boolean;
  setLeaseTermId: (leaseTermId: number) => void;
  onStepSuccess: () => void;
}
class CheckoutAssetDetails extends React.PureComponent<IOwnProps, IState> {
  public state = {
    currencyData: [],
    currency: 'INR',
    initialLeaseTerms: null,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getLeaseDetails();
    await this.getCurrencyCodes();
  };

  public render = (): React.ReactNode => {
    const { t, isLeaseFlow } = this.props;
    const { currency, currencyData, initialLeaseTerms } = this.state;
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
        <LeaseDetailsForm initialValues={initialLeaseTerms} currency={currency} onSubmit={this.onLeaseFormSubmit} />
      </>
    );
  };

  private onCurrencyChange = (value: string | number): void => {
    this.setState({ currency: value as string });
  };

  private onLeaseFormSubmit = async (data: ICreateLeaseTermDetails | IUpdateLeaseTermDetails): Promise<void> => {
    const { propertyId, leaseTermId, setLeaseTermId, onStepSuccess } = this.props;

    if (leaseTermId) {
      await this.updateLeaseTerms(data as IUpdateLeaseTermDetails);
      return;
    }

    try {
      const response = await PropertyRepository.createLeaseTerms(propertyId, data as ICreateLeaseTermDetails);
      setLeaseTermId(response.id);
      onStepSuccess();
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  private getLeaseDetails = async (): Promise<void> => {
    const { propertyId } = this.props;
    try {
      const response = await PropertyRepository.getLeaseTerms(propertyId);
      this.setState({ initialLeaseTerms: response[0] });
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  private updateLeaseTerms = async (data: IUpdateLeaseTermDetails): Promise<void> => {
    const { propertyId, leaseTermId, onStepSuccess } = this.props;
    try {
      await PropertyRepository.updateLeaseTerms(propertyId, leaseTermId, data);
      onStepSuccess();
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  private getCurrencyCodes = async (): Promise<void> => {
    try {
      const response = await CommonRepository.getCurrencyCodes();
      this.setState({
        currencyData: response.map(
          (currency: ICurrency): PickerItemProps => ({
            label: currency.currency_code,
            value: currency.currency_code,
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
