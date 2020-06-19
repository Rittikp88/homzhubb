import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker';
import { findIndex } from 'lodash';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Text, Label, Divider, UploadBox, ImageThumbnail } from '@homzhub/common/src/components';
import {
  IVerificationTypes,
  IVerificationDocumentList,
  VerificationDocumentTypes,
} from '@homzhub/common/src/domain/models/Service';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';

interface IPropertyVerificationState {
  verificationTypes: IVerificationTypes[];
  existingDocuments: IVerificationDocumentList[];
}

interface IProps {
  navigateToPropertyHelper: () => void;
}

type Props = WithTranslation & IProps;

class PropertyVerification extends React.PureComponent<Props, IPropertyVerificationState> {
  public state = {
    verificationTypes: [],
    existingDocuments: [],
  };

  public componentDidMount = async (): Promise<void> => {
    // TODO: Get the proper ids from reducer to pass here
    await this.getVerificationTypes(1);
    await this.getExistingDocuments(10);
  };

  public render(): React.ReactElement {
    const { t } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.propertyVerification}>
          <Label type="large" textType="regular" style={styles.subTitle}>
            {t('subTitle')}
          </Label>
          <Text type="small" textType="semiBold" style={styles.link} onPress={this.navigateToHelper}>
            {t('helperNavigationText')}
          </Text>
          <Divider containerStyles={styles.divider} />
        </View>
        <View style={styles.proofContainer}>{this.renderVerificationTypes()}</View>
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
    const { existingDocuments } = this.state;
    const onPress = async (): Promise<void> => this.handleVerificationDocumentUploads(currentData);
    const thumbnailIndex = findIndex(existingDocuments, (document: IVerificationDocumentList) => {
      return document.document_type_id === currentData.id;
    });
    if (thumbnailIndex !== -1) {
      const currentDocument: IVerificationDocumentList = existingDocuments[thumbnailIndex];
      const thumbnailImage = currentDocument.document_url;
      const onDeleteImageThumbnail = (): Promise<void> => this.deleteDocument(currentDocument.document_id);
      return currentDocument.type === 'application/pdf' ? (
        <View style={styles.pdfContainer}>
          <Text type="small" textType="regular">
            {currentDocument.name}
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

  public uploadDocument = async (documentId: number): Promise<void> => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const source = { uri: response.uri, type: response.type, name: response.name };
      // TODO: Upload the file from here once the api call is set.
      // await this.postDocument()
      // TODO: To be removed once the api call is in place
      this.updateExistingDocument(documentId, source);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        AlertHelper.error({ message: err.message });
      } else {
        throw err;
      }
    }
  };

  public captureSelfie = (documentId: number): void => {
    const { t } = this.props;
    const options = {
      title: t('captureSelfie'),
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
      quality: 1,
    };
    // @ts-ignore
    ImagePicker.launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        AlertHelper.error({ message: 'User cancelled image picker' });
      } else if (response.error) {
        AlertHelper.error({ message: `ImagePicker Error: ${response.error}` });
      } else if (response.customButton) {
        AlertHelper.error({ message: `User tapped on custom button: ${response.customButton}` });
      } else {
        const source = {
          uri: `data:image/jpeg;base64,${response.data}`,
          type: response.type,
          name: response.fileName,
        };
        // TODO: Call the post document function from here
        // await this.postDocument(requestBody)
        // TODO: Remove this logic
        this.updateExistingDocument(documentId, source);
      }
    });
  };

  public handleVerificationDocumentUploads = async (data: IVerificationTypes): Promise<void> => {
    if (data.name === VerificationDocumentTypes.SELFIE_ID_PROOF) {
      this.captureSelfie(data.id);
    } else {
      await this.uploadDocument(data.id);
    }
  };

  public getVerificationTypes = async (categoryId: number): Promise<void> => {
    try {
      const response = await ServiceRepository.getVerificationDocumentTypes(categoryId);
      this.setState({
        verificationTypes: response,
      });
    } catch (error) {
      AlertHelper.error({ message: error.message });
    }
  };

  public getExistingDocuments = async (assetId: number): Promise<void> => {
    try {
      const response = await ServiceRepository.getExistingVerificationDocuments(assetId);
      this.setState({
        existingDocuments: response,
      });
    } catch (error) {
      AlertHelper.error({ message: error.message });
    }
  };

  // TODO: Add the type of document once the api is ready
  public postDocument = async (document: any): Promise<void> => {
    try {
      await ServiceRepository.postDocument(document);
      // TODO: Map the correct ID here
      await this.getExistingDocuments(10);
    } catch (error) {
      AlertHelper.error({ message: error.message });
    }
  };

  public deleteDocument = async (documentId: number): Promise<void> => {
    try {
      await ServiceRepository.deleteVerificationDocument(documentId);
      // TODO: Map the correct ID here
      await this.getExistingDocuments(10);
    } catch (error) {
      AlertHelper.error({ message: error.message });
    }
  };

  // TODO: This function needs to be removed once the post call is in place
  public updateExistingDocument = (
    documentId: number,
    source: { uri: string; type: string | undefined; name: string | undefined }
  ): void => {
    const imageObject: IVerificationDocumentList = {
      document_type_id: documentId,
      document_id: 2,
      document_url: source.uri,
      type: source.type,
      name: source.name,
    };
    const { existingDocuments } = this.state;
    this.setState({
      existingDocuments: [...existingDocuments, imageObject],
    });
  };

  public navigateToHelper = (): void => {
    const { navigateToPropertyHelper } = this.props;
    navigateToPropertyHelper();
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
    borderWidth: 1,
    borderColor: theme.colors.disabled,
  },
  pdfContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    padding: 15,
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
    // backgroundColor: theme.colors.crossIconContainer,
  },
});
