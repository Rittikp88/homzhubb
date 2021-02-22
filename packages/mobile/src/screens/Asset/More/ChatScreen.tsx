import React, { Component } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import ImagePicker, { Image as ImagePickerResponse } from 'react-native-image-crop-picker';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { MessageRepository } from '@homzhub/common/src/domain/repositories/MessageRepository';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import ChatInputBox from '@homzhub/common/src/components/molecules/ChatInputBox';
import MessagePreview from '@homzhub/common/src/components/organisms/MessagePreview';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { IGetMessageParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IDispatchProps {
  getMessages: (param: IGetMessageParam) => void;
}

interface IScreenState {
  messageString: string;
}

type libraryProps = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.ChatScreen>;
type Props = libraryProps & IDispatchProps;

class ChatScreen extends Component<Props, IScreenState> {
  public state = {
    messageString: '',
  };

  // TODO: Add proper group name
  public render(): React.ReactNode {
    const { navigation } = this.props;
    return (
      <>
        <UserScreen title="More" pageTitle="2BHK - Godrej Prime" onBackPress={navigation.goBack} scrollEnabled={false}>
          <MessagePreview />
        </UserScreen>
        {this.renderInputView()}
      </>
    );
  }

  private renderInputView = (): React.ReactElement => {
    return (
      <KeyboardAvoidingView behavior="padding">
        <ChatInputBox onSubmit={this.onSendMessage} onUploadImage={this.onUploadAttachment} />
      </KeyboardAvoidingView>
    );
  };

  private onUploadAttachment = (): void => {
    // @ts-ignore
    const response: ImagePickerResponse = ImagePicker.openPicker({
      compressImageMaxWidth: 400,
      compressImageMaxHeight: 400,
      compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
      includeBase64: true,
      mediaType: 'photo',
    });

    const formData = new FormData();
    formData.append('files[]', {
      // @ts-ignore
      name: PlatformUtils.isIOS() ? response.filename : response.path.substring(response.path.lastIndexOf('/') + 1),
      uri: response.path,
      type: response.mime,
    });
  };

  private onSendMessage = (): void => {
    const { messageString } = this.state;
    const { getMessages } = this.props;

    const payload = {
      groupId: 16,
      message: messageString,
      attachments: [],
    };

    MessageRepository.sendMessage(payload)
      .then(() => {
        getMessages({ groupId: 16 });
        this.setState({ messageString: '' });
      })
      .catch((err) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
      });
  };
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getMessages } = CommonActions;
  return bindActionCreators({ getMessages }, dispatch);
};

export default connect(null, mapDispatchToProps)(ChatScreen);
