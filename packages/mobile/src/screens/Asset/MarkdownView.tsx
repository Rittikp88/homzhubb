import React, { PureComponent } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { WithTranslation } from 'react-i18next';
import axios from 'axios';
// @ts-ignore
import Markdown from 'react-native-easy-markdown';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Header } from '@homzhub/mobile/src/components';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IUser } from '@homzhub/common/src/domain/models/User';

type OwnProps = WithTranslation & NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.MarkdownScreen>;
type Props = OwnProps;

interface IMarkdownState {
  markdownData: string;
}

export class MarkdownView extends PureComponent<Props, IMarkdownState> {
  public state = {
    markdownData: '',
  };

  // TODO: (Shikha: 20/06/2020) - Need to check data api data and remove axios call from screen
  public componentDidMount = async (): Promise<void> => {
    const {
      route: { params },
    } = this.props;
    const baseUrl = ConfigHelper.getBaseUrl();
    const urlEndpoint = params.isFrom === 'verification' ? 'VERIFICATION_DOCUMENT' : 'VISIT_PROPERTY_LOCATION';
    const user: IUser | null = await StorageService.get(StorageKeys.USER);
    if (user) {
      axios
        .get(`${baseUrl}markdown/${urlEndpoint}/`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${user.access_token}`,
          },
        })
        .then((res) => {
          this.setState({ markdownData: res.data });
        });
    }
  };

  public render(): React.ReactElement {
    const {
      route: { params },
    } = this.props;
    const { markdownData } = this.state;
    return (
      <View style={styles.container}>
        <Header
          type="primary"
          icon={icons.leftArrow}
          onIconPress={this.navigateBack}
          isHeadingVisible
          title={params.title ?? ''}
        />
        <ScrollView style={styles.scrollView}>
          <View style={styles.markdownContainer}>
            <Markdown markdownStyles={{ strong: { fontWeight: 'bold' }, text: { fontWeight: 'normal', fontSize: 16 } }}>
              {markdownData}
            </Markdown>
          </View>
        </ScrollView>
      </View>
    );
  }

  public navigateBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  markdownContainer: {
    margin: theme.layout.screenPadding,
  },
});
