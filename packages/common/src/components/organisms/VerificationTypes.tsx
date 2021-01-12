import React, { Component, ReactElement, ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { findIndex } from 'lodash';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { AllowedAttachmentFormats } from '@homzhub/common/src/services/AttachmentService';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import Selfie from '@homzhub/common/src/assets/images/selfie.svg';
import { theme } from '@homzhub/common/src/styles/theme';
import { ImageThumbnail } from '@homzhub/common/src/components/atoms/ImageThumbnail';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { UploadBox } from '@homzhub/common/src/components/molecules/UploadBox';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import {
  ExistingVerificationDocuments,
  VerificationDocumentCategory,
  VerificationDocumentTypes,
} from '@homzhub/common/src/domain/models/VerificationDocuments';
import { selfieInstruction } from '@homzhub/common/src/constants/AsssetVerification';

interface IProps {
  typeOfPlan: TypeOfPlan;
  existingDocuments: ExistingVerificationDocuments[];
  localDocuments: ExistingVerificationDocuments[];
  handleUpload: (verificationData: VerificationDocumentTypes) => void;
  deleteDocument: (document: ExistingVerificationDocuments, isLocalDocument: boolean | null) => Promise<void>;
}

interface IVerificationState {
  verificationTypes: VerificationDocumentTypes[];
}

export default class VerificationTypes extends Component<IProps, IVerificationState> {
  public state = {
    verificationTypes: [],
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getVerificationTypes();
  };

  public render(): ReactNode {
    const { verificationTypes } = this.state;
    return (
      <View style={styles.container}>
        {verificationTypes.map((verificationType: VerificationDocumentTypes, index: number) => {
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
        })}
      </View>
    );
  }

  private renderImageOrUploadBox = (currentData: VerificationDocumentTypes): ReactElement => {
    const { handleUpload, existingDocuments, localDocuments, deleteDocument } = this.props;
    const onPress = (): void => handleUpload(currentData);

    const totalDocuments = existingDocuments.concat(localDocuments);
    const thumbnailIndex = findIndex(totalDocuments, (document: ExistingVerificationDocuments) => {
      return currentData.id === document.verificationDocumentType.id;
    });

    if (thumbnailIndex !== -1) {
      const currentDocument: ExistingVerificationDocuments = totalDocuments[thumbnailIndex];
      const thumbnailImage = currentDocument.document.link;
      const fileType = currentDocument.document.link.split('/')?.pop()?.split('.');

      const onDeleteImageThumbnail = (): Promise<void> =>
        deleteDocument(currentDocument, currentDocument.isLocalDocument);

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
}

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
