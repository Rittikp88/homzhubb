import React, { FC, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';
import Icon from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { IMenuItemList, MenuItemList, sideMenuItems } from '@homzhub/common/src/constants/DashBoard';
import { Hoverable } from '@homzhub/web/src/components/hoc/Hoverable';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  onItemClick: (ItemId: number) => void;
}

const SideMenu: FC<IProps> = (props: IProps) => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetMore);
  const [selectedItem, setSelectedItem] = useState(1);
  const onItemPress = (item: number): void => {
    setSelectedItem(item);
  };
  const isSelectedItem = (id: number): boolean => selectedItem === id;
  return (
    <View style={styles.menu}>
      {MenuItemList.map((item, index) => {
        return renderMenuItem(item, t, isSelectedItem(item.id), onItemPress);
      })}
    </View>
  );
};

const renderMenuItem = (
  item: IMenuItemList,
  t: TFunction,
  isActive: boolean,
  onItemPress: (item: number) => void
): React.ReactNode => {
  const { menuItem, hoveredItem, activeBar, iconStyle } = styles;
  const iconColor = (isActiveColor: boolean): string => {
    const { error, blue, darkTint4 } = theme.colors;
    return item.name === sideMenuItems.logout ? error : isActiveColor ? blue : darkTint4;
  };
  let setTooltipTimeout: number;
  const TOOLTIP_TIMEOUT = 2000;

  const hideTooltip = (): void => {
    setTooltipTimeout = setTimeout(ReactTooltip.hide, TOOLTIP_TIMEOUT);
  };

  const clearTooltipTimeout = (): void => {
    ReactTooltip.hide();
    clearTimeout(setTooltipTimeout);
  };

  const onMenuItemPress = (): void => onItemPress(item.id);

  return (
    <Hoverable onHoverOut={clearTooltipTimeout} key={item.id}>
      {(isHovered: boolean): React.ReactNode => (
        <TouchableOpacity
          data-tip
          data-for={item.name}
          activeOpacity={100}
          onPress={onMenuItemPress}
          style={[menuItem, (isHovered || isActive) && hoveredItem]}
        >
          <View style={[activeBar, isActive && { opacity: 100 }]} />
          <Icon name={item.icon} color={iconColor(isHovered || isActive)} size={24} style={iconStyle} />
          <ReactTooltip id={item.name} afterShow={hideTooltip} place="right" effect="solid" resizeHide={isHovered}>
            {t(`${item.name}`)}
          </ReactTooltip>
        </TouchableOpacity>
      )}
    </Hoverable>
  );
};

const styles = StyleSheet.create({
  menu: {
    width: 60,
    flexDirection: 'column',
    alignSelf: 'flex-start',
    paddingVertical: theme.layout.screenPadding,
    marginRight: 24,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    zIndex: 1200,
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

export default SideMenu;
