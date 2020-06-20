import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { findIndex, cloneDeep } from 'lodash';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import {
  Text,
  Label,
  Divider,
  UploadBox,
  ImageThumbnail,
  Button,
  WithShadowView,
} from '@homzhub/common/src/components';
import {
  IVerificationTypes,
  IVerificationDocumentList,
  VerificationDocumentTypes,
} from '@homzhub/common/src/domain/models/Service';
import { MarkdownType } from '@homzhub/mobile/src/navigation/interfaces';

interface IPropertyVerificationState {
  verificationTypes: IVerificationTypes[];
  existingDocuments: IVerificationDocumentList[];
  localDocuments: IVerificationDocumentList[];
}

interface IProps {
  navigateToPropertyHelper: (markdownKey: MarkdownType) => void;
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
    // TODO: Get the proper ids from reducer to pass here
    const { propertyId } = this.props;
    await this.getVerificationTypes(1);
    await this.getExistingDocuments(propertyId);
  };

  public render(): React.ReactElement {
    const { t } = this.props;
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
            title={t('common:continue')}
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
      return currentData.id === document.verification_document_type_id;
    });
    if (thumbnailIndex !== -1) {
      const currentDocument: IVerificationDocumentList = totalDocuments[thumbnailIndex];
      const thumbnailImage = currentDocument.document_link;
      const fileType = currentDocument.document_link.split('/')?.pop()?.split('.')[1];
      const onDeleteImageThumbnail = (): Promise<void> =>
        this.deleteDocument(currentDocument, currentDocument.is_local_document);
      return currentDocument.type === 'application/pdf' || fileType === 'pdf' ? (
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

  public uploadDocument = async (documentId: number, verificationDocumentId: number): Promise<void> => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const source = { uri: response.uri, type: response.type, name: response.name };
      this.updateLocalDocuments(documentId, source, verificationDocumentId);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        AlertHelper.error({ message: err.message });
      } else {
        throw err;
      }
    }
  };

  public captureSelfie = (documentId: number, verificationDocumentId: number): void => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      includeBase64: true,
      useFrontCamera: true,
    }).then((image: any) => {
      const source = {
        uri: `data:${image.mime};base64,${image.data}`,
        type: image.mime,
        name: image.fileName,
      };
      this.updateLocalDocuments(documentId, source, verificationDocumentId);
    });
  };

  public handleVerificationDocumentUploads = async (data: IVerificationTypes): Promise<void> => {
    if (data.name === VerificationDocumentTypes.SELFIE_ID_PROOF) {
      this.captureSelfie(data.id, 2);
    } else {
      const verificationDocumentId = data.name === VerificationDocumentTypes.ID_PROOF ? 1 : 3;
      await this.uploadDocument(data.id, verificationDocumentId);
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

  public getExistingDocuments = async (propertyId: number): Promise<void> => {
    try {
      const response = await ServiceRepository.getExistingVerificationDocuments(propertyId);
      this.setState({
        existingDocuments: response,
      });
    } catch (error) {
      AlertHelper.error({ message: error.message });
    }
  };

  public postPropertyVerificationDocuments = async (): Promise<void> => {
    const { propertyId, updateStep } = this.props;
    // First- Upload all the local documents to s3 using attachment upload api,
    // get the id back and update the local references of id in these objects
    // then make a payload with new id and verification type id and make a post call and update the step
    // Promise.all([promise1, promise2, promise3]).then(function(values) {
    //   console.log(values);
    // });
    // try {
    //   await ServiceRepository.postDocument(document);
    await this.getExistingDocuments(propertyId);
    // } catch (error) {
    //   AlertHelper.error({ message: error.message });
    // }
    updateStep();
  };

  public deleteDocument = async (
    document: IVerificationDocumentList,
    isLocalDocument: boolean | undefined
  ): Promise<void> => {
    const { existingDocuments, localDocuments, verificationTypes } = this.state;
    const clonedDocuments = isLocalDocument ? cloneDeep(localDocuments) : cloneDeep(existingDocuments);
    if (!document.id) {
      const documentIndex = findIndex(clonedDocuments, (existingDocument: IVerificationDocumentList) => {
        return existingDocument.verification_document_type_id === document.verification_document_type_id;
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
        await ServiceRepository.deleteVerificationDocument(propertyId, document.id);
        await this.getExistingDocuments(propertyId);
      } catch (error) {
        AlertHelper.error({ message: error.message });
      }
    }
  };

  public updateLocalDocuments = (
    documentId: number,
    source: { uri: string; type: string | undefined; name: string | undefined },
    verificationDocumentId: number
  ): void => {
    const imageObject: IVerificationDocumentList = {
      verification_document_type_id: verificationDocumentId,
      document_id: documentId,
      document_link: source.uri,
      type: source.type,
      name: source.name,
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
  shadowView: {
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
});
