import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import RatingForm from '@homzhub/common/src/components/molecules/RatingForm';
import { Pillar, PillarTypes } from '@homzhub/common/src/domain/models/Pillar';
import { Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { IListingReviewParams } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  ticketData: Ticket;
  renderRatingForm: (children: React.ReactElement, onClose: () => void) => React.ReactElement;
}

const TicketReview = (props: IProps): React.ReactElement => {
  const {
    ticketData: { title, createdAt },
    renderRatingForm,
  } = props;
  const [isReview, setIsReview] = useState(false);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const timeElapsed = DateUtils.getTimeElapsedInDays(createdAt);
  const { t } = useTranslation();

  useEffect(() => {
    CommonRepository.getPillars(PillarTypes.SERVICE_TICKET_REVIEW)
      .then((res) => {
        setPillars(res);
      })
      .catch((e) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      });
  }, []);

  const onCloseForm = (): void => {
    setIsReview(false);
  };

  const onUpdate = async (payload: IListingReviewParams): Promise<void> => {
    // TODO:  (Shikha) - Call Update API
  };

  const onSubmit = async (payload: IListingReviewParams): Promise<void> => {
    // TODO:  (Shikha) - Call Submit API
  };

  const renderRating = (): React.ReactElement => {
    const data = [
      {
        type: t('serviceTickets:createdOn'),
        value: DateUtils.getDisplayDate(createdAt, DateFormats.DDMM_YYYY_HH_MM),
      },
      {
        type: t('serviceTickets:timeElapsed'),
        value: `${timeElapsed} ${t(timeElapsed === 1 ? 'common:day' : 'common:days')}`,
      },
    ];

    return (
      <View style={styles.container}>
        <Text textType="semiBold" type="small" style={styles.ticketTitle}>
          {title}
        </Text>
        <View style={styles.detailContainer}>
          {data.map((item, index) => {
            return (
              <View key={index} style={styles.detailItem}>
                <Label textType="regular" type="small" style={styles.label}>
                  {item.type}
                </Label>
                <Label textType="semiBold" type="regular" style={styles.label}>
                  {item.value}
                </Label>
              </View>
            );
          })}
        </View>
        <Divider containerStyles={styles.dividerStyle} />
        <RatingForm
          ratings={pillars}
          onUpdate={onUpdate}
          onSubmit={onSubmit}
          secondaryAction={onCloseForm}
          containerStyle={styles.form}
        />
      </View>
    );
  };

  return (
    <>
      <Button // TODO: (Shikha) - Handle Reviewed case
        type="primary"
        textType="label"
        textSize="large"
        title={t('common:writReview')}
        onPress={(): void => setIsReview(!isReview)}
        containerStyle={styles.buttonContainer}
        titleStyle={styles.buttonTitle}
      />
      {isReview && renderRatingForm(renderRating(), onCloseForm)}
    </>
  );
};

export default TicketReview;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    flex: 1,
  },
  detailContainer: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  buttonContainer: {
    backgroundColor: theme.colors.lightGrayishBlue,
    marginVertical: 12,
  },
  dividerStyle: {
    marginVertical: 10,
    borderColor: theme.colors.background,
  },
  buttonTitle: {
    color: theme.colors.primaryColor,
    marginVertical: 6,
  },
  detailItem: {
    flex: 0.5,
  },
  ticketTitle: {
    color: theme.colors.darkTint3,
    marginVertical: 5,
    marginTop: 10,
  },
  label: {
    color: theme.colors.darkTint3,
  },
  form: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
});
