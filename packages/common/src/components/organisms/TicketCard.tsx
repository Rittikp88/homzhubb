import React from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import TicketReview from '@homzhub/common/src/components/organisms/ServiceTickets/TicketReview';
import { Ticket, TicketPriority, TicketStatus } from '@homzhub/common/src/domain/models/Ticket';
import { TicketStatusTitle } from '@homzhub/common/src/constants/ServiceTickets';

interface IDataType {
  [key: string]: string;
}

interface IProps {
  cardData: Ticket;
  onCardPress: () => void;
  isFromMore?: boolean;
  onSubmitReview: () => void;
  isOddElement: boolean;
  renderWebRating?: (children: React.ReactElement, onClose: () => void, isOpen: boolean) => React.ReactElement;
}

/* Get color for status  */
const getStatusColor = (type: string): string => {
  switch (type) {
    case TicketStatus.OPEN:
      return theme.colors.red;
    case TicketStatus.QUOTE_REQUESTED:
      return theme.colors.blueTint5;
    case TicketStatus.QUOTE_SUBMITTED:
      return theme.colors.blueTint4;
    case TicketStatus.QUOTE_APPROVED:
      return theme.colors.greenTint6;
    case TicketStatus.PAYMENT_REQUESTED:
      return theme.colors.pinkRed;
    case TicketStatus.PAYMENT_DONE:
      return theme.colors.greenTint7;
    case TicketStatus.WORK_INITIATED:
      return theme.colors.blueTint3;
    case TicketStatus.CLOSED:
      return theme.colors.greenTint8;
    default:
      return theme.colors.darkTint3;
  }
};

/* Get color for card border  */
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

/* Get values for card keys  */
const keyValue = (key: string, data: IDataType): string => {
  if (key === 'helpAndSupport:status') {
    const status = data[key] as TicketStatus;
    // @ts-ignore
    return TicketStatusTitle[status];
  }
  return data[key];
};

export const TicketCard = (props: IProps): React.ReactElement => {
  const { cardData, onCardPress, isFromMore = false, onSubmitReview, isOddElement, renderWebRating } = props;
  const {
    title,
    createdAt,
    updatedAt,
    status,
    closedAt,
    closedBy,
    asset: { formattedAddressWithProjectAndCity },
    assignedTo: { fullName },
  } = cardData;

  const { t } = useTranslation();

  const isClosed = status === TicketStatus.CLOSED;

  // Data formation for closed and open tickets
  const openTicket = {
    'serviceTickets:createdOn': DateUtils.convertDateFormatted(createdAt),
    'serviceTickets:updatedOn': DateUtils.convertDateFormatted(updatedAt),
    'helpAndSupport:status': status,
    'serviceTickets:assignedTo': fullName,
  };
  const closedTicket = {
    'serviceTickets:closedOn': DateUtils.convertDateFormatted(closedAt),
    'serviceTickets:closedBy': closedBy.firstName,
  };

  const dataByStatus: IDataType = isClosed ? closedTicket : openTicket;

  // HANDLERS START

  const onColorChange = (value: string): TextStyle => {
    const color = getStatusColor(value);
    return { ...styles.detail, color };
  };
  // HANDLERS END

  const renderRatingSheet = (children: React.ReactElement, onClose: () => void): React.ReactElement => {
    return (
      <BottomSheet visible headerTitle={t('serviceTickets:ticketReview')} sheetHeight={600} onCloseSheet={onClose}>
        {children}
      </BottomSheet>
    );
  };

  const renderRatingView = (): React.ReactElement => {
    return (
      <View style={styles.experienceContent}>
        <Divider containerStyles={styles.divider} />
        <TicketReview
          ticketData={cardData}
          renderRatingForm={renderWebRating && !PlatformUtils.isMobile() ? renderWebRating : renderRatingSheet}
          successCallback={onSubmitReview}
        />
      </View>
    );
  };

  const isWeb = PlatformUtils.isWeb();

  return (
    <View style={[styles.container, isWeb && isOddElement ? styles.oddElement : styles.evenElement]}>
      <TouchableOpacity onPress={onCardPress}>
        <View style={styles.row}>
          <View style={[styles.line, { backgroundColor: cardColor(cardData.priority) }]} />
          <View>
            <View style={styles.titleView}>
              <Label type="large" textType="semiBold" style={styles.title}>
                {title}
              </Label>
              {isFromMore && (
                <Label type="regular" style={styles.subTitle}>
                  {formattedAddressWithProjectAndCity}
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
                    {keyValue(key, dataByStatus)}
                  </Label>
                </View>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {isClosed && renderRatingView()}
    </View>
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
  oddElement: {
    maxWidth: '50%',
  },
  evenElement: {
    marginHorizontal: '1%',
  },
});
