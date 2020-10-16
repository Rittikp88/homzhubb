import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Label, Text } from '@homzhub/common/src/components';
import { AssetGroup } from '@homzhub/common/src/domain/models/AssetGroup';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps extends WithTranslation {
  assetGroups: AssetGroup[];
  selectedAssetGroupType: number;
  selectedAssetGroupId: number;
  scrollRef: ScrollView | null;
  onAssetGroupSelected: (id: number) => void;
  isDisabled: boolean;
}

interface IOwnState {
  selectedAssetGroup: number;
}

enum Type {
  // eslint-disable-next-line no-shadow
  AssetGroup = 'AssetGroup',
  AssetType = 'AssetType',
}

class AssetGroupSelection extends React.PureComponent<IProps, IOwnState> {
  public state = {
    selectedAssetGroup: -1,
  };

  public static getDerivedStateFromProps(props: IProps, state: IOwnState): IOwnState | null {
    const { selectedAssetGroupId: newPropValue } = props;
    const { selectedAssetGroup: oldStateValue } = state;

    if (oldStateValue !== newPropValue && newPropValue !== -1) {
      return {
        selectedAssetGroup: newPropValue,
      };
    }

    return null;
  }

  public render = (): React.ReactNode => {
    const { assetGroups, t, isDisabled } = this.props;
    const { selectedAssetGroup } = this.state;

    const selectedGroup = assetGroups.find((assetGroup: AssetGroup) => assetGroup.id === selectedAssetGroup);

    let opacity;
    let pointer;
    if (isDisabled) {
      opacity = 0.5;
      pointer = 'none';
    }

    return (
      <View style={[styles.container, { opacity }]} pointerEvents={pointer as 'none' | undefined}>
        <Text type="small" textType="semiBold" style={styles.title}>
          {t('myProjectIs')}
        </Text>
        <View style={styles.mainGroupContainer}>
          {assetGroups.map((group, index) => this.renderItem(Type.AssetGroup, group, index))}
        </View>
        {selectedAssetGroup >= 0 && (
          <>
            <Text type="small" textType="semiBold" style={styles.title}>
              {t('selectType')}
            </Text>
            <View style={styles.subGroupContainer}>
              {selectedGroup?.assetTypes.map((item, index) => this.renderItem(Type.AssetType, item, index))}
            </View>
          </>
        )}
      </View>
    );
  };

  private renderItem = (type: Type, item: AssetGroup | Unit, index: number): React.ReactNode => {
    const { selectedAssetGroup } = this.state;
    const { onAssetGroupSelected, selectedAssetGroupType, scrollRef } = this.props;

    const conditionalSelectedItem = type === Type.AssetGroup ? selectedAssetGroup : selectedAssetGroupType;
    const conditionalContainerStyle =
      type === Type.AssetGroup
        ? styles.itemContainer
        : [styles.subItemContainer, { marginEnd: index % 2 === 0 ? marginEnd : 0 }];

    let color = theme.colors.darkTint4;
    let backgroundColor;
    let textType = 'regular';
    if (item.id === conditionalSelectedItem) {
      color = theme.colors.white;
      backgroundColor = theme.colors.primaryColor;
      textType = 'semiBold';
    }

    const onPress = (): void => {
      if (type === Type.AssetGroup) {
        this.setState({ selectedAssetGroup: item.id });
        onAssetGroupSelected(-1);
        setTimeout(() => {
          scrollRef?.scrollToEnd({ animated: true });
        }, 0);
      } else {
        onAssetGroupSelected(item.id);
      }
    };

    return (
      <TouchableOpacity key={item.id} onPress={onPress} style={[conditionalContainerStyle, { backgroundColor }]}>
        {type === Type.AssetGroup && <Icon name={item.name.toLowerCase()} size={24} color={color} />}
        <Label type="large" textType={textType as 'regular' | 'semiBold'} style={[styles.assetGroupName, { color }]}>
          {item.name}
        </Label>
      </TouchableOpacity>
    );
  };
}

const {
  layout: { screenPadding },
  viewport: { width },
} = theme;
const marginEnd = 12;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: screenPadding,
    marginBottom: 12,
  },
  mainGroupContainer: {
    flexDirection: 'row',
  },
  subGroupContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  itemContainer: {
    alignItems: 'center',
    marginEnd: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.disabled,
  },
  subItemContainer: {
    width: (width - (screenPadding * 2 + marginEnd)) / 2,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.disabled,
  },
  assetGroupName: {
    textAlign: 'center',
    marginEnd: 4,
  },
  title: {
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
});

const HOC = withTranslation(LocaleConstants.namespacesKey.property)(AssetGroupSelection);
export { HOC as AssetGroupSelection };
