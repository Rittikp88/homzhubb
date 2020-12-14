import React, { createRef, ReactElement } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { WithShadowView } from '@homzhub/common/src/components/atoms/WithShadowView';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import {
  PostAssetForm,
  Header,
  PropertyDetailsLocation,
  AssetGroupSelection,
  Loader,
  BottomSheet,
} from '@homzhub/mobile/src/components';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import PropertyConfirmationView from '@homzhub/mobile/src/components/molecules/PropertyConfirmationView';
import { IEditPropertyFlow } from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/PropertyDetailScreen';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetGroup } from '@homzhub/common/src/domain/models/AssetGroup';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IStateProps {
  assetGroups: AssetGroup[];
  isLoading: boolean;
  assetId: number;
  asset: Asset | null;
  lastVisitedStep: ILastVisitedStep | null;
  editPropertyFlowDetails: IEditPropertyFlow;
}

interface IDispatchProps {
  setAssetId: (id: number) => void;
  getAssetGroups: () => void;
  setEditPropertyFlow: (payload: boolean) => void;
  toggleEditPropertyFlowBottomSheet: (payload: boolean) => void;
}

interface IFormData {
  projectName: string;
  unitNo: string;
  blockNo: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  countryIsoCode: string;
  address: string;
}

interface IOwnState {
  formData: IFormData;
  assetGroupTypeId: number;
  assetGroupId: number;
  latitude: number;
  longitude: number;
  assetGroupSelectionDisabled: boolean;
  displayGoBackCaution: boolean;
}
type libraryProps = NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.PostAssetDetails>;
type Props = WithTranslation & libraryProps & IDispatchProps & IStateProps;

class PostAssetDetails extends React.PureComponent<Props, IOwnState> {
  public state = {
    formData: {
      projectName: '',
      unitNo: '',
      blockNo: '',
      pincode: '',
      city: '',
      state: '',
      country: '',
      countryIsoCode: '',
      address: '',
    },
    assetGroupSelectionDisabled: false,
    assetGroupTypeId: -1,
    assetGroupId: -1,
    longitude: 0,
    latitude: 0,
    displayGoBackCaution: false,
  };

  private scrollView: ScrollView | null = null;
  private formikInnerRef: React.RefObject<FormikProps<IFormData>> | null = createRef<FormikProps<IFormData>>();

