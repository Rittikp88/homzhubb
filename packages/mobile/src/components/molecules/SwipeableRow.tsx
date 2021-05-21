// @ts-nocheck
// Todo (Praharsh) : Handle right swipe case, if required for future and resolve ts-errors.
import React, { Component, Ref } from 'react';
import { Animated as RNAnimated, StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { AnimationService } from '@homzhub/mobile/src/services/AnimationService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';

const AnimatedIcon = RNAnimated.createAnimatedComponent(Icon);
const AnimatedTouchableOpacity = RNAnimated.createAnimatedComponent(TouchableOpacity);

// CONSTANTS START
const LEFT_THRESHOLD = 30;
const RIGHT_THRESHOLD = 30;
const ICON_SIZE = 25;
const INCREASING_INPUT_RANGE_ANIMATION = [0, 1];
const DECREASING_OUTPUT_RANGE_ANIMATION = [1, 0];
const SCALE_INPUT = [-20, 0];
const OPACITY_INPUT = [-150, 0];
// CONSTANTS END

export interface IGroupIcons {
  iconName: string;
  iconSize?: number;
  iconColor?: string;
  onPress: () => void;
  containerStyle?: ViewStyle;
  backgroundColor: string;
}

interface IProps {
  leftThreshold?: number;
  rightThreshold?: number;
  rightIcons?: IGroupIcons[];
  children: React.ReactElement;
  isSwipeable?: boolean;
}

export default class SwipeableRow extends Component<IProps> {
  public _swipeableRow!: Swipeable;

  public render(): React.ReactElement {
    const { children, leftThreshold = LEFT_THRESHOLD, rightThreshold = RIGHT_THRESHOLD } = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        leftThreshold={leftThreshold}
        rightThreshold={rightThreshold}
        renderRightActions={this.handleRightToLeftSwipe}
      >
        {children}
      </Swipeable>
    );
  }

  private renderIcons = (
    iconItems: IGroupIcons[],
    progress: RNAnimated.AnimatedInterpolation,
    dragX: RNAnimated.AnimatedInterpolation
  ): React.ReactElement => {
    const { interpolateAnimation } = AnimationService;
    return (
      <>
        {iconItems.map((item, index) => {
          const {
            iconName,
            onPress,
            iconColor = theme.colors.white,
            iconSize = ICON_SIZE,
            containerStyle,
            backgroundColor,
          } = item;
          const handleOnPress = (): void => {
            this.close();
            onPress();
          };

          const translateX = interpolateAnimation(progress, INCREASING_INPUT_RANGE_ANIMATION, [index + 60, 0]);
          const scale = interpolateAnimation(dragX, SCALE_INPUT, DECREASING_OUTPUT_RANGE_ANIMATION);
          const opacity = interpolateAnimation(dragX, OPACITY_INPUT, DECREASING_OUTPUT_RANGE_ANIMATION);

          return (
            <AnimatedTouchableOpacity
              key={index}
              style={[
                styles.rightAction,
                {
                  backgroundColor,
                  opacity,
                  transform: [{ translateX }],
                },
                containerStyle && { ...containerStyle },
              ]}
              onPress={handleOnPress}
            >
              <AnimatedIcon name={iconName} color={iconColor} size={iconSize} style={{ transform: [{ scale }] }} />
            </AnimatedTouchableOpacity>
          );
        })}
      </>
    );
  };

  private handleRightToLeftSwipe = (
    progress: RNAnimated.AnimatedInterpolation,
    dragX: RNAnimated.AnimatedInterpolation
  ): React.ReactElement | null => {
    const { rightIcons, isSwipeable = true } = this.props;
    if (!rightIcons || !(rightIcons.length > 0) || !isSwipeable) return null;
    return <View style={styles.itemContainer}>{this.renderIcons(rightIcons, progress, dragX)}</View>;
  };

  private close = (): void => {
    this._swipeableRow.close();
  };

  private updateRef = (ref: Ref): void => {
    this._swipeableRow = ref;
  };
}

const styles = StyleSheet.create({
  itemContainer: {
    width: theme.viewport.width / 2.7,
    flexDirection: 'row',
  },
  rightAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
