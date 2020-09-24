import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Formik, FormikActions, FormikProps, FormikValues } from 'formik';
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
import { AssetGroup } from '@homzhub/common/src/domain/models/AssetGroup';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IStateProps {
  assetGroups: AssetGroup[];
  isLoading: boolean;
  assetId: number;
}

interface IDispatchProps {
  setAssetId: (id: number) => void;
  getAssetGroups: () => void;
}

interface IOwnState {
  formData: {
    projectName: string;
    unitNo: string;
    blockNo: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
    countryIsoCode: string;
    address: string;
  };
  assetTypeId: number;
}
type libraryProps = NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.PostAssetDetails>;
type Props = WithTranslation & libraryProps & IDispatchProps & IStateProps;

class PostAssetDetails extends React.PureComponent<Props, IOwnState> {
  private scrollView: ScrollView | null = null;

  // TODO (Aditya 24-09-2020): Redo this logic so as to accommodate the edit flow
  public constructor(props: Props) {
    super(props);
    const {
      route: {
        params: { name, pincode, state, address, country, city, countryIsoCode },
      },
    } = props;
    this.state = {
      formData: {
        projectName: name,
        unitNo: '',
        blockNo: '',
        pincode,
        city,
        state,
        country,
        countryIsoCode,
        address,
      },
      assetTypeId: -1,
    };
  }

  public componentDidMount = (): void => {
    const { getAssetGroups } = this.props;
    getAssetGroups();
  };

  public render(): React.ReactNode {
    const { t, isLoading } = this.props;

    return (
      <>
        <Header title={t('headerTitle')} onIconPress={this.onBackPress} isBarVisible />
        <SafeAreaView style={styles.container}>{this.renderForm()}</SafeAreaView>
        <Loader visible={isLoading} />
      </>
    );
  }

  private renderForm = (): React.ReactNode => {
    const {
      t,
      assetGroups,
      route: {
        params: { name, address },
      },
    } = this.props;
    const { formData, assetTypeId } = this.state;

    return (
      <Formik initialValues={formData} onSubmit={this.onSubmit} validate={FormUtils.validate(this.formSchema)}>
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
                  propertyName={name}
                  propertyAddress={address}
                  onNavigate={this.onChangeText}
                  testID="propertyLocation"
                />
                <PostAssetForm formProps={formProps} />
                <AssetGroupSelection
                  assetGroups={assetGroups}
                  selectedAssetGroupType={assetTypeId}
                  onAssetGroupSelected={this.onAssetGroupSelected}
                  scrollRef={this.scrollView}
                />
              </ScrollView>
              <WithShadowView>
                <FormButton
                  disabled={assetTypeId === -1}
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

  private onBackPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private onChangeText = (): void => {
    const { navigation } = this.props;
    navigation.popToTop();
  };

  private onSubmit = async (values: FormikValues, formActions: FormikActions<FormikValues>): Promise<void> => {
    const {
      projectName: project_name,
      unitNo: unit_number,
      blockNo: block_number,
      pincode: pin_code,
      city,
      state,
      country,
      countryIsoCode: country_iso2_code,
      address,
    } = values;
    const {
      route: {
        params: { lat: latitude, lng: longitude },
      },
      setAssetId,
      assetId,
      navigation,
    } = this.props;
    const { assetTypeId: asset_type } = this.state;

    const params = {
      city,
      state,
      country,
      country_iso2_code,
      address,
      project_name,
      pin_code,
      asset_type,
      block_number,
      unit_number,
      latitude,
      longitude,
      last_visited_step: {
        current_step: 1,
        total_step: 4,
      },
    };

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
  };

  private onAssetGroupSelected = (assetTypeId: number): void => {
    this.setState({ assetTypeId });
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
  const { getAssetGroups, getAssetGroupsLoading, getCurrentAssetId } = RecordAssetSelectors;
  return {
    assetGroups: getAssetGroups(state),
    assetId: getCurrentAssetId(state),
    isLoading: getAssetGroupsLoading(state),
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
