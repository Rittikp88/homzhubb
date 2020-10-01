import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton, WithShadowView } from '@homzhub/common/src/components';
import {
  PostAssetForm,
  Header,
  PropertyDetailsLocation,
  AssetGroupSelection,
  Loader,
} from '@homzhub/mobile/src/components';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetGroup } from '@homzhub/common/src/domain/models/AssetGroup';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IStateProps {
  assetGroups: AssetGroup[];
  isLoading: boolean;
  assetId: number;
  asset: Asset | null;
}

interface IDispatchProps {
  setAssetId: (id: number) => void;
  getAssetGroups: () => void;
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
  };

  private scrollView: ScrollView | null = null;

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

  public componentWillUnmount = (): void => {
    const { navigation } = this.props;
    navigation.removeListener('focus', this.onFocus);
  };

  public render(): React.ReactNode {
    const {
      t,
      isLoading,
      navigation: { goBack },
    } = this.props;

    return (
      <>
        <Header title={t('headerTitle')} onIconPress={goBack} isBarVisible />
        <SafeAreaView style={styles.container}>{this.renderForm()}</SafeAreaView>
        <Loader visible={isLoading} />
      </>
    );
  }

  private renderForm = (): React.ReactNode => {
    const { t, assetGroups } = this.props;
    const {
      formData,
      assetGroupTypeId,
      assetGroupId,
      formData: { projectName, address },
      assetGroupSelectionDisabled,
    } = this.state;

    return (
      <Formik
        enableReinitialize
        initialValues={formData}
        onSubmit={this.onSubmit}
        validate={FormUtils.validate(this.formSchema)}
      >
        {(formProps: FormikProps<FormikValues>): React.ReactNode => {
          return (
            <>
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
                />
                <PostAssetForm formProps={formProps} />
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
            </>
          );
        }}
      </Formik>
    );
  };

  private onChange = (): void => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate(ScreensKeys.AssetLocationSearch);
  };

  private onSubmit = async (values: IFormData, formActions: FormikHelpers<IFormData>): Promise<void> => {
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
    const { setAssetId, assetId, navigation } = this.props;
    const { assetGroupTypeId: asset_type, longitude, latitude } = this.state;

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
      last_visited_step: {
        is_created: true,
        current_step: 1,
        total_step: 4,
      },
    };

    formActions.setSubmitting(true);
    try {
      if (assetId > -1) {
        await AssetRepository.updateAsset(assetId, params);
      } else {
        const response = await AssetRepository.createAsset(params);
        setAssetId(response.id);
      }
      navigation.navigate(ScreensKeys.AddProperty);
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
});

const mapStateToProps = (state: IState): IStateProps => {
  const { getAssetGroups, getAssetGroupsLoading, getCurrentAssetId, getAssetDetails } = RecordAssetSelectors;
  return {
    assetGroups: getAssetGroups(state),
    assetId: getCurrentAssetId(state),
    isLoading: getAssetGroupsLoading(state),
    asset: getAssetDetails(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetGroups, setAssetId } = RecordAssetActions;
  return bindActionCreators(
    {
      setAssetId,
      getAssetGroups,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(PostAssetDetails));
