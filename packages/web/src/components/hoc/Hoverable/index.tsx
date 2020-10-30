
import React, { useState } from 'react';
import { element, func, oneOfType } from 'prop-types';
import { isHoverEnabled } from './HoverState';

interface IProps {
  children: any;
  onHoverIn?: any;
  onHoverOut?: any;
}

export const Hoverable = (props: IProps): any => {
  const [isHovered, setIsHovered] = useState(false);
  const [showHover, setShowHover] = useState(true);

  const { children, onHoverIn, onHoverOut } = props;
  const child = typeof children === 'function' ? children(showHover && isHovered) : children;

  const handleMouseEnter = (): void => {
    if (isHoverEnabled() && !isHovered) {
      if (onHoverIn) onHoverIn();
      setIsHovered(true);
    }
  };

  const handleMouseLeave = (): void => {
    if (isHovered) {
      if (onHoverOut) onHoverOut();
      setIsHovered(false);
    }
  };

  const handleGrant = (): void => {
    setShowHover(false);
  };

  const handleRelease = (): void => {
    setShowHover(true);
  };

  return React.cloneElement(React.Children.only(child), {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    // prevent hover showing while responder
    onResponderGrant: handleGrant,
    onResponderRelease: handleRelease,
    // if child is Touchable
    onPressIn: handleGrant,
    onPressOut: handleRelease,
  });
};

Hoverable.propTypes = {
  children: oneOfType([func, element]),
  onHoverIn: func,
  onHoverOut: func,
};
