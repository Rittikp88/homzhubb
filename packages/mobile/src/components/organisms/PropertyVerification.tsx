import React from 'react';
import { StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { cloneDeep, findIndex } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import {
  AllowedAttachmentFormats,
  AttachmentError,
  AttachmentService,
  AttachmentType,
} from '@homzhub/common/src/services/AttachmentService';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import VerificationTypes from '@homzhub/common/src/components/organisms/VerificationTypes';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import {
  ExistingVerificationDocuments,
  IExistingVerificationDocuments,
  IPostVerificationDocuments,
  VerificationDocumentCategory,
  VerificationDocumentTypes,
} from '@homzhub/common/src/domain/models/VerificationDocuments';
import { IUpdateAssetParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

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
    await this.getExistingDocuments(propertyId);
  };

  public render(): React.ReactElement {
    const { t, typeOfPlan } = this.props;
    const { existingDocuments, localDocuments, isLoading, verificationTypes } = this.state;
    const totalDocuments = existingDocuments.concat(localDocuments);

    // TODO (21-12-2020): Remove this temp hack once camera module is refactored
    const uploadedTypes = totalDocuments.map((doc: ExistingVerificationDocuments) => doc.verificationDocumentType.name);
    const containsAllReqd =
      verificationTypes.length > 3
        ? uploadedTypes.includes(VerificationDocumentCategory.ID_PROOF) &&
          uploadedTypes.includes(VerificationDocumentCategory.OCCUPANCY_CERTIFICATE) &&
          uploadedTypes.includes(VerificationDocumentCategory.PROPERTY_TAX)
        : uploadedTypes.includes(VerificationDocumentCategory.ID_PROOF) &&
          uploadedTypes.includes(VerificationDocumentCategory.OWNERSHIP_VERIFICATION_DOCUMENT);

    return (
      <>
        <VerificationTypes
          typeOfPlan={typeOfPlan}
          existingDocuments={existingDocuments}
          localDocuments={localDocuments}
          handleUpload={this.handleVerificationDocumentUploads}
          deleteDocument={this.deleteDocument}
        />
        <Button
          type="primary"
          title={t('common:continue')}
          disabled={!containsAllReqd || isLoading}
          containerStyle={styles.buttonStyle}
          onPress={this.postPropertyVerificationDocuments}
        />
      </>
    );
  }

  // HANDLERS START

  public handleVerificationDocumentUploads = async (data: VerificationDocumentTypes): Promise<void> => {
    const verificationDocumentId = data.id;
    const verificationDocumentType = data.name;
    if (verificationDocumentType === VerificationDocumentCategory.SELFIE_ID_PROOF) {
      this.captureSelfie(verificationDocumentId, data);
    } else {
      await this.uploadDocument(verificationDocumentId, data);
    }
  };

  public captureSelfie = (verificationDocumentId: number, data: VerificationDocumentTypes): void => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      compressImageMaxWidth: 400,
      compressImageMaxHeight: 400,
      compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
      useFrontCamera: true,
      cropping: true,
    }).then((image: any) => {
      const source = {
        uri: image.path,
        type: image.mime,
        name: PlatformUtils.isIOS()
          ? image.filename ?? image.path.substring(image.path.lastIndexOf('/') + 1)
          : image.path.substring(image.path.lastIndexOf('/') + 1),
      };
      this.updateLocalDocuments(verificationDocumentId, source, data);
    });
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

  // HANDLERS END

  // API'S START

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

  // API'S END
}

export default withTranslation(LocaleConstants.namespacesKey.property)(PropertyVerification);

const styles = StyleSheet.create({
  buttonStyle: {
    flex: 0,
    marginVertical: 20,
  },
});
