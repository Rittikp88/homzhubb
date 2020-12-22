import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Hoverable } from '@homzhub/web/src/components/hoc/Hoverable';

interface IPopupOptions {
  icon?: string;
  label: string;
}

interface IProps {
  options: IPopupOptions[];
  onMenuOptionPress: (option: IPopupOptions) => void;
}

const PopupMenuOptions: FC<IProps> = ({ options, onMenuOptionPress }: IProps) => {
  const { primaryColor, darkTint4 } = theme.colors;
  return (
    <View style={styles.optionContainer}>
      {options.map((item) => (
        <Hoverable key={item.label}>
          {(isHovered: boolean): React.ReactNode => (
            <TouchableOpacity
              onPress={(): void => onMenuOptionPress(item)}
              style={[styles.option, isHovered && styles.activeOption]}
            >
              {item.icon && <Icon name={item.icon} color={isHovered ? primaryColor : darkTint4} style={styles.icon} />}
              <Label
                type="large"
                textType="semiBold"
                style={[styles.optionText, isHovered && styles.optionTextHovered]}
              >
                {item.label}
              </Label>
            </TouchableOpacity>
          )}
        </Hoverable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    backgroundColor: theme.colors.white,
    paddingVertical: 8,
  },
  option: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    marginRight: 8,
  },
  activeOption: {
    backgroundColor: theme.colors.background,
  },
  optionText: {
    color: theme.colors.darkTint4,
  },
  optionTextHovered: {
    color: theme.colors.primaryColor,
  },
});

export default PopupMenuOptions;
