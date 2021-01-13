import React, { ReactElement } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { AllowedAttachmentFormats } from '@homzhub/common/src/services/AttachmentService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { ImageThumbnail } from '@homzhub/common/src/components/atoms/ImageThumbnail';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { UploadBox } from '@homzhub/common/src/components/molecules/UploadBox';

export interface IDocumentSource {
  uri: string;
  type: string;
  name: string;
  key?: number;
}

interface IState {
  documentSource: IDocumentSource;
}

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
  isClear?: boolean;
  onCapture: (DocumentSource: IDocumentSource) => void;
  onDelete: (key?: number) => void;
  displayThumbnail?: boolean;
}

export class UploadBoxComponent extends React.PureComponent<IProps, IState> {
  public state = {
    documentSource: {
      uri: '',
      type: '',
      name: '',
    },
  };

  public componentDidUpdate = (prevProps: Readonly<IProps>): void => {
    const { isClear } = this.props;
    if (prevProps.isClear !== isClear && isClear) {
      this.deleteDocument();
    }
  };

  public render(): ReactElement {
    const { displayThumbnail = true, ...rest } = this.props;
    const {
      documentSource: { uri, name, type },
    } = this.state;

    if (displayThumbnail && uri) {
      if (type === AllowedAttachmentFormats.AppPdf) {
        return (
          <View style={[styles.pdfStyles, styles.marginStyle]}>
            <Text type="small" textType="regular" style={styles.pdfDisplayText}>
              {name}
            </Text>
            <Icon
              style={styles.iconStyles}
              name={icons.close}
              size={22}
              color={theme.colors.shadow}
              onPress={this.deleteDocument}
            />
          </View>
        );
      }
      return <ImageThumbnail containerStyle={styles.marginStyle} imageUrl={uri} onIconPress={this.deleteDocument} />;
    }

    return <UploadBox {...rest} onPress={this.captureDocument} />;
  }

  public captureDocument = async (): Promise<void> => {
    const { onCapture, key } = this.props;
    try {
      const document = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      /* Check if the uploaded document is one of the allowed type */
      if (Object.values(AllowedAttachmentFormats).includes(document.type)) {
        const documentSource = { uri: document.uri, type: document.type, name: document.name, ...(key && { key }) };
        onCapture(documentSource);

        this.setState({ documentSource });
      } else {
        AlertHelper.error({ message: 'Unsupported format' });
      }
    } catch (e) {
      AlertHelper.error({ message: 'Please try again.' });
    }
  };

  private deleteDocument = (): void => {
    const { onDelete, key } = this.props;

    this.setState(
      {
        documentSource: {
          uri: '',
          type: '',
          name: '',
        },
      },
      () => {
        onDelete(key);
      }
    );
  };
}

const styles = StyleSheet.create({
  pdfStyles: {
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
  iconStyles: {
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
  marginStyle: {
    marginBottom: 24,
  },
  pdfDisplayText: {
    flex: 0.9,
  },
});
