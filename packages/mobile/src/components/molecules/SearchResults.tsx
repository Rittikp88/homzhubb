import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components';
import { GooglePlaceData } from '@homzhub/common/src/services/GooglePlaces/interfaces';

export interface IProps extends WithTranslation {
  results: GooglePlaceData[];
  onResultPress: (item: GooglePlaceData) => void;
}

class SearchResults extends React.PureComponent<IProps, {}> {
  public render = (): React.ReactNode => {
    const { results } = this.props;
    return (
      <FlatList
        keyboardShouldPersistTaps="always"
        data={results}
        renderItem={this.renderSearchResult}
        ListHeaderComponent={this.renderListHeader}
        contentContainerStyle={styles.contentContainer}
      />
    );
  };

  private renderListHeader = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <Label type="large" textType="semiBold" style={styles.listTitle}>
        {t('common:searchResults')}
      </Label>
    );
  };

  private renderSearchResult = ({ item }: { item: GooglePlaceData }): React.ReactElement => {
    const { onResultPress } = this.props;

    const onPress = (): void => {
      onResultPress(item);
    };

    return (
      <TouchableOpacity style={styles.listItemContainer} onPress={onPress}>
        <Label type="large" style={styles.listItemTitle} numberOfLines={2}>
          {item.description}
        </Label>
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: theme.colors.secondaryColor,
  },
  listItemContainer: {
    marginStart: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.darkTint10,
  },
  listTitle: {
    backgroundColor: theme.colors.background,
    color: theme.colors.darkTint4,
    paddingTop: 20,
    paddingStart: 16,
    paddingBottom: 6,
  },
  listItemTitle: {
    marginVertical: 16,
    marginEnd: 16,
  },
});

const HOC = withTranslation()(SearchResults);
export { HOC as SearchResults };
