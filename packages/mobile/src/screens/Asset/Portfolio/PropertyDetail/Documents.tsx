import React, { PureComponent } from 'react';
import { FlatList, Share, StyleSheet, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { ICreateDocumentPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import {
  AllowedAttachmentFormats,
  AttachmentService,
  AttachmentType,
} from '@homzhub/common/src/services/AttachmentService';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';
import { IGetDocumentPayload } from '@homzhub/common/src/modules/asset/interfaces';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider, EmptyState, UploadBox } from '@homzhub/common/src/components';
import { DocumentCard, Loader, SearchBar } from '@homzhub/mobile/src/components';
import { IDocumentSource } from '@homzhub/mobile/src/components/molecules/UploadBoxComponent';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { UserProfile } from '@homzhub/common/src/domain/models/UserProfile';

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
}

type Props = IStateProps & IDispatchProps;

export class Documents extends PureComponent<Props, IDocumentState> {
  public state = {
    searchValue: '',
    documents: [],
    isLoading: false,
  };

  private search = debounce(() => {
    const { searchValue, documents } = this.state;
    const results: AssetDocument[] = [];
    documents.forEach((item: AssetDocument) => {
      const name = item.attachment.fileName.toLowerCase();
      if (name.includes(searchValue.toLowerCase())) {
        results.push(item);
      }
    });
    this.setState({ documents: results, isLoading: false });
  }, 1000);

  public componentDidMount(): void {
    this.getDocuments();
  }

  public render(): React.ReactNode {
    const { searchValue, isLoading } = this.state;
    return (
      <View style={styles.container}>
        <UploadBox
          icon={icons.document}
          header="Upload Document"
          subHeader="Supports: JPG, JPEG, PNG, PDF "
          containerStyle={styles.uploadBox}
          onPress={this.onCapture}
        />
        <SearchBar
          placeholder="Search by document name"
          value={searchValue}
          updateValue={this.onSearch}
          containerStyle={styles.searchBar}
          testID="searchBar"
        />
        {this.renderDocumentList()}
        <Loader visible={isLoading} />
      </View>
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
    try {
      const document = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      /* Check if the uploaded document is one of the allowed type */
      if (Object.values(AllowedAttachmentFormats).includes(document.type)) {
        const documentSource = { uri: document.uri, type: document.type, name: document.name };
        await this.uploadDocument(documentSource);
      } else {
        AlertHelper.error({ message: 'Unsupported format' });
      }
    } catch (e) {
      AlertHelper.error({ message: 'Please try again.' });
    }
  };

  private onShare = async (link: string): Promise<void> => {
    // TODO: (Shikha) - Replace message
    try {
      await Share.share({
        message: `Hey, I would like to share this document ${link}`,
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
    if (!assetData) {
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
    const { getAssetDocument, currentAssetId } = this.props;
    this.setState({ isLoading: true });
    getAssetDocument({ assetId: currentAssetId, onCallback: this.getDocumentCallback });
  };

  private getDocumentCallback = (): void => {
    const { documents } = this.props;
    this.setState({ documents, isLoading: false });
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

export default connect(mapStateToProps, mapDispatchToProps)(Documents);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
