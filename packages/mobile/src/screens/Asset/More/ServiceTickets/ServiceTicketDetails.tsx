import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { theme } from '@homzhub/common/src/styles/theme';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { AssetDetailsImageCarousel, FullScreenAssetDetailsCarousel } from '@homzhub/mobile/src/components';
import { mockChatMedia } from '@homzhub/common/src/mocks/ChatMedia';
import { mockTicket, sampleDetails } from '@homzhub/common/src/constants/ServiceTickets';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

// TODO (Praharsh : 04/03/2021) : Replace param
type NavProps = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.SubmitQuote>;

type Props = NavProps & WithTranslation;

// TODO (Praharsh : 04/03/2021) : Replace Ticket with Model as per contract
interface ITicket {
  type: string;
  value: string;
}

interface IScreenState {
  activeSlide: number;
  isFullScreen: boolean;
}
class ServiceTicketDetails extends React.Component<Props, IScreenState> {
  public state: IScreenState = {
    activeSlide: 0,
    isFullScreen: false,
  };

  public render = (): React.ReactElement => {
    const {
      navigation: { goBack },
      t,
    } = this.props;
    return (
      <UserScreen
        title="Property Name"
        pageTitle={t('serviceTickets:ticketDetails')}
        loading={false}
        onBackPress={goBack}
      >
        {this.renderFullscreenCarousel()}
        {this.detailsCard()}
        <View style={styles.activityView}>
          {this.renderActivity()}
          {this.statusSeparator()}
          {this.renderActivityCard()}
          {/* Remaining renders fall here (Take Action button) */}
        </View>
      </UserScreen>
    );
  };

  private renderActivity = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <View style={styles.activityHeader}>
        <Text type="small" textType="semiBold">
          {t('serviceTickets:activity')}
        </Text>
      </View>
    );
  };

  private renderCarousel = (): React.ReactElement => {
    const { activeSlide } = this.state;

    if (!mockChatMedia.length) {
      return <ImagePlaceholder height="100%" containerStyle={styles.placeholder} />;
    }
    return (
      <AssetDetailsImageCarousel
        enterFullScreen={this.onFullScreenToggle}
        // TODO (Praharsh : 04/03/2021) - Replace with attachments.
        data={mockChatMedia}
        activeSlide={activeSlide}
        updateSlide={this.updateSlide}
        containerStyles={styles.carousel}
      />
    );
  };

  private renderFullscreenCarousel = (): React.ReactElement | null => {
    const { isFullScreen, activeSlide } = this.state;
    if (!isFullScreen) return null;
    return (
      <FullScreenAssetDetailsCarousel
        onFullScreenToggle={this.onFullScreenToggle}
        activeSlide={activeSlide}
        // TODO (Praharsh : 04/03/2021) - Replace with attachments.
        data={mockChatMedia}
        updateSlide={this.updateSlide}
      />
    );
  };

  private renderActivityCard = (): React.ReactElement => {
    const { t } = this.props;
    const { avatar, role, time, status, description, timeLine } = mockTicket.activity.stage1;
    return (
      <View style={styles.activityHolder}>
        <Avatar image={avatar} isOnlyAvatar imageSize={45} containerStyle={styles.avatar} />
        <View style={styles.flexSix}>
          <View style={styles.activityTextTop}>
            <Label type="regular" textType="regular">
              {t(role)}
            </Label>
            <Label type="regular" textType="regular">
              {time}
            </Label>
          </View>
          <Text type="small" textType="semiBold" style={styles.ticketStatus}>
            {t(status)}
          </Text>
          <Label type="large" textType="regular">
            {t(description)}
          </Label>
          <View style={styles.activityBadgeContainer}>
            <Badge
              badgeColor={theme.colors.gray11}
              title={t(timeLine[0])}
              badgeStyle={styles.activityBadge}
              titleStyle={styles.activityBadgeText}
            />
            <Badge
              badgeColor={theme.colors.gray11}
              title={t(timeLine[1])}
              badgeStyle={styles.activityBadge}
              titleStyle={styles.activityBadgeText}
            />
          </View>
        </View>
      </View>
    );
  };

  private renderDetails = (): React.ReactElement => {
    const details = this.formatDetails();
    const { t } = this.props;

    const keyExtractor = (item: ITicket, index: number): string => `${item}-${index}`;

    const renderItem = ({ item }: { item: ITicket }): React.ReactElement => {
      const { type, value } = item;
      return (
        <View style={styles.flexOne}>
          <Label textType="regular" type="regular">
            {t(type)}
          </Label>

          <Label textType="semiBold" type="large">
            {value}
          </Label>
        </View>
      );
    };
    return (
      <FlatList
        data={details}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.flatList}
        ItemSeparatorComponent={this.DetailSeparator}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  public onFullScreenToggle = (): void => {
    this.setState((prevState) => ({
      isFullScreen: !prevState.isFullScreen,
    }));
  };

  private DetailSeparator = (): React.ReactElement => <View style={styles.detailSeparator} />;

  private detailsCard = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <View style={styles.detailsCard}>
        {this.renderCarousel()}
        <View style={styles.details}>
          <Badge
            title={t('serviceTickets:priorityHigh')}
            textType="semiBold"
            badgeColor={theme.colors.highPriority}
            badgeStyle={styles.badgeStyle}
          />
          <Text textType="semiBold" type="small" style={styles.ticketTitle}>
            {mockTicket.title}
          </Text>
          {this.renderDetails()}
        </View>
      </View>
    );
  };

  // Date view that separates ticket statuses. Optional param for now
  private statusSeparator = (): React.ReactElement => {
    return (
      <View style={styles.separator}>
        <View style={styles.dividerView} />
        <Label type="large">{mockTicket.date}</Label>
        <View style={styles.dividerView} />
      </View>
    );
  };

  private formatDetails = (): ITicket[] => {
    const details = sampleDetails;
    return details;
  };

  public updateSlide = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };
}

export default withTranslation()(ServiceTicketDetails);

const styles = StyleSheet.create({
  details: {
    marginHorizontal: 16,
    marginVertical: 13,
  },
  activityView: {
    backgroundColor: theme.colors.background,
  },
  placeholder: {
    backgroundColor: theme.colors.darkTint5,
  },
  carousel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.viewport.width - 64,
    borderRadius: 10,
    height: 160,
    marginHorizontal: 16,
  },
  ticketTitle: {
    marginVertical: 8,
  },
  flatList: {
    marginTop: 5,
  },
  flexOne: {
    flex: 1,
  },
  badgeStyle: {
    minWidth: 75,
    paddingHorizontal: 8,
    paddingVertical: 1,
    alignSelf: 'flex-start',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  dividerView: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.darkTint10,
    width: 150,
  },
  detailsCard: {
    backgroundColor: theme.colors.white,
  },
  detailSeparator: {
    marginVertical: 7,
  },
  activityHeader: {
    marginTop: 20,
  },
  activityHolder: {
    flex: 1,
    flexDirection: 'row',
  },
  avatar: {
    flex: 1.2,
  },
  flexSix: {
    flex: 6,
  },
  activityTextTop: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  ticketStatus: {
    marginVertical: 4,
  },
  activityBadgeContainer: {
    marginBottom: 16,
  },
  activityBadge: {
    marginTop: 16,
    minHeight: 26,
    justifyContent: 'center',
    borderRadius: 6,
  },
  activityBadgeText: {
    color: theme.colors.darkTint3,
  },
});
