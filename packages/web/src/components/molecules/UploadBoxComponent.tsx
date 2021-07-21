import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import FileUpload from '@homzhub/common/src/components/atoms/FileUpload';
import { UploadBox } from '@homzhub/common/src/components/molecules/UploadBox';
import { IDocumentSource } from '@homzhub/common/src/services/AttachmentService/interfaces';

interface IProps {
  icon: string;
  header: string;
  subHeader: string;
  containerStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  subHeaderStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
  iconColor?: string;
  key?: number;
  onCapture: (DocumentSource: IDocumentSource[]) => void;
  onDelete: (uri: string) => void;
  displayThumbnail?: boolean;
  attachments: IDocumentSource[] | [];
  allowedTypes?: string[];
  children?: React.ReactElement | React.ReactNode;
}

const UploadBoxComponent = (props: IProps): React.ReactElement => {
  const { attachments, onDelete, onCapture, children, ...rest } = props;
  const { t } = useTranslation();

  const captureDocument = (files: File[]): void => {
    try {
      const documentSource: IDocumentSource[] = [];
      if (files.length) {
        files.forEach((item) => {
          const uri = URL.createObjectURL(item);

          documentSource.push({ type: item.type, name: item.name, uri, size: item.size, fileCopyUri: uri });
        });
      }
      onCapture(documentSource);
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  const onDropRejection = (): void => {
    AlertHelper.error({ message: t('unsupportedFormat') });
  };

  return (
    <>
      <UploadBox {...rest} webOnDropAccepted={captureDocument} webOnDropRejected={onDropRejection} />
      {children}
      <FileUpload attachments={attachments} onDelete={onDelete} />
    </>
  );
};

const memoised = React.memo(UploadBoxComponent);
export { memoised as UploadBoxComponent };
