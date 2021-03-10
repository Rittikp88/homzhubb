import React, { useState } from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { TicketRepository } from '@homzhub/common/src/domain/repositories/TicketRepository';
import Icon from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import EditableTextArea from '@homzhub/common/src/components/molecules/EditableTextArea';
import { Ticket, TicketPriority, TicketStatus } from '@homzhub/common/src/domain/models/Ticket';
import {
  ExperienceType,
  IExperienceData,
  initialExperienceData,
  ServiceTicketStatus,
} from '@homzhub/common/src/constants/ServiceTickets';

interface IDataType {
  [key: string]: string;
}

interface IProps {
  cardData: Ticket;
  onCardPress: () => void;
  isFromMore?: boolean;
  onSubmitReview: () => void;
}

const getIconColor = (type: ExperienceType): string => {
  switch (type) {
    case ExperienceType.SATISFIED:
      return theme.colors.green;
    case ExperienceType.NEUTRAL:
      return theme.colors.mediumPriority;
    case ExperienceType.UNSATISFIED:
      return theme.colors.error;
    default:
      return theme.colors.darkTint9;
  }
};

const StatusCode = (type: string): string => {
  switch (type) {
    case ServiceTicketStatus.OPEN:
      return theme.colors.red;
    case ServiceTicketStatus.PAYMENT_DONE:
      return theme.colors.greenTint7;
    case ServiceTicketStatus.PAYMENT_REQUESTED:
      return theme.colors.pinkRed;
    case ServiceTicketStatus.QUOTES_APPROVED:
      return theme.colors.greenTint6;
    case ServiceTicketStatus.QUOTES_REQUESTED:
      return theme.colors.blueTint5;
    case ServiceTicketStatus.QUOTES_SUBMITTED:
      return theme.colors.blueTint4;
    case ServiceTicketStatus.WORK_INITIATED:
      return theme.colors.blueTint3;
    case ServiceTicketStatus.CLOSED:
      return theme.colors.greenTint8;
    default:
      return theme.colors.darkTint3;
  }
};

const cardColor = (type: string): string => {
  switch (type) {
    case TicketPriority.HIGH:
      return theme.colors.error;
    case TicketPriority.MEDIUM:
      return theme.colors.yellow;
    case TicketPriority.LOW:
      return theme.colors.blue;
    default:
      return theme.colors.darkTint3;
  }
};

const setEmojiColor = (
  experienceType: ExperienceType | string,
  experienceData: IExperienceData[],
  callback?: (selectedExperience: IExperienceData) => void
): IExperienceData[] => {
  let updatedExperienceData = experienceData;

  if (experienceType) {
    updatedExperienceData = experienceData.map((item, index) => {
      if (item.type === experienceType) {
        if (callback) {
          callback(item);
        }
        return { ...item, color: getIconColor(experienceType) };
      }
      return initialExperienceData[index];
    });
  }

  return updatedExperienceData;
};

