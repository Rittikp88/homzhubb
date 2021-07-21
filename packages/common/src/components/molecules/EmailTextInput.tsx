import React, { Component } from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputChangeEventData,
  TextInputKeyPressEventData,
  View,
  StyleSheet,
} from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IState {
  value: string;
  emails: string[];
}

interface IProps extends WithTranslation {
  data: string[]; // TODO: (Shikha) Verify after API integration
}

class EmailTextInput extends Component<IProps, IState> {
  public state = {
    value: '',
    emails: [],
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    const { emails, value } = this.state;
    return (
      <View style={styles.container}>
        <Label type="large" style={styles.label}>
          {t('assetFinancial:notifyTo')}
        </Label>
        <View style={styles.itemContainer}>
          {emails.length > 0 && (
            <View style={styles.content}>
              {emails.map((item, index) => (
                <View key={index} style={styles.item}>
                  <Label type="large" style={styles.itemLabel}>
                    {item}
                  </Label>
                  <Icon
                    name={icons.circularCrossFilled}
                    size={16}
                    color={theme.colors.darkTint4}
                    onPress={(): void => this.handleRemove(item)}
                  />
                </View>
              ))}
            </View>
          )}
          {emails.length < 10 && (
            <TextInput
              placeholder={t('assetFinancial:enterEmails')}
              onChange={this.handleChange}
              autoFocus={emails.length > 0}
              value={value}
              onKeyPress={this.handleKeyPress}
            />
          )}
        </View>
      </View>
    );
  }

  private handleChange = (event: NativeSyntheticEvent<TextInputChangeEventData>): void => {
    const { text } = event.nativeEvent;

    if (text.includes(',')) return;
    this.setState({ value: text });
  };

  private handleRemove = (email: string): void => {
    const { emails } = this.state;
    this.setState({ emails: emails.filter((item) => item !== email) });
  };

  private handleKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>): void => {
    const { emails, value } = this.state;
    const { key } = event.nativeEvent;
    if ([','].includes(key)) {
      event.preventDefault();
      const email = value.trim();
      if (email) {
        this.setState({
          emails: [...emails, email],
          value: '',
        });
      }
    }
  };
}

export default withTranslation()(EmailTextInput);

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    color: theme.colors.darkTint4,
    marginBottom: 8,
  },
  itemContainer: {
    borderWidth: 1,
    padding: 12,
    borderColor: theme.colors.disabled,
    borderRadius: 4,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.lightGrayishBlue,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  itemLabel: {
    color: theme.colors.darkTint4,
    marginRight: 6,
  },
});
