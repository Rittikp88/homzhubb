import React, { PureComponent } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import ImageThumbnail from '@homzhub/common/src/components/atoms/ImageThumbnail';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import {
  ActivityQuotesApproved,
  ActivityQuotesSubmitted,
} from '@homzhub/common/src/components/molecules/ActivityQuoteCard';
import { TicketActivitySection } from '@homzhub/common/src/components/HOC/TicketActivitySection';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { Ticket, TicketStatus } from '@homzhub/common/src/domain/models/Ticket';
import { TicketActivity } from '@homzhub/common/src/domain/models/TicketActivity';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  ticketData: Ticket;
  onPressImage?: (imageNumber: number) => void;
  onPressQuote?: (url: string) => Promise<void>;
}

interface IActivityStatusBadge {
  data: string[];
  extraStyle?: ViewStyle;
}

type Props = IProps & WithTranslation;

class TicketActivityCard extends PureComponent<Props> {
  public render(): React.ReactNode {
    const { t, ticketData } = this.props;
    const { groupedActivities } = ticketData;

    return (
      <View style={styles.activityView}>
        <Text type="small" textType="semiBold" style={styles.activity}>
          {t('serviceTickets:activity')}
        </Text>
        {Object.keys(groupedActivities).map((key) => {
          return (
            <>
              <View style={styles.separator}>
                <View style={styles.dividerView} />
                <Label type="large" style={styles.dateOnSeparator}>
                  {key}
                </Label>
                <View style={styles.dividerView} />
              </View>
              {groupedActivities[key].map((activity) => this.renderActivities(activity))}
            </>
          );
        })}
      </View>
    );
  }

  private renderActivities = (activity: TicketActivity): React.ReactElement | null => {
    const { onPressQuote } = this.props;
    const {
      role,
      comment,
      createdAt,
      activityType: { label, code },
      user,
      data,
    } = activity;

    if (!data) return null;

    const renderActivityData = (): React.ReactElement | null => {
      switch (code) {
        case TicketStatus.QUOTE_SUBMITTED:
          return <ActivityQuotesSubmitted quoteData={data.quoteRequestCategory} onQuotePress={onPressQuote} />;
        case TicketStatus.QUOTE_APPROVED:
          return <ActivityQuotesApproved quoteData={data.quotes} description={comment} />;
        case TicketStatus.WORK_COMPLETED:
          return this.renderWorkCompleted(data.attachments);
        case TicketStatus.TICKET_RAISED:
        case TicketStatus.QUOTE_REQUESTED:
        default:
          return this.renderActivityStatusBadge({ data: this.getActionContent(code) });
      }
    };

    return (
      <TicketActivitySection role={role} user={user} time={createdAt} label={label} description={comment}>
        {renderActivityData()}
      </TicketActivitySection>
    );
  };

  private renderWorkCompleted = (attachments: Attachment[]): React.ReactElement => {
    const { t, onPressImage = FunctionUtils.noop } = this.props;
    const count = attachments.length;
    const customStyle = customStyles(count);

    return (
      <>
        {attachments.length > 0 && (
          <View style={styles.completedQuotesContainer}>
            <Label textType="semiBold" type="large" style={styles.completedLabel}>
              {t('uploadedPhotos')}
            </Label>
            <ImageThumbnail
              imageUrl={attachments[0].link}
              isIconVisible={false}
              isLastThumbnail={false}
              containerStyle={styles.thumbnailContainer}
              imageWrapperStyle={styles.thumbnailHeight}
              onPressLastThumbnail={(): void => onPressImage(0)}
              onPressImage={(): void => onPressImage(0)}
            />
            {count > 1 && (
              <View style={styles.thumbnailView}>
                <ImageThumbnail
                  imageUrl={attachments[1].link}
                  isIconVisible={false}
                  isLastThumbnail={false}
                  containerStyle={customStyle.thumbnailLeft}
                  imageWrapperStyle={styles.thumbnailHeight}
                  onPressImage={(): void => onPressImage(1)}
                />
                {count > 2 && (
                  <ImageThumbnail
                    imageUrl={attachments[2].link}
                    isIconVisible={false}
                    isLastThumbnail={count > 3}
                    dataLength={count - 3}
                    containerStyle={customStyle.thumbnailRight}
                    imageWrapperStyle={styles.thumbnailHeight}
                    onPressLastThumbnail={(): void => onPressImage(2)}
                  />
                )}
              </View>
            )}
          </View>
        )}
        {this.renderActivityStatusBadge({ data: [t('ticketClosed')] })}
      </>
    );
  };

  private renderActivityStatusBadge = (props: IActivityStatusBadge): React.ReactElement => {
    const { data, extraStyle } = props;

    return (
      <View style={[styles.activityBadgeContainer, extraStyle]}>
        {data.map((status: string, index: number) => (
          <Badge
            badgeColor={theme.colors.gray11}
            title={status}
            badgeStyle={styles.activityBadge}
            titleStyle={styles.activityBadgeText}
            key={index}
          />
        ))}
      </View>
    );
  };

  private getActionContent = (code: string): string[] => {
    const { t } = this.props;
    switch (code) {
      case TicketStatus.TICKET_RAISED:
        return [t('ticketAssignedTo', { name: 'Homzhub' }), t('awaitingAction', { name: 'Homzhub' })];
      case TicketStatus.QUOTE_REQUESTED:
        return [t('awaitingQuotes')];
      default:
        return [];
    }
  };
}

export default withTranslation(LocaleConstants.namespacesKey.serviceTickets)(TicketActivityCard);

const styles = StyleSheet.create({
  activityView: {
    backgroundColor: theme.colors.background,
  },
  activity: {
    marginTop: 20,
  },
  activityBadgeContainer: {
    marginBottom: 16,
  },
  activityBadge: {
    marginTop: 16,
    minHeight: 26,
    justifyContent: 'center',
    borderRadius: 6,
    marginEnd: 16,
  },
  activityBadgeText: {
    color: theme.colors.darkTint4,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  dateOnSeparator: {
    paddingHorizontal: 10,
  },
  dividerView: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.darkTint10,
    width: 150,
  },
  thumbnailContainer: {
    flex: 1,
    marginVertical: 4,
  },

  thumbnailHeight: {
    height: 120,
  },
  completedQuotesContainer: {
    backgroundColor: theme.colors.gray8,
    padding: 16,
    paddingTop: 5,
    marginTop: 16,
    borderRadius: 5,
    marginEnd: 16,
  },
  completedLabel: {
    marginVertical: 5,
  },
  thumbnailView: {
    flex: 1,
    flexDirection: 'row',
  },
});

interface IStyles {
  thumbnailLeft: ViewStyle;
  thumbnailRight: ViewStyle;
}

const customStyles = (count = 0): IStyles => {
  return StyleSheet.create({
    thumbnailLeft: {
      flex: 1,
      marginRight: count > 2 ? 6.5 : 0,
    },
    thumbnailRight: {
      flex: 1,
      marginLeft: count > 2 ? 6.5 : 0,
    },
  });
};
