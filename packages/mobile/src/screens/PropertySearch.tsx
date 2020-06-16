import React from 'react';
import { View, StyleSheet } from 'react-native';
// import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker';
// import DocumentPicker from 'react-native-document-picker';
import { theme } from '@homzhub/common/src/styles/theme';
// import { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components';
// import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';

// const options = {
//   title: 'Add property Images',
//   customButtons: [{ name: 'video', title: 'Take a Video' }],
//   storageOptions: {
//     skipBackup: true,
//     path: 'images',
//   },
//   noData: true,
//   maxWidth: 100,
//   minWidth: 100,
//   quality: 1,
// };

class PropertySearch extends React.PureComponent<{}, {}> {
  public render(): React.ReactElement {
    return (
      <View style={styles.container}>
        <Text type="regular" textType="regular">
          Welcome to Property Search!
        </Text>
        {/* <UploadBox */}
        {/*  icon={icons.idProof} */}
        {/*  header="Upload ID proof" */}
        {/*  subHeader="Supports something" */}
        {/*  onPress={this.onPressOfUploadBoxOfDocument} */}
        {/* /> */}
      </View>
    );
  }

  public onPressOfUploadBox = (): void => {
    // ImagePicker.showImagePicker(options, (response: ImagePickerResponse) => {
    //   if (response.didCancel) {
    //     AlertHelper.error({ message: 'User cancelled image picker' });
    //   } else if (response.error) {
    //     AlertHelper.error({ message: `ImagePicker Error: ${response.error}` });
    //   } else if (response.customButton) {
    //     AlertHelper.error({ message: `User tapped on custom button: ${response.customButton}` });
    //   } else {
    //     const source = { uri: response.uri };
    //     // You can also display the image using data:
    //     // const source = { uri: 'data:image/jpeg;base64,' + response.data };
    //   }
    // });
  };

  public onPressOfUploadBoxOfDocument = async (): Promise<void> => {
    // Pick a single file
    // try {
    //   const res = await DocumentPicker.pick({
    //     type: [DocumentPicker.types.allFiles],
    //   });
    // } catch (err) {
    //   if (DocumentPicker.isCancel(err)) {
    //     // User cancelled the picker, exit any dialogs or menus and move on
    //   } else {
    //     throw err;
    //   }
    // }
  };
}

export default PropertySearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
