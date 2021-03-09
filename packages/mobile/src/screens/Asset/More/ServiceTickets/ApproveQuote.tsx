import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { TicketRepository } from '@homzhub/common/src/domain/repositories/TicketRepository';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
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
  const { goBack, navigate } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  const [isLoading, setLoader] = useState(false);
  const [comment, setComment] = useState('');
  const [quotes, setQuotes] = useState<QuoteRequest>();
  const [selectedQuote, setSelectedQuote] = useState<number[]>([]);

  useEffect(() => {
    setLoader(true);
    // TODO: (Shikha) - Use ids from ticket detail screen
    TicketRepository.getQuoteRequest({ ticketId: 11, quoteRequestId: 2 })
      .then((res) => {
        setQuotes(res);
        setLoader(false);
      })
      .catch((e) => {
        setLoader(false);
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      });
  }, []);

  // HANDLERS

  const onSubmit = (): void => {
    const payload: IQuoteApprovePayload = {
      param: { ticketId: 11 }, // TODO: (Shikha) - Use from ticket detail screen
      data: {
        quotes: selectedQuote,
        ...(!!comment && { comment }),
      },
    };

    TicketRepository.quoteApprove(payload)
      .then(() => {
        AlertHelper.success({ message: t('quoteApproved') });
        navigate(ScreensKeys.ServiceTicketDetail);
      })
      .catch((e) => AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) }));
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

  // TODO: (Shikha) - Use title from ticket detail screen
  return (
    <UserScreen title="Property Name" pageTitle={t('approveQuote')} onBackPress={goBack} loading={isLoading}>
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
