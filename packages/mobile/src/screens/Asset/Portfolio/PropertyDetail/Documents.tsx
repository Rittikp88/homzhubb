import React, { PureComponent } from 'react';
import { FlatList, Share, StyleSheet, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { debounce } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { ICreateDocumentPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';
import { IGetDocumentPayload } from '@homzhub/common/src/modules/asset/interfaces';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import Menu, { IMenu } from '@homzhub/mobile/src/components/molecules/Menu';
import { SearchBar } from '@homzhub/common/src/components/molecules/SearchBar';
import { UploadBox } from '@homzhub/common/src/components/molecules/UploadBox';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { DocumentCard } from '@homzhub/mobile/src/components';
import { IDocumentSource } from '@homzhub/mobile/src/components/molecules/UploadBoxComponent';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AllowedAttachmentFormats } from '@homzhub/common/src/domain/models/Attachment';
import { UserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';
import { DocumentOperations, DocumentOptions } from '@homzhub/common/src/constants/Documents';

interface IStateProps {
  currentAssetId: number;
  assetData: Asset | null;
  documents: AssetDocument[];
  user: UserProfile | null;
}

interface IDispatchProps {
  getAssetDocument: (payload: IGetDocumentPayload) => void;
}

interface IDocumentState {
  searchValue: string;
  documents: AssetDocument[];
  isLoading: boolean;
  header: string;
  selectedDocumentId: number;
  showBottomSheet: boolean;
  formValues: FormikValues;
  showDeleteSheet: boolean;
}

type NavProps = NavigationScreenProps<CommonParamList, ScreensKeys.DocumentScreen>;
type Props = IStateProps & IDispatchProps & WithTranslation & NavProps;

export class Documents extends PureComponent<Props, IDocumentState> {
  private search = debounce(() => {
    const { searchValue } = this.state;
    const { documents } = this.props;
    const results: AssetDocument[] = [];
    documents.forEach((item: AssetDocument) => {
      const name = item.attachment.fileName.toLowerCase();
      if (name.includes(searchValue.toLowerCase())) {
        results.push(item);
      }
    });
    this.setState({ documents: results, isLoading: false });
  }, 1000);

  constructor(props: Props) {
    super(props);
    const {
      t,
      route: { params },
    } = this.props;
    this.state = {
      searchValue: '',
      documents: [],
      isLoading: false,
      header: params?.screenTitle ?? t('assetPortfolio:portfolio'),
      selectedDocumentId: -1,
      showBottomSheet: false,
      showDeleteSheet: false,
      formValues: {
        fileName: '',
      },
    };
  }

  public componentDidMount(): void {
    const {
      route: { params },
    } = this.props;
    if (params?.isFromDashboard) {
      this.getProjectName().then();
    }
    this.getDocuments();
  }

  public componentDidUpdate(): void {
    const {
      route: { params },
    } = this.props;
    if (params?.shouldReload) {
      this.getDocuments();
    }
  }

  public render(): React.ReactNode {
    const { searchValue, isLoading, header } = this.state;
    const { t, navigation } = this.props;
    return (
      <UserScreen
        title={header}
        pageTitle={t('assetMore:documents')}
        onBackPress={navigation.goBack}
        loading={isLoading}
      >
        <View style={styles.container}>
          <UploadBox
            icon={icons.document}
            header={t('uploadDocument')}
            subHeader={t('uploadDocHelperText')}
            containerStyle={styles.uploadBox}
            onPress={this.onCapture}
          />
          <SearchBar
            placeholder={t('assetMore:searchByDoc')}
            value={searchValue}
            updateValue={this.onSearch}
            containerStyle={styles.searchBar}
            testID="searchBar"
          />
          {this.renderDocumentList()}
          {this.renderRenameBottomSheet()}
        </View>
      </UserScreen>
    );
  }

  private renderDocumentList = (): React.ReactElement => {
    const { documents } = this.state;
    if (documents.length === 0) {
      return <EmptyState />;
    }

    return (
      <FlatList
        data={documents}
        renderItem={({ item }): React.ReactElement => this.renderDocumentCard(item)}
        ItemSeparatorComponent={this.renderSeparatorComponent}
        keyExtractor={this.renderKeyExtractor}
        showsVerticalScrollIndicator={false}
        testID="documentList"
      />
    );
  };

  private renderRenameBottomSheet = (): React.ReactElement | null => {
    const { t } = this.props;
    const { showBottomSheet, formValues, selectedDocumentId, isLoading } = this.state;

    if (selectedDocumentId === -1) return null;

    const BottomSheetContent = (): React.ReactElement => {
      return (
        <View style={styles.bottomSheetContainer}>
          <Formik
            onSubmit={this.onRenameDocument}
            initialValues={formValues}
            enableReinitialize
            validate={FormUtils.validate(this.validateForm)}
          >
            {(formProps: FormikProps<FormikValues>): React.ReactElement => {
              const onPress = (): void => formProps.handleSubmit();

              const onPressCross = (): void => formProps.setFieldValue('fileName', '');

              const renderCrossMark = (): React.ReactNode => (
                <Button
                  type="primary"
                  icon={icons.close}
                  iconSize={20}
                  iconColor={theme.colors.darkTint8}
                  containerStyle={styles.crossIconInTextInput}
                  onPress={onPressCross}
                />
              );
              return (
                <>
                  <FormTextInput
                    name="fileName"
                    inputType="default"
                    formProps={formProps}
                    containerStyle={styles.nameField}
                    style={styles.textInput}
                    multiline
                    inputGroupSuffix={renderCrossMark()}
                  />
                  <FormButton
                    type="primary"
                    formProps={formProps}
                    title={t('common:save')}
                    onPress={onPress}
                    containerStyle={styles.saveButton}
                    disabled={formProps.values.fileName.length === 0 || isLoading}
                  />
                </>
              );
            }}
          </Formik>
        </View>
      );
    };

    return (
      <BottomSheet
        visible={showBottomSheet}
        headerTitle={t('common:rename')}
        onCloseSheet={this.onCloseBottomSheet}
        sheetHeight={theme.viewport.height / 2.7}
      >
        <BottomSheetContent />
      </BottomSheet>
    );
  };

  private renderDocumentCard = (item: AssetDocument): React.ReactElement => {
    const { user, t } = this.props;
    const isDeleteAllowed = !item.isSystemGenerated && item.user?.id === user?.id;
    const rightNode = (): React.ReactElement => this.renderMenu(item.id, isDeleteAllowed);

    const handleOpenDocument = async (): Promise<void> => {
      const result = await LinkingService.canOpenURL(item.attachment.link);
      if (!result) {
        AlertHelper.error({ message: t('common:genericErrorMessage') });
      }
    };

    return (
      <DocumentCard
        document={item}
        userEmail={user?.email ?? ''}
        testID="documentCard"
        showIcons={false}
        leftIcon={icons.doc}
        renderRightNode={rightNode}
        handleOpenDocument={handleOpenDocument}
      />
    );
  };

  private renderMenu = (id: number, isDeleteAllowed: boolean): React.ReactElement => {
    const { t } = this.props;
    const { showDeleteSheet } = this.state;

    const formattedData: IMenu[] = DocumentOptions.map((item) => {
      return {
        label: t(item.label),
        value: item.value,
        isExtraData: item.isExtraData,
        isExtraDataAllowed: isDeleteAllowed,
      };
    });

    return (
      <Menu
        data={formattedData}
        optionTitle={t('assetMore:documentOptions')}
        sheetHeight={theme.viewport.height / 2.7}
        onPressIcon={(): void => this.onClickIcon(id)}
        isExtraNode={showDeleteSheet}
        onSelect={(value): Promise<void> => this.onSelectMenu(value, isDeleteAllowed)}
        extraNode={this.renderDeleteConfirmation()}
      />
    );
  };

  private renderDeleteConfirmation = (): React.ReactElement => {
    const { t } = this.props;
    const { showDeleteSheet, selectedDocumentId, documents } = this.state;
    const selectedDocument = documents.filter((item) => item.id === selectedDocumentId)[0];
    return (
      <BottomSheet
        visible={showDeleteSheet}
        headerTitle={t('property:deleteDocument')}
        sheetHeight={theme.viewport.height / 2.7}
      >
        <View style={styles.deleteContainer}>
          <Text type="small">{t('property:deleteConfirmation', { name: selectedDocument?.attachment.fileName })}</Text>
          <View style={styles.buttonContainer}>
            <Button
              type="secondary"
              title={t('common:cancel')}
              containerStyle={[styles.button, styles.buttonView]}
              onPress={this.onCloseDeleteSheet}
            />
            <Button
              type="primary"
              title={t('common:delete')}
              containerStyle={styles.button}
              onPress={this.onSelectDelete}
            />
          </View>
        </View>
      </BottomSheet>
    );
  };

  private renderSeparatorComponent = (): React.ReactElement => {
    return <Divider containerStyles={styles.divider} />;
  };

  private renderKeyExtractor = (item: AssetDocument, index: number): string => {
    return `${item.id}-${index}`;
  };

  private onSelectMenu = async (value: string, isDeleteAllowed: boolean): Promise<void> => {
    const { t } = this.props;
    switch (value) {
      case DocumentOperations.RENAME:
        this.onSelectRename();
        break;
      case DocumentOperations.SHARE:
        await this.onSelectShare();
        break;
      case DocumentOperations.DOWNLOAD:
        await this.onSelectDownload();
        break;
      case DocumentOperations.DELETE:
        if (isDeleteAllowed) {
          this.onPressDelete();
        } else {
          AlertHelper.error({ message: t('property:cannotDeleteDocument') });
        }
        break;
      default:
        break;
    }
  };

  private onClickIcon = (id: number): void => {
    this.setState({ selectedDocumentId: id });
  };

  private onSearch = (value: string): void => {
    const { documents } = this.props;
    this.setState({ searchValue: value }, () => {
      if (value.length >= 3) {
        this.setState({ isLoading: true });
        this.search();
      }

      if (value.length === 0) {
        this.setState({
          documents,
        });
      }
    });
  };

  private onPressDelete = (): void => {
    this.setState({ showDeleteSheet: true });
  };

  private onCloseDeleteSheet = (): void => {
    this.setState({ showDeleteSheet: false });
  };

  private onCapture = async (): Promise<void> => {
    const { t } = this.props;
    try {
      const document = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      /* Check if the uploaded document's size is lesser than 5mb */
      if (document.size > 5000000) {
        AlertHelper.error({ message: t('common:docExceedsMaxSize', { size: '5mb' }) });
        return;
      }

      /* Check if the uploaded document is one of the allowed type */
      if (Object.values(AllowedAttachmentFormats).includes(document.type)) {
        const documentSource = { uri: document.uri, type: document.type, name: document.name };
        await this.uploadDocument(documentSource as IDocumentSource);
      } else {
        AlertHelper.error({ message: t('unsupportedFormat') });
      }
    } catch (e) {
      AlertHelper.error({ message: t('pleaseTryAgain') });
    }
  };

  private onRenameDocument = async (values: FormikValues): Promise<void> => {
    const { currentAssetId, t } = this.props;
    const { selectedDocumentId } = this.state;
    const { fileName } = values;
    try {
      this.setState({ isLoading: true });
      await AssetRepository.renameAssetDocument({
        assetId: currentAssetId,
        assetDocumentId: selectedDocumentId,
        fileName,
      });
      AlertHelper.success({ message: t('assetFinancial:renamedSuccessfullyMessage') });
      this.setState({ isLoading: false, showBottomSheet: false });
      this.getDocuments();
    } catch (e) {
      this.setState({ isLoading: false, showBottomSheet: false });
      AlertHelper.error({ message: e.utils });
    }
  };

  private onSelectShare = async (): Promise<void> => {
    const { selectedDocumentId, documents } = this.state;
    const { t } = this.props;
    const currentDocumentLink = documents.filter((i) => i.id === selectedDocumentId)[0].attachment.link;
    try {
      await Share.share({
        message: `${t('assetMore:shareDoc')} ${currentDocumentLink}`,
      });
    } catch (error) {
      AlertHelper.error({ message: error });
    }
  };

  private onSelectDownload = async (): Promise<void> => {
    const { documents, selectedDocumentId } = this.state;
    const { presignedReferenceKey: key, fileName } = documents.filter((i) => i.id === selectedDocumentId)[0].attachment;
    await AttachmentService.downloadAttachment(key, fileName);
  };

  private onSelectDelete = async (): Promise<void> => {
    const { selectedDocumentId } = this.state;
    const { currentAssetId, t } = this.props;
    this.setState({ isLoading: true });
    try {
      await AssetRepository.deleteAssetDocument(currentAssetId, selectedDocumentId);
      this.getDocuments();
      AlertHelper.success({ message: t('assetFinancial:deletedSuccessfullyMessage') });
      this.setState({ isLoading: false, showDeleteSheet: false });
    } catch (e) {
      this.setState({ isLoading: false });
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private onSelectRename = (): void => {
    const { documents, selectedDocumentId } = this.state;
    const currentFileName = documents
      .filter((item) => item.id === selectedDocumentId)[0]
      .attachment.fileName.split('.')
      .reverse()
      .slice(1)
      .toString();

    this.setState({
      showBottomSheet: true,
      formValues: {
        fileName: currentFileName,
      },
    });
  };

  private onCloseBottomSheet = (): void => {
    this.setState({
      showBottomSheet: false,
    });
  };

  private uploadDocument = async (DocumentSource: IDocumentSource): Promise<void> => {
    const { currentAssetId, assetData } = this.props;
    if (!assetData || !assetData.assetStatusInfo) {
      return;
    }

    const {
      assetStatusInfo: { leaseListingId, saleListingId },
    } = assetData;
    const formData = new FormData();
    // @ts-ignore
    formData.append('files[]', DocumentSource);

    try {
      const response = await AttachmentService.uploadImage(formData, AttachmentType.ASSET_DOCUMENT);
      const { data } = response;
      const attachmentId = data[0].id;
      const payload: ICreateDocumentPayload = {
        propertyId: currentAssetId,
        documentData: [
          {
            attachment: attachmentId,
            ...(leaseListingId && { lease_listing_id: leaseListingId }),
            ...(saleListingId && { sale_listing_id: saleListingId }),
          },
        ],
      };

      await AssetRepository.createAssetDocument(payload);
      this.getDocuments();
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e);
      AlertHelper.error({ message: error });
    }
  };

  private validateForm = (): yup.ObjectSchema => {
    const { t } = this.props;
    return yup.object().shape({
      fileName: yup.string().required(t('moreProfile:fieldRequiredError')),
    });
  };

  private getDocuments = (): void => {
    const {
      getAssetDocument,
      currentAssetId,
      route: { params },
      navigation,
    } = this.props;
    const assetId = params?.isFromDashboard ? params?.propertyId ?? -1 : currentAssetId;
    this.setState({ isLoading: true });
    getAssetDocument({ assetId, onCallback: this.getDocumentCallback });
    navigation.setParams({ shouldReload: false });
  };

  private getDocumentCallback = (): void => {
    const { documents } = this.props;
    this.setState({ documents, isLoading: false });
  };

  private getProjectName = async (): Promise<void> => {
    const {
      route: { params },
    } = this.props;

    const returnWithComma = (text: string): string => (text.length > 0 ? `${text}, ` : text);

    try {
      if (params?.propertyId) {
        const requiredFields = ['project_name', 'unit_number', 'block_number'];
        this.setState({ isLoading: true });
        const { projectName, unitNumber, blockNumber } = await AssetRepository.getRequiredAssetFieldsById(
          params.propertyId,
          requiredFields
        );
        const headerText = `${returnWithComma(unitNumber)}${returnWithComma(blockNumber)}${projectName}`;
        this.setState({ header: headerText, isLoading: false });
      }
    } catch (e) {
      this.setState({ isLoading: false });
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    currentAssetId: PortfolioSelectors.getCurrentAssetId(state),
    assetData: PortfolioSelectors.getAssetById(state),
    documents: AssetSelectors.getAssetDocuments(state),
    user: UserSelector.getUserProfile(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetDocument } = AssetActions;
  return bindActionCreators({ getAssetDocument }, dispatch);
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Documents));

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  uploadBox: {
    paddingVertical: 16,
  },
  searchBar: {
    marginTop: 16,
  },
  divider: {
    borderColor: theme.colors.darkTint10,
  },
  nameField: {
    marginTop: 25,
  },
  textInput: {
    maxHeight: 45,
  },
  saveButton: {
    maxHeight: 45,
    marginTop: 20,
  },
  crossIconInTextInput: {
    backgroundColor: theme.colors.secondaryColor,
    marginHorizontal: 14,
  },
  bottomSheetContainer: {
    paddingHorizontal: 25,
    flex: 1,
  },
  deleteContainer: {
    margin: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 40,
  },
  button: {
    height: 50,
  },
  buttonView: {
    marginRight: 10,
  },
});
