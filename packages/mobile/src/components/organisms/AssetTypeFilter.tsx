import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { remove } from 'lodash';
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
  asset_group: number;
  asset_type: number[];
  updateAssetFilter: (type: string, value: number | number[]) => void;
}

type Props = WithTranslation & IProps;

export class AssetTypeFilter extends React.PureComponent<Props, {}> {
  public render = (): React.ReactNode => {
    const { t, asset_group } = this.props;
    return (
      <View>
        <Text type="small" textType="semiBold" style={styles.title}>
          {StringUtils.toTitleCase(t('property:propertyType'))}
        </Text>
        <SelectionPicker
          data={this.assetGroupsListPickerData()}
          selectedItem={[asset_group]}
          onValueChange={this.onAssetGroupListChanged}
          testID="assetGroupSelection"
        />
        <CheckboxGroup
          data={this.assetGroupsTypesData()}
          onToggle={this.onAssetGroupChecked}
          labelStyle={styles.checkboxLabel}
          containerStyle={styles.checkboxGroupContainer}
          testID="assetGroupCheck"
        />
      </View>
    );
  };

  private onAssetGroupListChanged = (selectedItem: number): void => {
    const { updateAssetFilter } = this.props;
    updateAssetFilter('asset_group', selectedItem);
    updateAssetFilter('asset_type', []);
  };

  private onAssetGroupChecked = (assetTypeId: number, isSelected: boolean): void => {
    const { updateAssetFilter, asset_type } = this.props;
    if (!isSelected) {
      remove(asset_type, (asset) => asset === assetTypeId);
      updateAssetFilter('asset_type', [...asset_type]);
    } else {
      updateAssetFilter('asset_type', [...asset_type, assetTypeId]);
    }
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
      asset_type,
    } = this.props;
    return asset_types.map((assetGroupType: IAssetTypes) => ({
      id: assetGroupType.id,
      label: assetGroupType.name,
      isSelected: asset_type.includes(assetGroupType.id),
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

export default withTranslation()(AssetTypeFilter);