  public componentDidMount = (): void => {
    const {
      getAssetGroups,
      navigation,
      route: { params },
    } = this.props;
    getAssetGroups();

    navigation.addListener('focus', this.onFocus);

    if (!params) {
      this.setDataFromAsset();
      return;
    }

    this.setDataFromNavProps();
  };

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<IOwnState>): void {
    const { asset } = this.props;
    const { asset: prevAsset } = prevProps;

    if (asset !== prevAsset) {
      this.setDataFromAsset();
    }
  }

  public componentWillUnmount = (): void => {
    const { navigation } = this.props;
    navigation.removeListener('focus', this.onFocus);
  };

  public render(): React.ReactNode {
    const { isLoading } = this.props;

    return (
      <>
        <SafeAreaView style={styles.container}>{this.renderForm()}</SafeAreaView>
        <Loader visible={isLoading} />
        {this.renderGoBackCaution()}
      </>
    );
  }

  private renderForm = (): React.ReactNode => {
    const { t, assetGroups, asset } = this.props;
    const {
      formData,
      assetGroupTypeId,
      assetGroupId,
      formData: { projectName, address },
      assetGroupSelectionDisabled,
    } = this.state;

    return (
      <Formik
        validateOnMount
        enableReinitialize
        initialValues={formData}
        onSubmit={this.onSubmit}
        validate={FormUtils.validate(this.formSchema)}
        innerRef={this.formikInnerRef}
      >
        {(formProps: FormikProps<FormikValues>): React.ReactNode => {
          return (
            <>
              <Header title={t('headerTitle')} onIconPress={this.handleGoBack} isBarVisible />
              <ScrollView
                keyboardShouldPersistTaps="never"
                showsVerticalScrollIndicator={false}
                ref={(ref): void => {
                  this.scrollView = ref;
                }}
              >
                <PropertyDetailsLocation
                  propertyName={projectName}
                  propertyAddress={address}
                  onNavigate={this.onChange}
                  testID="propertyLocation"
                  isVerificationDone={asset?.isVerificationDocumentUploaded}
                />
                <PostAssetForm formProps={formProps} isVerificationDone={asset?.isVerificationDocumentUploaded} />
                <AssetGroupSelection
                  isDisabled={assetGroupSelectionDisabled}
                  assetGroups={assetGroups}
                  selectedAssetGroupType={assetGroupTypeId}
                  selectedAssetGroupId={assetGroupId}
                  onAssetGroupSelected={this.onAssetGroupSelected}
                  scrollRef={this.scrollView}
                />
              </ScrollView>
              <WithShadowView>
                <FormButton
                  disabled={assetGroupTypeId === -1}
                  type="primary"
                  title={t('common:submit')}
                  containerStyle={styles.buttonStyle}
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  formProps={formProps}
                />
              </WithShadowView>
              {this.renderEditFlowCaution()}
            </>
          );
        }}
      </Formik>
    );
  };

  private renderEditFlowCaution = (): ReactElement | null => {
    const {
      t,
      editPropertyFlowDetails: { showBottomSheet },
      asset,
    } = this.props;
    if (!asset) {
      return null;
    }

    return (
      <BottomSheet
        key="editFlowSheet"
        sheetHeight={400}
        headerTitle={t('editProperty')}
        visible={showBottomSheet}
        onCloseSheet={this.onBottomSheetClose}
      >
        <PropertyConfirmationView
          propertyData={asset}
          description={t('editPropertyCautionText')}
          message={t('common:wantToContinue')}
          onCancel={this.goBack}
          onContinue={this.onBottomSheetClose}
        />
      </BottomSheet>
    );
  };

  private renderGoBackCaution = (): ReactElement => {
    const { t } = this.props;
    const { displayGoBackCaution } = this.state;

    return (
      <BottomSheet
        key="goBackCaution"
        sheetHeight={300}
        visible={displayGoBackCaution}
        onCloseSheet={this.closeGoBackCaution}
      >
        <View style={styles.sheetStyle}>
          <Text type="regular" textType="regular">
            {t('saveYourDetailsCautionText')}
          </Text>
          <View style={styles.buttonGroupStyle}>
            <Button
              containerStyle={styles.marginRight}
              type="primary"
              title={t('common:save')}
              onPress={this.onSavePress}
            />
            <Button
              containerStyle={styles.marginLeft}
              type="primary"
              title={t('common:discard')}
              onPress={this.goBack}
            />
          </View>
        </View>
      </BottomSheet>
    );
  };

  private onChange = (): void => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate(ScreensKeys.AssetLocationSearch);
  };

  private onBottomSheetClose = (): void => {
    const { toggleEditPropertyFlowBottomSheet } = this.props;

    toggleEditPropertyFlowBottomSheet(false);
  };

  private onSubmit = async (
    values: IFormData,
    formActions: FormikHelpers<IFormData>,
    shouldGoBack?: boolean
  ): Promise<void> => {
    const {
      projectName: project_name,
      unitNo: unit_number,
      blockNo: block_number,
      pincode: postal_code,
      city: city_name,
      state: state_name,
      country: country_name,
      countryIsoCode: country_iso2_code,
      address,
    } = values;
    const { setAssetId, assetId, navigation, lastVisitedStep } = this.props;
    const { assetGroupTypeId: asset_type, longitude, latitude } = this.state;
    let visitedStep = {
      asset_creation: {
        is_created: true,
        total_step: 4,
      },
    };

    if (lastVisitedStep) {
      visitedStep = {
        ...lastVisitedStep,
        asset_creation: {
          ...lastVisitedStep.asset_creation,
          is_created: true,
          total_step: 4,
        },
      };
    }

    const params = {
      city_name,
      state_name,
      country_name,
      country_iso2_code,
      address,
      project_name,
      postal_code,
      asset_type,
      block_number,
      unit_number,
      latitude,
      longitude,
      last_visited_step: visitedStep,
    };

    formActions.setSubmitting(true);
    try {
      if (assetId > -1) {
        await AssetRepository.updateAsset(assetId, params);
      } else {
        const response = await AssetRepository.createAsset(params);
        setAssetId(response.id);
      }

      if (!shouldGoBack) {
        navigation.navigate(ScreensKeys.AddProperty);
        return;
      }
      this.goBack();
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
    formActions.setSubmitting(false);
  };

  private onAssetGroupSelected = (assetGroupTypeId: number): void => {
    this.setState({ assetGroupTypeId });
  };

  private onFocus = (): void => {
    const {
      route: { params },
    } = this.props;

    if (!params) return;
    this.setDataFromNavProps();
  };

  private onSavePress = async (): Promise<void> => {
    if (!this.formikInnerRef) {
      return;
    }

    const { current } = this.formikInnerRef;
    await this.onSubmit(current?.values as IFormData, current as FormikHelpers<IFormData>, true);
  };

  private closeGoBackCaution = (): void => {
    this.setState({ displayGoBackCaution: false });
  };

  private handleGoBack = (): void => {
    if (!this.formikInnerRef) {
      return;
    }

    const { current } = this.formikInnerRef;
    if (current?.dirty) {
      this.setState({ displayGoBackCaution: true });
      return;
    }
    this.goBack();
  };

  private goBack = (): void => {
    const {
      navigation,
      setEditPropertyFlow,
      editPropertyFlowDetails: { isEditPropertyFlow },
    } = this.props;

    if (isEditPropertyFlow) {
      setEditPropertyFlow(false);
    }
    navigation.goBack();
  };

  private setDataFromNavProps = (): void => {
    const {
      route: { params },
      asset,
    } = this.props;
    const { formData } = this.state;

    if (!params) return;
    const { name, pincode, state, address, country, city, countryIsoCode, longitude, latitude } = params;

    this.setState({
      formData: {
        ...formData,
        projectName: name,
        pincode,
        city,
        state,
        country,
        countryIsoCode,
        address,
        unitNo: asset?.unitNumber ?? '',
        blockNo: asset?.blockNumber ?? '',
      },
      assetGroupId: asset?.assetGroupId ?? -1,
      assetGroupTypeId: asset?.assetGroupTypeId ?? -1,
      assetGroupSelectionDisabled: !!asset,
      longitude,
      latitude,
    });
  };

  private setDataFromAsset = (): void => {
    const { asset } = this.props;
    if (!asset) {
      return;
    }

    const {
      pinCode,
      projectName,
      unitNumber,
      blockNumber,
      city,
      state,
      countryName,
      countryIsoCode,
      address,
      assetGroupTypeId,
      latitude,
      longitude,
      assetGroupId,
    } = asset;

    this.setState({
      formData: {
        projectName,
        unitNo: unitNumber,
        blockNo: blockNumber,
        pincode: pinCode,
        city,
        state,
        country: countryName,
        countryIsoCode,
        address,
      },
      assetGroupSelectionDisabled: true,
      assetGroupTypeId,
      assetGroupId,
      longitude,
      latitude,
    });
  };

  private formSchema = (): yup.ObjectSchema<{
    projectName: string;
    unitNo: string;
    blockNo: string;
    pincode: string;
    address: string;
  }> => {
    const { t } = this.props;
    return yup.object().shape({
      projectName: yup.string().required(t('projectNameRequired')),
      unitNo: yup.string().required(t('unitNoRequired')),
      blockNo: yup.string(),
      pincode: yup.string().required(t('common:requiredText', { field: t('pincode').toLowerCase() })),
      address: yup.string().required(t('common:requiredText', { field: t('address').toLowerCase() })),
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
  sheetStyle: {
    paddingHorizontal: theme.layout.screenPadding,
  },
  buttonGroupStyle: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  marginRight: {
    marginRight: 5,
  },
  marginLeft: {
    marginLeft: 5,
  },
});

const mapStateToProps = (state: IState): IStateProps => {
  const {
    getAssetGroups,
    getAssetGroupsLoading,
    getCurrentAssetId,
    getAssetDetails,
    getLastVisitedStep,
    getEditPropertyFlowDetails,
  } = RecordAssetSelectors;
  return {
    assetGroups: getAssetGroups(state),
    assetId: getCurrentAssetId(state),
    isLoading: getAssetGroupsLoading(state),
    asset: getAssetDetails(state),
    lastVisitedStep: getLastVisitedStep(state),
    editPropertyFlowDetails: getEditPropertyFlowDetails(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetGroups, setAssetId, setEditPropertyFlow, toggleEditPropertyFlowBottomSheet } = RecordAssetActions;
  return bindActionCreators(
    {
      setAssetId,
      getAssetGroups,
      setEditPropertyFlow,
      toggleEditPropertyFlowBottomSheet,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(PostAssetDetails));
