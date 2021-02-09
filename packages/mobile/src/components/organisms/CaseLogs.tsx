import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { PdfView } from '@homzhub/mobile/src/components/atoms/PdfView';
import { SearchBar } from '@homzhub/common/src/components/molecules/SearchBar';
import { CaseLog } from '@homzhub/common/src/mocks/CaseLogs';

interface IScreenState {
  searchQuery: string;
}

interface ICaseDetails {
  [key: string]: string;
  case_id: string;
  date: string;
  category: string;
  status: string;
}

type Props = WithTranslation;

export class CaseLogs extends React.PureComponent<Props, IScreenState> {
  public state = {
    searchQuery: '',
  };

  public render = (): React.ReactNode => {
    const { t } = this.props;
    const { searchQuery } = this.state;
    return (
      <>
        <SearchBar
          placeholder={t('assetDashboard:searchByKeyword')}
          value={searchQuery}
          updateValue={this.onUpdateSearchText}
          containerStyle={styles.searchBar}
        />
        {this.renderCaseLogs()}
      </>
    );
  };

  private renderCaseLogs = (): React.ReactNode => {
    const { searchQuery } = this.state;
    const arrToDisplay = searchQuery
      ? CaseLog.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : CaseLog;
    if (arrToDisplay.length <= 0) {
      return <EmptyState />;
    }
    return arrToDisplay.map((item) => {
      const CaseDetails = {
        case_id: item.ticket_number,
        date: DateUtils.getUtcFormatted(item.raised_at, DateFormats.ISO24Format, DateFormats.DD_MMM_YYYY),
        category: item.support_category.label,
        status: item.status,
      };

      return (
        <>
          {item.title && (
            <Label type="large" textType="semiBold" style={styles.title}>
              {item.title}
            </Label>
          )}
          {this.renderCaseLogDetails(CaseDetails)}
          {item.description && (
            <Label type="large" textType="regular" style={styles.description}>
              {item.description}
            </Label>
          )}
          {item.attachments &&
            item.attachments.map((attachments) =>
              attachments.media_type === 'IMAGE' ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: attachments.link,
                    }}
                    style={styles.image}
                  />
                </View>
              ) : (
                <>
                  <PdfView source={{ uri: attachments.link }} fileName={attachments.file_name} />
                </>
              )
            )}
          <Divider containerStyles={styles.divider} />
        </>
      );
    });
  };

  private renderCaseLogDetails = (logs: ICaseDetails): React.ReactElement => {
    return (
      <View style={styles.detailsContainer}>
        {Object.keys(logs).map((key, index: number) => (
          <View key={index} style={styles.detailsColumn}>
            <Label type="small" textType="regular" style={styles.details}>
              {StringUtils.toTitleCase(key.replace('_', ' '))}
            </Label>
            <Label type="regular" textType="semiBold" style={styles.details}>
              {logs[key]}
            </Label>
          </View>
        ))}
      </View>
    );
  };

  private onUpdateSearchText = (searchQuery: string): void => {
    this.setState({ searchQuery });
  };
}

const styles = StyleSheet.create({
  searchBar: {
    marginTop: 24,
  },
  details: {
    color: theme.colors.darkTint3,
    marginBottom: 6,
  },
  description: {
    color: theme.colors.darkTint4,
    marginTop: 20,
  },
  title: {
    color: theme.colors.darkTint3,
    marginTop: 16,
    marginBottom: 12,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  detailsColumn: {
    flexDirection: 'column',
    width: '50%',
  },
  imageContainer: {
    marginTop: 16,
    width: 350,
    height: 160,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  divider: {
    marginTop: 16,
  },
});

export default withTranslation()(CaseLogs);
