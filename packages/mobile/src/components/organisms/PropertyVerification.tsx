import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { cloneDeep, findIndex } from 'lodash';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import {
  AllowedAttachmentFormats,
  AttachmentError,
  AttachmentService,
  AttachmentType,
} from '@homzhub/common/src/services/AttachmentService';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import Selfie from '@homzhub/common/src/assets/images/selfie.svg';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { ImageThumbnail } from '@homzhub/common/src/components/atoms/ImageThumbnail';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { UploadBox } from '@homzhub/common/src/components/molecules/UploadBox';
import {
  ExistingVerificationDocuments,
  IExistingVerificationDocuments,
  IPostVerificationDocuments,
  VerificationDocumentCategory,
  VerificationDocumentTypes,
} from '@homzhub/common/src/domain/models/VerificationDocuments';
import { selfieInstruction } from '@homzhub/common/src/constants/AsssetVerification';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { IUpdateAssetParams } from '@homzhub/common/src/domain/repositories/interfaces';

interface IPropertyVerificationState {
  verificationTypes: VerificationDocumentTypes[];
  existingDocuments: ExistingVerificationDocuments[];
  localDocuments: ExistingVerificationDocuments[];
  isLoading: boolean;
}

interface IProps {
  typeOfPlan: TypeOfPlan;
  updateStep: () => void;
  propertyId: number;
  lastVisitedStep: ILastVisitedStep;
}

type Props = WithTranslation & IProps;

export class PropertyVerification extends React.PureComponent<Props, IPropertyVerificationState> {
  public state = {
    verificationTypes: [],
    existingDocuments: [],
    localDocuments: [],
    isLoading: false,
  };

  public componentDidMount = async (): Promise<void> => {
    const { propertyId } = this.props;
    await this.getVerificationTypes();
    await this.getExistingDocuments(propertyId);
  };

  public render(): React.ReactElement {
    const { t } = this.props;
    const { verificationTypes, existingDocuments, localDocuments, isLoading } = this.state;
    const totalDocuments = existingDocuments.concat(localDocuments);
    return (
      <>
        <View style={styles.container}>{this.renderVerificationTypes()}</View>
        <Button
          type="primary"
          title={t('common:continue')}
          disabled={totalDocuments.length < verificationTypes.length || isLoading}
          containerStyle={styles.buttonStyle}
          onPress={this.postPropertyVerificationDocuments}
        />
      </>
    );
  }

  public renderVerificationTypes = (): React.ReactNode => {
    const { verificationTypes } = this.state;
    return verificationTypes.map((verificationType: VerificationDocumentTypes, index: number) => {
      const data: VerificationDocumentTypes = verificationType;
      return (
        <View style={styles.proofChild} key={index}>
          <Text type="small" textType="semiBold" style={styles.title}>
            {data.title}
          </Text>
          {verificationType.name === VerificationDocumentCategory.SELFIE_ID_PROOF ? (
            <>
              <Selfie style={styles.selfie} />
              {selfieInstruction.map((instruction, i) => {
                return (
                  <Label type="regular" textType="regular" style={styles.instruction} key={i}>
                    {instruction}
                  </Label>
                );
              })}
            </>
          ) : (
            <>
              {data.description !== '' && (
                <Label type="regular" textType="regular" style={styles.subTitle}>
                  {data.description}
                </Label>
              )}
            </>
          )}
          {this.renderImageOrUploadBox(verificationType)}
        </View>
      );
    });
  };

