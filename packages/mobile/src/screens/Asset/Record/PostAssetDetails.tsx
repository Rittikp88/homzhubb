import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Formik, FormikActions, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider, FormTextInput, FormButton, WithShadowView } from '@homzhub/common/src/components';
import { Header, PropertyDetailsLocation, AssetGroupSelection, Loader } from '@homzhub/mobile/src/components';
import { AssetGroup } from '@homzhub/common/src/domain/models/AssetGroup';
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
    address: string;
  };
  assetTypeId: number;
}
type libraryProps = NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.PostAssetDetails>;
type Props = WithTranslation & libraryProps & IDispatchProps & IStateProps;

class PostAssetDetails extends React.PureComponent<Props, IOwnState> {
  public constructor(props: Props) {
    super(props);
    const {
      route: {
        params: { name, pincode, state, address, country, city },
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
              <ScrollView keyboardShouldPersistTaps="never" showsVerticalScrollIndicator={false}>
                <PropertyDetailsLocation
                  propertyName={name}
                  propertyAddress={address}
                  onNavigate={this.onChangeText}
                  testID="propertyLocation"
                />
                <View style={styles.fieldsView}>
                  <FormTextInput
                    name="projectName"
                    label={t('projectName')}
                    inputType="default"
                    maxLength={50}
                    numberOfLines={1}
                    placeholder={t('projectNamePlaceholder')}
                    formProps={formProps}
                  />
                  <View style={styles.contentView}>
                    <View style={styles.subContentView}>
                      <FormTextInput
                        name="unitNo"
                        label={t('unitNo')}
                        maxLength={10}
                        numberOfLines={1}
                        inputType="default"
                        formProps={formProps}
                      />
                    </View>
                    <View style={styles.flexOne}>
                      <FormTextInput
                        name="blockNo"
                        label={t('blockNo')}
                        maxLength={10}
                        numberOfLines={1}
                        inputType="default"
                        formProps={formProps}
                      />
                    </View>
                  </View>
                  <FormTextInput
                    name="address"
                    label={t('address')}
                    maxLength={100}
                    inputType="default"
                    multiline
                    formProps={formProps}
                    style={styles.address}
                  />
                  <View style={styles.contentView}>
                    <View style={styles.subContentView}>
                      <FormTextInput
                        name="pincode"
                        label={t('pincode')}
                        maxLength={10}
                        numberOfLines={1}
                        inputType="default"
                        formProps={formProps}
                      />
                    </View>
                    <View style={styles.flexOne}>
                      <FormTextInput
                        name="city"
                        label={t('city')}
                        maxLength={20}
                        numberOfLines={1}
                        inputType="default"
                        editable={false}
                        formProps={formProps}
                      />
                    </View>
                  </View>
                  <View style={styles.contentView}>
                    <View style={styles.subContentView}>
                      <FormTextInput
                        name="state"
                        label={t('state')}
                        maxLength={20}
                        numberOfLines={1}
                        inputType="default"
                        editable={false}
                        formProps={formProps}
                      />
                    </View>
                    <View style={styles.flexOne}>
                      <FormTextInput
                        name="country"
                        label={t('country')}
                        maxLength={20}
                        numberOfLines={1}
                        editable={false}
                        inputType="default"
                        formProps={formProps}
                      />
                    </View>
                  </View>
                </View>
                <Divider />
                <AssetGroupSelection
                  assetGroups={assetGroups}
                  selectedAssetGroupType={assetTypeId}
                  onAssetGroupSelected={this.onAssetGroupSelected}
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
      address,
      project_name,
      pin_code,
      asset_type,
      block_number,
      unit_number,
      latitude,
      longitude,
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
  fieldsView: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  contentView: {
    flexDirection: 'row',
  },
  subContentView: {
    flex: 1,
    marginRight: 16,
  },
  address: {
    height: 80,
    paddingTop: 16,
    paddingBottom: 16,
  },
  flexOne: {
    flex: 1,
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
