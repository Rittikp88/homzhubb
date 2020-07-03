import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { findIndex, cloneDeep } from 'lodash';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { IUser } from '@homzhub/common/src/domain/models/User';
import {
  IVerificationTypes,
  IVerificationDocumentList,
  VerificationDocumentTypes,
  IPostVerificationDocuments,
} from '@homzhub/common/src/domain/models/Service';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { MarkdownType } from '@homzhub/mobile/src/navigation/interfaces';
import {
  Text,
  Label,
  Divider,
  UploadBox,
  ImageThumbnail,
  Button,
  WithShadowView,
} from '@homzhub/common/src/components';

interface IPropertyVerificationState {
  verificationTypes: IVerificationTypes[];
  existingDocuments: IVerificationDocumentList[];
  localDocuments: IVerificationDocumentList[];
}

interface IProps {
  navigateToPropertyHelper: (markdownKey: MarkdownType) => void;
  typeOfFlow: string;
  updateStep: () => void;
  propertyId: number;
}

type Props = WithTranslation & IProps;

class PropertyVerification extends React.PureComponent<Props, IPropertyVerificationState> {
  public state = {
    verificationTypes: [],
    existingDocuments: [],
    localDocuments: [],
  };

  public componentDidMount = async (): Promise<void> => {
    const { propertyId } = this.props;
    await this.getVerificationTypes();
    await this.getExistingDocuments(propertyId);
  };

  public render(): React.ReactElement {
    const { t } = this.props;
    const { verificationTypes, existingDocuments, localDocuments } = this.state;
    const totalDocuments = existingDocuments.concat(localDocuments);
    return (
      <View style={styles.container}>
        <View style={styles.propertyVerification}>
          <Label type="large" textType="regular" style={styles.subTitle}>
            {t('propertyVerificationSubTitle')}
          </Label>
          <Text type="small" textType="semiBold" style={styles.link} onPress={this.navigateToHelper}>
            {t('helperNavigationText')}
          </Text>
          <Divider containerStyles={styles.divider} />
        </View>
        <View style={styles.proofContainer}>{this.renderVerificationTypes()}</View>
        <WithShadowView outerViewStyle={styles.shadowView}>
          <Button
            type="primary"
            title={t('common:saveAndContinue')}
            disabled={totalDocuments.length < verificationTypes.length}
            containerStyle={styles.buttonStyle}
            onPress={this.postPropertyVerificationDocuments}
          />
        </WithShadowView>
      </View>
    );
  }

  public renderVerificationTypes = (): React.ReactNode => {
    const { verificationTypes } = this.state;
    return verificationTypes.map((verificationType: IVerificationTypes, index: number) => {
      const data: IVerificationTypes = verificationType;
      return (
        <View style={styles.proofChild} key={index}>
          <Text type="small" textType="semiBold" style={styles.title}>
            {data.title}
          </Text>
          {data.description !== '' && (
            <Label type="regular" textType="regular" style={styles.subTitle}>
              {data.description}
            </Label>
          )}
          {this.renderImageOrUploadBox(verificationType)}
        </View>
      );
    });
  };

  public renderImageOrUploadBox = (currentData: IVerificationTypes): React.ReactElement => {
    const { existingDocuments, localDocuments } = this.state;
    const onPress = async (): Promise<void> => this.handleVerificationDocumentUploads(currentData);
    const totalDocuments = existingDocuments.concat(localDocuments);
    const thumbnailIndex = findIndex(totalDocuments, (document: IVerificationDocumentList) => {
      return currentData.id === document.verification_document_type.id;
    });
    if (thumbnailIndex !== -1) {
      const currentDocument: IVerificationDocumentList = totalDocuments[thumbnailIndex];
      const thumbnailImage = currentDocument.document.link;
      const fileType = currentDocument.document.link.split('/')?.pop()?.split('.');
      const onDeleteImageThumbnail = (): Promise<void> =>
        this.deleteDocument(currentDocument, currentDocument.is_local_document);
      return currentDocument.document.mime_type === 'application/pdf' || !fileType || fileType[1] === 'pdf' ? (
        <View style={styles.pdfContainer}>
          <Text type="small" textType="regular" style={styles.pdfName}>
            {currentDocument.document.name || fileType || [0]}
          </Text>
          <TouchableOpacity style={styles.iconContainer} onPress={onDeleteImageThumbnail}>
            <Icon name={icons.close} size={22} color={theme.colors.shadow} />
          </TouchableOpacity>
        </View>
      ) : (
        <ImageThumbnail imageUrl={thumbnailImage} onIconPress={onDeleteImageThumbnail} />
      );
    }
    return (
      <UploadBox
        icon={currentData.icon}
        header={currentData.label}
        subHeader={currentData.help_text}
        onPress={onPress}
        containerStyle={styles.uploadBox}
      />
    );
  };