  public renderImageOrUploadBox = (currentData: VerificationDocumentTypes): React.ReactElement => {
    const { existingDocuments, localDocuments } = this.state;

    const onPress = async (): Promise<void> => this.handleVerificationDocumentUploads(currentData);

    const totalDocuments = existingDocuments.concat(localDocuments);
    const thumbnailIndex = findIndex(totalDocuments, (document: ExistingVerificationDocuments) => {
      return currentData.id === document.verificationDocumentType.id;
    });

    if (thumbnailIndex !== -1) {
      const currentDocument: ExistingVerificationDocuments = totalDocuments[thumbnailIndex];
      const thumbnailImage = currentDocument.document.link;
      const fileType = currentDocument.document.link.split('/')?.pop()?.split('.');

      const onDeleteImageThumbnail = (): Promise<void> =>
        this.deleteDocument(currentDocument, currentDocument.isLocalDocument);

      const { mimeType } = currentDocument.document;

      return mimeType === AllowedAttachmentFormats.AppPdf || !fileType || fileType[1] === 'pdf' ? (
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
        subHeader={currentData.helpText}
        onPress={onPress}
        containerStyle={styles.uploadBox}
      />
    );
  };

  public uploadDocument = async (verificationDocumentId: number, data: VerificationDocumentTypes): Promise<void> => {
    const document = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });
    if (Object.values(AllowedAttachmentFormats).includes(document.type)) {
      const source = { uri: document.uri, type: document.type, name: document.name };
      this.updateLocalDocuments(verificationDocumentId, source, data);
    } else {
      AlertHelper.error({ message: data.helpText });
    }
  };

  public captureSelfie = (verificationDocumentId: number, data: VerificationDocumentTypes): void => {
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

  public handleVerificationDocumentUploads = async (data: VerificationDocumentTypes): Promise<void> => {
    const verificationDocumentId = data.id;
    const verificationDocumentType = data.name;
    if (verificationDocumentType === VerificationDocumentCategory.SELFIE_ID_PROOF) {
      this.captureSelfie(verificationDocumentId, data);
    } else {
      await this.uploadDocument(verificationDocumentId, data);
    }
  };

  public getVerificationTypes = async (): Promise<void> => {
    const { typeOfPlan } = this.props;
    try {
      const response: VerificationDocumentTypes[] = await AssetRepository.getVerificationDocumentTypes();
      const filteredResponse = response.filter((data: VerificationDocumentTypes) => {
        return data.category === typeOfPlan || data.category === 'IDENTITY';
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
      let existingDocuments: ExistingVerificationDocuments[] = [];
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
    const { propertyId, updateStep, t, lastVisitedStep, typeOfPlan } = this.props;
    const { localDocuments, existingDocuments } = this.state;

    const updateAssetPayload: IUpdateAssetParams = {
      last_visited_step: {
        ...lastVisitedStep,
        listing: {
          ...lastVisitedStep.listing,
          type: typeOfPlan,
          is_verification_done: true,
        },
      },
    };

    if (localDocuments.length === 0) {
      await AssetRepository.updateAsset(propertyId, updateAssetPayload);
      updateStep();
      return;
    }
    const formData = new FormData();
    localDocuments.forEach((document: ExistingVerificationDocuments) => {
      formData.append('files[]', {
        // @ts-ignore
        name: document.document.name,
        uri: document.document.link,
        // @ts-ignore
        type: document.document.mimeType,
      });
    });

    this.setState({ isLoading: true });

    try {
      const response = await AttachmentService.uploadImage(formData, AttachmentType.ASSET_VERIFICATION);

      const { data } = response;
      const postRequestBody: IPostVerificationDocuments[] = [];

      localDocuments.forEach((document: ExistingVerificationDocuments, index: number) => {
        postRequestBody.push({
          verification_document_type_id: document.verificationDocumentType.id,
          document_id: data[index].id,
        });
      });

      existingDocuments.forEach((document: ExistingVerificationDocuments) => {
        if (!document.id) {
          postRequestBody.push({
            verification_document_type_id: document.verificationDocumentType.id,
            document_id: document.document.id,
          });
        }
      });
      this.setState({ isLoading: false });

      await AssetRepository.postVerificationDocuments(propertyId, postRequestBody);
      await this.getExistingDocuments(propertyId);
      await AssetRepository.updateAsset(propertyId, updateAssetPayload);
      updateStep();
    } catch (e) {
      this.setState({ isLoading: false });
      if (e === AttachmentError.UPLOAD_IMAGE_ERROR) {
        AlertHelper.error({ message: t('common:fileCorrupt') });
      }
    }
  };

  public deleteDocument = async (
    document: ExistingVerificationDocuments,
    isLocalDocument: boolean | null
  ): Promise<void> => {
    const { existingDocuments, localDocuments, verificationTypes, isLoading } = this.state;
    const clonedDocuments = isLocalDocument ? cloneDeep(localDocuments) : cloneDeep(existingDocuments);
    if (!document.id) {
      const documentIndex = findIndex(clonedDocuments, (existingDocument: ExistingVerificationDocuments) => {
        return existingDocument.verificationDocumentType.id === document.verificationDocumentType.id;
      });
      if (documentIndex !== -1) {
        clonedDocuments.splice(documentIndex, 1);
        const key = isLocalDocument ? 'localDocuments' : 'existingDocuments';
        this.setState({
          existingDocuments,
          localDocuments,
          verificationTypes,
          [key]: clonedDocuments,
          isLoading,
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
    data: VerificationDocumentTypes
  ): void => {
    const imageObject: IExistingVerificationDocuments = {
      id: null,
      verification_document_type: ObjectMapper.serialize(data),
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
      localDocuments: [...localDocuments, ObjectMapper.deserialize(ExistingVerificationDocuments, imageObject)],
    });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.property)(PropertyVerification);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 4,
    backgroundColor: theme.colors.white,
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
  pdfContainer: {
    flex: 0,
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    padding: 16,
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
  buttonStyle: {
    flex: 0,
    marginVertical: 20,
  },
  pdfName: {
    flex: 0.9,
  },
  instruction: {
    color: theme.colors.darkTint3,
    marginBottom: 6,
  },
  selfie: {
    alignSelf: 'center',
    marginVertical: 12,
  },
});
