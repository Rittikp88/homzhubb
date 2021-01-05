import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { BottomSheet } from '@homzhub/mobile/src/components';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import CancelTerminateListing, { IFormData } from '@homzhub/mobile/src/components/organisms/CancelTerminateListing';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import {
  ICancelListingPayload,
  ITerminateListingPayload,
  ListingType,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { NavigationScreenProps, ScreensKeys, UpdatePropertyFormTypes } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IStateProps {
  assetDetail: Asset | null;
}

interface IDispatchProps {
  getAssetById: () => void;
  resetState: () => void;
}

interface IScreenState {
  isFormTouched: boolean;
  isSheetVisible: boolean;
  reasons: IDropdownOption[];
}

type libProps = WithTranslation & NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.UpdatePropertyScreen>;
type Props = IStateProps & IDispatchProps & libProps;

class UpdatePropertyListing extends Component<Props, IScreenState> {
  constructor(props: Props) {
    super(props);
    props.getAssetById();
    this.state = {
      isFormTouched: false,
      isSheetVisible: false,
      reasons: [],
    };
  }

  public componentDidMount = (): void => {
    const {
      route: { params },
    } = this.props;
    AssetRepository.getClosureReason(params.payload)
      .then((res) => {
        const formattedData: IDropdownOption[] = [];
        res.forEach((item) => {
          formattedData.push({
            value: item.id,
            label: item.title,
          });
        });
        this.setState({
          reasons: formattedData,
        });
      })
      .catch((err) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.detail) });
      });
  };

  public render(): React.ReactNode {
    const { t, assetDetail } = this.props;
    const { isSheetVisible } = this.state;
    if (!assetDetail) return null;
    return (
      <>
        <UserScreen
          title={t('portfolio')}
          pageTitle={this.renderSectionHeader()}
          onBackPress={(): void => this.onBack(false)}
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
        </UserScreen>
        <BottomSheet visible={isSheetVisible} headerTitle={t('common:backText')} onCloseSheet={this.onCloseSheet}>
          <View style={styles.sheetContainer}>
            <Text type="small" textType="regular">
              {t('common:wantToLeave')}
            </Text>
            <View style={styles.buttonView}>
              <Button
                type="primary"
                title={t('common:yes')}
                containerStyle={styles.leftButton}
                onPress={(): void => this.onBack(true)}
              />
              <Button
                type="secondary"
                title={t('common:no')}
                containerStyle={styles.buttonContainer}
                onPress={this.onCloseSheet}
              />
            </View>
          </View>
        </BottomSheet>
      </>
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
    const { reasons } = this.state;
    if (!params) return null;
    const { formType, param } = params;
    switch (formType) {
      case UpdatePropertyFormTypes.CancelListing:
        return (
          <CancelTerminateListing onFormEdit={this.onFormEdit} reasonData={reasons} onSubmit={this.handleSubmit} />
        );
      case UpdatePropertyFormTypes.TerminateListing:
        return (
          <CancelTerminateListing
            isTerminate
            leaseEndDate={param?.endDate}
            onFormEdit={this.onFormEdit}
            reasonData={reasons}
            onSubmit={this.handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  // HANDLERS START

  private onBack = (leave: boolean): void => {
    const { navigation, resetState } = this.props;
    const { isFormTouched } = this.state;
    if (isFormTouched && !leave) {
      this.setState({
        isSheetVisible: true,
      });
    } else {
      navigation.goBack();
      resetState();
    }
  };

  private onFormEdit = (): void => {
    this.setState({
      isFormTouched: true,
    });
  };

  private onCloseSheet = (): void => {
    this.setState({
      isSheetVisible: false,
    });
  };

  private handleSubmit = (formData: IFormData): void => {
    const {
      t,
      assetDetail,
      navigation,
      route: { params },
    } = this.props;
    if (!assetDetail) return;
    const { id, leaseListingIds, saleListingIds } = assetDetail;
    const { reasonId, isTerminate, description, terminationDate } = formData;
    if (isTerminate && params.param && params.param.id) {
      const payload: ITerminateListingPayload = {
        id: params.param.id,
        data: {
          termination_reason: reasonId,
          termination_date: `${terminationDate}T23:59:00Z`,
          ...(description && { termination_description: description }),
        },
      };
      AssetRepository.terminateLease(payload)
        .then(() => {
          navigation.goBack();
          // TODO: (SHIKHA) - Update message string and move to en.json
          AlertHelper.success({ message: '“The owner/tenant has been notified of the termination request”.' });
        })
        .catch((err) => {
          AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.detail) });
        });
    } else {
      const payload: ICancelListingPayload = {
        param: {
          listingType: leaseListingIds.length > 0 ? ListingType.LEASE_LISTING : ListingType.SALE_LISTING,
          listingId: leaseListingIds.length > 0 ? leaseListingIds[0] : saleListingIds[0],
          assetId: id,
        },
        data: {
          cancel_reason: reasonId,
          cancel_date: DateUtils.getCurrentDateISO(),
          ...(description && { cancel_description: description }),
        },
      };
      AssetRepository.cancelAssetListing(payload)
        .then(() => {
          navigation.goBack();
          AlertHelper.success({ message: t('property:listingCancelled') });
        })
        .catch((err) => {
          AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.detail) });
        });
    }
  };

  // HANDLERS END
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetPortfolio)(UpdatePropertyListing));

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  address: {
    marginTop: 12,
  },
  divider: {
    marginTop: 10,
    borderColor: theme.colors.background,
  },
  sheetContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonView: {
    flexDirection: 'row',
    marginTop: 24,
  },
  leftButton: {
    height: 50,
    marginRight: 20,
  },
  buttonContainer: {
    height: 50,
  },
});