  public uploadDocument = async (verificationDocumentId: number, data: IVerificationTypes): Promise<void> => {
    const response = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });
    const source = { uri: response.uri, type: response.type, name: response.name };
    this.updateLocalDocuments(verificationDocumentId, source, data);
  };

  public captureSelfie = (verificationDocumentId: number, data: IVerificationTypes): void => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 400,
      compressImageMaxHeight: 400,
      compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
      useFrontCamera: true,
    }).then((image: any) => {
      const source = {
        uri: image.path,
        type: image.mime,
        name: PlatformUtils.isIOS() ? image.filename : image.path.substring(image.path.lastIndexOf('/') + 1),
      };
      this.updateLocalDocuments(verificationDocumentId, source, data);
    });
  };

  public handleVerificationDocumentUploads = async (data: IVerificationTypes): Promise<void> => {
    const verificationDocumentId = data.id;
    const verificationDocumentType = data.name;
    if (verificationDocumentType === VerificationDocumentTypes.SELFIE_ID_PROOF) {
      this.captureSelfie(verificationDocumentId, data);
    } else {
      await this.uploadDocument(verificationDocumentId, data);
    }
  };

  public getVerificationTypes = async (): Promise<void> => {
    const { typeOfFlow } = this.props;
    try {
      const response = await AssetRepository.getVerificationDocumentTypes();
      const filteredResponse = response.filter((data: IVerificationTypes) => {
        return data.category === typeOfFlow || data.category === 'IDENTITY';
      });
      this.setState({
        verificationTypes: filteredResponse,
      });
    } catch (error) {
      AlertHelper.error({ message: error.message });
    }
  };

  public getExistingDocuments = async (propertyId: number): Promise<void> => {
    try {
      let existingDocuments = [];
      existingDocuments = await AssetRepository.getExistingVerificationDocuments(propertyId);
      if (existingDocuments.length === 0) {
        existingDocuments = await AssetRepository.getAssetIdentityDocuments();
      }
      this.setState({
        existingDocuments,
      });
    } catch (error) {
      AlertHelper.error({ message: error.message });
    }
  };

  public postPropertyVerificationDocuments = async (): Promise<void> => {
    const { propertyId, updateStep } = this.props;
    const { localDocuments, existingDocuments } = this.state;
    if (localDocuments.length === 0) {
      updateStep();
      return;
    }
    const formData = new FormData();
    localDocuments.forEach((document: IVerificationDocumentList) => {
      formData.append('files[]', {
        // @ts-ignore
        name: document.document.name,
        uri: document.document.link,
        // @ts-ignore
        type: document.document.mime_type,
      });
    });
    const baseUrl = ConfigHelper.getBaseUrl();
    const user: IUser | null = await StorageService.get(StorageKeys.USER);
    fetch(`${baseUrl}attachments/upload/`, {
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data',
        // @ts-ignore
        Authorization: `Bearer ${user.access_token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        const { data } = responseJson;
        const postRequestBody: IPostVerificationDocuments[] = [];
        localDocuments.forEach((document: IVerificationDocumentList, index: number) => {
          postRequestBody.push({
            verification_document_type_id: document.verification_document_type.id,
            document_id: data[index].id,
          });
        });
        existingDocuments.forEach((document: IVerificationDocumentList) => {
          if (!document.id) {
            postRequestBody.push({
              verification_document_type_id: document.verification_document_type.id,
              document_id: document.document.id,
            });
          }
        });
        await AssetRepository.postVerificationDocuments(propertyId, postRequestBody);
        await this.getExistingDocuments(propertyId);
        updateStep();
      });
  };

  public deleteDocument = async (
    document: IVerificationDocumentList,
    isLocalDocument: boolean | undefined
  ): Promise<void> => {
    const { existingDocuments, localDocuments, verificationTypes } = this.state;
    const clonedDocuments = isLocalDocument ? cloneDeep(localDocuments) : cloneDeep(existingDocuments);
    if (!document.id) {
      const documentIndex = findIndex(clonedDocuments, (existingDocument: IVerificationDocumentList) => {
        return existingDocument.verification_document_type.id === document.verification_document_type.id;
      });
      if (documentIndex !== -1) {
        clonedDocuments.splice(documentIndex, 1);
        const key = isLocalDocument ? 'localDocuments' : 'existingDocuments';
        this.setState({
          existingDocuments,
          localDocuments,
          verificationTypes,
          [key]: clonedDocuments,
        });
      }
    } else {
      const { propertyId } = this.props;
      try {
        await AssetRepository.deleteVerificationDocument(propertyId, document.id);
        await this.getExistingDocuments(propertyId);
      } catch (error) {
        AlertHelper.error({ message: error.message });
      }
    }
  };

  public updateLocalDocuments = (
    verificationDocumentId: number,
    source: { uri: string; type: string; name: string },
    data: IVerificationTypes
  ): void => {
    const imageObject: IVerificationDocumentList = {
      id: null,
      verification_document_type: data,
      document: {
        id: data.id,
        name: source.name,
        attachment_type: source.type,
        mime_type: source.type,
        link: source.uri,
      },
      is_local_document: true,
    };
    const { localDocuments } = this.state;
    this.setState({
      localDocuments: [...localDocuments, imageObject],
    });
  };

  public navigateToHelper = (): void => {
    const { navigateToPropertyHelper } = this.props;
    navigateToPropertyHelper('verification');
  };
}

export default withTranslation(LocaleConstants.namespacesKey.property)(PropertyVerification);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  propertyVerification: {
    flex: 1,
    justifyContent: 'space-between',
  },
  link: {
    marginVertical: 10,
    color: theme.colors.primaryColor,
  },
  proofContainer: {
    flex: 1,
  },
  proofChild: {
    marginBottom: 10,
    marginTop: 20,
  },
  uploadBox: {
    marginTop: 20,
  },
  title: {
    color: theme.colors.darkTint4,
  },
  subTitle: {
    color: theme.colors.darkTint3,
    marginVertical: 10,
  },
  divider: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.disabled,
  },
  pdfContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    padding: 20,
    borderColor: theme.colors.primaryColor,
    borderWidth: 1,
    borderStyle: 'solid',
    marginTop: 10,
    borderRadius: 4,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 13,
    right: 10,
    bottom: 0,
  },
  shadowView: {
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
  pdfName: {
    flex: 0.9,
  },
});
