import React from 'react';
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';

interface IProps {
  placeholder: string;
  value: string;
  updateValue: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  searchBarStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export class SearchField extends React.PureComponent<IProps> {
  public render = (): React.ReactNode => {
    const { placeholder, value, containerStyle = {}, searchBarStyle = {} } = this.props;

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.textInputContainer, searchBarStyle]}>
          <TextInput
            style={styles.textInput}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.darkTint7}
            autoCorrect={false}
            onChangeText={this.onChangeText}
            testID="textInput"
          />

          <Button
            type="primary"
            icon={icons.search}
            iconSize={20}
            iconColor={theme.colors.darkTint6}
            containerStyle={styles.iconButton}
            testID="btnSearch"
          />
        </View>
      </View>
    );
  };

  private onChangeText = (value: string): void => {
    const { updateValue } = this.props;
    updateValue(value);
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theme.colors.darkTint10,
  },
  textInputContainer: {
    flex: 1,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: theme.colors.secondaryColor,
  },
  textInput: {
    flex: 1,
  },
  iconButton: {
    backgroundColor: theme.colors.secondaryColor,
  },
});
