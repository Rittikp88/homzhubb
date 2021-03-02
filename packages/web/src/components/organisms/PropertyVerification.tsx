import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { IDocsProps, ListingService } from '@homzhub/common/src/services/Property/ListingService';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import VerificationTypes from '@homzhub/common/src/components/organisms/VerificationTypes';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { AllowedAttachmentFormats } from '@homzhub/common/src/domain/models/Attachment';
import {
  ExistingVerificationDocuments,
  VerificationDocumentTypes,
  IExistingVerificationDocuments,
} from '@homzhub/common/src/domain/models/VerificationDocuments';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';

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
  onUploadDocument: () => any;
}

type Props = WithTranslation & IProps & IWithMediaQuery;

export class PropertyVerification extends React.PureComponent<Props, IPropertyVerificationState> {
  public state = {
    verificationTypes: [],
    existingDocuments: [],
    localDocuments: [],
    isLoading: false,
  };

  public componentDidMount = async (): Promise<void> => {
    const { propertyId } = this.props;
    await ListingService.getExistingDocuments(propertyId, this.updateState);
  };

  public render(): React.ReactElement {
    const { t, typeOfPlan, isTablet, isIpadPro } = this.props;
    const { existingDocuments, localDocuments, isLoading, verificationTypes } = this.state;
    const totalDocuments = existingDocuments.concat(localDocuments);

    const uploadedTypes = totalDocuments.map((doc: ExistingVerificationDocuments) => doc.verificationDocumentType.name);
    const containsAllReqd = uploadedTypes.length === verificationTypes.length;

    return (
      <>
        <View style={styles.container}>
          <VerificationTypes
            typeOfPlan={typeOfPlan}
            existingDocuments={existingDocuments}
            localDocuments={localDocuments}
            deleteDocument={this.onDeleteDocument}
            handleTypes={FunctionUtils.noop}
            handleUpload={this.onImageSelection}
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

        <Button
          type="primary"
          title={t('common:continue')}
          disabled={!containsAllReqd || isLoading}
          containerStyle={styles.buttonStyle}
          onPress={FunctionUtils.noop}
        />
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

  public onImageSelection = async (value: VerificationDocumentTypes, files?: File[]): Promise<void> => {
    if (!files) {
      return;
    }
    const verificationDocumentId = value.id;
    const image = files[0];

    const formData = new FormData();
    formData.append('files[]', image);

     const response = await AttachmentService.uploadImage(formData, AttachmentType.ASSET_VERIFICATION);
     const { data } = response;
    const source = { uri: data[0].link, type: image.type, name: image.name };
    if (Object.values(AllowedAttachmentFormats).includes(image.type)) {
      this.updateLocalDocuments(verificationDocumentId, source, value);
    } else {
      AlertHelper.error({ message: value.helpText });
    }
  };

  public updateLocalDocuments = (
    verificationDocumentId: number,
    source: { uri: string; type: string; name: string },
    value: VerificationDocumentTypes
  ): void => {
    const imageObject: IExistingVerificationDocuments = {
      id: null,
      verification_document_type: ObjectMapper.serialize(value),
      document: {
        id: value.id,
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

  // HANDLERS END
}

const translatedpPropertyVerification = withTranslation(LocaleConstants.namespacesKey.property)(PropertyVerification);

export default withMediaQuery<any>(translatedpPropertyVerification);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});
