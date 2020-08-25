import React, { ReactElement } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { FinancialsNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { AnimatedProfileHeader, HeaderCard, AddRecordForm } from '@homzhub/mobile/src/components';

type libraryProps = WithTranslation & NavigationScreenProps<FinancialsNavigatorParamList, ScreensKeys.AddRecordScreen>;
type Props = libraryProps;

class AddRecordScreen extends React.PureComponent<Props> {
  public render(): ReactElement {
    const { t } = this.props;
    return (
      <AnimatedProfileHeader title={t('financial')}>
        <>
          <HeaderCard
            title={t('addRecords')}
            subTitle={t('common:clear')}
            renderItem={this.renderAddRecordForm}
            onIconPress={this.goBack}
            onClearPress={this.onClearPress}
          />
        </>
      </AnimatedProfileHeader>
    );
  }

  private renderAddRecordForm = (): ReactElement => {
    return <AddRecordForm containerStyles={styles.addFormContainer} />;
  };

  private onClearPress = (): void => {
    /* Handle clearing of form */
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
