import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ReactTooltip from 'react-tooltip';
import Icon from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { IMenuItemList, MenuItemList, sideMenuItems } from '@homzhub/common/src/constants/DashBoard';
import { Hoverable } from '@homzhub/web/src/components/hoc/Hoverable';

interface IProps {
  onItemClick: (ItemId: number) => void;
}

const menuItem = (item: IMenuItemList, isActive: boolean, onItemPress: (item: number) => void): React.ReactNode => {
  const iconColor = item.name === sideMenuItems.LOGOUT ? theme.colors.error : theme.colors.blue;
  let setTooltipTimeout: number;
  const hideTooltip = (): void => {
    setTooltipTimeout = setTimeout(ReactTooltip.hide, 2000);
  };
  const clearTooltipTimeout = (): void => {
    ReactTooltip.hide();
    clearTimeout(setTooltipTimeout);
  };
  return (
    <Hoverable onHoverOut={clearTooltipTimeout}>
      {(isHovered): React.ReactNode => (
        <TouchableOpacity
          data-tip
          data-for={item.name}
          data-hide="1000"
          activeOpacity={100}
          onPress={(): void => onItemPress(item.id)}
          style={[styles.menuItem, (isHovered || isActive) && styles.hoveredItem]}
        >
          <View style={[styles.activeBar, isActive && { opacity: 100 }]} />
          <Icon name={item.icon} color={iconColor} size={24} style={styles.iconStyle} />
          <ReactTooltip id={item.name} afterShow={hideTooltip} place="right" effect="solid" resizeHide={isHovered}>
            {item.name}
          </ReactTooltip>
        </TouchableOpacity>
      )}
    </Hoverable>
  );
};

export const SideMenu: React.FunctionComponent<IProps> = (props: IProps) => {
  const [activeItem, setActiveItem] = useState(1);
  const onItemPress = (item: number): void => {
    setActiveItem(item);
  };
  return (
    <View style={styles.menu}>
      {MenuItemList.map((item, index) => {
        return menuItem(item, activeItem === item.id, onItemPress);
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    width: 60,
    flexDirection: 'column',
    alignSelf: 'flex-start',
    paddingVertical: theme.layout.screenPadding,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
  },
  menuItem: {
    position: 'relative',
    flexDirection: 'row',
    width: '100%',
    height: 40,
    backgroundColor: theme.colors.white,
  },
  hoveredItem: {
    backgroundColor: theme.colors.blueOpacity,
  },
  activeBar: {
    opacity: 0,
    width: 3,
    borderBottomRightRadius: 100,
    borderTopRightRadius: 100,
    backgroundColor: theme.colors.primaryColor,
  },
  iconStyle: {
    alignSelf: 'center',
    marginHorizontal: 'auto',
  },
});
