import React, { ReactElement } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { LedgerService } from '@homzhub/common/src/services/LedgerService';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { FinancialsNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { AnimatedProfileHeader, HeaderCard, StateAwareComponent } from '@homzhub/mobile/src/components';
import AddRecordForm from '@homzhub/mobile/src/components/organisms/AddRecordForm';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { LedgerCategory } from '@homzhub/common/src/domain/models/LedgerCategory';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IScreenState {
  ledgerCategories: LedgerCategory[];
  properties: Asset[];
  clearForm: boolean;
  isLoading: boolean;
}

interface IStateToProps {
  currency: Currency;
}

type libraryProps = WithTranslation & NavigationScreenProps<FinancialsNavigatorParamList, ScreensKeys.AddRecordScreen>;
type IProps = libraryProps & IStateToProps;

export class AddRecordScreen extends React.PureComponent<IProps, IScreenState> {
  public state = {
    ledgerCategories: [],
    properties: [],
    isLoading: false,
    clearForm: false,
  };

  public async componentDidMount(): Promise<void> {
    this.setState({ isLoading: true });

    const categories = await LedgerService.getAllLedgerCategories();
    const properties = await AssetRepository.getPropertiesByStatus();

    this.setState({ ledgerCategories: categories, properties, isLoading: false });
  }

  public render(): ReactElement {
    const { isLoading } = this.state;

    return <StateAwareComponent loading={isLoading} renderComponent={this.renderComponent()} />;
  }

  private renderComponent = (): ReactElement => {
    const { t } = this.props;
    const { clearForm } = this.state;
    return (
      <AnimatedProfileHeader title={t('financial')}>
        <>
          <HeaderCard
            title={t('addRecords')}
            clear={clearForm}
            subTitle={t('common:clear')}
            renderItem={this.renderAddRecordForm}
            onIconPress={this.goBack}
            onClearPress={this.onClearPress}
          />
        </>
      </AnimatedProfileHeader>
    );
  };

  private renderAddRecordForm = (): ReactElement => {
    const { clearForm, ledgerCategories, properties } = this.state;
    const { currency } = this.props;

    return (
      <AddRecordForm
        properties={properties}
        ledgerCategories={ledgerCategories}
        clear={clearForm}
        defaultCurrency={currency}
        onFormClear={this.onClearPress}
        containerStyles={styles.addFormContainer}
        onSubmitFormSuccess={this.onSubmitFormSuccess}
        shouldLoad={this.toggleLoading}
      />
    );
  };

  private onClearPress = (): void => {
    const { clearForm } = this.state;
    this.setState({ clearForm: !clearForm });
  };

  private onSubmitFormSuccess = (): void => {
    const { t } = this.props;
    AlertHelper.success({ message: t('addedSuccessfullyMessage') });
    this.goBack();
  };

  private toggleLoading = (isLoading: boolean): void => {
    this.setState({ isLoading });
  };

  private goBack = (): void => {
    const { navigation } = this.props;

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };
}

const mapStateToProps = (state: IState): IStateToProps => {
  return {
    currency: CommonSelectors.getDefaultCurrency(state),
  };
};

export default connect(
  mapStateToProps,
  null
)(withTranslation(LocaleConstants.namespacesKey.assetFinancial)(AddRecordScreen));

const styles = StyleSheet.create({
  addFormContainer: {
    marginTop: 24,
  },
});
