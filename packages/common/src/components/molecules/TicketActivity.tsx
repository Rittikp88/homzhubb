import React from 'react';
import { ImageStyle, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import ImageThumbnail from '@homzhub/common/src/components/atoms/ImageThumbnail';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import {
  ActivityQuotesApproved,
  ActivityQuotesSubmitted,
} from '@homzhub/common/src/components/molecules/ActivityQuoteCard';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { TicketActivity } from '@homzhub/common/src/domain/models/TicketActivity';
import { User } from '@homzhub/common/src/domain/models/User';
import { ServiceTicketStatus } from '@homzhub/common/src/constants/ServiceTickets';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

type onPressImage = (imageNumber: number) => void;
type onPressQuote = (url: string) => Promise<void>;

interface IProps {
  ticketData: Ticket;
  onPressImage?: onPressImage;
  onPressQuote?: onPressQuote;
}
interface ITicketActivity {
  role: string;
  user: User;
  time: string;
  label: string;
  description: string;
  children: React.ReactNode;
}

interface IActivityStatusBadge {
  data: string[];
  extraStyle?: ViewStyle;
}

interface IActivity {
  activity: TicketActivity;
  onPressQuoteHandler?: onPressQuote;
  onPressImageHandler?: onPressImage;
}
interface IActivityWorkCompleted {
  attachments: Attachment[];
  onPressImage: onPressImage;
}

const TicketActivityComponent = (props: ITicketActivity): React.ReactElement => {
  const {
    user: { profilePicture, name },
    role,
    time,
    label,
    description,
    children,
  } = props;
  const styles = getStyles();
  return (
    <View style={styles.activityHolder}>
      <Avatar
        image={profilePicture}
        fullName={name}
        isOnlyAvatar
        imageSize={45}
        containerStyle={styles.avatar}
        rating={8}
      />
      <View style={styles.flexSix}>
        <View style={styles.activityTextTop}>
          <Label type="regular" textType="regular">
            {role}
          </Label>
          <Label type="regular" textType="regular" style={styles.timeLabel}>
            {DateUtils.getDisplayDate(time, DateFormats.HHMM_AP)}
          </Label>
        </View>
        <Text type="small" textType="semiBold" style={styles.ticketStatus}>
          {label}
        </Text>
        <Label type="large" textType="regular">
          {description}
        </Label>
        {children}
      </View>
    </View>
  );
};

const ActivityStatusBadge = (props: IActivityStatusBadge): React.ReactElement => {
  const { data, extraStyle } = props;
  const styles = getStyles();
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

const ActivityWorkCompleted = (props: IActivityWorkCompleted): React.ReactElement => {
  const { attachments, onPressImage } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const count = attachments.length;
  const styles = getStyles(count);

  const onPressFirstImage = (): void => onPressImage(0);
  const onPressSecondImage = (): void => onPressImage(1);
  const onPressExtraImage = (): void => onPressImage(2);

  return (
    <>
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
          onPressLastThumbnail={onPressFirstImage}
          onPressImage={onPressFirstImage}
        />
        {count > 1 && (
          <View style={styles.thumbnailView}>
            <ImageThumbnail
              imageUrl={attachments[1].link}
              isIconVisible={false}
              isLastThumbnail={false}
              containerStyle={styles.thumbnailLeft}
              imageWrapperStyle={styles.thumbnailHeight}
              onPressImage={onPressSecondImage}
            />
            {count > 2 && (
              <ImageThumbnail
                imageUrl={attachments[2].link}
                isIconVisible={false}
                isLastThumbnail={count > 3}
                dataLength={count - 3}
                containerStyle={styles.thumbnailRight}
                imageWrapperStyle={styles.thumbnailHeight}
                onPressLastThumbnail={onPressExtraImage}
              />
            )}
          </View>
        )}
      </View>
      <ActivityStatusBadge data={[t('ticketClosed')]} />
    </>
  );
};

const TicketRaised = (props: IActivity): React.ReactElement | null => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const { activity } = props;
  const {
    role,
    comment,
    createdAt,
    activityType: { label },
    user,
    data,
  } = activity;

  if (!data) return null;
  const {
    assignedTo: { name },
  } = data;
  const actionContent = [t('ticketAssignedTo', { name }), t('awaitingAction', { name })];

  return (
    <TicketActivityComponent role={role} user={user} time={createdAt} label={label} description={comment}>
      <ActivityStatusBadge data={actionContent} />
    </TicketActivityComponent>
  );
};

const TicketQuotesSubmitted = (props: IActivity): React.ReactElement | null => {
  const { activity, onPressQuoteHandler = FunctionUtils.noopAsync } = props;
  const {
    role,
    comment,
    createdAt,
    activityType: { label },
    user,
    data,
  } = activity;

  if (!data) return null;

  return (
    <TicketActivityComponent role={role} user={user} time={createdAt} label={label} description={comment}>
      <ActivityQuotesSubmitted quoteData={data.quoteRequestCategory} onQuotePress={onPressQuoteHandler} />
    </TicketActivityComponent>
  );
};

const TicketQuotesApproved = (props: IActivity): React.ReactElement | null => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const { activity } = props;
  const {
    role,
    comment,
    createdAt,
    activityType: { label },
    user,
    data,
  } = activity;
  if (!data) return null;
  return (
    <TicketActivityComponent role={role} user={user} time={createdAt} label={label} description={comment}>
      <ActivityQuotesApproved quoteData={data.quotes} description={t('approvedQuotesDescription')} />
    </TicketActivityComponent>
  );
};

