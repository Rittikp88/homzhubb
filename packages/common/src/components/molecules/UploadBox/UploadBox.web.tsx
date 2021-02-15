import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { FileRejection, useDropzone } from 'react-dropzone';
import { UploadBtn } from '@homzhub/common/src/components/molecules/UploadBox/UploadBtn';

interface IUploadProps {
  icon: string;
  header: string;
  subHeader: string;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  subHeaderStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
  iconColor?: string;
  webOnDropAccepted?: (files: File[]) => void;
  webOnDropRejected?: (fileRejections: FileRejection[]) => void;
}

export const UploadBox: React.FC<IUploadProps> = (props: IUploadProps) => {
  const { webOnDropAccepted, webOnDropRejected } = props;
  const { getRootProps, getInputProps } = useDropzone({
    accept: '.jpg,.jpeg,.png,.pdf',
    onDropAccepted: webOnDropAccepted,
    onDropRejected: webOnDropRejected,
  });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <UploadBtn {...props} />
    </div>
  );
};
