import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity } from 'react-native';
import ImagePicker, { Image as ImagePickerResponse } from 'react-native-image-crop-picker';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { MessageRepository } from '@homzhub/common/src/domain/repositories/MessageRepository';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { NotificationService } from '@homzhub/mobile/src/services/NotificationService';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/MoreStack';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { IApiClientError } from '@homzhub/common/src/network/ApiClientError';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import ChatInputBox from '@homzhub/common/src/components/molecules/ChatInputBox';
import DropdownModal, { IMenu } from '@homzhub/mobile/src/components/molecules/DropdownModal';
import MessagePreview from '@homzhub/common/src/components/organisms/MessagePreview';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { IGetMessageParam, IMessagePayload, MessageAction } from '@homzhub/common/src/domain/repositories/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IChatPayload } from '@homzhub/common/src/modules/common/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IAttachmentResponse } from '@homzhub/common/src/services/AttachmentService/interfaces';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';

enum MenuItems {
  VIEW_INFO = 'VIEW_INFO',
}

interface IDispatchProps {
  getMessages: (param: IGetMessageParam) => void;
  setAttachment: (payload: string) => void;
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

  public async componentDidMount(): Promise<void> {
    if (!(await NotificationService.checkIsPermissionGranted())) {
      await NotificationService.requestPermisson();
    }
  }

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
          onNavigateCallback={this.handleNavigationCallback}
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
      <KeyboardAvoidingView behavior={PlatformUtils.isIOS() ? 'padding' : undefined}>
        <ChatInputBox
          containerStyle={styles.inputBox}
          onInputFocus={this.onInputFocus}
          onFocusOut={this.onInputFocusOut}
          onSubmit={this.onSendMessage}
          onUploadImage={this.onUploadAttachment}
          onPressCamera={this.onClickImage}
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
    const { navigation, clearChatDetail } = this.props;
    this.setState({ isMenuVisible: false });
    this.handleNavigationCallback().then(() => {
      clearChatDetail();
      navigation.goBack();
    });
  };

  private onInputFocus = (): void => {
    this.setState({ isScrollToBottom: true });
  };

  private onInputFocusOut = (): void => {
    this.setState({ isScrollToBottom: false });
  };

  private onSelectMenuItem = (value: string): void => {
    const { navigation, currentChat } = this.props;
    if (value === MenuItems.VIEW_INFO && currentChat) {
      // @ts-ignore
      navigation.navigate(ScreensKeys.GroupChatInfo, { groupId: currentChat.groupId });
      this.handleMenu();
    }
  };

  private onClickImage = (): void => {
    const { setAttachment } = this.props;
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      compressImageMaxWidth: 400,
      compressImageMaxHeight: 400,
      compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
      useFrontCamera: true,
      cropping: true,
    })
      .then((response: ImagePickerResponse | ImagePickerResponse[]) => {
        const image = response as ImagePickerResponse;
        this.setState({ attachment: image });
        setAttachment(image.path);
      })
      .catch((err) => {
        AlertHelper.error({ message: err.message });
      });
  };

  private onUploadAttachment = async (): Promise<void> => {
    const { setAttachment } = this.props;
    try {
      const response: ImagePickerResponse | ImagePickerResponse[] = await ImagePicker.openPicker({
        compressImageMaxWidth: 400,
        compressImageMaxHeight: 400,
        compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
        includeBase64: true,
        mediaType: 'photo',
      });
      const image = response as ImagePickerResponse;
      this.setState({ attachment: image });
      setAttachment(image.path);
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
          ? attachment.filename ?? attachment.path.substring(attachment.path.lastIndexOf('/') + 1)
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
    const { getMessages, currentChat } = this.props;
    MessageRepository.sendMessage(payload)
      .then(() => {
        getMessages({ groupId: payload.groupId, isNew: true });
        if (currentChat) {
          AnalyticsService.track(EventType.NewMessage, { group_name: currentChat.groupName });
        }
      })
      .catch((err) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
      });
  };

  private handleNavigationCallback = async (): Promise<void> => {
    const { currentChat, clearAttachment, navigation } = this.props;

    clearAttachment();
    this.setState({ isMenuVisible: false });

    if (!currentChat) return;
    try {
      await MessageRepository.updateMessage({
        groupId: currentChat.groupId,
        data: {
          action: MessageAction.READ,
          payload: {
            read_at: DateUtils.getDisplayDate(new Date().toISOString(), DateFormats.ISO8601),
          },
        },
      });
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
      navigation.goBack();
    }
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
  const { getMessages, setAttachment, clearAttachment, clearChatDetail } = CommonActions;
  return bindActionCreators({ getMessages, setAttachment, clearAttachment, clearChatDetail }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ChatScreen));

const styles = StyleSheet.create({
  inputBox: {
    marginHorizontal: 16,
    marginBottom: 4,
  },
});