const TicketWorkCompleted = (props: IActivity): React.ReactElement | null => {
  const { activity, onPressImageHandler = FunctionUtils.noop } = props;
  const {
    role,
    comment,
    createdAt,
    activityType: { label },
    user,
    data,
  } = activity;

  if (!data) return null;

  return (
    <TicketActivityComponent role={role} user={user} time={createdAt} label={label} description={comment}>
      <ActivityWorkCompleted attachments={data.attachments} onPressImage={onPressImageHandler} />
    </TicketActivityComponent>
  );
};

const mapActivities = (
  activities: TicketActivity[],
  onPressQuote: onPressQuote,
  onPressImageHandler: onPressImage
): React.ReactElement[] => {
  return activities.map((activity) => handleActivities(activity, onPressQuote, onPressImageHandler));
};

const handleActivities = (
  activity: TicketActivity,
  onPressQuoteHandler: onPressQuote,
  onPressImageHandler: onPressImage
): React.ReactElement => {
  const {
    activityType: { label },
  } = activity;

  switch (label) {
    case ServiceTicketStatus.TICKET_RAISED:
      return <TicketRaised activity={activity} />;
    case ServiceTicketStatus.QUOTES_SUBMITTED:
      return <TicketQuotesSubmitted activity={activity} onPressQuoteHandler={onPressQuoteHandler} />;
    case ServiceTicketStatus.QUOTES_APPROVED:
      return <TicketQuotesApproved activity={activity} onPressQuoteHandler={onPressQuoteHandler} />;
    case ServiceTicketStatus.WORK_COMPLETED:
      return <TicketWorkCompleted activity={activity} onPressImageHandler={onPressImageHandler} />;
    default:
      return <></>;
  }
};

const TicketActivityCard = (props: IProps): React.ReactElement => {
  const { ticketData, onPressImage = FunctionUtils.noop, onPressQuote = FunctionUtils.noopAsync } = props;
  const { createdAt, activities } = ticketData;
  const { t } = useTranslation();
  const styles = getStyles();

  const ActivityHeader = (): React.ReactElement => (
    <Text type="small" textType="semiBold" style={styles.activity}>
      {t('serviceTickets:activity')}
    </Text>
  );

  const ActivityDate = (): React.ReactElement => {
    return (
      <View style={styles.separator}>
        <View style={styles.dividerView} />
        <Label type="large" style={styles.dateOnSeparator}>
          {DateUtils.getDisplayDate(createdAt, DateFormats.DDMMMYYYY)}
        </Label>
        <View style={styles.dividerView} />
      </View>
    );
  };

  return (
    <View style={styles.activityView}>
      <ActivityHeader />
      <ActivityDate />
      {mapActivities(activities, onPressQuote, onPressImage)}
    </View>
  );
};

export default React.memo(TicketActivityCard);

interface IStyles {
  activityView: ViewStyle;
  activity: ViewStyle;
  activityHolder: ViewStyle;
  avatar: ViewStyle;
  timeLabel: ViewStyle;
  flexSix: ViewStyle;
  activityTextTop: ViewStyle;
  ticketStatus: ViewStyle;
  activityBadgeContainer: ViewStyle;
  activityBadge: ViewStyle;
  activityBadgeText: TextStyle;
  separator: ViewStyle;
  dateOnSeparator: ViewStyle;
  dividerView: ViewStyle;
  thumbnailContainer: ViewStyle;
  thumbnailLeft: ViewStyle;
  thumbnailRight: ViewStyle;
  thumbnailHeight: ImageStyle;
  completedQuotesContainer: ViewStyle;
  completedLabel: ViewStyle;
  thumbnailView: ViewStyle;
}

const getStyles = (count = 0): IStyles =>
  StyleSheet.create({
    activityView: {
      backgroundColor: theme.colors.background,
    },
    activity: {
      marginTop: 20,
    },
    activityHolder: {
      flex: 1,
      flexDirection: 'row',
      marginTop: 20,
    },
    avatar: {
      flex: 1.2,
      marginLeft: 10,
    },
    timeLabel: {
      marginRight: 10,
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
    thumbnailLeft: {
      flex: 1,
      marginRight: count > 2 ? 6.5 : 0,
    },
    thumbnailRight: {
      flex: 1,
      marginLeft: count > 2 ? 6.5 : 0,
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
