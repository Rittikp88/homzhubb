import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, TouchableHighlight, View, ViewStyle } from 'react-native';
import { MessageComponentProps } from 'react-native-flash-message';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';

type IProps = MessageComponentProps & WithTranslation;
class Toast extends React.PureComponent<IProps> {
  public render = (): React.ReactNode => {
    const {
      t,
      message: { message, type },
    } = this.props;
    const icon = type === 'danger' ? icons.circularCrossFilled : icons.circularCheckFilled;

    return (
      <View style={this.getContainerStyle()}>
        <View style={styles.iconMessageContainer}>
          <Icon name={icon} size={20} color={theme.colors.white} style={styles.icon} />
          <Label type="large" style={styles.text} numberOfLines={2}>
            {message}
          </Label>
        </View>
        {type === 'danger' && (
          <TouchableHighlight
            testID="tohighPress"
            style={styles.buttonContainer}
            onPress={this.onOKPress}
            underlayColor={theme.colors.highPriority}
          >
            <Label type="large" textType="semiBold" style={styles.buttonTitleStyle}>
              {t('ok')}
            </Label>
          </TouchableHighlight>
        )}
      </View>
    );
  };

  private onOKPress = (): void => {
    AlertHelper.dismiss();
  };

  private getContainerStyle = (): StyleProp<ViewStyle> => {
    const {
      message: { backgroundColor },
    } = this.props;
    return StyleSheet.flatten([styles.container, { backgroundColor }]);
  };
}

const HOC = withTranslation()(Toast);
export { HOC as Toast };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: theme.layout.toastMargin,
  },
  buttonContainer: {
    borderRadius: 4,
  },
  iconMessageContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  text: {
    flex: 1,
    marginEnd: 16,
    color: theme.colors.white,
  },
  buttonTitleStyle: {
    color: theme.colors.white,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  icon: {
    marginEnd: 12,
  },
});
