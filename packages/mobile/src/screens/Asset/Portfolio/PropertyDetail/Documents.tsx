import React, { Component } from 'react';
import { FlatList, Share, StyleSheet, View } from 'react-native';
import { debounce } from 'lodash';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider, UploadBox } from '@homzhub/common/src/components';
import { SearchBar, EmptyState, DocumentCard, Loader } from '@homzhub/mobile/src/components';
import { DocumentsData } from '@homzhub/common/src/mocks/AssetData';

// TODO: Add types once API integration is done

interface IDocumentState {
  searchValue: string;
  documents: any[];
  isLoading: boolean;
}

class Documents extends Component<{}, IDocumentState> {
  public state = {
    searchValue: '',
    documents: DocumentsData,
    isLoading: false,
  };

  private search = debounce(() => {
    const { searchValue, documents } = this.state;
    const results: any[] = [];
    documents.forEach((item) => {
      if (item.name.includes(searchValue)) {
        results.push(item);
      }
    });
    this.setState({ documents: results, isLoading: false });
  }, 1000);

  public render(): React.ReactNode {
    const { searchValue, isLoading } = this.state;
    return (
      <View style={styles.container}>
        <UploadBox
          icon={icons.document}
          header="Upload Document"
          subHeader="Supports: JPG, JPEG, PNG, PDF "
          containerStyle={styles.uploadBox}
          onPress={(): void => {}}
        />
        <SearchBar
          placeholder="Search by document name"
          value={searchValue}
          updateValue={this.onSearch}
          containerStyle={styles.searchBar}
        />
        {this.renderDocumentList()}
        <Loader visible={isLoading} />
      </View>
    );
  }

  private renderDocumentList = (): React.ReactElement => {
    const { documents } = this.state;
    if (documents.length === 0) {
      return <EmptyState />;
    }
    return (
      <FlatList
        data={documents}
        renderItem={this.renderDocumentCard}
        ItemSeparatorComponent={this.renderSeparatorComponent}
        keyExtractor={this.renderKeyExtractor}
      />
    );
  };

  private renderDocumentCard = ({ item }: { item: any }): React.ReactElement => {
    return <DocumentCard document={item} handleShare={this.onShare} />;
  };

  private renderSeparatorComponent = (): React.ReactElement => {
    return <Divider containerStyles={styles.divider} />;
  };

  private renderKeyExtractor = (item: any, index: number): string => {
    return `${item.name}-${index}`;
  };

  private onSearch = (value: string): void => {
    this.setState({ searchValue: value }, () => {
      if (value.length >= 3) {
        this.setState({ isLoading: true });
        this.search();
      }

      if (value.length === 0) {
        this.setState({
          documents: DocumentsData,
        });
      }
    });
  };

  private onShare = async (): Promise<void> => {
    // TODO: (Shikha) - Replace url and message
    const url = 'www.homzhub.com/documents/';
    try {
      await Share.share({
        message: `Hey, I would like to share this document ${url}`,
      });
    } catch (error) {
      AlertHelper.error({ message: error });
    }
  };
}

export default Documents;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  uploadBox: {
    paddingVertical: 16,
  },
  searchBar: {
    marginTop: 16,
  },
  divider: {
    marginTop: 16,
    borderColor: theme.colors.darkTint10,
  },
});
