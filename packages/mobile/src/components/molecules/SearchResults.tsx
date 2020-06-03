import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components';
import { GooglePlaceData } from '@homzhub/common/src/services/GooglePlaces/interfaces';

interface IProps extends WithTranslation {
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

  private renderSearchResult = ({ item, index }: { item: GooglePlaceData; index: number }): React.ReactElement => {
    const { onResultPress } = this.props;

    const onPress = (): void => {
      onResultPress(item);
    };

    return (
      <TouchableOpacity style={styles.listItemContainer} onPress={onPress}>
        <Label type="large" style={styles.listItemTitle}>
          {item.description}
        </Label>
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  listItemContainer: {
    backgroundColor: theme.colors.secondaryColor,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.darkTint10,
  },
  listTitle: {
    color: theme.colors.darkTint4,
    marginTop: 20,
    marginStart: 16,
    marginBottom: 6,
  },
  listItemTitle: {
    margin: 16,
  },
});

const HOC = withTranslation()(SearchResults);
export { HOC as SearchResults };
