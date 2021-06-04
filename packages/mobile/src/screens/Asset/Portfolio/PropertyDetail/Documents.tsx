import React, { PureComponent } from 'react';
import { FlatList, Share, StyleSheet, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { ICreateDocumentPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';
import { IGetDocumentPayload } from '@homzhub/common/src/modules/asset/interfaces';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { SearchBar } from '@homzhub/common/src/components/molecules/SearchBar';
import { UploadBox } from '@homzhub/common/src/components/molecules/UploadBox';
import { DocumentCard } from '@homzhub/mobile/src/components';
import { IDocumentSource } from '@homzhub/mobile/src/components/molecules/UploadBoxComponent';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AllowedAttachmentFormats } from '@homzhub/common/src/domain/models/Attachment';
import { UserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

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
        renderItem={this.renderDocumentCard}
        ItemSeparatorComponent={this.renderSeparatorComponent}
        keyExtractor={this.renderKeyExtractor}
        showsVerticalScrollIndicator={false}
        testID="documentList"
      />
    );
  };

  private renderDocumentCard = ({ item }: { item: AssetDocument }): React.ReactElement => {
    const { user } = this.props;
    return (
      <DocumentCard
        document={item}
        handleShare={this.onShare}
        handleDelete={this.onDeleteDocument}
        handleDownload={this.onDownloadDocument}
        userEmail={user?.email ?? ''}
        testID="documentCard"
      />
    );
  };

  private renderSeparatorComponent = (): React.ReactElement => {
    return <Divider containerStyles={styles.divider} />;
  };

  private renderKeyExtractor = (item: AssetDocument, index: number): string => {
    return `${item.id}-${index}`;
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

  private onCapture = async (): Promise<void> => {
    const { t } = this.props;
    try {
      const document = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

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

  private onShare = async (link: string): Promise<void> => {
    const { t } = this.props;
    try {
      await Share.share({
        message: `${t('assetMore:shareDoc')} ${link}`,
      });
    } catch (error) {
      AlertHelper.error({ message: error });
    }
  };

  private onDownloadDocument = async (key: string, fileName: string): Promise<void> => {
    await AttachmentService.downloadAttachment(key, fileName);
  };

  private onDeleteDocument = async (id: number): Promise<void> => {
    const { currentAssetId } = this.props;
    try {
      await AssetRepository.deleteAssetDocument(currentAssetId, id);
      this.getDocuments();
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e);
      AlertHelper.error({ message: error });
    }
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
    marginTop: 16,
    borderColor: theme.colors.darkTint10,
  },
});
