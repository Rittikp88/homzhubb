import React, { ReactElement } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { AssetService } from '@homzhub/common/src/services/Property/AssetService';
import { LedgerService } from '@homzhub/common/src/services/LedgerService';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { FinancialsNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { AnimatedProfileHeader, HeaderCard, AddRecordForm, StateAwareComponent } from '@homzhub/mobile/src/components';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { LedgerCategory } from '@homzhub/common/src/domain/models/LedgerCategory';

interface IState {
  ledgerCategories: LedgerCategory[];
  properties: Asset[];
  clearForm: boolean;
  isLoading: boolean;
}

type libraryProps = WithTranslation & NavigationScreenProps<FinancialsNavigatorParamList, ScreensKeys.AddRecordScreen>;
type IProps = libraryProps;

class AddRecordScreen extends React.PureComponent<IProps, IState> {
  public state = {
    ledgerCategories: [],
    properties: [],
    isLoading: false,
    clearForm: false,
  };

  public async componentDidMount(): Promise<void> {
    this.setState({ isLoading: true });

    const categories = await LedgerService.getAllLedgerCategories();
    const properties = await AssetService.getPropertiesByStatus();

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

    return (
      <AddRecordForm
        properties={properties}
        ledgerCategories={ledgerCategories}
        clear={clearForm}
        onFormClear={this.onClearPress}
        containerStyles={styles.addFormContainer}
      />
    );
  };

  private onClearPress = (): void => {
    const { clearForm } = this.state;
    this.setState({ clearForm: !clearForm });
  };

  private goBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetFinancial)(AddRecordScreen);

const styles = StyleSheet.create({
  addFormContainer: {
    marginTop: 24,
  },
});
