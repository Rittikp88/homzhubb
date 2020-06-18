import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components';

class PropertySearch extends React.PureComponent<{}, {}> {
  public render(): React.ReactElement {
    return (
      <View style={styles.container}>
        <Text type="regular" textType="regular">
          Welcome to Property Search!
        </Text>
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