export const TicketCard = (props: IProps): React.ReactElement => {
  const { cardData, onCardPress, isFromMore = false, onSubmitReview } = props;
  const {
    title,
    createdAt,
    updatedAt,
    status,
    closedAt,
    closedBy,
    id,
    location,
    review: { rating, description },
    experienceType,
  } = cardData;
  // HOOKS START

  const { t } = useTranslation();
  const [experienceData, setExperienceData] = useState(setEmojiColor(experienceType, initialExperienceData));
  const [ticketInfo, setTicketInfo] = useState({
    experience: experienceType,
    showComment: !!description,
    comment: description,
    rating,
  });

  // HOOKS END

  const isClosed = status === TicketStatus.CLOSED;

  // Data formation for closed and open tickets
  const openTicket = {
    'serviceTickets:createdOn': DateUtils.convertDateFormatted(createdAt),
    'serviceTickets:updatedOn': DateUtils.convertDateFormatted(updatedAt),
    'helpAndSupport:status': StringUtils.toTitleCase(status),
    'serviceTickets:assignedTo': 'Homzhub', // TODO: (Shikha) Remove after demo and use AssignedTo
  };
  const closedTicket = {
    'serviceTickets:closedOn': DateUtils.convertDateFormatted(closedAt),
    'serviceTickets:closedBy': closedBy.firstName,
  };

  const dataByStatus: IDataType = isClosed ? closedTicket : openTicket;

  // HANDLERS START

  const handleExperience = (type: ExperienceType): void => {
    setExperienceData(
      setEmojiColor(type, experienceData, (selectedExperience: IExperienceData) =>
        setTicketInfo((prevState) => ({
          ...prevState,
          showComment: true,
          experience: type,
          rating: selectedExperience.rating,
        }))
      )
    );
  };

  const clearExperience = (): void => {
    const updatedData = experienceData.map((item, index) => {
      setTicketInfo((prevState) => ({ ...prevState, experience: '', rating: -1 }));
      return initialExperienceData[index];
    });
    setTicketInfo((prevState) => ({ ...prevState, showComment: false, comment: '' }));
    setExperienceData(updatedData);
  };

  const onChangeComment = (value: string): void => {
    setTicketInfo((prevState) => ({ ...prevState, comment: value }));
  };

  const submitReview = (): void => {
    const { rating: ticketRating, comment } = ticketInfo;

    const payload = {
      param: { ticketId: id },
      data: { rating: ticketRating, description: comment },
    };

    TicketRepository.reviewSubmit(payload).then();
    onSubmitReview();
    clearExperience();
  };

  const onColorChange = (value: string): TextStyle => {
    const color = StatusCode(value);
    return { ...styles.detail, color };
  };
  // HANDLERS END

  const { experience, showComment, comment } = ticketInfo;

  const renderIconView = (): React.ReactElement => {
    const isReviewed = rating > 0;
    return (
      <View style={styles.experienceContent}>
        <Divider containerStyles={styles.divider} />
        <Label type="large">{t('common:experience')}</Label>
        <View style={styles.iconView}>
          <>
            <View style={styles.row}>
              {experienceData.map((item, index) => {
                return (
                  <Icon
                    key={index}
                    name={item.icon}
                    color={item.color}
                    size={28}
                    style={styles.iconPadding}
                    onPress={isReviewed ? FunctionUtils.noop : (): void => handleExperience(item.type)}
                  />
                );
              })}
            </View>
            <Label type="large" textType="semiBold">
              {experience}
            </Label>
          </>
        </View>
        {showComment && (
          <EditableTextArea
            message={comment}
            onCancelPress={clearExperience}
            showCancel
            onChangeMessage={onChangeComment}
            onSubmit={submitReview}
            isEditable={!(rating > 0)}
            containerStyle={styles.commentBox}
          />
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onCardPress}>
      <View style={styles.row}>
        <View style={[styles.line, { backgroundColor: cardColor(cardData.priority) }]} />
        <View>
          <View style={styles.titleView}>
            <Label type="large" textType="semiBold" style={styles.title}>
              {title}
            </Label>
            {isFromMore && (
              <Label type="regular" style={styles.subTitle}>
                {location}
              </Label>
            )}
          </View>
          <View style={styles.detailsContainer}>
            {Object.keys(dataByStatus).map((key, indexValue: number) => (
              <View key={indexValue} style={styles.detailsColumn}>
                <Label type="small" textType="regular" style={styles.details}>
                  {t(key)}
                </Label>
                <Label type="regular" textType="semiBold" style={onColorChange(dataByStatus[key])}>
                  {dataByStatus[key]}
                </Label>
              </View>
            ))}
          </View>
        </View>
      </View>
      {isClosed && renderIconView()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: theme.colors.darkTint10,
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 16,
    marginBottom: 20,
  },
  details: {
    color: theme.colors.darkTint3,
    marginBottom: 6,
  },
  detailsColumn: {
    paddingTop: 12,
    width: '50%',
  },
  line: {
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
    paddingLeft: 5,
    width: 3,
    backgroundColor: theme.colors.error,
    marginVertical: 18,
  },
  buttonContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    flex: 0,
  },
  detail: {
    color: theme.colors.darkTint3,
  },
  buttonTitle: {
    marginHorizontal: 12,
    marginVertical: 6,
  },
  divider: {
    marginBottom: 10,
  },
  submit: {
    marginStart: 12,
  },
  textArea: {
    height: 80,
    borderRadius: 4,
  },
  experienceContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  iconView: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconPadding: {
    marginRight: 15,
  },
  titleView: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  title: {
    color: theme.colors.darkTint3,
  },
  subTitle: {
    color: theme.colors.darkTint4,
  },
  commentBox: {
    marginTop: 16,
  },
});
