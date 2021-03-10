import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { RNCheckbox } from '@homzhub/common/src/components/atoms/Checkbox';

export interface ICheckboxGroupData {
  id: number | string;
  label: string;
  isSelected: boolean;
  isDisabled?: boolean;
}

export interface ICheckboxGroupProps {
  data: ICheckboxGroupData[];
  onToggle: (id: number | string, isSelected: boolean) => void;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

type IProps = ICheckboxGroupProps & IWithMediaQuery;

class CheckboxGroup extends React.PureComponent<IProps, {}> {
  public render = (): React.ReactNode => {
    const { data, containerStyle = {}, isMobile } = this.props;
    const styles = checkBoxGrpStyles(isMobile);
    return PlatformUtils.isMobile() ? (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.col}>
          {data.filter((item, index) => index % 2 === 0).map((item) => this.renderCheckbox(item))}
        </View>
        <View style={styles.col}>
          {data.filter((item, index) => index % 2 !== 0).map((item) => this.renderCheckbox(item))}
        </View>
      </View>
    ) : (
      <View style={styles.checkboxStyle}>{data.map((item) => this.renderCheckbox(item))}</View>
    );
  };

  private renderCheckbox = (item: ICheckboxGroupData): React.ReactElement => {
    const { label, isSelected = false, isDisabled = false } = item;
    const { onToggle, labelStyle = {}, testID, isMobile, containerStyle = {} } = this.props;
    const styles = checkBoxGrpStyles(isMobile);
    const onCheckboxToggle = (): void => onToggle(item.id, !isSelected);

    return (
      <View key={`${item.id}`} style={isDisabled && styles.disabled} pointerEvents={isDisabled ? 'none' : undefined}>
        <RNCheckbox
          selected={isSelected}
          label={label}
          onToggle={onCheckboxToggle}
          labelStyle={labelStyle}
          containerStyle={[styles.checkboxContainer, containerStyle]}
          testID={testID}
        />
      </View>
    );
  };
}

const checkboxGroup = withMediaQuery<any>(CheckboxGroup);
export { checkboxGroup as CheckboxGroup };

interface ICheckBoxGrpStyle {
  container: ViewStyle;
  col: ViewStyle;
  disabled: ViewStyle;
  checkboxContainer: ViewStyle;
  checkboxStyle: ViewStyle;
}

const checkBoxGrpStyles = (isMobile: boolean): StyleSheet.NamedStyles<ICheckBoxGrpStyle> =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    col: {
      flex: isMobile ? 0.5 : undefined,
      flexDirection: isMobile ? 'column' : 'row',
      flexWrap: isMobile ? undefined : 'wrap',
    },
    disabled: {
      opacity: 0.5,
    },
    checkboxContainer: {
      marginRight: isMobile ? undefined : 40,
      marginVertical: 12,
    },
    checkboxStyle: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
    },
  });
