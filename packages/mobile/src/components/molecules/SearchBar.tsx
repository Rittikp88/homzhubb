import React from 'react';
import { StyleProp, StyleSheet, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components';

interface IProps {
  placeholder: string;
  value: string;
  updateValue: (value: string) => void;
  onFocusChange?: (showAutoDetect: boolean) => void;
  containerStyle?: StyleProp<ViewStyle>;
  cancelButtonStyle?: StyleProp<ViewStyle>;
  cancelTextStyle?: StyleProp<TextStyle>;
}
interface IState {
  showCancel: boolean;
}
type Props = WithTranslation & IProps;

class SearchBar extends React.PureComponent<Props, IState> {
  public SearchTextInput: TextInput | null = null;

  public state = {
    showCancel: false,
  };

  public render = (): React.ReactNode => {
    const { placeholder, value, t, containerStyle = {}, cancelButtonStyle = {}, cancelTextStyle = {} } = this.props;
    const { showCancel } = this.state;

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.textInputContainer}>
          <Button
            type="primary"
            icon="search"
            iconSize={20}
            iconColor={theme.colors.darkTint6}
            containerStyle={[styles.iconButton, styles.searchIcon]}
            onPress={this.onSearchIconPress}
          />
          <TextInput
            ref={(input): void => {
              this.SearchTextInput = input;
            }}
            style={styles.textInput}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.darkTint7}
            autoCorrect={false}
            numberOfLines={1}
            returnKeyType="search"
            onChangeText={this.onChangeText}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />
          {value.length > 0 && (
            <Button
              type="primary"
              icon="circular-cross-filled"
              iconSize={20}
              iconColor={theme.colors.darkTint6}
              containerStyle={styles.iconButton}
              onPress={this.onCrossPress}
            />
          )}
        </View>
        {showCancel && (
          <Button
            type="secondary"
            title={t('common:cancel')}
            containerStyle={[styles.cancelButtonContainer, cancelButtonStyle]}
            titleStyle={[styles.cancelButtonText, cancelTextStyle]}
            onPress={this.onCancelPress}
          />
        )}
      </View>
    );
  };

  private onFocus = (): void => {
    const { onFocusChange } = this.props;
    if (onFocusChange) {
      onFocusChange(false);
    }
    this.setState({ showCancel: true });
  };

  private onBlur = (): void => {
    const { onFocusChange } = this.props;
    if (onFocusChange) {
      onFocusChange(true);
    }
    this.setState({ showCancel: false });
  };

  private onSearchIconPress = (): void => {
    this.SearchTextInput?.focus();
  };

  private onCrossPress = (): void => {
    this.onChangeText('');
  };

  private onCancelPress = (): void => {
    this.onCrossPress();
    this.SearchTextInput?.blur();
  };

  private onChangeText = (updatedValue: string): void => {
    const { updateValue } = this.props;
    updateValue(updatedValue);
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    paddingTop: 4,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.primaryColor,
  },
  textInputContainer: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 8,
    backgroundColor: theme.colors.secondaryColor,
  },
  textInput: {
    flex: 1,
  },
  cancelButtonContainer: {
    backgroundColor: theme.colors.primaryColor,
    flex: 0,
    borderWidth: 0,
    marginStart: 12,
  },
  cancelButtonText: {
    color: theme.colors.secondaryColor,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  iconButton: {
    backgroundColor: theme.colors.secondaryColor,
    flex: 0,
  },
  searchIcon: {
    marginEnd: 8,
  },
});

const HOC = withTranslation()(SearchBar);
export { HOC as SearchBar };
