import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { TicketRepository } from '@homzhub/common/src/domain/repositories/TicketRepository';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import QuotePreview from '@homzhub/common/src/components/molecules/QuotePreview';
import { CollapsibleSection } from '@homzhub/mobile/src/components';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { QuoteRequest } from '@homzhub/common/src/domain/models/QuoteRequest';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IQuoteApprovePayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const ApproveQuote = (): React.ReactElement => {
  const dispatch = useDispatch();
  const [isLoading, setLoader] = useState(false);
  const [comment, setComment] = useState('');
  const [quotes, setQuotes] = useState<QuoteRequest>();
  const [selectedQuote, setSelectedQuote] = useState<number[]>([]);

  const { goBack, navigate } = useNavigation();
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  useEffect(() => {
    setLoader(true);
    if (selectedTicket) {
      TicketRepository.getQuoteRequest({
        ticketId: selectedTicket.ticketId,
        quoteRequestId: selectedTicket.quoteRequestId,
      })
        .then((res) => {
          setQuotes(res);
          setLoader(false);
        })
        .catch((e) => {
          setLoader(false);
          AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
        });
    }
  }, []);

  // HANDLERS

  const onSubmit = (): void => {
    if (selectedTicket) {
      const payload: IQuoteApprovePayload = {
        param: { ticketId: selectedTicket.ticketId },
        data: {
          quotes: selectedQuote,
          ...(!!comment && { comment }),
        },
      };

      TicketRepository.quoteApprove(payload)
        .then(() => {
          AlertHelper.success({ message: t('quoteApproved') });
          dispatch(TicketActions.getTickets());
          navigate(ScreensKeys.ServiceTicketDetail);
        })
        .catch((e) => AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) }));
    }
  };

  const onSelectQuote = (id: number, index: number): void => {
    const updateQuote = [...selectedQuote];
    updateQuote[index] = id;
    setSelectedQuote(updateQuote);
  };

  const onCommentChange = (value: string): void => {
    setComment(value);
  };

  const onOpenQuote = async (url: string): Promise<void> => {
    if (!(await LinkingService.canOpenURL(url))) {
      AlertHelper.error({ message: t('common:invalidLinkError') });
    }

    await LinkingService.canOpenURL(url);
  };
  // HANDLERS

  return (
    <UserScreen
      title={selectedTicket?.propertyName ?? ''}
      pageTitle={t('approveQuote')}
      onBackPress={goBack}
      loading={isLoading}
    >
      <View style={styles.container}>
        <Text type="small" textType="semiBold">
          {t('submittedQuotes')}
        </Text>
        <Label type="large" style={styles.description}>
          {t('approveQuoteDescription')}
        </Label>
        {quotes &&
          quotes.quoteRequestCategories.map((item, index) => {
            return (
              <CollapsibleSection
                key={index}
                title={item.name}
                collapseIcon={icons.upArrow}
                expandIcon={icons.downArrow}
                containerStyle={styles.cardContainer}
                titleStyle={styles.cardTitle}
                iconStyle={styles.iconStyle}
              >
                <QuotePreview
                  detail={item.quoteSubmitGroups}
                  selectedQuote={selectedQuote[index]}
                  onSelectQuote={(id): void => onSelectQuote(id, index)}
                  onOpenQuote={onOpenQuote}
                />
              </CollapsibleSection>
            );
          })}
        <TextArea
          value={comment}
          label={t('common:comment')}
          helpText={t('common:optional')}
          placeholder={t('common:typeComment')}
          wordCountLimit={450}
          onMessageChange={onCommentChange}
          containerStyle={styles.commentBox}
        />
        <Button type="primary" title={t('common:accept')} disabled={!selectedQuote.length} onPress={onSubmit} />
      </View>
    </UserScreen>
  );
};

export default ApproveQuote;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  description: {
    color: theme.colors.darkTint3,
    marginVertical: 12,
  },
  cardContainer: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: theme.colors.disabled,
    paddingVertical: 12,
  },
  cardTitle: {
    color: theme.colors.darkTint2,
    paddingHorizontal: 16,
  },
  iconStyle: {
    paddingHorizontal: 16,
  },
  commentBox: {
    marginVertical: 20,
  },
});
