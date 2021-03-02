import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { IDocsProps, ListingService } from '@homzhub/common/src/services/Property/ListingService';
import { AttachmentError } from '@homzhub/common/src/services/AttachmentService/AttachmentService.web';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import VerificationTypes from '@homzhub/common/src/components/organisms/VerificationTypes';
import CaptureSelfiePopover from '@homzhub/web/src/screens/addPropertyListing/CaptureSelfiePopover';
import NoCamera from '@homzhub/web/src/components/molecules/NoCamera';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { AllowedAttachmentFormats } from '@homzhub/common/src/domain/models/Attachment';
import {
  ExistingVerificationDocuments,
  IPostVerificationDocuments,
  VerificationDocumentTypes,
  IExistingVerificationDocuments,
  VerificationDocumentCategory,
} from '@homzhub/common/src/domain/models/VerificationDocuments';
import { IUpdateAssetParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';

interface IPropertyVerificationState {
  verificationTypes: VerificationDocumentTypes[];
  existingDocuments: ExistingVerificationDocuments[];
  localDocuments: ExistingVerificationDocuments[];
  isLoading: boolean;
  takeSelfie: boolean;
  selfie: string;
}

interface IProps {
  typeOfPlan: TypeOfPlan;
  updateStep: () => void;
  propertyId: number;
  lastVisitedStep: ILastVisitedStep;
  onUploadDocument: () => any;
  handleNextStep: () => void;
}

type Props = WithTranslation & IProps & IWithMediaQuery;

export class PropertyVerification extends React.PureComponent<Props, IPropertyVerificationState> {
  public state = {
    verificationTypes: [],
    existingDocuments: [],
    localDocuments: [],
    isLoading: false,
    takeSelfie: false,
    selfie: '',
  };

  public componentDidMount = async (): Promise<void> => {
    const { propertyId } = this.props;
    await ListingService.getExistingDocuments(propertyId, this.updateState);
  };

  public render(): React.ReactElement {
    const { t, typeOfPlan, isTablet, isIpadPro, isMobile } = this.props;
    const { existingDocuments, localDocuments, isLoading, verificationTypes, takeSelfie } = this.state;
    const totalDocuments = existingDocuments.concat(localDocuments);

    const uploadedTypes = totalDocuments.map((doc: ExistingVerificationDocuments) => doc.verificationDocumentType.name);
    const containsAllReqd = uploadedTypes.length === verificationTypes.length;

    return (
      <>
        {navigator.mediaDevices.getUserMedia && (
          <View style={styles.container}>
            <CaptureSelfiePopover onCaptureSelfie={this.onCaptureSelfie} takeSelfie={takeSelfie} />
            <VerificationTypes
              typeOfPlan={typeOfPlan}
              existingDocuments={existingDocuments}
              localDocuments={localDocuments}
              deleteDocument={this.onDeleteDocument}
              handleTypes={this.handleVerificationTypes}
              handleUpload={this.handleVerificationDocumentUploads}
            />
            {!isTablet && !isIpadPro && (
              <>
                <Divider containerStyles={styles.divider} />
                <View style={styles.contentView}>
                  <Label type="regular" textType="regular" style={styles.verificationSubtitle}>
                    {t('propertyVerificationSubTitle')}
                  </Label>
                  <Label type="large" textType="semiBold" style={styles.helperText}>
                    {t('helperNavigationText')}
                  </Label>
                </View>
              </>
            )}
          </View>
        )}
        {!navigator.mediaDevices.getUserMedia && (
          <View style={styles.container}>
            <NoCamera />
          </View>
        )}
        {navigator.mediaDevices.getUserMedia && (
          <Button
            type="primary"
            title={t('common:continue')}
            disabled={!containsAllReqd || isLoading}
            containerStyle={[styles.buttonStyle, !isMobile && styles.tabContainer]}
            onPress={this.postPropertyVerificationDocuments}
          />
        )}
        {!navigator.mediaDevices.getUserMedia && (
          <Button
            type="primary"
            title={t('common:continue')}
            containerStyle={[styles.buttonStyle, !isMobile && styles.tabContainer]}
            onPress={this.nextStep}
          />
        )}
      </>
    );
  }

  // HANDLERS START

  public onDeleteDocument = async (
    document: ExistingVerificationDocuments,
    isLocalDocument?: boolean
  ): Promise<void> => {
    const { localDocuments, existingDocuments } = this.state;
    const { propertyId } = this.props;
    await ListingService.deleteDocument(
      {
        document,
        localDocuments,
        existingDocuments,
        isLocalDocument,
        propertyId,
      },
      this.updateState
    );
  };

  public onCaptureSelfie = (data: string | null): void => {
    if (!data) {
      this.setState({ takeSelfie: false });
      return;
    }

    this.setState({ selfie: data, takeSelfie: false }, () => {
      const { verificationTypes } = this.state;
      this.onSelfieSelect(verificationTypes[1], data);
    });
  };

  public onSelfieSelect = (value: VerificationDocumentTypes, selfie: string): void => {
    const verificationDocumentId = value.id;
    const source = { uri: selfie, type: 'jpeg', name: 'image', id: verificationDocumentId };
    this.updateLocalDocuments(verificationDocumentId, source, value);
  };

  public onImageSelection = async (value: VerificationDocumentTypes, files?: File[]): Promise<void> => {
    if (!files) {
      return;
    }
    const verificationDocumentId = value.id;
    const image = files[0];
    const formData = new FormData();
    formData.append('files[]', image);

    const response = await AttachmentService.uploadImage(formData, AttachmentType.ASSET_IMAGE);
    const { data } = response;
    const source = { uri: data[0].link, type: image.type, name: image.name, id: data[0].id };
    if (Object.values(AllowedAttachmentFormats).includes(image.type)) {
      this.updateLocalDocuments(verificationDocumentId, source, value);
    } else {
      AlertHelper.error({ message: value.helpText });
    }
  };

  public handleVerificationDocumentUploads = async (
    value: VerificationDocumentTypes,
    files?: File[]
  ): Promise<void> => {
    const verificationDocumentType = value.name;

    if (verificationDocumentType === VerificationDocumentCategory.SELFIE_ID_PROOF) {
      this.setState({ takeSelfie: true });
    } else {
      await this.onImageSelection(value, files);
    }
  };

  public updateLocalDocuments = (
    verificationDocumentId: number,
    source: { uri: string; type: string; name: string; id: number },
    value: VerificationDocumentTypes
  ): void => {
    const imageObject: IExistingVerificationDocuments = {
      id: null,
      verification_document_type: ObjectMapper.serialize(value),
      document: {
        id: source.id,
        name: source.name,
        attachment_type: source.name,
        mime_type: source.name,
        link: source.uri,
      },
      is_local_document: true,
    };
    const { localDocuments } = this.state;
    this.setState({
      localDocuments: [...localDocuments, ObjectMapper.deserialize(ExistingVerificationDocuments, imageObject)],
    });
  };

  public handleVerificationTypes = (types: VerificationDocumentTypes[]): void => {
    this.setState({
      verificationTypes: types,
    });
  };

  public updateState = (data: IDocsProps): void => {
    const { existingDocuments, localDocuments, clonedDocuments, key } = data;
    this.setState((prevState) => ({
      ...prevState,
      ...(existingDocuments && { existingDocuments }),
      ...(localDocuments && { localDocuments }),
      ...(clonedDocuments && key && { [key]: clonedDocuments }),
    }));
  };

  public nextStep = (): void => {
    const { handleNextStep } = this.props;
    handleNextStep();
  };
  // HANDLERS END

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
      const postRequestBody: IPostVerificationDocuments[] = [];

      localDocuments.forEach((document: ExistingVerificationDocuments, index: number) => {
        postRequestBody.push({
          verification_document_type_id: document.verificationDocumentType.id,
          document_id: document.document.id,
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
      await ListingService.getExistingDocuments(propertyId, this.updateState);
      await AssetRepository.updateAsset(propertyId, updateAssetPayload);
      updateStep();
    } catch (e) {
      this.setState({ isLoading: false });
      if (e === AttachmentError.UPLOAD_IMAGE_ERROR) {
        AlertHelper.error({ message: t('common:fileCorrupt') });
      }
    }
  };
}

const translatedpPropertyVerification = withTranslation(LocaleConstants.namespacesKey.property)(PropertyVerification);

export default withMediaQuery<any>(translatedpPropertyVerification);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:"center",
    backgroundColor: theme.colors.white,
  },
  buttonStyle: {
    flex: 0,
    marginVertical: 20,
  },
  helperText: {
    color: theme.colors.primaryColor,
  },
  verificationSubtitle: {
    marginTop: 12,
    marginBottom: 8,
  },
  divider: {
    marginBottom: 10,
    marginTop: 50,
  },
  contentView: {
    backgroundColor: theme.colors.white,
    paddingRight: 16,
    marginTop: 50,
  },
  tabContainer: {
    width: 280,
    marginLeft: 'auto',
  },
});
