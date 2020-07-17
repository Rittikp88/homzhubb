import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import {
  SelectionPicker,
  ISelectionPicker,
  Text,
  CheckboxGroup,
  ICheckboxGroupData,
} from '@homzhub/common/src/components';
import { IAssetGroupList, IAssetTypes, IFilterDetails } from '@homzhub/common/src/domain/models/Search';

interface IProps {
  filterData: IFilterDetails;
}
type Props = WithTranslation & IProps;

class AssetTypeFilter extends React.PureComponent<Props, {}> {
  public render = (): React.ReactNode => {
    const {
      t,
      filterData: {
        filters: {
          asset_group: { id: selectedAssetGroupId },
        },
      },
    } = this.props;
    return (
      <View>
        <Text type="small" textType="semiBold" style={styles.title}>
          {StringUtils.toTitleCase(t('property:propertyType'))}
        </Text>
        <SelectionPicker
          data={this.assetGroupsListPickerData()}
          selectedItem={[selectedAssetGroupId]}
          onValueChange={this.onAssetGroupListChanged}
        />
        <CheckboxGroup
          data={this.assetGroupsTypesData()}
          onToggle={this.onAssetGroupChecked}
          labelStyle={styles.checkboxLabel}
          containerStyle={styles.checkboxGroupContainer}
        />
      </View>
    );
  };

  private onAssetGroupListChanged = (selectedItem: number): void => {
    console.log(selectedItem);
  };

  private onAssetGroupChecked = (assetTypeId: number): void => {
    console.log(assetTypeId);
  };

  private assetGroupsListPickerData = (): ISelectionPicker[] => {
    const {
      filterData: { asset_group_list },
    } = this.props;
    return asset_group_list.map((assetGroup: IAssetGroupList) => ({
      title: assetGroup.title,
      value: assetGroup.id,
    }));
  };

  private assetGroupsTypesData = (): ICheckboxGroupData[] => {
    const {
      filterData: {
        filters: {
          asset_group: { asset_types },
        },
      },
    } = this.props;
    return asset_types.map((assetGroupType: IAssetTypes) => ({
      id: assetGroupType.id,
      label: assetGroupType.name,
      isSelected: false,
    }));
  };
}

const styles = StyleSheet.create({
  title: {
    color: theme.colors.darkTint4,
    marginBottom: 16,
  },
  checkboxGroupContainer: {
    marginTop: 24,
  },
  checkboxLabel: {
    color: theme.colors.darkTint4,
  },
});

const HOC = withTranslation()(AssetTypeFilter);
export { HOC as AssetTypeFilter };
