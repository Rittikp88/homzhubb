import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import ChatInputBox from '@homzhub/common/src/components/molecules/ChatInputBox';
import MessagePreview from '@homzhub/common/src/components/organisms/MessagePreview';

interface IProps {
  shouldEnableOuterScroll: (enable: boolean) => void;
}

const MessageTab = (props: IProps): React.ReactElement => {
  const { shouldEnableOuterScroll } = props;
  return (
    <View style={styles.container}>
      <MessagePreview shouldEnableOuterScroll={shouldEnableOuterScroll} />
      <ChatInputBox onUploadImage={FunctionUtils.noop} onSubmit={FunctionUtils.noop} />
    </View>
  );
};

export default MessageTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    height: 500,
  },
});
