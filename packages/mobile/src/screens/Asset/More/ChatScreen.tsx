import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity } from 'react-native';
import ImagePicker, { Image as ImagePickerResponse } from 'react-native-image-crop-picker';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { MessageRepository } from '@homzhub/common/src/domain/repositories/MessageRepository';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { IApiClientError } from '@homzhub/common/src/network/ApiClientError';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import ChatInputBox from '@homzhub/common/src/components/molecules/ChatInputBox';
import DropdownModal, { IMenu } from '@homzhub/mobile/src/components/molecules/DropdownModal';
import MessagePreview from '@homzhub/common/src/components/organisms/MessagePreview';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { IGetMessageParam, IMessagePayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IChatPayload } from '@homzhub/common/src/modules/common/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IAttachmentResponse } from '@homzhub/common/src/services/AttachmentService/interfaces';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';

enum MenuItems {
  VIEW_INFO = 'VIEW_INFO',
}

interface IDispatchProps {
  getMessages: (param: IGetMessageParam) => void;
  setAttachment: (payload: string) => void;
  clearMessages: () => void;
  clearAttachment: () => void;
  clearChatDetail: () => void;
}

interface IStateProps {
  currentChat: IChatPayload | null;
}

interface IScreenState {
  isScrollToBottom: boolean;
  isMenuVisible: boolean;
  attachment: ImagePickerResponse;
}

type libraryProps = WithTranslation & NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.ChatScreen>;
type Props = libraryProps & IDispatchProps & IStateProps;

class ChatScreen extends Component<Props, IScreenState> {
  public state = {
    isScrollToBottom: true,
    isMenuVisible: false,
    attachment: {} as ImagePickerResponse,
  };

  public render(): React.ReactNode {
    const { t, currentChat } = this.props;
    const { isScrollToBottom, isMenuVisible } = this.state;
    const menuItems = this.getMenuItems();

    return (
      <>
        <UserScreen
          title={t('assetMore:more')}
          pageTitle={currentChat?.groupName ?? ''}
          onBackPress={this.onGoBack}
          scrollEnabled={false}
          rightNode={this.renderRightNode()}
        >
          <MessagePreview isScrollToBottom={isScrollToBottom} shouldScrollToBottom={this.updateScroll} />
        </UserScreen>
        <DropdownModal isVisible={isMenuVisible} data={menuItems} onSelect={this.onSelectMenuItem} />
        {this.renderInputView()}
      </>
    );
  }

  private renderInputView = (): React.ReactElement => {
    return (
      <KeyboardAvoidingView behavior="padding">
        <ChatInputBox
          containerStyle={styles.inputBox}
          onInputFocus={this.onInputFocus}
          onSubmit={this.onSendMessage}
          onUploadImage={this.onUploadAttachment}
        />
      </KeyboardAvoidingView>
    );
  };

  private renderRightNode = (): React.ReactElement => {
    return (
      <TouchableOpacity onPress={this.handleMenu}>
        <Icon name={icons.verticalDots} size={16} />
      </TouchableOpacity>
    );
  };

  private onGoBack = (): void => {
    const { navigation, clearMessages, clearAttachment, clearChatDetail } = this.props;
    navigation.goBack();
    clearMessages();
    clearAttachment();
    clearChatDetail();
  };

  private onInputFocus = (): void => {
    this.setState({ isScrollToBottom: true });
  };

  private onSelectMenuItem = (value: string): void => {
    if (value === MenuItems.VIEW_INFO) {
      // TODO: Add navigation for info screen
    }
  };

  private onUploadAttachment = async (): Promise<void> => {
    const { setAttachment } = this.props;
    try {
      // @ts-ignore
      const response: ImagePickerResponse = await ImagePicker.openPicker({
        compressImageMaxWidth: 400,
        compressImageMaxHeight: 400,
        compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
        includeBase64: true,
        mediaType: 'photo',
      });
      this.setState({ attachment: response });
      setAttachment(response.path);
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  private onSendMessage = (text: string, isAttachment?: boolean): void => {
    const { currentChat } = this.props;
    const { attachment } = this.state;
    if (!currentChat) return;

    let payload: IMessagePayload = {
      groupId: currentChat.groupId,
      message: text,
      attachments: [],
    };

    if (isAttachment) {
      const formData = new FormData();
      formData.append('files[]', {
        // @ts-ignore
        name: PlatformUtils.isIOS()
          ? attachment.filename
          : attachment.path.substring(attachment.path.lastIndexOf('/') + 1),
        uri: attachment.path,
        type: attachment.mime,
      });

      AttachmentService.uploadImage(formData, AttachmentType.CHAT_DOCUMENT)
        .then((res: IAttachmentResponse) => {
          const { data } = res;
          const attachmentId: number = data[0].id;
          payload = {
            ...payload,
            attachments: [attachmentId],
          };
          this.handleSend(payload);
        })
        .catch((e: IApiClientError) => {
          AlertHelper.error({ message: e.message });
        });
    }

    if (!isAttachment && !!payload.message) {
      this.handleSend(payload);
    }
  };

  private handleSend = (payload: IMessagePayload): void => {
    const { getMessages } = this.props;
    MessageRepository.sendMessage(payload)
      .then(() => {
        getMessages({ groupId: payload.groupId, isNew: true });
      })
      .catch((err) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
      });
  };

  private getMenuItems = (): IMenu[] => {
    const { t } = this.props;
    return [{ icon: icons.info, label: t('assetMore:viewInfo'), value: MenuItems.VIEW_INFO }];
  };

  private handleMenu = (): void => {
    const { isMenuVisible } = this.state;
    this.setState({ isMenuVisible: !isMenuVisible });
  };

  public updateScroll = (): void => {
    this.setState({
      isScrollToBottom: false,
    });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getCurrentChatDetail } = CommonSelectors;
  return {
    currentChat: getCurrentChatDetail(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getMessages, clearMessages, setAttachment, clearAttachment, clearChatDetail } = CommonActions;
  return bindActionCreators({ getMessages, clearMessages, setAttachment, clearAttachment, clearChatDetail }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ChatScreen));

const styles = StyleSheet.create({
  inputBox: {
    marginHorizontal: 16,
    marginBottom: 4,
  },
});
