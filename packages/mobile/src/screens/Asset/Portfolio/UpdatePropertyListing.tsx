import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { AnimatedProfileHeader } from '@homzhub/mobile/src/components';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import CancelTerminateListing from '@homzhub/mobile/src/components/organisms/CancelTerminateListing';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { NavigationScreenProps, ScreensKeys, UpdatePropertyFormTypes } from '@homzhub/mobile/src/navigation/interfaces';

interface IStateProps {
  assetDetail: Asset | null;
}

interface IDispatchProps {
  getAssetById: () => void;
  resetState: () => void;
}

type libProps = WithTranslation & NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.UpdatePropertyScreen>;
type Props = IStateProps & IDispatchProps & libProps;

class UpdatePropertyListing extends Component<Props> {
  constructor(props: Props) {
    super(props);
    props.getAssetById();
  }

  public render(): React.ReactNode {
    const { t, assetDetail } = this.props;
    if (!assetDetail) return null;
    return (
      <AnimatedProfileHeader
        title={t('assetPortfolio:portfolio')}
        sectionHeader={this.renderSectionHeader()}
        onBackPress={this.onBack}
        sectionTitleType="semiBold"
      >
        <View style={styles.container}>
          <PropertyAddressCountry
            primaryAddress={assetDetail.projectName}
            subAddress={assetDetail.address}
            countryFlag={assetDetail.country.flag}
            containerStyle={styles.address}
          />
          <Divider containerStyles={styles.divider} />
          {this.renderFormOnType()}
        </View>
      </AnimatedProfileHeader>
    );
  }

  private renderSectionHeader = (): string => {
    const {
      route: { params },
      t,
    } = this.props;

    switch (params.formType) {
      case UpdatePropertyFormTypes.CancelListing:
        return t('property:cancelListing');
      case UpdatePropertyFormTypes.TerminateListing:
        return t('property:terminateListing');
      case UpdatePropertyFormTypes.RenewListing:
        return t('property:renewListing');
      default:
        return t('property:cancelListing');
    }
  };

  private renderFormOnType = (): React.ReactElement | null => {
    const {
      route: { params },
    } = this.props;
    switch (params.formType) {
      case UpdatePropertyFormTypes.CancelListing:
        return <CancelTerminateListing />;
      case UpdatePropertyFormTypes.TerminateListing:
        return <CancelTerminateListing isTerminate />;
      default:
        return null;
    }
  };

  private onBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getAssetDetails } = RecordAssetSelectors;

  return {
    assetDetail: getAssetDetails(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetById, resetState } = RecordAssetActions;
  return bindActionCreators({ getAssetById, resetState }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(UpdatePropertyListing));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.white,
  },
  address: {
    marginTop: 24,
  },
  divider: {
    marginTop: 10,
    borderColor: theme.colors.background,
  },
});
